import { GoogleGenAI, Type } from "@google/genai";
import type { Patient, TriageResult, Symptom, MediScanResult } from "../types";
import { KNOWLEDGE_BASE } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const triageResultSchema = {
    type: Type.OBJECT,
    properties: {
        triage_id: { type: Type.STRING, description: "A unique ID for the triage result, e.g., t_12345" },
        report_id: { type: Type.STRING, description: "A unique ID for the symptom report, e.g., r_67890" },
        top_conditions: {
            type: Type.ARRAY,
            description: "An array of the top 2-3 likely conditions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    condition_id: { type: Type.STRING, description: "The ID of the condition from the knowledge base." },
                    name: { type: Type.STRING, description: "The name of the condition." },
                    confidence: { type: Type.NUMBER, description: "A confidence score from 0 to 100." },
                },
                required: ["condition_id", "name", "confidence"]
            }
        },
        severity_level: { type: Type.STRING, enum: ["mild", "moderate", "severe"], description: "Overall assessed severity." },
        urgency: { type: Type.STRING, enum: ["Routine", "Urgent", "Emergency"], description: "The urgency of the situation." },
        recommendations: {
            type: Type.ARRAY,
            description: "A list of recommended actions for the patient.",
            items: { type: Type.STRING }
        },
        safety_flags: {
            type: Type.ARRAY,
            description: "Any specific safety warnings or flags triggered.",
            items: { type: Type.STRING }
        },
        confidence_level: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Overall confidence in the triage assessment." },
    },
    required: ["triage_id", "report_id", "top_conditions", "severity_level", "urgency", "recommendations", "safety_flags", "confidence_level"]
};

const mediScanResultSchema = {
    type: Type.OBJECT,
    properties: {
        matchingMedications: {
            type: Type.ARRAY,
            description: "A list of medications that were successfully identified in the images and match the prescription.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                    instructions: { type: Type.STRING, description: "Detailed usage instructions, e.g., 'Take one tablet twice a day for 7 days'." },
                    notes: { type: Type.STRING, description: "Confirmation that this medication matches the prescription." }
                },
                required: ["name", "dosage", "instructions", "notes"]
            }
        },
        unprescribedMedications: {
            type: Type.ARRAY,
            description: "A list of medications identified in the images but NOT found on the prescription.",
            items: {
                type: Type.OBJECT,
                properties: {
                    identifiedName: { type: Type.STRING, description: "The name of the identified medication." },
                    notes: { type: Type.STRING, description: "A warning that this medication was not found on the prescription." }
                },
                required: ["identifiedName", "notes"]
            }
        },
        missingMedications: {
            type: Type.ARRAY,
            description: "A list of medication names from the prescription that were not found in the provided images.",
            items: { type: Type.STRING }
        },
        summary: {
            type: Type.STRING,
            description: "A brief, overall summary of the analysis."
        }
    },
    required: ["matchingMedications", "unprescribedMedications", "missingMedications", "summary"]
};


export const generateTriageResult = async (patient: Patient, symptoms: Symptom[]): Promise<TriageResult> => {

  const prompt = `
    Analyze the provided patient data and medical knowledge base to perform a medical triage.
    
    Your goal is to identify the most likely conditions and provide safe, clinically-informed recommendations.
    
    **CRITICAL SAFETY RULE:** If symptoms match any "emergency_triggers" from the knowledge base (e.g., 'shortness_of_breath', 'chest_pain'), you MUST classify the 'urgency' as "Emergency" and recommend calling emergency services immediately. This rule overrides all other logic.

    **PATIENT DATA:**
    - Age: ${patient.age}
    - Gender: ${patient.gender}
    - Allergies: ${patient.allergies || 'None'}
    - Pre-existing Conditions: ${patient.medical_history || 'None'}

    **REPORTED SYMPTOMS:**
    ${symptoms.map(s => `- ${s.name}`).join('\n')}

    **MEDICAL KNOWLEDGE BASE (for reference):**
    ${JSON.stringify(KNOWLEDGE_BASE, null, 2)}
    
    **TASK:**
    Based on all the information, generate a JSON response that adheres to the provided schema.
    The response should include:
    - Top 2-3 likely conditions with confidence scores.
    - An overall severity and urgency assessment.
    - Actionable recommendations for the patient.
    - Any safety warnings.
    - Do not give a definitive diagnosis. Your output should be a list of possibilities, not a certain diagnosis.
    `;

  try {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: triageResultSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as TriageResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to get triage result from AI service due to an unknown error.");
  }
};


export const analyzePrescriptionAndMedications = async (
    prescriptionImage: { mimeType: string, data: string },
    medicationImages: { mimeType: string, data: string }[]
): Promise<MediScanResult> => {

    const prompt = `
    You are an AI pharmacy assistant. Your task is to analyze a doctor's prescription and photos of medications to verify they match and provide a detailed usage report.
    
    **Instructions:**
    1.  First, carefully read the provided prescription image. Identify all medication names, dosages, and instructions (e.g., frequency, duration).
    2.  Next, for each medication image provided, identify the medication name and strength from its packaging, label, or pill imprint.
    3.  Compare each medication identified from the images to the list of medications from the prescription.
    4.  For each medication that **matches** the prescription, provide its name, dosage, and detailed usage instructions.
    5.  If you identify a medication from an image that is **not** on the prescription, flag it clearly as an "Unprescribed Medication".
    6.  If a medication on the prescription is **missing** from the scanned images, list it under "Missing Medications".
    7.  Provide the final output as a single, valid JSON object that adheres to the provided schema. Do not include any extra text or markdown formatting outside of the JSON object.
    `;

    const contents = {
        parts: [
            { text: prompt },
            { inlineData: { mimeType: prescriptionImage.mimeType, data: prescriptionImage.data } },
            ...medicationImages.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.data } }))
        ]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: mediScanResultSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MediScanResult;

    } catch (error) {
        console.error("Error calling Gemini API for MediScan:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to get MediScan result from AI service due to an unknown error.");
    }
};
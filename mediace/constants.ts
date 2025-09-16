import type { Symptom, ConditionKnowledge, PatientRecord } from './types';

export const SYMPTOMS: Symptom[] = [
  { code: 'fever', name: 'Fever', category: 'General' },
  { code: 'body_ache', name: 'Body Ache', category: 'General' },
  { code: 'fatigue', name: 'Fatigue', category: 'General' },
  { code: 'sore_throat', name: 'Sore Throat', category: 'Respiratory' },
  { code: 'cough', name: 'Cough', category: 'Respiratory' },
  { code: 'runny_nose', name: 'Runny Nose', category: 'Respiratory' },
  { code: 'sneezing', name: 'Sneezing', category: 'Respiratory' },
  { code: 'shortness_of_breath', name: 'Shortness of Breath', category: 'Emergency' },
  { code: 'chest_pain', name: 'Chest Pain', category: 'Emergency' },
  { code: 'headache', name: 'Headache', category: 'Neurological' },
  { code: 'dizziness', name: 'Dizziness', category: 'Neurological' },
  { code: 'nausea', name: 'Nausea', category: 'Gastrointestinal' },
  { code: 'vomiting', name: 'Vomiting', category: 'Gastrointestinal' },
  { code: 'diarrhea', name: 'Diarrhea', category: 'Gastrointestinal' },
  { code: 'abdominal_pain', name: 'Abdominal Pain', category: 'Gastrointestinal' },
  { code: 'skin_rash', name: 'Skin Rash', category: 'Allergic' },
  { code: 'itching', name: 'Itching', category: 'Allergic' },
];

// FIX: Added DURATIONS constant for symptom duration dropdown.
export const DURATIONS: string[] = [
  'Less than a day',
  '1-2 days',
  '3-5 days',
  'About a week',
  'More than a week',
];

// FIX: Added MEDICAL_HISTORY_OPTIONS for patient information form.
export const MEDICAL_HISTORY_OPTIONS: string[] = [
  'Asthma',
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Kidney Disease',
  'None',
];

export const KNOWLEDGE_BASE: ConditionKnowledge[] = [
  {
    "condition_id": "resp_cold_v1",
    "name": "Common Cold",
    "category": "respiratory",
    "symptoms": [
      {"code": "runny_nose", "weight": 2},
      {"code": "sneezing", "weight": 2},
      {"code": "sore_throat", "weight": 2},
      {"code": "cough", "weight": 1},
      {"code": "fever", "weight": 1}
    ],
    "severity_level": "mild",
    "recommendations": ["Rest and stay hydrated","Use saline nasal sprays","Over-the-counter pain relievers if needed"],
    "emergency_triggers": []
  },
  {
    "condition_id": "resp_influenza_v1",
    "name": "Influenza",
    "category": "respiratory",
    "symptoms": [
      {"code": "fever", "weight": 3},
      {"code": "body_ache", "weight": 3},
      {"code": "fatigue", "weight": 3},
      {"code": "cough", "weight": 2},
      {"code": "headache", "weight": 2}
    ],
    "severity_level": "moderate",
    "recommendations": ["Rest is crucial", "Drink plenty of fluids", "Antiviral medication may be prescribed by a doctor"],
    "emergency_triggers": ["shortness_of_breath"]
  },
   {
    "condition_id": "resp_pneumonia_v1",
    "name": "Pneumonia",
    "category": "respiratory",
    "symptoms": [
      {"code": "fever", "weight": 3},
      {"code": "cough", "weight": 3},
      {"code": "shortness_of_breath", "weight": 4},
      {"code": "chest_pain", "weight": 4},
      {"code": "fatigue", "weight": 2}
    ],
    "severity_level": "severe",
    "recommendations": ["Seek immediate medical attention", "Antibiotics are usually required", "Hospitalization may be necessary"],
    "emergency_triggers": ["shortness_of_breath", "chest_pain"]
  },
  {
    "condition_id": "resp_asthma_attack_v1",
    "name": "Asthma Attack",
    "category": "respiratory",
    "symptoms": [
      {"code": "shortness_of_breath", "weight": 5},
      {"code": "cough", "weight": 2},
      {"code": "chest_pain", "weight": 3}
    ],
    "severity_level": "severe",
    "recommendations": ["Use your rescue inhaler immediately", "Seek emergency medical care if symptoms do not improve"],
    "emergency_triggers": ["shortness_of_breath", "chest_pain"]
  },
  {
    "condition_id": "gastro_gastroenteritis_v1",
    "name": "Gastroenteritis",
    "category": "gastrointestinal",
    "symptoms": [
      {"code": "nausea", "weight": 2},
      {"code": "vomiting", "weight": 3},
      {"code": "diarrhea", "weight": 3},
      {"code": "abdominal_pain", "weight": 2}
    ],
    "severity_level": "moderate",
    "recommendations": ["Stay hydrated with clear fluids (water, broth)", "Follow the BRAT diet (bananas, rice, applesauce, toast)", "Rest"],
    "emergency_triggers": []
  },
  {
    "condition_id": "gastro_food_poisoning_v1",
    "name": "Food Poisoning",
    "category": "gastrointestinal",
    "symptoms": [
      {"code": "vomiting", "weight": 3},
      {"code": "diarrhea", "weight": 3},
      {"code": "nausea", "weight": 2},
      {"code": "abdominal_pain", "weight": 3},
      {"code": "fever", "weight": 1}
    ],
    "severity_level": "moderate",
    "recommendations": ["Drink plenty of fluids to prevent dehydration", "Avoid solid foods until vomiting subsides", "Seek medical attention if symptoms are severe or persist"],
    "emergency_triggers": []
  },
  {
    "condition_id": "neuro_tension_headache_v1",
    "name": "Tension Headache",
    "category": "neurological",
    "symptoms": [
      {"code": "headache", "weight": 4}
    ],
    "severity_level": "mild",
    "recommendations": ["Over-the-counter pain relievers", "Rest in a quiet, dark room", "Apply a cold compress to your forehead"],
    "emergency_triggers": []
  },
   {
    "condition_id": "neuro_migraine_v1",
    "name": "Migraine",
    "category": "neurological",
    "symptoms": [
      {"code": "headache", "weight": 5},
      {"code": "nausea", "weight": 2},
      {"code": "dizziness", "weight": 1}
    ],
    "severity_level": "severe",
    "recommendations": ["Take prescribed migraine medication", "Rest in a dark, quiet environment", "Stay hydrated"],
    "emergency_triggers": []
  },
  {
    "condition_id": "allergy_mild_v1",
    "name": "Mild Allergy",
    "category": "allergic",
    "symptoms": [
      {"code": "skin_rash", "weight": 3},
      {"code": "itching", "weight": 3},
      {"code": "sneezing", "weight": 1},
      {"code": "runny_nose", "weight": 1}
    ],
    "severity_level": "mild",
    "recommendations": ["Take an over-the-counter antihistamine", "Avoid the known allergen", "Apply a cool compress to rashes"],
    "emergency_triggers": []
  },
  {
    "condition_id": "allergy_anaphylaxis_v1",
    "name": "Anaphylaxis",
    "category": "allergic",
    "symptoms": [
      {"code": "shortness_of_breath", "weight": 5},
      {"code": "skin_rash", "weight": 2},
      {"code": "dizziness", "weight": 3}
    ],
    "severity_level": "severe",
    "recommendations": ["THIS IS A MEDICAL EMERGENCY. Call emergency services immediately.", "If you have an epinephrine auto-injector, use it without delay."],
    "emergency_triggers": ["shortness_of_breath"]
  }
];

export const MOCK_PATIENTS: PatientRecord[] = [
  {
    id: 'p_12345',
    name: 'Ananya Sharma',
    age: 30,
    gender: 'female',
    phone: '+91-9876543210',
    email: 'ananya.sharma@example.com',
    allergies: 'Penicillin, Dust Mites',
    conditions: 'Type 2 Diabetes (controlled)',
    treatments: 'Metformin 500mg daily. Annual check-ups.',
    currentSymptoms: 'Patient reports mild fatigue and occasional headaches for the last 3 days.',
    reports: [],
    lastVisit: '2025-08-20',
  },
  {
    id: 'p_67890',
    name: 'Rohan Verma',
    age: 45,
    gender: 'male',
    phone: '+91-9123456789',
    email: 'rohan.verma@example.com',
    allergies: 'None known',
    conditions: 'Hypertension',
    treatments: 'Lisinopril 10mg. Advised low-sodium diet.',
    currentSymptoms: 'Scheduled for a routine blood pressure check.',
    reports: [],
    lastVisit: '2025-07-15',
  }
];

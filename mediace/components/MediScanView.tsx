import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import type { MedicationImage, MediScanResult } from '../types';
import { analyzePrescriptionAndMedications } from '../services/geminiService';

// FIX: Return a plain object with `data` and `mimeType` to match the `analyzePrescriptionAndMedications` service's expected input type.
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        data: await base64EncodedDataPromise, mimeType: file.type
    };
};

// FIX: Return a plain object with `data` and `mimeType` to match the `analyzePrescriptionAndMedications` service's expected input type.
const base64ToGenerativePart = (dataUrl: string) => {
    const [meta, data] = dataUrl.split(',');
    const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return {
        data, mimeType
    };
}

const AnalysisResult: React.FC<{ result: MediScanResult }> = ({ result }) => (
    <div className="space-y-6 mt-6 p-6 bg-white rounded-lg border border-gray-200 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Analysis Report</h3>
        <p className="text-sm text-gray-600">{result.summary}</p>
        
        {result.matchingMedications.length > 0 && (
            <div>
                <h4 className="font-semibold text-green-700">✓ Verified Medications</h4>
                <ul className="mt-2 space-y-3 list-inside">
                    {result.matchingMedications.map((med, index) => (
                        <li key={index} className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <strong className="block">{med.name} - {med.dosage}</strong>
                            <span className="text-sm text-gray-700">{med.instructions}</span>
                            <em className="block text-xs text-gray-500 mt-1">{med.notes}</em>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        {result.unprescribedMedications.length > 0 && (
            <div>
                <h4 className="font-semibold text-red-700">✗ Unprescribed Medications</h4>
                 <ul className="mt-2 space-y-3 list-inside">
                    {result.unprescribedMedications.map((med, index) => (
                        <li key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <strong className="block">{med.identifiedName}</strong>
                            <span className="text-sm text-gray-700">{med.notes}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        {result.missingMedications.length > 0 && (
            <div>
                <h4 className="font-semibold text-yellow-700">! Missing Medications</h4>
                <p className="text-sm text-gray-600">The following medications were on the prescription but not found in your scans:</p>
                 <ul className="mt-2 space-y-1 list-disc list-inside">
                    {result.missingMedications.map((name, index) => (
                        <li key={index} className="ml-4">{name}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);

const MediScanView: React.FC = () => {
    const [prescription, setPrescription] = useState<File | null>(null);
    const [prescriptionPreview, setPrescriptionPreview] = useState<string>('');
    const [medicationImages, setMedicationImages] = useState<MedicationImage[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<MediScanResult | null>(null);

    const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPrescription(file);
            setPrescriptionPreview(URL.createObjectURL(file));
        }
    };

    const handleCapture = (dataUrl: string) => {
        setMedicationImages(prev => [...prev, { id: `med_${Date.now()}`, dataUrl }]);
        setIsCameraOpen(false);
    };

    const removeMedicationImage = (id: string) => {
        setMedicationImages(prev => prev.filter(img => img.id !== id));
    };

    const handleAnalyze = async () => {
        if (!prescription) {
            setError("Please upload a prescription first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const prescriptionPart = await fileToGenerativePart(prescription);
            const medicationParts = medicationImages.map(img => base64ToGenerativePart(img.dataUrl));
            const result = await analyzePrescriptionAndMedications(prescriptionPart, medicationParts);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isCameraOpen) {
        return <CameraCapture onCapture={handleCapture} onCancel={() => setIsCameraOpen(false)} />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">MediScan Prescription Analysis</h2>
                <p className="mt-2 text-md text-gray-600">Upload your prescription and scan your medications to verify them.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Prescription Upload */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-3">1</span>
                        Upload Prescription
                    </h3>
                    <input
                        type="file"
                        id="prescription-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePrescriptionChange}
                    />
                    <label htmlFor="prescription-upload" className="cursor-pointer w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <span>{prescription ? "Change Prescription" : "Click to Upload Image"}</span>
                    </label>
                    {prescriptionPreview && (
                        <div className="mt-4">
                            <img src={prescriptionPreview} alt="Prescription Preview" className="w-full h-auto rounded-md border border-gray-300" />
                        </div>
                    )}
                </div>

                {/* Medication Scan */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg space-y-4">
                     <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-3">2</span>
                        Scan Medications
                    </h3>
                    <button
                        onClick={() => setIsCameraOpen(true)}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 transition"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>Scan a Medication</span>
                    </button>
                    {medicationImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {medicationImages.map(img => (
                                <div key={img.id} className="relative group">
                                    <img src={img.dataUrl} alt="Medication" className="rounded-md border border-gray-300" />
                                    <button onClick={() => removeMedicationImage(img.id)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-center pt-4">
                 <button 
                    onClick={handleAnalyze} 
                    disabled={!prescription || medicationImages.length === 0 || isLoading}
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                 >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Analyzing...
                        </>
                    ) : "Analyze Prescription"}
                 </button>
                 {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>

            {analysisResult && <AnalysisResult result={analysisResult} />}
        </div>
    );
};

export default MediScanView;
import React, { useState } from 'react';
import type { Patient, Symptom, PatientRecord } from '../types';
import DiagnosisStepper from './DiagnosisStepper';
import PatientInfoForm from './PatientInfoForm';
import SymptomSelector from './SymptomSelector';

interface DiagnosisWizardProps {
  onSubmit: (patient: Patient, symptoms: Symptom[]) => void;
  isLoading: boolean;
  error: string | null;
  patientRecords: PatientRecord[];
}

const DiagnosisWizard: React.FC<DiagnosisWizardProps> = ({ onSubmit, isLoading, error, patientRecords }) => {
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState<Patient | null>(null);

  const effectiveStep = isLoading ? 3 : step;
  const steps = ['Patient Info', 'Symptoms', 'Assessment', 'Results'];

  const handlePatientInfoSubmit = (data: Patient) => {
    setPatientData(data);
    setStep(2);
  };

  const handleSymptomSubmit = (selectedSymptoms: Symptom[]) => {
    if (patientData) {
      onSubmit(patientData, selectedSymptoms);
    } else {
       console.error("Patient data is missing.");
       // Optionally, handle this error more gracefully in the UI
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DiagnosisStepper steps={steps} currentStep={effectiveStep} />
      <div className="mt-8 bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xl">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {step === 1 && (
          <PatientInfoForm
            patientRecords={patientRecords}
            onNext={handlePatientInfoSubmit}
          />
        )}
        {step === 2 && (
          <SymptomSelector
            onBack={() => setStep(1)}
            onSubmit={handleSymptomSubmit}
            isLoading={isLoading}
          />
        )}
        {isLoading && (
            <div className="flex flex-col items-center justify-center p-8">
                 <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-700">Analyzing Symptoms...</h3>
                <p className="text-gray-500">Our AI is processing the information. Please wait a moment.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisWizard;
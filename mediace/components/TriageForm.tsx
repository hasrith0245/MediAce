import React, { useState, useCallback } from 'react';
import type { Patient, SymptomSelection } from '../types';
import { SYMPTOMS, DURATIONS, MEDICAL_HISTORY_OPTIONS } from '../constants';
import SymptomDetail from './SymptomDetail';
import SymptomIcon from './SymptomIcon';

interface TriageFormProps {
  onSubmit: (patient: Patient, symptoms: SymptomSelection[]) => void;
  isLoading: boolean;
  error: string | null;
}

const TriageForm: React.FC<TriageFormProps> = ({ onSubmit, isLoading, error }) => {
  // FIX: Updated patient state to handle medical_history as a string array for checkbox logic.
  // This avoids type conflicts with the Patient interface, which is constructed on submit.
  const [patient, setPatient] = useState({
    age: 30,
    gender: 'female' as 'male' | 'female' | 'other',
    medical_history: [] as string[],
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomSelection[]>([]);
  const [allergiesInput, setAllergiesInput] = useState('');

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) : value }));
  };
  
  const handleHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      setPatient(prev => {
          // This logic correctly handles an array of strings for medical history, including the exclusive "None" option.
          const newHistory = checked 
              ? [...prev.medical_history.filter(h => h !== 'None'), value] 
              : prev.medical_history.filter(h => h !== value);
          if (value === 'None' && checked) return {...prev, medical_history: ['None']};
          return {...prev, medical_history: newHistory.length === 0 ? [] : newHistory};
      });
  };

  const toggleSymptom = (symptomCode: string) => {
    const symptom = SYMPTOMS.find(s => s.code === symptomCode);
    if (!symptom) return;

    if (selectedSymptoms.some(s => s.code === symptomCode)) {
      setSelectedSymptoms(prev => prev.filter(s => s.code !== symptomCode));
    } else {
      setSelectedSymptoms(prev => [...prev, { ...symptom, severity: 5, duration: '1-2 days' }]);
    }
  };

  const updateSymptomDetail = useCallback((code: string, severity: number, duration: string) => {
    setSelectedSymptoms(prev =>
      prev.map(s => (s.code === code ? { ...s, severity, duration } : s))
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Construct a valid Patient object before submission, converting form state (e.g., arrays) into the required string format.
    const patientToSubmit: Patient = {
      ...patient,
      allergies: allergiesInput,
      medical_history: patient.medical_history.join(', '),
    };
    onSubmit(patientToSubmit, selectedSymptoms);
  };
  
  const isSymptomSelected = (code: string) => selectedSymptoms.some(s => s.code === code);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      {/* Patient Information Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">1. Patient Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-600">Age</label>
            <input type="number" name="age" id="age" value={patient.age} onChange={handlePatientChange} className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600">Gender</label>
            <select name="gender" id="gender" value={patient.gender} onChange={handlePatientChange} className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-600">Pre-existing Medical Conditions</label>
             <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MEDICAL_HISTORY_OPTIONS.map(option => (
                    <div key={option} className="flex items-center">
                        <input id={`history-${option}`} name="medical_history" type="checkbox" value={option} onChange={handleHistoryChange} checked={patient.medical_history.includes(option)} className="h-4 w-4 rounded bg-gray-200 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-white"/>
                        <label htmlFor={`history-${option}`} className="ml-2 block text-sm text-gray-700">{option}</label>
                    </div>
                ))}
             </div>
          </div>
           <div className="md:col-span-2">
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-600">Allergies (comma-separated, e.g. penicillin, nuts)</label>
            <input type="text" name="allergies" id="allergies" value={allergiesInput} onChange={e => setAllergiesInput(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="None"/>
          </div>
        </div>
      </div>
      
      {/* Symptom Selection Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">2. Select Your Symptoms</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {SYMPTOMS.map(symptom => (
            <button
              type="button"
              key={symptom.code}
              onClick={() => toggleSymptom(symptom.code)}
              className={`p-3 flex flex-col items-center justify-center space-y-2 rounded-lg border-2 text-center transition-all duration-200 text-gray-700 ${isSymptomSelected(symptom.code) ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-400'}`}
            >
              <SymptomIcon code={symptom.code} className="w-8 h-8 text-gray-600"/>
              <span className="text-sm font-medium">{symptom.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptom Details Section */}
      {selectedSymptoms.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">3. Describe Your Symptoms</h2>
          <div className="space-y-6">
            {selectedSymptoms.map(symptom => (
              <SymptomDetail
                key={symptom.code}
                symptom={symptom}
                onUpdate={updateSymptomDetail}
                durations={DURATIONS}
              />
            ))}
          </div>
        </div>
      )}

      {/* Submission */}
      <div className="pt-4 text-center">
         {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || selectedSymptoms.length === 0}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
             <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
             </>
          ) : 'Analyze My Symptoms'}
        </button>
      </div>
    </form>
  );
};

export default TriageForm;

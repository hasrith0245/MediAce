import React, { useState } from 'react';
import type { Symptom } from '../types';
import { SYMPTOMS } from '../constants';
import SymptomIcon from './SymptomIcon';

interface SymptomSelectorProps {
  onBack: () => void;
  onSubmit: (symptoms: Symptom[]) => void;
  isLoading: boolean;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ onBack, onSubmit, isLoading }) => {
  const [selectedSymptomCodes, setSelectedSymptomCodes] = useState<Set<string>>(new Set());
  const [otherSymptoms, setOtherSymptoms] = useState('');

  const toggleSymptom = (symptomCode: string) => {
    setSelectedSymptomCodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symptomCode)) {
        newSet.delete(symptomCode);
      } else {
        newSet.add(symptomCode);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    // Get symptoms from the predefined list
    const selectedFromList = SYMPTOMS.filter(s => selectedSymptomCodes.has(s.code));
    
    // Parse and create symptom objects from the "Other Symptoms" text area
    const customSymptoms: Symptom[] = otherSymptoms
      .split(',')
      .map(s => s.trim())
      .filter(Boolean) // Remove any empty strings
      .map(name => ({
        name,
        code: `custom_${name.toLowerCase().replace(/\s+/g, '_')}`,
        category: 'Custom'
      }));

    const allSymptoms = [...selectedFromList, ...customSymptoms];
    onSubmit(allSymptoms);
  };
  
  const isSymptomSelected = (code: string) => selectedSymptomCodes.has(code);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Symptom Assessment</h2>
      <p className="text-sm text-gray-600">Select all symptoms you are currently experiencing:</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {SYMPTOMS.map(symptom => (
          <button
            type="button"
            key={symptom.code}
            onClick={() => toggleSymptom(symptom.code)}
            className={`p-3 flex items-center space-x-3 rounded-lg border text-left transition-all duration-200 text-gray-700 ${
              isSymptomSelected(symptom.code)
                ? 'bg-fuchsia-50 border-fuchsia-500 ring-2 ring-fuchsia-200'
                : 'bg-white border-gray-300 hover:border-blue-400'
            }`}
          >
            <SymptomIcon code={symptom.code} className="w-6 h-6 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium">{symptom.name}</span>
          </button>
        ))}
      </div>
      
      <div className="pt-2">
        <label htmlFor="other_symptoms" className="block text-sm font-semibold text-gray-700">
          Other Symptoms (Optional)
        </label>
        <textarea
          id="other_symptoms"
          value={otherSymptoms}
          onChange={(e) => setOtherSymptoms(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-slate-50 py-2 px-3 text-gray-800 shadow-sm transition-all duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:shadow-md hover:border-gray-400"
          placeholder="Enter any other symptoms, separated by commas"
        ></textarea>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || (selectedSymptomCodes.size === 0 && !otherSymptoms.trim())}
          className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </div>
    </div>
  );
};

export default SymptomSelector;
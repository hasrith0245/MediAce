import React from 'react';
import type { SymptomSelection } from '../types';

interface SymptomDetailProps {
  symptom: SymptomSelection;
  onUpdate: (code: string, severity: number, duration: string) => void;
  durations: string[];
}

const SymptomDetail: React.FC<SymptomDetailProps> = ({ symptom, onUpdate, durations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-md font-semibold text-gray-700 md:col-span-1">{symptom.name}</h3>
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`severity-${symptom.code}`} className="block text-sm font-medium text-gray-600">
            Severity: <span className="font-bold text-blue-600">{symptom.severity}</span>/10
          </label>
          <input
            type="range"
            id={`severity-${symptom.code}`}
            min="1"
            max="10"
            value={symptom.severity}
            onChange={(e) => onUpdate(symptom.code, parseInt(e.target.value), symptom.duration)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div>
          <label htmlFor={`duration-${symptom.code}`} className="block text-sm font-medium text-gray-600">Duration</label>
          <select
            id={`duration-${symptom.code}`}
            value={symptom.duration}
            onChange={(e) => onUpdate(symptom.code, symptom.severity, e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {durations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SymptomDetail);
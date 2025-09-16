import React from 'react';
import type { TriageResult } from '../types';

interface TriageResultDisplayProps {
  result: TriageResult;
  onSchedule: () => void;
  onReset: () => void;
  onSaveRecord: () => void;
}

const UrgencyBanner: React.FC<{ urgency: 'Routine' | 'Urgent' | 'Emergency' }> = ({ urgency }) => {
  const urgencyStyles = {
    Routine: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500',
      text: 'text-blue-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Routine"
    },
    Urgent: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500',
      text: 'text-yellow-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Urgent Care Recommended"
    },
    Emergency: {
      bg: 'bg-red-500/10',
      border: 'border-red-500',
      text: 'text-red-700',
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 9v4m0 4h.01" />
        </svg>
      ),
      title: "Potential Emergency"
    },
  };

  const styles = urgencyStyles[urgency];
  return (
    <div className={`rounded-md ${styles.bg} p-4 border-l-4 ${styles.border}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${styles.text}`}>{styles.icon}</div>
        <div className="ml-3">
          <h3 className={`text-sm font-bold ${styles.text}`}>{styles.title}</h3>
        </div>
      </div>
    </div>
  );
};

const TriageResultDisplay: React.FC<TriageResultDisplayProps> = ({ result, onSchedule, onReset, onSaveRecord }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-xl animate-fade-in space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Triage Analysis Complete</h2>
      
      <UrgencyBanner urgency={result.urgency} />

      {/* Recommendations */}
      <div className="border-t border-gray-900/10 pt-4">
        <h3 className="text-lg font-bold text-gray-700 mb-3">Recommendations</h3>
        <ul className="space-y-2 list-disc list-inside text-gray-600">
          {result.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
         {result.urgency === 'Emergency' && <p className="mt-4 font-bold text-red-600">Please call emergency services or go to the nearest emergency room immediately.</p>}
      </div>

      {/* Possible Conditions */}
      <div className="border-t border-gray-900/10 pt-4">
        <h3 className="text-lg font-bold text-gray-700 mb-3">Possible Conditions</h3>
        <p className="text-sm text-gray-500 mb-4">This is not a diagnosis. These are potential conditions based on your symptoms for discussion with a healthcare professional.</p>
        <div className="space-y-4">
          {result.top_conditions.map(cond => (
            <div key={cond.condition_id}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-medium text-gray-800">{cond.name}</span>
                <span className="text-sm font-semibold text-blue-600">{cond.confidence}% confidence</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${cond.confidence}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-gray-900/10 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div>
              <p className="text-sm text-gray-500">Overall Severity</p>
              <p className="font-semibold text-lg capitalize text-gray-800">{result.severity_level}</p>
          </div>
          <div>
              <p className="text-sm text-gray-500">Assessment</p>
              <p className="font-semibold text-lg text-gray-800">{result.confidence_level}</p>
          </div>
           <div className="col-span-2 sm:col-span-1">
              <p className="text-sm text-gray-500">Report ID</p>
              <p className="font-mono text-xs mt-2 text-gray-500">{result.report_id}</p>
          </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-900/10 pt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300"
        >
          Start Over
        </button>
        {result.urgency !== 'Emergency' && (
          <>
            <button
              onClick={onSaveRecord}
              className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-500"
            >
              Save Record
            </button>
            <button
              onClick={onSchedule}
              className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-fuchsia-500"
            >
              Schedule Appointment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TriageResultDisplay;
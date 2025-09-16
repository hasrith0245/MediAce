import React from 'react';

interface DiagnosisStepperProps {
  steps: string[];
  currentStep: number; // 1-based index
}

const StepIcon: React.FC<{step: number; isActive: boolean; isCompleted: boolean}> = ({ step, isActive, isCompleted }) => {
    const icons = [
        // Patient Info
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>,
        // Symptoms
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l.477 2.387a2 2 0 001.806.547a2 2 0 001.022-.547l2.387-.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-.477-2.387zM12 8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>,
        // Assessment
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V8a4 4 0 10-8 0v8m8-8a4 4 0 100-8 4 4 0 000 8zm0 0v8m6-8a4 4 0 100-8 4 4 0 000 8z" />
        </svg>,
        // Results
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>,
    ];

    return (
         <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-300 ${
            isActive ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white' : isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
            }`}
        >
            {isCompleted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ) : (
                icons[step-1]
            )}
        </div>
    );
}

const DiagnosisStepper: React.FC<DiagnosisStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-start justify-center">
        {steps.map((step, index) => {
            const stepIndex = index + 1;
            const isCompleted = currentStep > stepIndex;
            const isActive = currentStep === stepIndex;

            return (
            <React.Fragment key={step}>
                <div className="flex flex-col items-center w-24">
                   <StepIcon step={stepIndex} isActive={isActive} isCompleted={isCompleted} />
                   <p className={`mt-2 text-sm text-center font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{step}</p>
                </div>

                {stepIndex < steps.length && (
                <div className={`flex-auto border-t-2 transition-colors duration-300 mt-6 ${isCompleted ? 'border-blue-500' : 'border-gray-200'}`}></div>
                )}
            </React.Fragment>
            );
        })}
        </div>
    </div>
  );
};

export default DiagnosisStepper;
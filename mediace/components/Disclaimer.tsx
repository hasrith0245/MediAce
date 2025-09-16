import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-700 text-xs max-w-4xl">
        <p className="font-bold mb-1 text-gray-800">MEDICAL DISCLAIMER</p>
        <p>
          MediAssist is an AI-powered informational tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. If you think you may have a medical emergency, call your doctor, go to the emergency department, or call 911 immediately.
        </p>
      </div>
    </footer>
  );
};

export default Disclaimer;
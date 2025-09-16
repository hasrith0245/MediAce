import React, { useState, useEffect } from 'react';
import type { Patient, PatientRecord } from '../types';

interface PatientInfoFormProps {
  onNext: (patient: Patient) => void;
  patientRecords: PatientRecord[];
}

// Local state for the form, allowing age to be a string for input handling
interface FormData {
    age: string;
    gender: 'male' | 'female' | 'other';
    medical_history: string;
    allergies: string;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ onNext, patientRecords }) => {
    const [selectedPatientId, setSelectedPatientId] = useState<string>('new');
    const [formData, setFormData] = useState<FormData>({
        age: '',
        gender: 'female',
        medical_history: '',
        allergies: '',
    });

    useEffect(() => {
        if (selectedPatientId === 'new') {
            setFormData({ age: '', gender: 'female', medical_history: '', allergies: '' });
        } else {
            const record = patientRecords.find(p => p.id === selectedPatientId);
            if (record) {
                setFormData({
                    age: record.age.toString(),
                    gender: record.gender,
                    medical_history: record.conditions,
                    allergies: record.allergies
                });
            }
        }
    }, [selectedPatientId, patientRecords]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientToSubmit: Patient = {
        ...formData,
        age: parseInt(formData.age, 10) || 0,
    };
    onNext(patientToSubmit);
  };

  const inputClasses = "mt-1 block w-full rounded-lg border border-gray-300 bg-slate-50 py-2 px-3 text-gray-800 shadow-sm transition-all duration-200 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:shadow-md hover:border-gray-400";


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Patient Information</h2>
      
      <div>
        <label htmlFor="select-patient" className="block text-sm font-semibold text-gray-700">Select Existing Patient (Optional)</label>
        <select 
            id="select-patient" 
            className={inputClasses}
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
        >
          <option value="new">New Patient</option>
          {patientRecords.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.age}, {p.gender})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="age" className="block text-sm font-semibold text-gray-700">Age *</label>
          <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className={inputClasses} required placeholder="Enter age" />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">Gender *</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputClasses} required>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="medical_history" className="block text-sm font-semibold text-gray-700">Medical History (Optional)</label>
        <textarea name="medical_history" id="medical_history" value={formData.medical_history} onChange={handleChange} rows={3} className={inputClasses} placeholder="Enter medical conditions separated by commas"></textarea>
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700">Allergies (Optional)</label>
        <textarea name="allergies" id="allergies" value={formData.allergies} onChange={handleChange} rows={2} className={inputClasses} placeholder="Enter allergies separated by commas"></textarea>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500">
          Next
        </button>
      </div>
    </form>
  );
};

export default PatientInfoForm;
import React, { useState } from 'react';
import type { Patient, TriageResult, PatientRecord, Symptom } from '../types';

interface SavePatientRecordFormProps {
    patient: Patient;
    result: TriageResult;
    symptoms: Symptom[];
    onSave: (record: PatientRecord) => void;
    onCancel: () => void;
}

const InfoItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
        <p className="text-md text-gray-800">{value}</p>
    </div>
);

const SavePatientRecordForm: React.FC<SavePatientRecordFormProps> = ({ patient, result, symptoms, onSave, onCancel }) => {
    const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRecord: PatientRecord = {
            id: `p_${Date.now()}`,
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            age: patient.age,
            gender: patient.gender,
            allergies: patient.allergies || 'None',
            conditions: result.top_conditions.map(c => c.name).join(', '),
            treatments: result.recommendations.join('\n'),
            currentSymptoms: symptoms.map(s => s.name).join(', '),
            reports: [],
            lastVisit: new Date().toISOString().split('T')[0],
        };
        onSave(newRecord);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Save Patient Record</h2>
            <p className="text-gray-500 mb-6">Please provide contact details to complete the record.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info Section */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Full Name" value={contactInfo.name} onChange={handleChange} required className="w-full bg-white border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"/>
                        <input type="email" name="email" placeholder="Email Address" value={contactInfo.email} onChange={handleChange} required className="w-full bg-white border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"/>
                        <input type="tel" name="phone" placeholder="Phone Number" value={contactInfo.phone} onChange={handleChange} required className="md:col-span-2 w-full bg-white border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"/>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Triage Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoItem label="Age" value={patient.age.toString()} />
                        <InfoItem label="Gender" value={patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} />
                        <InfoItem label="Urgency" value={result.urgency} />
                        <InfoItem label="Allergies" value={patient.allergies || 'None'} />
                        <InfoItem label="Medical History" value={patient.medical_history || 'None'} />
                        <div className="col-span-2 md:col-span-3">
                            <InfoItem label="Possible Conditions" value={result.top_conditions.map(c => `${c.name} (${c.confidence}%)`).join(', ')} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        Save Record
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SavePatientRecordForm;
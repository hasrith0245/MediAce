import React, { useState, useMemo, useEffect } from 'react';
import type { PatientRecord } from '../types';
import PatientAvatar from './PatientAvatar';

// --- Sub-components defined in the same file for simplicity ---

const EditPatientForm: React.FC<{ record: PatientRecord; onSave: (patient: PatientRecord) => void; onCancel: () => void; }> = ({ record, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: record.name,
        age: record.age.toString(),
        gender: record.gender,
        phone: record.phone,
        email: record.email,
        allergies: record.allergies,
        conditions: record.conditions,
        treatments: record.treatments,
        currentSymptoms: record.currentSymptoms,
    });
    const [reports, setReports] = useState<File[]>(record.reports);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setReports(Array.from(e.target.files));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedPatient: PatientRecord = {
            ...record,
            name: formData.name,
            age: parseInt(formData.age, 10),
            gender: formData.gender as 'male' | 'female' | 'other',
            phone: formData.phone,
            email: formData.email,
            allergies: formData.allergies,
            conditions: formData.conditions,
            treatments: formData.treatments,
            currentSymptoms: formData.currentSymptoms,
            reports,
        };
        onSave(updatedPatient);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg mb-8 animate-fade-in text-gray-200">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Patient Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"/>
                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required className="bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"/>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"/>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"/>
                </div>
                 <textarea name="currentSymptoms" placeholder="Current Symptoms" value={formData.currentSymptoms} onChange={handleChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400" rows={2}></textarea>
                <textarea name="allergies" placeholder="Allergies" value={formData.allergies} onChange={handleChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400" rows={2}></textarea>
                <textarea name="conditions" placeholder="Pre-existing Conditions" value={formData.conditions} onChange={handleChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400" rows={2}></textarea>
                <textarea name="treatments" placeholder="Previous Treatments" value={formData.treatments} onChange={handleChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400" rows={2}></textarea>
                 <div>
                    <label htmlFor="reports" className="block text-sm font-medium text-gray-400 mb-1">Upload Reports (PDF, Images)</label>
                    <input id="reports" type="file" onChange={handleFileChange} multiple className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-blue-300 hover:file:bg-gray-600"/>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

const PatientRecordPDF: React.FC<{ record: PatientRecord }> = ({ record }) => {
    return (
        <div id={`pdf-report-${record.id}`} className="p-10 bg-white font-serif" style={{ width: '210mm', minHeight: '297mm', color: 'black' }}>
            <h1 className="text-3xl font-bold border-b-2 border-black pb-2 mb-6">Patient Medical Record</h1>
            <h2 className="text-2xl font-semibold mb-4">{record.name}</h2>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-base mb-6">
                <p><strong>Age:</strong> {record.age}</p>
                <p><strong>Gender:</strong> {record.gender.charAt(0).toUpperCase() + record.gender.slice(1)}</p>
                <p><strong>Phone:</strong> {record.phone}</p>
                <p><strong>Email:</strong> {record.email}</p>
                <p><strong>Last Visit:</strong> {record.lastVisit}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-bold border-b border-gray-400 pb-1 mb-2">Current Symptoms</h3>
                    <p>{record.currentSymptoms || 'None reported'}</p>
                </div>
                 <div>
                    <h3 className="text-xl font-bold border-b border-gray-400 pb-1 mb-2">Allergies</h3>
                    <p>{record.allergies || 'None known'}</p>
                </div>
                 <div>
                    <h3 className="text-xl font-bold border-b border-gray-400 pb-1 mb-2">Pre-existing Conditions</h3>
                    <p>{record.conditions || 'None reported'}</p>
                </div>
                 <div>
                    <h3 className="text-xl font-bold border-b border-gray-400 pb-1 mb-2">Previous Treatments / Recommendations</h3>
                    <p>{record.treatments || 'None'}</p>
                </div>
            </div>
            
            <div className="mt-20 text-xs text-gray-500 text-center">
                <p>Report generated by MediAssist on {new Date().toLocaleDateString()}</p>
                <p>This is not a substitute for professional medical advice.</p>
            </div>
        </div>
    );
};


// --- Main View Component ---

interface PatientRecordsViewProps {
  records: PatientRecord[];
  onUpdatePatient: (patient: PatientRecord) => void;
  onDeletePatient: (id: string) => void;
}

const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({ records, onUpdatePatient, onDeletePatient }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
    const [isPrinting, setIsPrinting] = useState<string | null>(null);

    const filteredRecords = useMemo(() => {
        if (!searchTerm) return records;
        return records.filter(r => 
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            r.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [records, searchTerm]);

    const handleUpdate = (updatedRecord: PatientRecord) => {
        onUpdatePatient(updatedRecord);
        setEditingRecord(null);
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this patient record? This action cannot be undone.")) {
            onDeletePatient(id);
        }
    };

    const handleCopyDetails = (record: PatientRecord) => {
        const details = `
Patient Name: ${record.name}
Age: ${record.age}
Gender: ${record.gender}
Contact: ${record.phone} / ${record.email}
Last Visit: ${record.lastVisit}
---
Current Symptoms: ${record.currentSymptoms || 'N/A'}
Allergies: ${record.allergies || 'None known'}
Conditions: ${record.conditions || 'N/A'}
Treatments/Recommendations: ${record.treatments || 'N/A'}
        `.trim();

        navigator.clipboard.writeText(details)
            .then(() => {
                alert('Patient details copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy details: ', err);
                alert('Could not copy details to clipboard.');
            });
    };

    const handleDownloadPdf = async (record: PatientRecord) => {
        setIsPrinting(record.id);
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const { jsPDF } = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;
        const reportElement = document.getElementById(`pdf-report-${record.id}`);
        
        if (reportElement && html2canvas && jsPDF) {
            try {
                const canvas = await html2canvas(reportElement, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasAspectRatio = canvas.width / canvas.height;
                
                let imgWidth = pdfWidth;
                let imgHeight = imgWidth / canvasAspectRatio;

                if (imgHeight > pdfHeight) {
                    imgHeight = pdfHeight;
                    imgWidth = imgHeight * canvasAspectRatio;
                }

                const xOffset = (pdfWidth - imgWidth) / 2;
                pdf.addImage(imgData, 'PNG', xOffset, 0, imgWidth, imgHeight);
                pdf.save(`record-${record.name.replace(/\s/g, '_')}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
                alert("Sorry, there was an error generating the PDF.");
            } finally {
                setIsPrinting(null);
            }
        } else {
            console.error("PDF generation libraries or element not found.");
            alert("Could not generate PDF. Required libraries might be missing.");
            setIsPrinting(null);
        }
    };
    
    const DetailItem: React.FC<{label: string; value: string | React.ReactNode}> = ({label, value}) => (
        <div>
            <strong className="text-gray-400 block text-sm">{label}:</strong>
            <p className="text-gray-200 text-sm whitespace-pre-wrap">{value || 'None'}</p>
        </div>
    );
    
    if (editingRecord) {
        return <EditPatientForm record={editingRecord} onSave={handleUpdate} onCancel={() => setEditingRecord(null)} />;
    }

    return (
        <div className="space-y-6 bg-gray-900 p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <div className="relative flex-grow">
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md py-2 pl-10 pr-4 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <div className="space-y-1">
                {filteredRecords.length > 0 ? (
                    filteredRecords.map(record => {
                        const isExpanded = expandedId === record.id;
                        return (
                             <div key={record.id} className="bg-gray-800 text-white rounded-md transition-all duration-200">
                                <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => setExpandedId(prev => (prev === record.id ? null : record.id))}>
                                    <div className="flex items-center space-x-4">
                                        <PatientAvatar gender={record.gender} />
                                        <div>
                                            <p className="font-semibold text-base text-gray-100">{record.name}</p>
                                            <p className="text-sm text-gray-400">{record.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 px-3 py-1.5 border border-gray-600 bg-gray-700 rounded-md text-sm text-gray-300">
                                        <span>Details</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {isExpanded && (
                                     <div className="px-4 pb-4 border-t border-gray-700 space-y-4 animate-fade-in">
                                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-4">
                                            <DetailItem label="Contact" value={`${record.phone}`} />
                                            <DetailItem label="Gender" value={record.gender.charAt(0).toUpperCase() + record.gender.slice(1)} />
                                            <DetailItem label="Age" value={`${record.age} years old`} />
                                            <DetailItem label="Last Visit" value={record.lastVisit} />
                                            <DetailItem label="Current Symptoms" value={record.currentSymptoms} />
                                            <DetailItem label="Allergies" value={record.allergies} />
                                            <DetailItem label="Conditions" value={record.conditions} />
                                            <DetailItem label="Treatments" value={record.treatments} />
                                            <DetailItem label="Uploaded Reports" value={
                                                record.reports.length > 0 ? (
                                                     <ul className="list-disc list-inside mt-1 text-sm text-blue-400">
                                                        {record.reports.map((file, index) => <li key={index}>{file.name} ({Math.round(file.size/1024)} KB)</li>)}
                                                     </ul>
                                                ) : <span className="text-gray-400">No reports uploaded.</span>
                                            }/>
                                         </div>
                                        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-700 mt-4">
                                            <button onClick={() => setEditingRecord(record)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600">Edit Record</button>
                                            <button onClick={() => handleCopyDetails(record)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600">Copy Details</button>
                                            <button onClick={() => handleDownloadPdf(record)} disabled={isPrinting === record.id} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50">
                                                {isPrinting === record.id ? 'Downloading...' : 'Download PDF'}
                                            </button>
                                            <button onClick={() => handleDelete(record.id)} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Delete Record</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No patient records found.</p>
                    </div>
                )}
            </div>
            {/* Hidden container for PDF rendering */}
            <div style={{ position: 'fixed', left: '-10000px', top: 0, zIndex: -1 }}>
                {isPrinting && records.find(r => r.id === isPrinting) &&
                    <PatientRecordPDF record={records.find(r => r.id === isPrinting)!} />
                }
            </div>
        </div>
    );
};

export default PatientRecordsView;
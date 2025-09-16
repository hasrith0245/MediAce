import React, { useState } from 'react';
import type { Appointment } from '../types';
import ClinicFinder from './ClinicFinder';

interface AppointmentSchedulerProps {
  onReset: () => void;
  onBooked: (appointment: Appointment) => void;
  bookedAppointments: Appointment[];
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ onReset, onBooked, bookedAppointments }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'view' | 'find'>('book');
  
  // Form state
  const [appointmentType, setAppointmentType] = useState('teleconsult');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [report, setReport] = useState<File | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const reportInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReport(e.target.files[0]);
    } else {
      setReport(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
        id: `appt_${Date.now()}`,
        type: appointmentType as 'teleconsult' | 'clinic',
        date,
        time,
        reportName: report?.name
    };
    onBooked(newAppointment);
    setIsBooked(true);

    // Reset form and switch to the view tab after a delay
    setTimeout(() => {
        setIsBooked(false);
        setDate('');
        setTime('');
        setReport(null);
        if(reportInputRef.current) {
            reportInputRef.current.value = "";
        }
        setActiveTab('view');
    }, 2500);
  };

  const renderBookingForm = () => (
    <div className="p-6 sm:p-8">
        {isBooked ? (
             <div className="text-center animate-fade-in py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Appointment Confirmed!</h2>
                <p className="text-gray-600 mt-2">Your appointment has been successfully scheduled.</p>
                <p className="text-sm text-gray-500 mt-4">You will be taken to the appointment list shortly.</p>
             </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label className="block text-sm font-semibold text-gray-600">Appointment Type</label>
                <div className="mt-2 flex rounded-md shadow-sm">
                    <button
                        type="button"
                        onClick={() => setAppointmentType('teleconsult')}
                        className={`flex-1 px-4 py-2 rounded-l-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:z-10 transition ${appointmentType === 'teleconsult' ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                        Teleconsultation
                    </button>
                    <button
                        type="button"
                        onClick={() => setAppointmentType('clinic')}
                        className={`-ml-px flex-1 px-4 py-2 rounded-r-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:z-10 transition ${appointmentType === 'clinic' ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                        Clinic Visit
                    </button>
                </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-600">Preferred Date</label>
                    <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-semibold text-gray-600">Preferred Time</label>
                    <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
                </div>

                <div>
                    <label htmlFor="report" className="block text-sm font-semibold text-gray-600">Attach Report (Optional)</label>
                    <input
                    ref={reportInputRef}
                    type="file"
                    id="report"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onReset}
                        className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-fuchsia-500"
                    >
                        Book Appointment
                    </button>
                </div>
            </form>
        )}
    </div>
  );
  
  const renderViewAppointments = () => (
    <div className="p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Appointments</h3>
        {bookedAppointments.length > 0 ? (
            <ul className="space-y-4">
                {bookedAppointments.map(appt => (
                    <li key={appt.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                           <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-2 rounded-full">
                                {appt.type === 'teleconsult' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                ):(
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                )}
                           </div>
                           <div>
                                <p className="font-semibold text-gray-800 capitalize">{appt.type === 'teleconsult' ? 'Teleconsultation' : 'Clinic Visit'}</p>
                                <p className="text-sm text-gray-600">{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}</p>
                                {appt.reportName && <p className="text-xs text-green-700 mt-1">✓ Report Attached: {appt.reportName}</p>}
                           </div>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center py-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="mt-4 font-semibold">No Appointments Found</p>
                <p className="text-sm">You have not scheduled any appointments yet.</p>
            </div>
        )}
    </div>
  );
  
  const renderFindClinics = () => (
    <div className="p-6 sm:p-8">
      <ClinicFinder />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
        case 'book': return renderBookingForm();
        case 'view': return renderViewAppointments();
        case 'find': return renderFindClinics();
        default: return renderBookingForm();
    }
  }

  return (
    <div className="bg-white max-w-4xl mx-auto rounded-lg border border-gray-200 shadow-xl animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 pt-8">Appointments</h2>
        <div className="border-b border-gray-200 px-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('book')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'book' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Book Appointment
                </button>
                <button
                    onClick={() => setActiveTab('view')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'view' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    View Appointments ({bookedAppointments.length})
                </button>
                <button
                    onClick={() => setActiveTab('find')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'find' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Find Clinics
                </button>
            </nav>
        </div>
        {renderContent()}
    </div>
  );
};

export default AppointmentScheduler;
import React, { useState } from 'react';
import type { Patient, TriageResult, Symptom, PatientRecord, Appointment } from './types';
import { DiagnosisView } from './types';
import Header from './components/Header';
import TriageResultDisplay from './components/TriageResultDisplay';
import AppointmentScheduler from './components/AppointmentScheduler';
import Disclaimer from './components/Disclaimer';
import PatientRecordsView from './components/PatientRecordsView';
import Dashboard from './components/Dashboard';
import SavePatientRecordForm from './components/SavePatientRecordForm';
import { generateTriageResult } from './services/geminiService';
import DiagnosisWizard from './components/DiagnosisWizard';
import MediScanView from './components/MediScanView';


const App: React.FC = () => {
  const [mainView, setMainView] = useState<'dashboard' | 'diagnosis' | 'records' | 'appointments' | 'mediscan'>('dashboard');

  // Diagnosis state
  const [diagnosisView, setDiagnosisView] = useState<DiagnosisView>(DiagnosisView.WIZARD);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [patientForTriage, setPatientForTriage] = useState<Patient | null>(null);
  const [symptomsForTriage, setSymptomsForTriage] = useState<Symptom[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Patient Records state
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  
  // Appointments State
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);

  // Mock data for dashboard stats
  const [diagnosesCount, setDiagnosesCount] = useState(0);
  
  const handleTriageSubmit = async (patient: Patient, symptoms: Symptom[]) => {
    setIsLoading(true);
    setError(null);
    setPatientForTriage(patient);
    setSymptomsForTriage(symptoms);
    try {
      const result = await generateTriageResult(patient, symptoms);
      setTriageResult(result);
      setDiagnosisView(DiagnosisView.RESULT);
      setDiagnosesCount(prev => prev + 1); // Increment for demo
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing your symptoms. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleAppointment = () => {
    setDiagnosisView(DiagnosisView.APPOINTMENT);
  };
  
  const handleAppointmentBooked = (newAppointment: Appointment) => {
    setBookedAppointments(prev => {
        const updatedList = [newAppointment, ...prev];
        // Sort by date and time, most recent first
        updatedList.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB.getTime() - dateA.getTime();
        });
        return updatedList;
    });
  };

  const handleResetTriage = () => {
    setDiagnosisView(DiagnosisView.WIZARD);
    setTriageResult(null);
    setError(null);
    setPatientForTriage(null);
    setSymptomsForTriage(null);
    setMainView('dashboard');
  };

  const handleGoToSaveRecord = () => {
    if (patientForTriage && triageResult && symptomsForTriage) {
        setDiagnosisView(DiagnosisView.SAVE_RECORD);
    } else {
        setError("Cannot save record, essential data is missing.");
    }
  };

  const handleConfirmSavePatient = (newRecord: PatientRecord) => {
    setPatientRecords(prev => [newRecord, ...prev]);
    setMainView('records');
    handleResetTriage();
  };

  const handleDeletePatient = (patientId: string) => {
    setPatientRecords(prev => prev.filter(p => p.id !== patientId));
  };

  const handleUpdatePatient = (updatedRecord: PatientRecord) => {
    setPatientRecords(prev => prev.map(p => p.id === updatedRecord.id ? updatedRecord : p));
  };


  const renderDiagnosisView = () => {
    switch (diagnosisView) {
      case DiagnosisView.WIZARD:
        return (
          <DiagnosisWizard
            onSubmit={handleTriageSubmit}
            isLoading={isLoading}
            error={error}
            patientRecords={patientRecords}
          />
        );
      case DiagnosisView.RESULT:
        return (
          triageResult && (
            <TriageResultDisplay
              result={triageResult}
              onSchedule={handleScheduleAppointment}
              onReset={() => {
                  handleResetTriage();
                  setMainView('dashboard');
              }}
              onSaveRecord={handleGoToSaveRecord}
            />
          )
        );
      case DiagnosisView.APPOINTMENT:
        return <AppointmentScheduler 
                  onReset={handleResetTriage} 
                  onBooked={handleAppointmentBooked} 
                  bookedAppointments={bookedAppointments}
               />;
      case DiagnosisView.SAVE_RECORD:
        return (
            patientForTriage && triageResult && symptomsForTriage && (
                <SavePatientRecordForm 
                    patient={patientForTriage}
                    result={triageResult}
                    symptoms={symptomsForTriage}
                    onSave={handleConfirmSavePatient}
                    onCancel={() => setDiagnosisView(DiagnosisView.RESULT)}
                />
            )
        );
      default:
        return (
          <DiagnosisWizard
            onSubmit={handleTriageSubmit}
            isLoading={isLoading}
            error={error}
            patientRecords={patientRecords}
          />
        );
    }
  };
  
  const renderMainView = () => {
    switch(mainView) {
        case 'dashboard':
            return <Dashboard 
                        onStartDiagnosis={() => setMainView('diagnosis')}
                        onSchedule={() => setMainView('appointments')}
                        onStartMediScan={() => setMainView('mediscan')}
                        stats={{
                            patients: patientRecords.length,
                            diagnoses: diagnosesCount,
                            appointments: bookedAppointments.length
                        }}
                    />;
        case 'diagnosis':
            return renderDiagnosisView();
        case 'records':
            return <PatientRecordsView 
                        records={patientRecords} 
                        onUpdatePatient={handleUpdatePatient}
                        onDeletePatient={handleDeletePatient}
                    />;
        case 'appointments':
             return <AppointmentScheduler 
                        onReset={() => setMainView('dashboard')} 
                        onBooked={handleAppointmentBooked}
                        bookedAppointments={bookedAppointments}
                    />;
        case 'mediscan':
            return <MediScanView />;
        default:
             return <Dashboard 
                        onStartDiagnosis={() => setMainView('diagnosis')}
                        onSchedule={() => setMainView('appointments')}
                        onStartMediScan={() => setMainView('mediscan')}
                        stats={{
                            patients: patientRecords.length,
                            diagnoses: diagnosesCount,
                            appointments: bookedAppointments.length
                        }}
                    />;
    }
  }

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Header activeView={mainView} setView={setMainView} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {renderMainView()}
      </main>
      <Disclaimer />
    </div>
  );
};

export default App;
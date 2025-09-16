import React from 'react';

interface DashboardProps {
    onStartDiagnosis: () => void;
    onStartMediScan: () => void;
    onSchedule: () => void;
    stats: {
        patients: number;
        diagnoses: number;
        appointments: number;
    }
}

const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}> = ({ icon, title, description, color, onClick }) => (
    <button onClick={onClick} className={`text-white p-6 rounded-xl flex items-center space-x-4 transition-transform hover:scale-105 shadow-lg ${color}`}>
        <div className="bg-white/20 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
        </div>
    </button>
);


const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
}> = ({ icon, title, value, color }) => (
    <div className={`bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="text-gray-500">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ onStartDiagnosis, onStartMediScan, onSchedule, stats }) => {
    return (
        <div className="space-y-8">
            {/* Top action cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <ActionCard 
                    title="Start Diagnosis"
                    description="Begin symptom assessment"
                    color="bg-blue-600"
                    onClick={onStartDiagnosis}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M6 4h-1a2 2 0 0 0 -2 2v3.5h0a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1" />
                        <path d="M8 15a6 6 0 0 0 12 0v-3" />
                        <path d="M11 3v2" />
                        <path d="M6 3v2" />
                        <circle cx="20" cy="10" r="2" />
                    </svg>}
                />
                 <ActionCard 
                    title="MediScan"
                    description="Verify your medications"
                    color="bg-green-600"
                    onClick={onStartMediScan}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 12a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" /></svg>}
                />
                 <ActionCard 
                    title="Schedule"
                    description="Book appointment"
                    color="bg-purple-500"
                    onClick={onSchedule}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
            </div>

            {/* Medical Dashboard section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                 <h2 className="text-2xl font-bold text-gray-800">Medical Dashboard</h2>
                 <p className="text-sm text-gray-500 mb-6">Overview of patient care and system analytics</p>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Patients"
                        value={stats.patients}
                        color="border-blue-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.75 6.032a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06-1.06l-1.5-1.5zM15 6a3 3 0 11-6 0 3 3 0 016 0zM10 9a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5z" /></svg>}
                    />
                     <StatCard 
                        title="Diagnoses"
                        value={stats.diagnoses}
                        color="border-green-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>}
                    />
                     <StatCard 
                        title="Appointments"
                        value={stats.appointments}
                        color="border-purple-500"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
                    />
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border-l-4 border-red-500">
                        <div className="text-gray-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">System Status</p>
                            <p className="text-xl font-bold text-green-600">Active</p>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    )
};

export default Dashboard;
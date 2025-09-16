import React from 'react';

type ViewType = 'dashboard' | 'diagnosis' | 'records' | 'appointments' | 'mediscan';

interface HeaderProps {
    activeView: ViewType;
    setView: (view: ViewType) => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600'
        : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
    }`}
  >
    {icon}
    <span>{label}</span>
    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
  </button>
);

const Header: React.FC<HeaderProps> = ({ activeView, setView }) => {
  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
    },
    {
      id: 'diagnosis',
      label: 'Diagnosis',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 2a1 1 0 00-.707.293L3.414 5.172A1 1 0 003 5.88V17a1 1 0 001 1h12a1 1 0 001-1V5.88a1 1 0 00-.414-.707l-3.879-2.88a1 1 0 00-.707-.293H7zm0 2h6l3 2.25V16H4V6.25l3-2.25z" clipRule="evenodd" /><path d="M10 12a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-4 0a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1z" /></svg>,
    },
    {
        id: 'mediscan',
        label: 'MediScan',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 12a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" /></svg>,
    },
    {
      id: 'records',
      label: 'Records',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.75 6.032a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06-1.06l-1.5-1.5zM15 6a3 3 0 11-6 0 3 3 0 016 0zM10 9a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5z" /></svg>,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
    },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M6 4h-1a2 2 0 0 0 -2 2v3.5h0a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1" />
                    <path d="M8 15a6 6 0 0 0 12 0v-3" />
                    <path d="M11 3v2" />
                    <path d="M6 3v2" />
                    <path d="M18.396 6.223a4.5 4.5 0 0 1 5.604 5.604l-7.001 7.001l-7.001 -7.001a4.5 4.5 0 0 1 5.604 -5.604l1.397 1.397l1.397 -1.397z" />
                </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">MediAce</h1>
              <p className="text-xs text-gray-500">AI-Based Medical Diagnosis Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
              </svg>
              <span>System Active</span>
          </div>
        </div>
        <nav className="flex space-x-4 border-t border-gray-900/10 -mb-px">
          {navItems.map((item) => (
            <div key={item.id} className="relative">
              <NavLink
                label={item.label}
                icon={item.icon}
                isActive={activeView === item.id}
                onClick={() => setView(item.id)}
              />
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
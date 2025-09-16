import React from 'react';

interface PatientAvatarProps {
  gender: 'male' | 'female' | 'other';
  className?: string;
}

const PatientAvatar: React.FC<PatientAvatarProps> = ({ gender, className = 'h-12 w-12 rounded-full' }) => {
  const MaleAvatar = () => (
    <div className={`${className} bg-gray-700 flex items-center justify-center overflow-hidden`}>
       <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><title>Jackson Lee</title><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" fill="#FFFFFF" rx="72"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#f97316"></rect><rect x="0" y="0" width="36" height="36" transform="translate(4 4) rotate(340 18 18) scale(1.2)" fill="#f59e0b" rx="36"></rect><g transform="translate(-4 -3) rotate(0 18 18)"><path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path><rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
    </div>
  );

  const FemaleAvatar = () => (
     <div className={`${className} bg-gray-700 flex items-center justify-center overflow-hidden`}>
      <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><title>Sofia Davis</title><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" fill="#FFFFFF" rx="72"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#7c3aed"></rect><rect x="0" y="0" width="36" height="36" transform="translate(0 0) rotate(324 18 18) scale(1.2)" fill="#a78bfa" rx="36"></rect><g transform="translate(-4 4.5) rotate(-4 18 18)"><path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path><rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
    </div>
  );

  const OtherAvatar = () => (
     <div className={`${className} bg-gray-700 flex items-center justify-center overflow-hidden`}>
      <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><title>Isabella Nguyen</title><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" fill="#FFFFFF" rx="72"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#14b8a6"></rect><rect x="0" y="0" width="36" height="36" transform="translate(0 9) rotate(45 18 18) scale(1.2)" fill="#10b981" rx="6"></rect><g transform="translate(-3.5 3.5) rotate(5 18 18)"><path d="M15 20c2 1 4 1 6 0" stroke="#FFFFFF" fill="none" strokeLinecap="round"></path><rect x="13" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect><rect x="21" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect></g></g></svg>
    </div>
  );

  switch (gender) {
    case 'male':
      return <MaleAvatar />;
    case 'female':
      return <FemaleAvatar />;
    default:
      return <OtherAvatar />;
  }
};

export default PatientAvatar;

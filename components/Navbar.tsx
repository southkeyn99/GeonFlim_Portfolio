
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center md:items-baseline mix-blend-difference gap-4">
      <div 
        className="text-xl font-serif-cinematic tracking-[0.3em] cursor-pointer hover:opacity-70 transition-opacity uppercase font-bold text-white"
        onClick={() => onNavigate('HOME')}
      >
        NAMGUNG GEON
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[10px] tracking-[0.2em] font-light">
        {[
          { label: 'Home', view: 'HOME' },
          { label: 'Directing', view: 'DIRECTING' },
          { label: 'AI Film', view: 'AI_FILM' },
          { label: 'Cinematography', view: 'CINEMATOGRAPHY' },
          { label: 'Staff', view: 'STAFF' },
          { label: 'Contact', view: 'CONTACT' },
          { label: 'Manage', view: 'ADMIN' }
        ].map((item) => (
          <button 
            key={item.view}
            onClick={() => onNavigate(item.view as ViewState)}
            className={`${currentView === item.view ? 'opacity-100 font-bold' : 'opacity-40'} hover:opacity-100 transition-opacity uppercase text-white`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;


import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { label: 'Home', view: 'HOME' },
    { label: 'Directing', view: 'DIRECTING' },
    { label: 'AI Film', view: 'AI_FILM' },
    { label: 'Cinematography', view: 'CINEMATOGRAPHY' },
    { label: 'Staff', view: 'STAFF' },
    { label: 'Contact', view: 'CONTACT' },
    { label: 'Manage', view: 'ADMIN' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center md:items-center gap-6 pointer-events-none">
      {/* Logo Area */}
      <div 
        className="text-lg md:text-xl font-serif-cinematic tracking-[0.4em] cursor-pointer hover:opacity-70 transition-opacity uppercase font-bold text-white shrink-0 pointer-events-auto mix-blend-difference"
        onClick={() => onNavigate('HOME')}
      >
        GEON FILM
      </div>
      
      {/* Category Navigation Bar with Background */}
      <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex justify-start md:justify-end pointer-events-auto">
        <div className="flex items-center gap-2 md:gap-4 p-1.5 md:p-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-full shadow-2xl">
          {menuItems.map((item) => (
            <button 
              key={item.view}
              onClick={() => onNavigate(item.view as ViewState)}
              className={`relative px-4 py-2 transition-all duration-500 rounded-full group ${
                currentView === item.view ? 'text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold uppercase relative z-10 transition-colors">
                {item.label}
              </span>
              
              {/* Subtle Indicator Bar behind active text */}
              {currentView === item.view && (
                <div className="absolute inset-0 bg-white/10 rounded-full animate-fade-in" />
              )}
              
              {/* Bottom Gold Accent Bar */}
              <div 
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-[#c5a059] transition-all duration-500 rounded-full ${
                  currentView === item.view ? 'w-4 opacity-100' : 'w-0 opacity-0 group-hover:w-2 group-hover:opacity-50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

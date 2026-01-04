
import React from 'react';
import { SiteSettings } from '../types';

interface HomeProps {
  settings: SiteSettings;
  onExplore: () => void;
}

const Home: React.FC<HomeProps> = ({ settings, onExplore }) => {
  const scrollToNext = () => {
    const nextSection = document.getElementById('director-intro');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image - Increased visibility */}
      <div className="absolute inset-0 z-0">
        <img 
          src={settings.homeBgImage} 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        />
        {/* Refined gradient overlay for better contrast balance */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 px-6">
        <h1 className="text-6xl md:text-9xl font-serif-cinematic tracking-[0.2em] animate-fade-in font-bold uppercase drop-shadow-2xl">
          {settings.directorNameEn}
        </h1>
        <p className="text-xs md:text-sm tracking-[0.8em] text-white/70 uppercase animate-fade-in drop-shadow-lg" style={{ animationDelay: '0.4s' }}>
          Film Director & Visual Artist
        </p>
        <div className="pt-12 animate-fade-in flex flex-col items-center gap-6" style={{ animationDelay: '0.8s' }}>
          <button 
            onClick={scrollToNext}
            className="group relative px-12 py-4 text-[10px] tracking-[0.4em] uppercase font-light overflow-hidden transition-all backdrop-blur-sm bg-black/10"
          >
            <span className="relative z-10 group-hover:text-black transition-colors duration-500">Discover Profile</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="absolute inset-0 border border-white/20"></div>
          </button>
          
          <button 
            onClick={onExplore}
            className="text-[10px] tracking-[0.2em] text-white/50 uppercase hover:text-white transition-colors"
          >
            Skip to Works
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToNext}>
        <div className="w-px h-12 bg-white/30"></div>
      </div>
    </div>
  );
};

export default Home;

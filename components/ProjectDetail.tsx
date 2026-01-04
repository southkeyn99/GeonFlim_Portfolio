
import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const showNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % project.stillCuts.length);
    }
  }, [selectedImageIndex, project.stillCuts.length]);

  const showPrev = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + project.stillCuts.length) % project.stillCuts.length);
    }
  }, [selectedImageIndex, project.stillCuts.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, closeLightbox, showNext, showPrev]);

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-32 md:py-0 gap-16 md:gap-24 mb-40 last:mb-0">
      {/* Left Area: Visual - Fixed to Portrait (3:4) ratio across all devices */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="relative group w-full max-w-[450px] aspect-[3/4] overflow-hidden bg-neutral-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
          <img 
            src={project.coverImage} 
            alt={project.titleEn} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
        </div>
      </div>

      {/* Right Area: Information */}
      <div className="w-full md:w-1/2 flex flex-col justify-center max-w-xl">
        <header className="mb-8">
          <div className="text-[10px] tracking-[0.4em] font-bold text-[#c5a059] mb-6 uppercase">
            {project.year} &bull; {project.category.replace('_', ' ')}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif-cinematic mb-2 leading-none tracking-tighter">
            {project.titleKr}
          </h1>
          <h2 className="text-lg md:text-xl font-serif-cinematic italic text-neutral-500 mb-8 font-light">
            {project.titleEn}
          </h2>
          
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] tracking-widest text-neutral-400 font-medium uppercase mb-10 border-y border-neutral-900/50 py-6">
            <div><span className="text-neutral-600 mr-3">GENRE</span>{project.genre}</div>
            <div><span className="text-neutral-600 mr-3">TIME</span>{project.runtime}</div>
            <div><span className="text-neutral-600 mr-3">ROLE</span>{project.role}</div>
          </div>
        </header>

        <article className="mb-12">
          <p className="text-neutral-400 leading-relaxed text-sm md:text-base font-light whitespace-pre-line tracking-wide">
            {project.synopsis}
          </p>
        </article>

        {project.awards.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[9px] tracking-[0.5em] text-neutral-600 uppercase font-black mb-4">Recognition</h3>
            <ul className="space-y-3">
              {project.awards.map((award, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <span className="w-1 h-1 mt-2 bg-[#c5a059] group-hover:scale-150 transition-transform"></span>
                  <span className="text-xs md:text-sm text-neutral-300 font-light tracking-wide">{award}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Still Cuts Thumbnails */}
        {project.stillCuts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-900">
             <h3 className="text-[9px] tracking-[0.5em] text-neutral-600 uppercase font-black mb-6">Visual Stills</h3>
             <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
               {project.stillCuts.map((cut, idx) => (
                 <div 
                    key={idx} 
                    onClick={() => openLightbox(idx)}
                    className="h-24 md:h-28 aspect-video bg-neutral-900 border border-neutral-800/50 overflow-hidden cursor-pointer flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-700"
                 >
                    <img src={cut} className="w-full h-full object-cover" alt={`Still ${idx}`} />
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl animate-fade-in p-4 md:p-12">
          <button 
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110] p-4"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {project.stillCuts.length > 1 && (
            <>
              <button onClick={showPrev} className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all p-6 z-[110]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={showNext} className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-all p-6 z-[110]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          <div className="relative max-w-7xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <img 
              src={project.stillCuts[selectedImageIndex]} 
              className="max-w-full max-h-full object-contain shadow-2xl animate-fade-in"
              alt="Still full size"
            />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.6em] text-neutral-600 uppercase font-black">
              {selectedImageIndex + 1} / {project.stillCuts.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetail;

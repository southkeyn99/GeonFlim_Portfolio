
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
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-10 md:px-20 py-32 md:py-0 gap-16 md:gap-24 mb-40 last:mb-0">
      {/* Left Area: Visual */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="relative group w-full aspect-[2.35/1] md:aspect-[3/4] overflow-hidden bg-neutral-900 shadow-2xl">
          <img 
            src={project.coverImage} 
            alt={project.titleEn} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>

      {/* Right Area: Information */}
      <div className="w-full md:w-1/2 flex flex-col justify-center max-w-xl">
        <header className="mb-8">
          <div className="text-xs tracking-[0.3em] font-light text-neutral-500 mb-4 uppercase">
            {project.year} &bull; {project.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif-cinematic mb-2 leading-tight">
            {project.titleKr}
          </h1>
          <h2 className="text-xl md:text-2xl font-serif-cinematic italic text-neutral-400 mb-6">
            {project.titleEn}
          </h2>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-wider text-neutral-300 font-light uppercase mb-8 border-y border-neutral-800 py-4">
            <div><span className="text-neutral-500 mr-2">GENRE</span>{project.genre}</div>
            <div><span className="text-neutral-500 mr-2">TIME</span>{project.runtime}</div>
            <div><span className="text-neutral-500 mr-2">ROLE</span>{project.role}</div>
          </div>
        </header>

        <article className="mb-10">
          <p className="text-neutral-400 leading-relaxed text-sm md:text-base font-light whitespace-pre-line">
            {project.synopsis}
          </p>
        </article>

        {project.awards.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase font-medium mb-4">Recognition</h3>
            <ul className="space-y-2">
              {project.awards.map((award, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-[#c5a059]"></span>
                  <span className="text-sm text-neutral-300 font-light">{award}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Still Cuts Thumbnails */}
        {project.stillCuts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-900">
             <h3 className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase font-medium mb-4">Stills</h3>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
               {project.stillCuts.map((cut, idx) => (
                 <img 
                    key={idx} 
                    src={cut} 
                    onClick={() => openLightbox(idx)}
                    className="h-20 w-32 object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0 border border-neutral-800"
                    alt={`Still ${idx}`}
                 />
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in p-4 md:p-12">
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Controls */}
          {project.stillCuts.length > 1 && (
            <>
              <button 
                onClick={showPrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all p-4 z-[110]"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={showNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all p-4 z-[110]"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <img 
              src={project.stillCuts[selectedImageIndex]} 
              className="max-w-full max-h-full object-contain shadow-2xl animate-fade-in"
              alt="Still full size"
            />
            
            {/* Index indicator */}
            <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-[10px] tracking-[0.5em] text-neutral-500 uppercase">
              {selectedImageIndex + 1} / {project.stillCuts.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetail;

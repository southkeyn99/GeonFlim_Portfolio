
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageLoading(true);
  };

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const showNext = useCallback(() => {
    if (selectedImageIndex !== null && project.stillCuts && project.stillCuts.length > 0) {
      setIsImageLoading(true);
      setSelectedImageIndex((selectedImageIndex + 1) % project.stillCuts.length);
    }
  }, [selectedImageIndex, project.stillCuts]);

  const showPrev = useCallback(() => {
    if (selectedImageIndex !== null && project.stillCuts && project.stillCuts.length > 0) {
      setIsImageLoading(true);
      setSelectedImageIndex((selectedImageIndex - 1 + project.stillCuts.length) % project.stillCuts.length);
    }
  }, [selectedImageIndex, project.stillCuts]);

  // Handle body overflow
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImageIndex]);

  // Keyboard navigation
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
    <>
      <section className="min-h-screen bg-[#050505] text-white py-32 md:py-48 px-6 md:px-20 animate-fade-in">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left: Project Cover Photo - Sticky only on Desktop (lg and up) */}
          <div className="lg:col-span-5 relative group lg:sticky lg:top-48">
            <div className="relative z-10 aspect-[3/4] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 bg-neutral-900">
              <img 
                src={project.coverImage} 
                alt={project.titleEn} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 flex flex-col items-start gap-1">
                <span className="text-[8px] tracking-[0.5em] font-black uppercase bg-black/40 backdrop-blur-md px-2 py-1">KEY FRAME</span>
                <span className="text-[8px] tracking-[0.3em] font-bold text-[#c5a059] bg-black/40 backdrop-blur-md px-2 py-1">{project.year}</span>
              </div>
            </div>
            {/* Decorative borders - adjusted to hide or stay subtle on mobile */}
            <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-40 md:h-40 border-t border-l border-[#c5a059]/30 -z-0"></div>
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 border-b border-r border-neutral-800 -z-0"></div>
            <div className="mt-8 flex justify-between items-center text-[9px] tracking-[0.6em] text-neutral-600 font-black uppercase">
              <span>FILE NO. {project.id.padStart(4, '0')}</span>
              <span>CINEMATIC ARCHIVE</span>
            </div>
          </div>

          {/* Right: Project Information */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <header className="mb-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-[#c5a059]"></div>
                <span className="text-[10px] tracking-[0.5em] font-black text-neutral-500 uppercase">
                  {project.category.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl xl:text-8xl font-serif-cinematic font-medium tracking-tighter leading-none mb-4">
                  {project.titleKr}
                </h1>
                <h2 className="text-xl md:text-2xl font-serif-cinematic italic text-neutral-500 font-light tracking-wide">
                  {project.titleEn}
                </h2>
              </div>
            </header>

            <div className="grid grid-cols-3 gap-8 py-10 border-y border-neutral-900 mb-12">
              <div className="space-y-2">
                <span className="text-[9px] tracking-[0.4em] text-neutral-600 uppercase font-black">Genre</span>
                <p className="text-xs md:text-sm tracking-widest text-white uppercase">{project.genre}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] tracking-[0.4em] text-neutral-600 uppercase font-black">Runtime</span>
                <p className="text-xs md:text-sm tracking-widest text-white uppercase">{project.runtime}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] tracking-[0.4em] text-neutral-600 uppercase font-black">Role</span>
                <p className="text-xs md:text-sm tracking-widest text-[#c5a059] uppercase">{project.role}</p>
              </div>
            </div>

            <article className="mb-16">
              <h3 className="text-[10px] tracking-[0.5em] text-neutral-700 uppercase font-black mb-6">Logline & Synopsis</h3>
              <p className="text-neutral-400 leading-[1.8] text-sm md:text-base font-light whitespace-pre-line tracking-wide max-w-2xl">
                {project.synopsis}
              </p>
            </article>

            {project.awards.length > 0 && (
              <div className="mb-16 p-8 bg-[#0a0a0a] border border-neutral-800 rounded-sm">
                <h3 className="text-[10px] tracking-[0.5em] text-[#c5a059] uppercase font-black mb-8 flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
                  Honors & Screenings
                </h3>
                <ul className="space-y-4">
                  {project.awards.map((award, idx) => (
                    <li key={idx} className="flex items-center gap-5 group">
                      <span className="text-[10px] text-neutral-700 font-bold">0{idx + 1}</span>
                      <span className="text-xs md:text-sm text-neutral-300 font-light tracking-wide group-hover:text-white transition-colors">{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Still Cuts Gallery */}
            {project.stillCuts && project.stillCuts.length > 0 && (
              <div className="mt-12 pt-12 border-t border-neutral-900">
                <h3 className="text-[10px] tracking-[0.5em] text-neutral-700 uppercase font-black mb-8">Atmosphere & Stills</h3>
                <div className="grid grid-cols-2 gap-4">
                  {project.stillCuts.map((cut, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => openLightbox(idx)}
                        className="aspect-video bg-neutral-900 border border-neutral-800/50 overflow-hidden cursor-pointer group/still relative"
                    >
                        <img 
                          src={cut} 
                          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover/still:grayscale-0 group-hover/still:scale-110" 
                          alt={`Still ${idx}`} 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover/still:bg-transparent transition-colors"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal: Placed outside the transformed section to guarantee true full-screen centering */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[10000] bg-[#020202]/98 backdrop-blur-3xl animate-fade-in select-none overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Header Bar - Absolute inside the fixed overlay */}
          <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-[10002]">
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.4em] text-neutral-500 uppercase font-black mb-1">NAMGUNG GEON / ARCHIVE</span>
              <span className="text-xs tracking-widest text-white font-serif-cinematic uppercase">{project.titleKr}</span>
            </div>
            
            <button 
              onClick={closeLightbox}
              className="group flex items-center gap-4 text-white/40 hover:text-white transition-all p-2"
            >
              <span className="text-[9px] tracking-[0.3em] uppercase font-bold hidden md:block">Close Viewer</span>
              <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>

          {/* Background Layer for click-to-close */}
          <div className="absolute inset-0 z-0 cursor-zoom-out" onClick={closeLightbox}></div>

          {/* Centered Image Viewport */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20 z-[10001] pointer-events-none">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 border-2 border-neutral-800 border-t-[#c5a059] rounded-full animate-spin"></div>
              </div>
            )}

            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img 
                ref={imageRef}
                src={project.stillCuts[selectedImageIndex]} 
                className={`max-w-full max-h-[85vh] object-contain shadow-[0_40px_120px_rgba(0,0,0,1)] transition-all duration-700 pointer-events-auto ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                alt={`Still cut ${selectedImageIndex + 1}`}
                onLoad={() => setIsImageLoading(false)}
                onClick={(e) => { e.stopPropagation(); showNext(); }}
              />
              
              {/* Navigation Arrows */}
              {project.stillCuts.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); showPrev(); }}
                    className="fixed left-4 md:left-12 top-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-white/10 hover:text-[#c5a059] transition-all pointer-events-auto group/btn z-[10003]"
                  >
                    <svg className="w-8 h-8 md:w-16 md:h-16 transition-transform group-hover/btn:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); showNext(); }}
                    className="fixed right-4 md:right-12 top-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-white/10 hover:text-[#c5a059] transition-all pointer-events-auto group/btn z-[10003]"
                  >
                    <svg className="w-8 h-8 md:w-16 md:h-16 transition-transform group-hover/btn:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Navigation Meta */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col items-center gap-4 z-[10002] pointer-events-none">
            <div className="flex items-center gap-6">
              <div className="w-12 h-px bg-white/10"></div>
              <div className="text-[10px] tracking-[0.8em] text-white/60 font-black uppercase">
                SCENE {selectedImageIndex + 1} / {project.stillCuts.length}
              </div>
              <div className="w-12 h-px bg-white/10"></div>
            </div>
            
            <div className="flex gap-2 pointer-events-auto">
              {project.stillCuts.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(idx); }}
                  className={`h-1 transition-all duration-500 rounded-full cursor-pointer ${idx === selectedImageIndex ? 'w-8 bg-[#c5a059]' : 'w-2 bg-white/10 hover:bg-white/30'}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;

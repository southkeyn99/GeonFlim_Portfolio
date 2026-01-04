
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Project, ViewState, SiteSettings } from './types.ts';
import { storageService } from './services/storageService.ts';
import { DEFAULT_SETTINGS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import ProjectDetail from './components/ProjectDetail.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import Home from './components/Home.tsx';
import About from './components/About.tsx';
import Contact from './components/Contact.tsx';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<ViewState>('HOME');
  const [previousView, setPreviousView] = useState<ViewState>('HOME');
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [isReturning, setIsReturning] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Track the actual view to distinguish between fresh navigation and scroll restoration
  const lastViewRef = useRef<ViewState>(view);

  useEffect(() => {
    const initData = async () => {
      try {
        const [loadedProjects, loadedSettings] = await Promise.all([
          storageService.getProjects(),
          storageService.getSettings()
        ]);
        setProjects(loadedProjects);
        setSettings(loadedSettings);
      } catch (error) {
        console.error("Failed to load data from IndexedDB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Final and robust scroll management
  useEffect(() => {
    if (isReturning) {
      // 1. We are returning from a detail view
      const timer = setTimeout(() => {
        window.scrollTo({ top: scrollPos, behavior: 'auto' });
        setIsReturning(false);
        lastViewRef.current = view; // Update ref so the 'fresh navigation' block doesn't trigger
      }, 50); // Small delay to allow DOM to recalculate heights
      return () => clearTimeout(timer);
    } 

    // 2. This is a fresh navigation or manual view change
    if (view !== lastViewRef.current) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      lastViewRef.current = view;
    }

    setAuthError(false);
    setPasswordInput('');
  }, [view, isReturning, scrollPos]);

  const handleAddProject = async (p: Project) => {
    await storageService.addProject(p);
    const updated = await storageService.getProjects();
    setProjects(updated);
  };

  const handleUpdateProject = async (p: Project) => {
    await storageService.updateProject(p);
    const updated = await storageService.getProjects();
    setProjects(updated);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Delete this work?')) {
      await storageService.deleteProject(id);
      const updated = await storageService.getProjects();
      setProjects(updated);
    }
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    await storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1228') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasswordInput('');
    }
  };

  const handleProjectSelect = (id: string) => {
    const currentY = window.scrollY;
    setScrollPos(currentY); // Save current scroll position
    setIsReturning(false); 
    setSelectedProjectId(id);
    setPreviousView(view);
    setView('PROJECT_DETAIL');
  };

  const handleBack = () => {
    setIsReturning(true); // Signal restoration
    setView(previousView);
  };

  const handleNavbarNavigate = (v: ViewState) => {
    setIsReturning(false);
    setView(v);
  };

  const filteredProjects = useMemo(() => {
    if (view === 'HOME' || view === 'ADMIN' || view === 'CONTACT' || view === 'PROJECT_DETAIL') return [];
    return projects.filter(p => p.category === view);
  }, [projects, view]);

  const currentProject = useMemo(() => {
    if (view !== 'PROJECT_DETAIL' || !selectedProjectId) return null;
    return projects.find(p => p.id === selectedProjectId);
  }, [projects, view, selectedProjectId]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <div className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 animate-pulse">
          Initializing Database...
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return (
          <div className="animate-fade-in">
            <Home settings={settings} onExplore={() => handleNavbarNavigate('DIRECTING')} />
            <About settings={settings} projects={projects} onProjectClick={handleProjectSelect} />
            <Contact settings={settings} />
          </div>
        );
      case 'PROJECT_DETAIL':
        return currentProject ? (
          <div className="relative min-h-screen">
            <button 
              onClick={handleBack}
              className="fixed top-28 left-6 md:left-20 z-40 flex items-center gap-4 group text-[10px] tracking-[0.4em] uppercase text-neutral-500 hover:text-white transition-colors bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>
            <ProjectDetail project={currentProject} />
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center text-[10px] uppercase tracking-widest text-neutral-700">Project Not Found</div>
        );
      case 'CONTACT':
        return (
          <div className="animate-fade-in pt-20">
            <Contact settings={settings} />
          </div>
        );
      case 'ADMIN':
        if (!isAuthenticated) {
          return (
            <div className="h-screen w-full bg-[#050505] flex items-center justify-center px-6 animate-fade-in">
              <div className="max-w-md w-full space-y-12 text-center">
                <div className="space-y-4">
                  <h2 className="text-[10px] tracking-[0.6em] text-[#c5a059] uppercase font-bold">Security</h2>
                  <h1 className="text-4xl font-serif-cinematic">Restricted Access</h1>
                  <p className="text-xs text-neutral-500 tracking-widest uppercase">Authorized Personnel Only</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-8">
                  <div className="relative group">
                    <input 
                      type="password" 
                      autoFocus
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="ENTER PASSCODE"
                      className={`w-full bg-[#0a0a0a] border-b ${authError ? 'border-red-900' : 'border-neutral-800'} focus:border-[#c5a059] transition-colors py-4 text-center text-sm tracking-[0.5em] outline-none placeholder:text-neutral-800`}
                    />
                    {authError && (
                      <p className="absolute -bottom-6 left-0 w-full text-[9px] text-red-900 tracking-widest uppercase animate-pulse">
                        Invalid Access Code
                      </p>
                    )}
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#c5a059] transition-all duration-500"
                  >
                    Authenticate
                  </button>
                </form>

                <button 
                  onClick={() => handleNavbarNavigate('HOME')}
                  className="text-[9px] text-neutral-600 hover:text-white transition-colors uppercase tracking-[0.3em]"
                >
                  Return to Site
                </button>
              </div>
            </div>
          );
        }
        return (
          <AdminPanel 
            projects={projects}
            settings={settings}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            onSaveSettings={handleSaveSettings}
            onClose={() => {
                handleNavbarNavigate('HOME');
                setIsAuthenticated(false);
            }}
          />
        );
      default:
        return (
          <div className="pt-32 md:pt-48 pb-32">
            <header className="px-6 md:px-24 mb-20 md:mb-32 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-[#c5a059]"></div>
                <span className="text-[10px] tracking-[0.6em] text-[#c5a059] uppercase font-bold">Category</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-serif-cinematic tracking-tighter text-white uppercase font-bold">
                {view.replace('_', ' ')}
              </h2>
            </header>

            <div className="space-y-40 md:space-y-64 px-6 md:px-24 max-w-[1600px] mx-auto">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <div 
                    key={project.id} 
                    onClick={() => handleProjectSelect(project.id)}
                    className={`group cursor-pointer flex flex-col lg:flex-row items-center gap-12 lg:gap-24 animate-fade-in ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Visual Preview */}
                    <div className="w-full lg:w-1/2 aspect-[3/4] overflow-hidden bg-neutral-900 relative">
                      <img 
                        src={project.coverImage} 
                        alt={project.titleEn} 
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                      <div className="absolute top-8 left-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                         <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                           <span className="text-[9px] tracking-[0.3em] font-black text-white uppercase">Click to view details</span>
                         </div>
                      </div>
                    </div>

                    {/* Metadata Preview */}
                    <div className="w-full lg:w-1/2 flex flex-col space-y-8">
                       <div className="space-y-4">
                         <div className="text-[11px] md:text-xs font-black text-[#c5a059] tracking-[0.4em] uppercase">
                           {project.year}
                         </div>
                         <h3 className="text-3xl md:text-5xl xl:text-6xl font-serif-cinematic font-medium tracking-tight text-white leading-tight">
                           {project.titleKr} <span className="font-light opacity-60 text-2xl md:text-4xl">({project.titleEn})</span>
                         </h3>
                         <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs tracking-widest text-[#c5a059] font-bold uppercase py-2">
                           <span>{project.genre}</span>
                           <span className="text-neutral-800">|</span>
                           <span>{project.runtime}</span>
                           <span className="text-neutral-800">|</span>
                           <span>{project.role.split(',')[0]}</span>
                         </div>
                       </div>

                       <div className="max-w-lg">
                         <p className="text-neutral-500 text-sm md:text-base leading-[1.8] font-light tracking-wide line-clamp-3 group-hover:text-neutral-400 transition-colors">
                           {project.synopsis}
                         </p>
                       </div>

                       {/* Awards Highlights */}
                       {project.awards.length > 0 && (
                         <div className="pt-6 space-y-4">
                           {project.awards.slice(0, 3).map((award, aidx) => (
                             <div key={aidx} className="flex items-start gap-3 group/award">
                               <span className="text-xs text-[#d97706] mt-0.5 opacity-80 group-hover/award:opacity-100">🏆</span>
                               <span className="text-[11px] md:text-xs text-[#d97706] opacity-70 group-hover/award:opacity-100 transition-opacity tracking-wide">
                                 {award}
                               </span>
                             </div>
                           ))}
                         </div>
                       )}
                       
                       <div className="pt-10 flex items-center gap-4 text-[9px] tracking-[0.5em] text-neutral-700 uppercase font-black group-hover:text-[#c5a059] transition-colors">
                         <span>More Information</span>
                         <svg className="w-4 h-4 translate-y-[1px] transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                         </svg>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-8">
                  <div className="w-px h-24 bg-neutral-900"></div>
                  <div className="text-neutral-600 font-light tracking-[0.5em] text-[10px] uppercase">
                    Works are being updated for selection
                  </div>
                </div>
              )}
            </div>
            
            <footer className="mt-40 md:mt-64 h-60 flex flex-col items-center justify-center text-neutral-900 border-t border-neutral-900/30">
              <div className="w-px h-16 bg-neutral-900 mb-6"></div>
              <div className="text-[9px] tracking-[0.5em] uppercase">Cinematic Archive End</div>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Navbar currentView={view} onNavigate={handleNavbarNavigate} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

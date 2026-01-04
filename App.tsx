
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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

  const lastViewRef = useRef<ViewState>(view);

  const loadData = useCallback(async () => {
    try {
      const [loadedProjects, loadedSettings] = await Promise.all([
        storageService.getProjects(),
        storageService.getSettings()
      ]);
      setProjects([...loadedProjects]);
      setSettings({...loadedSettings});
    } catch (error) {
      console.error("Data Load Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isReturning) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: scrollPos, behavior: 'auto' });
        setIsReturning(false);
        lastViewRef.current = view;
      }, 50);
      return () => clearTimeout(timer);
    } 

    if (view !== lastViewRef.current) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      lastViewRef.current = view;
    }
    setPasswordInput('');
  }, [view, isReturning, scrollPos]);

  const handleAddProject = async (p: Project) => {
    await storageService.addProject(p);
    await loadData();
  };

  const handleUpdateProject = async (p: Project) => {
    await storageService.updateProject(p);
    await loadData();
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await storageService.deleteProject(id);
      await loadData();
    }
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    await storageService.saveSettings(newSettings);
    await loadData();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1228') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Passcode');
    }
  };

  const handleProjectSelect = (id: string) => {
    setScrollPos(window.scrollY);
    setIsReturning(false); 
    setSelectedProjectId(id);
    setPreviousView(view);
    setView('PROJECT_DETAIL');
  };

  const handleBack = () => {
    setIsReturning(true);
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

  if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-[10px] tracking-widest text-neutral-500 uppercase">Synchronizing Archive...</div>;

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
          <div className="relative">
            <button onClick={handleBack} className="fixed top-28 left-6 md:left-20 z-[45] bg-black/50 backdrop-blur-md px-6 py-3 border border-white/10 text-[10px] tracking-widest uppercase hover:text-[#c5a059] transition-colors">Go Back</button>
            <ProjectDetail project={currentProject} />
          </div>
        ) : null;
      case 'CONTACT':
        return <div className="pt-20"><Contact settings={settings} /></div>;
      case 'ADMIN':
        if (!isAuthenticated) {
          return (
            <div className="h-screen w-full bg-[#050505] flex items-center justify-center px-6">
              <div className="max-w-md w-full space-y-8 text-center">
                <h1 className="text-3xl font-serif-cinematic uppercase tracking-widest">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                  <input type="password" autoFocus value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="ENTER PASSCODE" className="w-full bg-transparent border-b border-neutral-800 focus:border-[#c5a059] py-4 text-center tracking-[0.5em] outline-none" />
                  <button type="submit" className="w-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-widest">Authenticate</button>
                </form>
                <button onClick={() => handleNavbarNavigate('HOME')} className="text-[9px] text-neutral-600 uppercase tracking-widest">Return Home</button>
              </div>
            </div>
          );
        }
        return (
          <AdminPanel 
            projects={projects} settings={settings}
            onAdd={handleAddProject} onUpdate={handleUpdateProject} onDelete={handleDeleteProject}
            onSaveSettings={handleSaveSettings}
            onClose={() => { setView('HOME'); setIsAuthenticated(false); }}
          />
        );
      default:
        return (
          <div className="pt-32 md:pt-48 pb-64 px-6 md:px-24 lg:px-40 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-48 md:space-y-72">
              
              {/* Category Header */}
              <div className="flex items-center gap-6 mb-32">
                <div className="h-px w-16 bg-[#c5a059]"></div>
                <h2 className="text-[12px] tracking-[0.8em] font-black uppercase text-neutral-500">
                  {view.replace('_', ' ')} ARCHIVE
                </h2>
              </div>

              {/* Work Entries Refined per Reference Image */}
              <div className="space-y-48 md:space-y-80">
                {filteredProjects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className={`flex flex-col lg:flex-row gap-12 lg:gap-24 items-center group cursor-pointer ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    {/* Image Side */}
                    <div className="w-full lg:w-5/12 relative">
                      <div className="aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/5 relative z-10 shadow-2xl">
                        <img 
                          src={project.coverImage} 
                          alt={project.titleKr} 
                          className="w-full h-full object-cover transition-all duration-[2.5s] ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                      </div>
                      <div className="absolute -inset-10 bg-[#c5a059]/5 blur-3xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    </div>

                    {/* Text Side - Refined Typography */}
                    <div className="w-full lg:w-7/12 space-y-8 flex flex-col justify-center">
                      <div className="space-y-3">
                        <div className="text-[#c5a059] text-[12px] font-black tracking-[0.4em] mb-4">{project.year}</div>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif-cinematic tracking-tight leading-tight transition-colors duration-500">
                          {project.titleKr} 
                          <span className="ml-4 text-xl md:text-2xl lg:text-3xl text-neutral-500 font-light italic opacity-80">
                            ({project.titleEn})
                          </span>
                        </h3>
                        <div className="pt-2">
                          <span className="text-[10px] md:text-xs text-[#c5a059] font-bold tracking-widest uppercase bg-[#c5a059]/5 px-3 py-1 border border-[#c5a059]/10">
                            {project.genre} | {project.runtime} | {project.aspectRatio}
                          </span>
                        </div>
                      </div>

                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light tracking-wide max-w-xl whitespace-pre-line border-l border-neutral-800 pl-6">
                        {project.synopsis}
                      </p>

                      {/* Reference-matched Award List with Orange-Gold Accent */}
                      {project.awards.length > 0 && (
                        <div className="space-y-3 pt-2">
                          {project.awards.map((award, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-3">
                              <svg className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <span className="text-[10px] md:text-[11px] tracking-widest text-[#c5a059] uppercase font-bold leading-tight">
                                {award}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-8">
                        <div className="inline-flex items-center gap-6 text-[9px] tracking-[0.8em] text-neutral-600 font-black uppercase group-hover:text-white transition-all duration-500">
                          ENTER CASE STUDY
                          <div className="h-[1px] w-16 bg-neutral-800 group-hover:bg-[#c5a059] transition-all duration-700 group-hover:w-28"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="py-40 text-center text-neutral-800 text-[10px] uppercase tracking-[0.5em] font-black border border-dashed border-neutral-900">
                  SECTION CURATION IN PROGRESS
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      <Navbar currentView={view} onNavigate={handleNavbarNavigate} />
      {renderContent()}
    </div>
  );
};

export default App;

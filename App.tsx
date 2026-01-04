
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
        console.error("Data Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

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
    if (window.confirm('정말 삭제하시겠습니까?')) {
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

  if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-[10px] tracking-widest text-neutral-500 uppercase">Loading Cinematic Archive...</div>;

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
            <button onClick={handleBack} className="fixed top-28 left-6 md:left-20 z-40 bg-black/50 backdrop-blur-md px-6 py-3 border border-white/10 text-[10px] tracking-widest uppercase hover:text-[#c5a059] transition-colors">Go Back</button>
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
          <div className="pt-32 md:pt-48 pb-32">
            <header className="px-6 md:px-24 mb-20 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-[#c5a059]"></div>
                <span className="text-[10px] tracking-[0.6em] text-[#c5a059] uppercase font-bold">Category</span>
              </div>
              <h2 className="text-4xl md:text-8xl font-serif-cinematic tracking-tight text-white uppercase">{view.replace('_', ' ')}</h2>
            </header>
            <div className="space-y-40 px-6 md:px-24 max-w-[1600px] mx-auto">
              {filteredProjects.map((project, idx) => (
                <div key={project.id} onClick={() => handleProjectSelect(project.id)} className={`group cursor-pointer flex flex-col lg:flex-row items-center gap-12 lg:gap-24 animate-fade-in ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="w-full lg:w-1/2 aspect-[3/4] overflow-hidden bg-neutral-900 relative">
                    <img src={project.coverImage} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-8">
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">{project.year}</div>
                      <h3 className="text-3xl md:text-6xl font-serif-cinematic font-medium text-white leading-tight">
                        {project.titleKr} 
                        {project.titleEn && <span className="block text-xl md:text-3xl text-neutral-600 font-light mt-2 italic">{project.titleEn}</span>}
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <p className="text-neutral-500 text-sm md:text-base leading-relaxed line-clamp-3 whitespace-pre-line font-light tracking-wide">
                        {project.synopsis}
                      </p>

                      {/* 추가된 수상 정보 섹션 */}
                      {project.awards && project.awards.length > 0 && (
                        <div className="pt-4 border-t border-neutral-900 space-y-3">
                          <div className="text-[10px] tracking-[0.4em] text-neutral-700 uppercase font-black mb-2">Selected Honors</div>
                          <div className="space-y-2">
                            {project.awards.slice(0, 3).map((award, aidx) => (
                              <div key={aidx} className="flex items-start gap-3 group/award">
                                <span className="text-[10px] text-[#c5a059] mt-0.5">🏆</span>
                                <span className="text-[11px] md:text-xs text-neutral-400 tracking-wide group-hover/award:text-white transition-colors">{award}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex items-center gap-4 text-[9px] tracking-[0.5em] text-neutral-700 uppercase font-black group-hover:text-[#c5a059] transition-colors">
                      <span>View Project Detail</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Navbar currentView={view} onNavigate={handleNavbarNavigate} />
      <main>{renderContent()}</main>
    </div>
  );
};

export default App;

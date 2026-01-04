
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

/**
 * Added missing default export and completed the truncated switch-case logic in renderContent.
 * This fixes the error: Module '"file:///App"' has no default export.
 */
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
          <div className="pt-32 md:pt-48 pb-32 px-6 md:px-20 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-6 mb-20">
                <div className="h-px w-12 bg-[#c5a059]"></div>
                <h2 className="text-[11px] tracking-[0.6em] font-black uppercase text-neutral-500">
                  {view.replace('_', ' ')} Archive
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="group cursor-pointer space-y-6"
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden border border-white/5 bg-neutral-900 shadow-2xl">
                      <img 
                        src={project.coverImage} 
                        alt={project.titleEn} 
                        className="w-full h-full object-cover grayscale transition-all duration-[2s] group-hover:grayscale-0 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-[#c5a059] font-black tracking-widest">{project.year}</span>
                        <div className="h-px w-4 bg-neutral-800"></div>
                        <span className="text-[8px] text-neutral-500 font-bold tracking-[0.2em] uppercase">{project.role}</span>
                      </div>
                      <h3 className="text-2xl font-serif-cinematic tracking-tight group-hover:text-[#c5a059] transition-colors">{project.titleKr}</h3>
                      <div className="text-[10px] text-neutral-600 uppercase tracking-widest">{project.titleEn}</div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredProjects.length === 0 && (
                <div className="py-20 text-center text-neutral-700 text-[10px] uppercase tracking-[0.5em]">
                  No entries found in this category
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

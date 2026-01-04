
import React, { useState, useEffect, useMemo } from 'react';
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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAuthError(false);
    setPasswordInput('');
  }, [view, selectedProjectId]);

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
    setSelectedProjectId(id);
    setView('PROJECT_DETAIL');
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
            <Home settings={settings} onExplore={() => setView('DIRECTING')} />
            <About settings={settings} projects={projects} onProjectClick={handleProjectSelect} />
            <Contact settings={settings} />
          </div>
        );
      case 'PROJECT_DETAIL':
        return currentProject ? (
          <div className="animate-fade-in pt-20 relative">
            <button 
              onClick={() => setView('HOME')}
              className="fixed top-28 left-10 md:left-20 z-40 flex items-center gap-4 group text-[10px] tracking-[0.4em] uppercase text-neutral-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Close Project
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
                  onClick={() => setView('HOME')}
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
                setView('HOME');
                setIsAuthenticated(false);
            }}
          />
        );
      default:
        return (
          <div className="pt-20">
            <header className="px-10 md:px-20 py-10 md:py-20 animate-fade-in">
              <h2 className="text-5xl md:text-8xl font-serif-cinematic tracking-tighter text-neutral-900 opacity-30 uppercase pointer-events-none select-none">
                {view.replace('_', ' ')}
              </h2>
            </header>

            {filteredProjects.length > 0 ? (
              <div className="space-y-10">
                {filteredProjects.map((project) => (
                  <ProjectDetail key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="h-[40vh] flex items-center justify-center text-neutral-600 font-light tracking-[0.3em] text-[10px] uppercase">
                Works in progress
              </div>
            )}
            
            {filteredProjects.length > 0 && (
              <footer className="h-60 flex flex-col items-center justify-center text-neutral-900 opacity-50">
                <div className="w-px h-16 bg-neutral-800 mb-6"></div>
                <div className="text-[9px] tracking-[0.5em] uppercase">End of Section</div>
              </footer>
            )}
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Navbar currentView={view} onNavigate={setView} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;


import React, { useState, useEffect, useMemo } from 'react';
import { Project, ViewState, SiteSettings } from './types';
import { storageService } from './services/storageService';
import { DEFAULT_SETTINGS } from './constants';
import Navbar from './components/Navbar';
import ProjectDetail from './components/ProjectDetail';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<ViewState>('HOME');
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
    // Reset password error when switching views
    setAuthError(false);
    setPasswordInput('');
  }, [view]);

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

  const filteredProjects = useMemo(() => {
    if (view === 'HOME' || view === 'ADMIN' || view === 'CONTACT') return [];
    return projects.filter(p => p.category === view);
  }, [projects, view]);

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
            <About settings={settings} />
            <Contact settings={settings} />
          </div>
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
                setIsAuthenticated(false); // Log out on exit
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
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1a1a1a; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;

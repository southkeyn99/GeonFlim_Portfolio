
import React, { useState, useRef } from 'react';
import { Project, SiteSettings } from '../types';

interface AdminPanelProps {
  projects: Project[];
  settings: SiteSettings;
  onAdd: (project: Project) => void;
  onUpdate: (project: Project) => void;
  onDelete: (id: string) => void;
  onSaveSettings: (settings: SiteSettings) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, settings, onAdd, onUpdate, onDelete, onSaveSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'WORKS' | 'SETTINGS'>('WORKS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<Project['category'] | 'ALL'>('ALL');
  const [isMoving, setIsMoving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    category: 'DIRECTING',
    year: '',
    titleKr: '',
    titleEn: '',
    genre: '',
    runtime: '',
    role: '',
    synopsis: '',
    awards: [],
    coverImage: '',
    stillCuts: []
  });

  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(settings);
  const [awardInput, setAwardInput] = useState('');

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'stills' | 'profile' | 'homeBg') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      if (target === 'cover' || target === 'profile' || target === 'homeBg') {
        const base64 = await fileToBase64(files[0]);
        if (target === 'cover') setFormData(prev => ({ ...prev, coverImage: base64 }));
        else if (target === 'profile') setSiteSettingsForm(prev => ({ ...prev, profileImage: base64 }));
        else if (target === 'homeBg') setSiteSettingsForm(prev => ({ ...prev, homeBgImage: base64 }));
      } else if (target === 'stills') {
        const promises = Array.from(files).map((f: File) => fileToBase64(f));
        const base64s = await Promise.all(promises);
        setFormData(prev => ({ ...prev, stillCuts: [...(prev.stillCuts || []), ...base64s] }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const addAward = () => {
    if (awardInput.trim()) {
      setFormData(prev => ({ ...prev, awards: [...(prev.awards || []), awardInput.trim()] }));
      setAwardInput('');
    }
  };

  const removeAward = (index: number) => {
    setFormData(prev => ({ ...prev, awards: (prev.awards || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'WORKS') {
      if (editingId) onUpdate({ ...formData, id: editingId } as Project);
      else onAdd({ ...formData, id: Date.now().toString() } as Project);
      handleReset();
    } else {
      onSaveSettings(siteSettingsForm);
      alert('Settings saved successfully.');
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({ 
      category: 'DIRECTING', 
      year: '', 
      titleKr: '', 
      titleEn: '', 
      genre: '', 
      runtime: '', 
      role: '', 
      synopsis: '', 
      awards: [], 
      coverImage: '', 
      stillCuts: [] 
    });
  };

  const handleMove = async (indexInFiltered: number, direction: 'UP' | 'DOWN') => {
    if (isMoving) return;
    
    const filteredProjects = libraryFilter === 'ALL' 
      ? projects 
      : projects.filter(p => p.category === libraryFilter);
      
    const targetIndex = direction === 'UP' ? indexInFiltered - 1 : indexInFiltered + 1;
    if (targetIndex < 0 || targetIndex >= filteredProjects.length) return;

    setIsMoving(true);
    
    // Find the two projects in the actual full list
    const p1 = filteredProjects[indexInFiltered];
    const p2 = filteredProjects[targetIndex];

    // Swap data content between the two IDs
    const p1Update = { ...p2, id: p1.id };
    const p2Update = { ...p1, id: p2.id };

    try {
      // Use sequential awaits to ensure DB consistency
      await (onUpdate as any)(p1Update);
      await (onUpdate as any)(p2Update);
    } catch (err) {
      console.error("Failed to reorder", err);
    } finally {
      setIsMoving(false);
    }
  };

  const currentLibraryList = libraryFilter === 'ALL' 
    ? projects 
    : projects.filter(p => p.category === libraryFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed top-0 left-0 w-full h-40 bg-[#0a0a0a] z-40"></div>
      
      <div className="relative z-50 pt-48 px-6 md:px-10 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-12 mb-16 border-b border-neutral-800">
            <button 
              onClick={() => setActiveTab('WORKS')}
              className={`pb-4 px-2 text-[10px] tracking-[0.4em] uppercase transition-all font-medium ${activeTab === 'WORKS' ? 'text-[#c5a059] border-b-2 border-[#c5a059]' : 'text-neutral-500 hover:text-white'}`}
            >
              Manage Works
            </button>
            <button 
              onClick={() => setActiveTab('SETTINGS')}
              className={`pb-4 px-2 text-[10px] tracking-[0.4em] uppercase transition-all font-medium ${activeTab === 'SETTINGS' ? 'text-[#c5a059] border-b-2 border-[#c5a059]' : 'text-neutral-500 hover:text-white'}`}
            >
              Site Settings
            </button>
          </div>

          {activeTab === 'WORKS' ? (
            <div className="flex flex-col xl:flex-row gap-16 animate-fade-in">
              {/* Work Form */}
              <div className="w-full xl:w-[60%] bg-[#111] p-8 md:p-12 border border-neutral-800 rounded-sm">
                <header className="flex justify-between items-baseline mb-12">
                  <h2 className="text-2xl font-serif-cinematic uppercase tracking-[0.2em]">{editingId ? 'Update Film' : 'New Entry'}</h2>
                  <span className="text-[9px] tracking-widest text-neutral-600 uppercase">Step 1: Details & Media</span>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#c5a059] block">Category</label>
                        <select 
                          value={formData.category} 
                          onChange={e => setFormData({...formData, category: e.target.value as any})} 
                          className="w-full bg-[#1a1a1a] border border-neutral-800 p-3 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        >
                          <option value="DIRECTING">DIRECTING</option>
                          <option value="AI_FILM">AI FILM</option>
                          <option value="CINEMATOGRAPHY">CINEMATOGRAPHY</option>
                          <option value="STAFF">STAFF</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#c5a059] block">Year</label>
                        <input 
                          type="text" 
                          value={formData.year} 
                          onChange={e => setFormData({...formData, year: e.target.value})} 
                          className="w-full bg-[#1a1a1a] border border-neutral-800 p-3 text-sm focus:border-[#c5a059] outline-none" 
                          placeholder="e.g. 2025" required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Title (KR)</label>
                        <input type="text" value={formData.titleKr} onChange={e => setFormData({...formData, titleKr: e.target.value})} className="w-full bg-[#1a1a1a] border border-neutral-800 p-3 text-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Title (EN)</label>
                        <input type="text" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-[#1a1a1a] border border-neutral-800 p-3 text-sm" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} placeholder="Genre" className="w-full bg-[#1a1a1a] border border-neutral-800 p-3 text-sm" />
                      <input type="text" value={formData.runtime} onChange={e => setFormData({...formData, runtime: e.target.value})} placeholder="Runtime" className="w-full bg-[#1a1a1a] border border-neutral-800 p-3 text-sm" />
                      <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Role" className="w-full bg-[#1a1a1a] border border-neutral-800 p-3 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Synopsis</label>
                      <textarea value={formData.synopsis} onChange={e => setFormData({...formData, synopsis: e.target.value})} className="w-full bg-[#1a1a1a] border border-neutral-800 p-4 text-sm h-32 resize-none leading-relaxed" />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-neutral-800 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold block">1. Main Cover Image</label>
                        <p className="text-[9px] text-neutral-500 uppercase">Single high-res image for thumbnails and headers.</p>
                        <div className="relative aspect-[3/4] bg-[#050505] border border-dashed border-neutral-700 flex flex-col items-center justify-center group overflow-hidden">
                          {formData.coverImage ? (
                            <>
                              <img src={formData.coverImage} className="w-full h-full object-cover transition-opacity group-hover:opacity-30" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <label className="cursor-pointer bg-white text-black px-4 py-2 text-[9px] uppercase tracking-widest font-bold">Change Image</label>
                              </div>
                            </>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-2">
                              <span className="text-2xl font-light text-neutral-600">+</span>
                              <span className="text-[9px] tracking-widest uppercase text-neutral-600">Upload Main Still</span>
                            </label>
                          )}
                          <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold block">2. Still Cuts (Multiple)</label>
                        <p className="text-[9px] text-neutral-500 uppercase">Select multiple images for the gallery view.</p>
                        <div className="min-h-[200px] p-4 bg-[#050505] border border-neutral-800">
                          <input type="file" multiple accept="image/*" onChange={e => handleFileUpload(e, 'stills')} className="text-[10px] text-neutral-500 mb-6 block" />
                          <div className="grid grid-cols-3 gap-2">
                            {formData.stillCuts?.map((cut, idx) => (
                              <div key={idx} className="aspect-video bg-neutral-900 border border-neutral-800 overflow-hidden relative group">
                                <img src={cut} className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, stillCuts: prev.stillCuts?.filter((_, i) => i !== idx) }))}
                                  className="absolute inset-0 bg-red-900/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] uppercase font-bold tracking-tighter"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <div className="aspect-video border border-dashed border-neutral-800 flex items-center justify-center text-neutral-800">
                              <span className="text-xl">+</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-neutral-800 space-y-6">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Awards & Screenings</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={awardInput} 
                        onChange={e => setAwardInput(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAward())}
                        placeholder="Add achievement..." 
                        className="flex-1 bg-[#1a1a1a] border border-neutral-800 p-3 text-sm" 
                      />
                      <button type="button" onClick={addAward} className="bg-neutral-800 px-6 text-[10px] uppercase tracking-widest">Add</button>
                    </div>
                    <ul className="space-y-2">
                      {formData.awards?.map((award, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-[#050505] p-3 border border-neutral-900">
                          <span className="text-xs text-neutral-400 font-light">{award}</span>
                          <button type="button" onClick={() => removeAward(idx)} className="text-red-900 hover:text-red-500 text-[10px] uppercase">Remove</button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-12">
                    <button type="submit" className="flex-1 bg-[#c5a059] text-black py-5 font-bold hover:bg-[#d4b47a] transition-all uppercase tracking-[0.4em] text-[10px] shadow-lg shadow-black/40">
                      {editingId ? 'Update Publication' : 'Release to Portfolio'}
                    </button>
                    {editingId && (
                      <button type="button" onClick={handleReset} className="px-8 bg-neutral-900 border border-neutral-800 text-[10px] uppercase tracking-widest hover:bg-neutral-800">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Work Library */}
              <div className="w-full xl:w-[40%]">
                <header className="mb-8 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-serif-cinematic mb-1 uppercase tracking-widest">Library</h2>
                      <p className="text-[9px] tracking-widest text-neutral-600 uppercase">Archive Count: {projects.length}</p>
                    </div>
                  </div>
                  
                  {/* Category Filter for Library */}
                  <div className="flex flex-wrap gap-2">
                    {['ALL', 'DIRECTING', 'AI_FILM', 'CINEMATOGRAPHY', 'STAFF', 'OTHER'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setLibraryFilter(cat as any)}
                        className={`px-3 py-1.5 text-[8px] tracking-[0.2em] uppercase font-bold border transition-all ${libraryFilter === cat ? 'bg-[#c5a059] text-black border-[#c5a059]' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </header>

                <div className={`space-y-4 max-h-[1200px] overflow-y-auto pr-4 custom-scroll transition-opacity ${isMoving ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  {currentLibraryList.map((p, idx) => (
                    <div key={p.id} className="group flex gap-6 items-center bg-[#111] border border-neutral-800 p-5 hover:border-[#c5a059]/50 transition-all">
                      {/* Reorder Controls */}
                      <div className="flex flex-col gap-2 items-center text-neutral-700">
                        <button 
                          type="button"
                          onClick={() => handleMove(idx, 'UP')}
                          disabled={idx === 0 || isMoving}
                          className="hover:text-[#c5a059] disabled:opacity-0 transition-colors p-1"
                          title="Move Up"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <span className="text-[9px] font-black opacity-30 tracking-tighter">{String(idx + 1).padStart(2, '0')}</span>
                        <button 
                          type="button"
                          onClick={() => handleMove(idx, 'DOWN')}
                          disabled={idx === currentLibraryList.length - 1 || isMoving}
                          className="hover:text-[#c5a059] disabled:opacity-0 transition-colors p-1"
                          title="Move Down"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>

                      <div className="w-16 h-20 bg-[#050505] border border-neutral-800 overflow-hidden flex-shrink-0">
                        <img src={p.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={p.titleKr} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[8px] text-[#c5a059] tracking-widest uppercase mb-1 font-bold">{p.category.replace('_', ' ')} &bull; {p.year}</div>
                        <div className="font-serif-cinematic text-sm truncate">{p.titleKr}</div>
                        <div className="text-[9px] text-neutral-600 uppercase tracking-widest truncate">{p.titleEn}</div>
                      </div>
                      <div className="flex flex-col items-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => { setEditingId(p.id); setFormData(p); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-[10px] uppercase text-neutral-400 hover:text-white underline underline-offset-4 font-bold">Edit</button>
                        <button type="button" onClick={() => onDelete(p.id)} className="text-[10px] uppercase text-red-900 hover:text-red-500 font-bold">Delete</button>
                      </div>
                    </div>
                  ))}
                  {currentLibraryList.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-neutral-800 text-neutral-700 text-[10px] uppercase tracking-widest">
                      Empty Archive in this filter
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl animate-fade-in mx-auto">
              <header className="mb-12">
                <h2 className="text-2xl font-serif-cinematic mb-2 uppercase tracking-[0.2em]">Profile & Identity</h2>
                <p className="text-[10px] tracking-[0.4em] text-neutral-600 uppercase">Manage global site appearance</p>
              </header>
              <form onSubmit={handleSubmit} className="space-y-10 bg-[#111] p-8 md:p-12 border border-neutral-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#c5a059] block">Director Name (KR)</label>
                    <input type="text" value={siteSettingsForm.directorNameKr} onChange={e => setSiteSettingsForm({...siteSettingsForm, directorNameKr: e.target.value})} className="w-full bg-[#1a1a1a] border border-neutral-800 p-4 text-sm focus:border-[#c5a059] outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#c5a059] block">Director Name (EN)</label>
                    <input type="text" value={siteSettingsForm.directorNameEn} onChange={e => setSiteSettingsForm({...siteSettingsForm, directorNameEn: e.target.value})} className="w-full bg-[#1a1a1a] border border-neutral-800 p-4 text-sm focus:border-[#c5a059] outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Vision Statement</label>
                  <input type="text" value={siteSettingsForm.vision} onChange={e => setSiteSettingsForm({...siteSettingsForm, vision: e.target.value})} className="w-full bg-[#1a1a1a] border border-neutral-800 p-4 text-sm font-serif-cinematic italic text-lg" placeholder="A cinematic vision..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Biography / Intro</label>
                  <textarea value={siteSettingsForm.bio} onChange={e => setSiteSettingsForm({...siteSettingsForm, bio: e.target.value})} className="w-full bg-[#1a1a1a] border border-neutral-800 p-4 text-sm h-48 resize-none leading-relaxed" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Portrait Image</label>
                    <div className="aspect-[4/5] bg-black border border-neutral-800 relative group overflow-hidden">
                      <img src={siteSettingsForm.profileImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <input type="file" onChange={e => handleFileUpload(e, 'profile')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="absolute bottom-4 left-4 text-[9px] uppercase bg-black/60 p-2 tracking-widest">Change Portrait</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Hero Background</label>
                    <div className="aspect-video bg-black border border-neutral-800 relative group overflow-hidden">
                      <img src={siteSettingsForm.homeBgImage} className="w-full h-full object-cover opacity-30 group-hover:opacity-100 transition-opacity" />
                      <input type="file" onChange={e => handleFileUpload(e, 'homeBg')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="absolute bottom-4 left-4 text-[9px] uppercase bg-black/60 p-2 tracking-widest">Change Hero View</div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#c5a059] text-black py-5 font-bold hover:bg-[#d4b47a] transition-all uppercase tracking-[0.4em] text-[10px] mt-10">
                  Save Identity Settings
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <button onClick={onClose} className="fixed bottom-10 right-10 bg-white text-black px-12 py-5 font-serif-cinematic tracking-[0.3em] uppercase text-[10px] font-bold hover:bg-[#c5a059] hover:text-white transition-all z-50 shadow-2xl">
        Exit Manager
      </button>
    </div>
  );
};

export default AdminPanel;


import React, { useState, useEffect } from 'react';
import { Project, SiteSettings } from '../types';
import { storageService } from '../services/storageService';

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
  const [activeTab, setActiveTab] = useState<'WORKS' | 'SETTINGS' | 'DATABASE'>('WORKS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<Project['category'] | 'ALL'>('ALL');
  
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'stills') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (target === 'cover') {
      const base64 = await fileToBase64(files[0]);
      setFormData(prev => ({ ...prev, coverImage: base64 }));
    } else if (target === 'stills') {
      // Fix: Cast elements to File because Array.from(FileList) may infer elements as unknown
      const promises = Array.from(files).map((f) => fileToBase64(f as File));
      const base64s = await Promise.all(promises);
      setFormData(prev => ({ ...prev, stillCuts: [...(prev.stillCuts || []), ...base64s] }));
    }
  };

  const addAward = () => {
    if (awardInput.trim()) {
      setFormData(prev => ({ ...prev, awards: [...(prev.awards || []), awardInput.trim()] }));
      setAwardInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate({ ...formData, id: editingId } as Project);
    } else {
      onAdd({ ...formData, id: Date.now().toString() } as Project);
    }
    handleReset();
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({ 
      category: 'DIRECTING', year: '', titleKr: '', titleEn: '', genre: '', 
      runtime: '', role: '', synopsis: '', awards: [], coverImage: '', stillCuts: [] 
    });
  };

  const moveProject = async (index: number, direction: 'UP' | 'DOWN') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    await storageService.saveProjects(newProjects);
    // 부모 컴포넌트 강제 새로고침을 위해 임시로 onUpdate 호출(id는 동일하게)
    onUpdate(newProjects[0]); 
    // 실제로는 App.tsx에서 전체 리스트를 다시 불러오도록 설계됨
  };

  const filteredList = libraryFilter === 'ALL' ? projects : projects.filter(p => p.category === libraryFilter);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6 md:px-12 pb-20">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-16">
        
        {/* Left: Form (New Entry) */}
        <div className="xl:col-span-7 space-y-10">
          <header className="flex justify-between items-baseline mb-4">
            <h2 className="text-3xl font-serif-cinematic tracking-[0.2em] uppercase">{editingId ? 'Edit Entry' : 'New Entry'}</h2>
            <span className="text-[10px] tracking-widest text-neutral-600 uppercase">Step 1: Details & Media</span>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 bg-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#c5a059] block">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-full bg-[#111] border border-neutral-800 p-3 text-sm focus:border-[#c5a059] outline-none"
                >
                  <option value="DIRECTING">DIRECTING</option>
                  <option value="AI_FILM">AI FILM</option>
                  <option value="CINEMATOGRAPHY">CINEMATOGRAPHY</option>
                  <option value="STAFF">STAFF</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Year</label>
                <input 
                  type="text" 
                  value={formData.year} 
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  placeholder="e.g. 2025"
                  className="w-full bg-[#111] border border-neutral-800 p-3 text-sm focus:border-[#c5a059] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Title (KR)</label>
                <input type="text" value={formData.titleKr} onChange={e => setFormData({...formData, titleKr: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-3 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Title (EN) - Optional</label>
                <input type="text" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-3 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} placeholder="Genre" className="bg-[#111] border border-neutral-800 p-3 text-xs" />
              <input type="text" value={formData.runtime} onChange={e => setFormData({...formData, runtime: e.target.value})} placeholder="Runtime" className="bg-[#111] border border-neutral-800 p-3 text-xs" />
              <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Role" className="bg-[#111] border border-neutral-800 p-3 text-xs" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Synopsis (Supports line breaks)</label>
              <textarea 
                value={formData.synopsis} 
                onChange={e => setFormData({...formData, synopsis: e.target.value})}
                placeholder="Enter film description... Use Enter for line breaks."
                className="w-full bg-[#111] border border-neutral-800 p-4 text-sm h-40 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-bold block">1. Main Cover Image</label>
                <p className="text-[9px] text-neutral-500 uppercase">Single high-res image for thumbnails and headers.</p>
                <div className="aspect-[3/4] bg-[#111] border border-dashed border-neutral-700 flex flex-col items-center justify-center relative group cursor-pointer">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl text-neutral-700 mb-2">+</div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-600">Upload Main Still</div>
                    </div>
                  )}
                  <input type="file" onChange={e => handleFileUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#c5a059] font-bold block">2. Still Cuts (Multiple)</label>
                <p className="text-[9px] text-neutral-500 uppercase">Select multiple images for the gallery view.</p>
                <div className="min-h-[250px] bg-[#111] border border-neutral-800 p-4 relative">
                   <div className="flex gap-2 mb-4">
                     <input type="file" multiple onChange={e => handleFileUpload(e, 'stills')} className="text-[10px] text-neutral-500" />
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     {formData.stillCuts?.map((cut, idx) => (
                       <div key={idx} className="aspect-video bg-black relative group">
                         <img src={cut} className="w-full h-full object-cover" />
                         <button onClick={() => setFormData(p => ({...p, stillCuts: p.stillCuts?.filter((_, i) => i !== idx)}))} className="absolute inset-0 bg-red-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] uppercase font-bold">Remove</button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Awards & Screenings</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={awardInput} 
                  onChange={e => setAwardInput(e.target.value)} 
                  placeholder="Add achievement..."
                  className="flex-1 bg-[#111] border border-neutral-800 p-3 text-sm focus:border-[#c5a059] outline-none"
                />
                <button type="button" onClick={addAward} className="bg-neutral-800 px-6 text-[10px] uppercase font-bold tracking-widest">Add</button>
              </div>
              <div className="space-y-2">
                {formData.awards?.map((award, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#111] p-3 border border-neutral-900">
                    <span className="text-xs text-neutral-400">{award}</span>
                    <button onClick={() => setFormData(p => ({...p, awards: p.awards?.filter((_, i) => i !== idx)}))} className="text-red-900 text-[9px] uppercase font-bold">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-[#c5a059] text-black py-5 font-bold uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:bg-[#d4b47a] transition-all">
              {editingId ? 'Update Publication' : 'Release to Portfolio'}
            </button>
          </form>
        </div>

        {/* Right: Library List */}
        <div className="xl:col-span-5 space-y-8">
          <header>
            <h2 className="text-2xl font-serif-cinematic tracking-widest uppercase mb-2">Library</h2>
            <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">Archive Count: {projects.length}</p>
          </header>

          <div className="flex flex-wrap gap-2 mb-8">
            {['ALL', 'DIRECTING', 'AI_FILM', 'CINEMATOGRAPHY', 'STAFF', 'OTHER'].map(cat => (
              <button 
                key={cat}
                onClick={() => setLibraryFilter(cat as any)}
                className={`px-3 py-1.5 text-[8px] font-bold uppercase border tracking-widest transition-all ${libraryFilter === cat ? 'bg-[#c5a059] text-black border-[#c5a059]' : 'border-neutral-800 text-neutral-500'}`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-4 custom-scroll">
            {filteredList.map((p, idx) => (
              <div key={p.id} className="group bg-[#0c0c0c] border border-neutral-900 p-4 flex gap-4 items-center hover:border-neutral-700 transition-all">
                <div className="flex flex-col gap-2 text-neutral-800">
                  <button onClick={() => moveProject(idx, 'UP')} disabled={idx === 0} className="hover:text-[#c5a059] disabled:opacity-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth={2} /></svg>
                  </button>
                  <span className="text-[10px] font-black text-center">{String(idx + 1).padStart(2, '0')}</span>
                  <button onClick={() => moveProject(idx, 'DOWN')} disabled={idx === filteredList.length - 1} className="hover:text-[#c5a059] disabled:opacity-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={2} /></svg>
                  </button>
                </div>

                <div className="w-16 h-20 bg-neutral-900 overflow-hidden flex-shrink-0">
                  <img src={p.coverImage} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[8px] text-[#c5a059] tracking-widest uppercase mb-1">{p.category} • {p.year}</div>
                  <div className="text-sm font-serif-cinematic truncate">{p.titleKr}</div>
                  <div className="text-[10px] text-neutral-600 truncate uppercase tracking-widest">{p.titleEn}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => { setEditingId(p.id); setFormData(p); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-[10px] text-neutral-400 hover:text-white font-bold uppercase tracking-widest underline underline-offset-4">Edit</button>
                  <button onClick={() => onDelete(p.id)} className="text-[10px] text-red-900 hover:text-red-600 font-bold uppercase tracking-widest">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onClose} className="fixed bottom-10 right-10 bg-white text-black px-12 py-5 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-[#c5a059] transition-all z-[60]">
        Exit Archive Manager
      </button>
    </div>
  );
};

export default AdminPanel;

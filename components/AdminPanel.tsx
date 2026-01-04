
import React, { useState, useRef } from 'react';
import { Project, SiteSettings } from '../types';
import { storageService } from '../services/storageService.ts';

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
  const [activeTab, setActiveTab] = useState<'WORKS' | 'SETTINGS' | 'EXPORT'>('WORKS');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const coverFileRef = useRef<HTMLInputElement>(null);
  const stillFileRef = useRef<HTMLInputElement>(null);
  const profileFileRef = useRef<HTMLInputElement>(null);
  
  // Project Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    category: 'DIRECTING',
    year: '',
    titleKr: '',
    titleEn: '',
    genre: '',
    runtime: '',
    aspectRatio: '',
    role: '',
    synopsis: '',
    awards: [],
    coverImage: '',
    stillCuts: []
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);

  // Helper: File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'still' | 'profile') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      if (type === 'cover') setFormData(prev => ({ ...prev, coverImage: base64 }));
      else if (type === 'still') setFormData(prev => ({ ...prev, stillCuts: [...(prev.stillCuts || []), base64] }));
      else if (type === 'profile') setSettingsForm(prev => ({ ...prev, profileImage: base64 }));
    } catch (err) { alert('이미지 변환에 실패했습니다.'); }
  };

  const copyToClipboard = (text: string, msg = '코드가 클립보드에 복사되었습니다.') => {
    navigator.clipboard.writeText(text);
    alert(msg);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) onUpdate({ ...formData, id: editingId } as Project);
    else onAdd({ ...formData, id: Date.now().toString() } as Project);
    handleProjectReset();
  };

  const handleProjectReset = () => {
    setEditingId(null);
    setFormData({ category: 'DIRECTING', year: '', titleKr: '', titleEn: '', genre: '', runtime: '', aspectRatio: '', role: '', synopsis: '', awards: [], coverImage: '', stillCuts: [] });
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    alert('프로필 설정이 저장되었습니다.');
  };

  // --- 코드로 변환하는 핵심 로직 ---
  const generateConstantsCode = () => {
    const projectsCode = JSON.stringify(projects, null, 2);
    const settingsCode = JSON.stringify(settings, null, 2);
    
    return `import { Project, SiteSettings } from './types.ts';

export const INITIAL_PROJECTS: Project[] = ${projectsCode};

export const DEFAULT_SETTINGS: SiteSettings = ${settingsCode};
`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6 md:px-12 pb-20">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 md:gap-8 mb-16 border-b border-neutral-900 pb-4">
          {['WORKS', 'SETTINGS', 'EXPORT'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-[10px] md:text-sm uppercase tracking-[0.3em] font-bold transition-all ${activeTab === tab ? 'text-[#c5a059]' : 'text-neutral-600 hover:text-white'}`}
            >
              {tab === 'EXPORT' ? 'Database Export' : `${tab} Management`}
            </button>
          ))}
        </div>

        {activeTab === 'WORKS' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
            <div className="xl:col-span-7 space-y-10">
              <header className="flex justify-between items-baseline mb-4">
                <h2 className="text-3xl font-serif-cinematic tracking-[0.2em] uppercase">{editingId ? 'Edit Project' : 'New Project'}</h2>
                <span className="text-[10px] tracking-widest text-neutral-600 uppercase">이미지 업로드 및 상세 정보</span>
              </header>
              <form onSubmit={handleProjectSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#c5a059] block font-black">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-[#111] border border-neutral-800 p-3 text-sm focus:border-[#c5a059] outline-none">
                      <option value="DIRECTING">DIRECTING</option>
                      <option value="AI_FILM">AI FILM</option>
                      <option value="CINEMATOGRAPHY">CINEMATOGRAPHY</option>
                      <option value="STAFF">STAFF</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Year</label>
                    <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="2025" className="w-full bg-[#111] border border-neutral-800 p-3 text-sm focus:border-[#c5a059] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Title (KR)</label>
                    <input type="text" value={formData.titleKr} onChange={e => setFormData({...formData, titleKr: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-3 text-sm outline-none focus:border-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Title (EN)</label>
                    <input type="text" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-3 text-sm outline-none focus:border-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} placeholder="Genre" className="bg-[#111] border border-neutral-800 p-3 text-xs outline-none" />
                  <input type="text" value={formData.runtime} onChange={e => setFormData({...formData, runtime: e.target.value})} placeholder="Runtime" className="bg-[#111] border border-neutral-800 p-3 text-xs outline-none" />
                  <input type="text" value={formData.aspectRatio} onChange={e => setFormData({...formData, aspectRatio: e.target.value})} placeholder="Aspect (e.g. 2.35:1)" className="bg-[#111] border border-neutral-800 p-3 text-xs outline-none" />
                  <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Role" className="bg-[#111] border border-neutral-800 p-3 text-xs outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Synopsis</label>
                  <textarea value={formData.synopsis} onChange={e => setFormData({...formData, synopsis: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-4 text-sm h-32 resize-none outline-none focus:border-[#c5a059]" />
                </div>

                <div className="space-y-10 p-6 bg-[#0a0a0a] border border-neutral-900 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-[#c5a059] font-black">Main Cover Photo</label>
                      <button type="button" onClick={() => coverFileRef.current?.click()} className="text-[10px] bg-white text-black px-4 py-2 font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-colors">내 컴퓨터에서 찾기</button>
                      <input type="file" ref={coverFileRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'cover')} />
                    </div>
                    {formData.coverImage && <div className="w-40 aspect-[3/4] border border-neutral-800 overflow-hidden"><img src={formData.coverImage} className="w-full h-full object-cover" /></div>}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-[#c5a059] font-black">Still Cuts Gallery</label>
                      <button type="button" onClick={() => stillFileRef.current?.click()} className="text-[10px] bg-neutral-800 text-white px-4 py-2 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">사진 추가 업로드</button>
                      <input type="file" ref={stillFileRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'still')} />
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {formData.stillCuts?.map((cut, idx) => (
                        <div key={idx} className="aspect-video bg-[#111] relative group border border-neutral-900 overflow-hidden">
                          <img src={cut} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setFormData(p => ({...p, stillCuts: p.stillCuts?.filter((_, i) => i !== idx)}))} className="absolute inset-0 bg-red-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] uppercase font-bold">Delete</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-[#c5a059] text-black py-5 font-bold uppercase tracking-[0.4em] text-[11px] hover:bg-white transition-all">{editingId ? 'Update Archive' : 'Publish to Archive'}</button>
                  {editingId && <button type="button" onClick={handleProjectReset} className="px-8 bg-neutral-900 text-white uppercase text-[10px] tracking-widest font-bold">Cancel</button>}
                </div>
              </form>
            </div>
            <div className="xl:col-span-5 space-y-8 border-l border-neutral-900 pl-8">
              <header><h2 className="text-2xl font-serif-cinematic tracking-widest uppercase mb-2">Library</h2><p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">Archive Count: {projects.length}</p></header>
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scroll">
                {projects.map((p) => (
                  <div key={p.id} className="group bg-[#0c0c0c] border border-neutral-900 p-4 flex gap-4 items-center hover:border-neutral-700 transition-all">
                    <div className="w-12 h-16 bg-neutral-900 overflow-hidden flex-shrink-0"><img src={p.coverImage} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" /></div>
                    <div className="flex-1 min-w-0"><div className="text-[8px] text-[#c5a059] tracking-widest uppercase mb-1">{p.category} • {p.year}</div><div className="text-sm font-serif-cinematic truncate">{p.titleKr}</div></div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => { setEditingId(p.id); setFormData(p); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-[10px] text-neutral-400 hover:text-white font-bold uppercase underline decoration-neutral-800">Edit</button>
                      <button onClick={() => onDelete(p.id)} className="text-[10px] text-red-900 hover:text-red-600 font-bold uppercase">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="max-w-4xl mx-auto space-y-16">
            <header className="mb-8"><h2 className="text-3xl font-serif-cinematic tracking-[0.2em] uppercase">Director Profile Settings</h2></header>
            <form onSubmit={handleSettingsSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-[#c5a059] font-black">Profile Portrait</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 aspect-[3/4] bg-neutral-900 border border-neutral-800 overflow-hidden"><img src={settingsForm.profileImage} className="w-full h-full object-cover grayscale" /></div>
                    <button type="button" onClick={() => profileFileRef.current?.click()} className="text-[10px] bg-white text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-colors">내 사진 올리기</button>
                    <input type="file" ref={profileFileRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'profile')} />
                  </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-neutral-500">Director Name (KR)</label><input type="text" value={settingsForm.directorNameKr} onChange={e => setSettingsForm({...settingsForm, directorNameKr: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-3 text-sm outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-neutral-500">Director Name (EN)</label><input type="text" value={settingsForm.directorNameEn} onChange={e => setSettingsForm({...settingsForm, directorNameEn: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-3 text-sm outline-none" /></div>
                </div>
              </div>
              <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest text-neutral-500 block">Professional Bio</label><textarea value={settingsForm.bio} onChange={e => setSettingsForm({...settingsForm, bio: e.target.value})} className="w-full bg-[#111] border border-neutral-800 p-6 text-sm h-48 resize-none leading-relaxed outline-none focus:border-[#c5a059]" /></div>
              <button type="submit" className="w-full bg-white text-black py-6 font-bold uppercase tracking-[0.4em] text-[11px] hover:bg-[#c5a059] transition-all">Save Global Profile</button>
            </form>
          </div>
        )}

        {activeTab === 'EXPORT' && (
          <div className="max-w-5xl mx-auto space-y-12">
            <header className="space-y-4">
              <h2 className="text-4xl font-serif-cinematic tracking-widest uppercase">Database Export</h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                이 브라우저에서 수정된 모든 데이터를 영구적으로 배포 코드에 반영하려면 아래의 코드를 복사하세요.<br />
                복사한 내용을 <code className="text-[#c5a059] font-bold">constants.ts</code> 파일의 전체 내용과 교체하고 배포하면 모든 기기에서 반영됩니다.
              </p>
            </header>

            <div className="relative group">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => copyToClipboard(generateConstantsCode(), '전체 데이터 코드가 복사되었습니다. constants.ts에 붙여넣으세요!')}
                  className="bg-[#c5a059] text-black px-6 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                >
                  Copy Full Code
                </button>
              </div>
              <pre className="w-full bg-[#0a0a0a] border border-neutral-800 p-8 pt-16 text-[11px] font-mono text-neutral-400 overflow-x-auto max-h-[600px] custom-scroll">
                {generateConstantsCode()}
              </pre>
            </div>

            <div className="pt-20 border-t border-neutral-900 text-center">
              <h3 className="text-xl font-serif-cinematic mb-6 text-red-900 uppercase tracking-widest">Emergency Sync</h3>
              <p className="text-xs text-neutral-600 mb-8 uppercase tracking-widest">다른 기기에서 수정된 최신 배포 데이터를 강제로 불러오고 싶다면 초기화를 누르세요.</p>
              <button 
                onClick={() => { if(window.confirm('브라우저의 모든 수정사항을 삭제하고 코드 기본값으로 되돌리시겠습니까?')) storageService.resetToDefaults(); }}
                className="border border-red-900/30 text-red-900 px-8 py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-900 hover:text-white transition-all"
              >
                Reset Storage to Code Defaults
              </button>
            </div>
          </div>
        )}
      </div>

      <button onClick={onClose} className="fixed bottom-10 right-10 bg-[#c5a059] text-black px-12 py-5 font-bold uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-white transition-all z-[60]">Exit Archive Manager</button>
    </div>
  );
};

export default AdminPanel;

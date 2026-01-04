
import React, { useMemo } from 'react';
import { SiteSettings, Project } from '../types.ts';

interface AboutProps {
  settings: SiteSettings;
  projects: Project[];
  onProjectClick: (id: string) => void;
}

const About: React.FC<AboutProps> = ({ settings, projects, onProjectClick }) => {
  // Automatically derive filmography list from projects database
  const dynamicFilmography = useMemo(() => {
    const categories = [
      { label: 'DIRECTING', dbKey: 'DIRECTING' },
      { label: 'AI FILM', dbKey: 'AI_FILM' },
      { label: 'AD & PRODUCING', dbKey: 'STAFF' },
      { label: 'CINEMATOGRAPHY', dbKey: 'CINEMATOGRAPHY' },
      { label: 'OTHER WORKS', dbKey: 'OTHER' }
    ];

    return categories.map(cat => {
      const filtered = projects
        .filter(p => p.category === cat.dbKey)
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));

      return {
        label: cat.label,
        credits: filtered.map(p => ({
          id: p.id,
          year: p.year,
          title: p.titleKr,
          role: p.role,
          note: p.awards.length > 0 ? p.awards[0] : (p.synopsis.slice(0, 60) + (p.synopsis.length > 60 ? '...' : ''))
        }))
      };
    }).filter(cat => cat.credits.length > 0);
  }, [projects]);

  // Automatically derive Key Awards from all projects
  const dynamicAwards = useMemo(() => {
    const allAwards: string[] = [];
    projects.forEach(p => {
      p.awards.forEach(award => {
        if (!allAwards.includes(award)) {
          allAwards.push(`${award} (${p.titleKr})`);
        }
      });
    });
    return allAwards;
  }, [projects]);

  return (
    <div className="bg-[#050505] text-white overflow-hidden">
      {/* Introduction Section: Layout matched to requested design */}
      <section id="director-intro" className="min-h-screen flex items-center justify-center px-6 md:px-24 py-32 md:py-48">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left: Compact Portrait (Smaller as requested) */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="relative w-full max-w-[340px] mx-auto lg:mx-0">
              <div className="relative overflow-hidden aspect-[3/4] bg-neutral-900 shadow-2xl grayscale brightness-90">
                <img 
                  src={settings.profileImage} 
                  alt={settings.directorNameEn} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-8">
                <div className="w-2/3 h-px bg-white/10 mb-4"></div>
                <div className="text-[8px] tracking-[0.6em] text-neutral-700 uppercase font-black">Archive Identity Port No. 1228</div>
              </div>
            </div>
          </div>

          {/* Right: Identity, Bio & Awards */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-start space-y-12">
            
            {/* Header: Name next to Photo */}
            <header className="space-y-4">
              <div className="space-y-0">
                <h1 className="text-6xl md:text-8xl font-serif-cinematic leading-[0.85] font-bold tracking-tighter uppercase mb-2">
                  NAMGUNG<br />GEON
                </h1>
                <div className="text-xl md:text-2xl text-neutral-500 font-light tracking-tight mt-4">
                  {settings.directorNameKr}
                </div>
              </div>
              
              <div className="pt-2">
                <span className="text-[#c5a059] text-[10px] md:text-xs tracking-[0.5em] font-black uppercase">
                  Film Director & Cinematographer
                </span>
              </div>
            </header>

            {/* Bio: Briefly organized into paragraphs */}
            <div className="max-w-xl space-y-8">
              <p className="text-sm md:text-base text-neutral-400 leading-[1.8] font-light tracking-wide whitespace-pre-line">
                {settings.bio}
              </p>
            </div>

            {/* Key Awards: List with thin horizontal lines and dots */}
            <div className="pt-10 w-full max-w-2xl">
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-[11px] tracking-[0.5em] text-white uppercase font-black shrink-0">KEY AWARDS</h3>
                <div className="w-full h-px bg-neutral-900"></div>
              </div>

              {dynamicAwards.length > 0 ? (
                <ul className="space-y-6">
                  {dynamicAwards.map((award, idx) => (
                    <li key={idx} className="flex items-start gap-5 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c5a059]/40 group-hover:bg-[#c5a059] transition-colors"></div>
                      <span className="text-xs md:text-sm text-neutral-500 group-hover:text-white transition-colors duration-500 font-light tracking-wide">
                        {award}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[10px] text-neutral-700 uppercase tracking-widest italic">Awaiting cinematic milestones</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filmography: Categorized Archives */}
      <section className="px-6 md:px-24 py-40 border-t border-neutral-900/50 bg-[#030303]">
        <div className="max-w-5xl mx-auto space-y-32 md:space-y-48">
          {dynamicFilmography.length > 0 ? (
            dynamicFilmography.map((cat) => (
              <div key={cat.label} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-4 sticky top-32">
                    <div className="w-[2px] h-8 bg-[#c5a059]"></div>
                    <h3 className="text-[11px] tracking-[0.6em] text-neutral-500 uppercase font-black">
                      {cat.label}
                    </h3>
                  </div>
                </div>
                <div className="md:col-span-9 space-y-16">
                  {cat.credits.map((item, cidx) => (
                    <div 
                      key={cidx} 
                      className="group border-b border-neutral-900 pb-12 last:border-0 transition-all cursor-pointer relative"
                      onClick={() => onProjectClick(item.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-3">
                          <div className="text-[10px] text-[#c5a059] font-bold tracking-[0.4em]">{item.year}</div>
                          <h4 className="text-3xl md:text-4xl font-serif-cinematic font-medium tracking-tighter group-hover:text-[#c5a059] transition-all duration-700">
                            {item.title}
                          </h4>
                        </div>
                        <div className="md:pt-4">
                          <div className="text-[9px] uppercase tracking-[0.5em] text-neutral-600 font-black px-4 py-2 border border-neutral-900 group-hover:border-[#c5a059] group-hover:text-[#c5a059] transition-all duration-500 rounded-full">
                            {item.role}
                          </div>
                        </div>
                      </div>
                      {item.note && (
                        <p className="mt-8 text-xs text-neutral-500 font-light leading-relaxed max-w-2xl opacity-60 group-hover:opacity-100 transition-opacity tracking-wide">
                          {item.note}
                        </p>
                      )}
                      
                      <div className="absolute bottom-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg className="w-4 h-4 text-[#c5a059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                         </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-neutral-700 text-[10px] uppercase tracking-[0.5em]">
              Archive is being curated for selection
            </div>
          )}
        </div>
      </section>

      {/* Footer Meta */}
      <footer className="px-6 md:px-24 py-24 border-t border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] tracking-[0.5em] text-neutral-700 uppercase font-medium">
          <div className="opacity-50 hover:opacity-100 transition-opacity">© 2025 {settings.directorNameEn} &bull; Official</div>
          <div className="flex gap-12">
            <a href="#" className="hover:text-[#c5a059] cursor-pointer transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#c5a059] cursor-pointer transition-colors">Vimeo</a>
            <a href="#" className="hover:text-[#c5a059] cursor-pointer transition-colors">IMDb</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;

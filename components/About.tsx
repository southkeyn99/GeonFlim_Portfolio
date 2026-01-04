
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
      { label: 'CINEMATOGRAPHY', dbKey: 'CINEMATOGRAPHY' },
      { label: 'STAFF', dbKey: 'STAFF' },
      { label: 'OTHER', dbKey: 'OTHER' }
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
          awards: p.awards
        }))
      };
    }).filter(cat => cat.credits.length > 0);
  }, [projects]);

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
      {/* Introduction Section */}
      <section id="director-intro" className="min-h-screen flex items-center justify-center px-6 md:px-24 py-32 md:py-48">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left: Compact Portrait */}
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

            <div className="max-w-xl space-y-8">
              <p className="text-sm md:text-base text-neutral-400 leading-[1.8] font-light tracking-wide whitespace-pre-line">
                {settings.bio}
              </p>
            </div>

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

      {/* Filmography: Refined with smaller text and narrower spacing */}
      <section className="px-6 md:px-24 py-32 md:py-48 border-t border-neutral-900/50 bg-[#030303]">
        <div className="max-w-6xl mx-auto space-y-32">
          {dynamicFilmography.length > 0 ? (
            dynamicFilmography.map((cat) => (
              <div key={cat.label} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-8 h-px bg-neutral-800"></div>
                    <h3 className="text-[10px] tracking-[0.6em] text-neutral-600 uppercase font-black">{cat.label}</h3>
                </div>
                
                <div className="space-y-0">
                    {cat.credits.map((item, cidx) => (
                    <div 
                        key={cidx} 
                        className="group py-4 border-b border-neutral-900/40 last:border-0 grid grid-cols-1 md:grid-cols-12 items-center gap-4 transition-all cursor-pointer"
                        onClick={() => onProjectClick(item.id)}
                    >
                        {/* Year & Category Accent (Left) */}
                        <div className="md:col-span-3 flex items-center gap-4">
                            <div className="w-[1.5px] h-3 bg-[#c5a059] opacity-40 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-[10px] text-[#c5a059] font-black tracking-widest">{item.year}</span>
                        </div>

                        {/* Title & Gold Awards (Center) */}
                        <div className="md:col-span-6 flex flex-col justify-center">
                            <h4 className="text-lg md:text-xl font-serif-cinematic tracking-tight group-hover:text-white transition-all">
                                {item.title}
                            </h4>
                            {item.awards && item.awards.length > 0 && (
                                <div className="text-[9px] md:text-[10px] text-[#c5a059] tracking-widest font-bold mt-1 opacity-90 uppercase">
                                    {item.awards[0]}
                                </div>
                            )}
                        </div>

                        {/* Role Badge (Right) */}
                        <div className="md:col-span-3 flex justify-end">
                            <div className="text-[8px] uppercase tracking-[0.2em] text-neutral-600 font-black px-4 py-1.5 border border-neutral-800 rounded-full group-hover:border-[#c5a059]/30 group-hover:text-[#c5a059] transition-all">
                                {item.role}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-neutral-700 text-[10px] uppercase tracking-[0.5em]">
              Archive is being curated
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

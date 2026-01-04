
import React from 'react';
import { SiteSettings } from '../types';

interface AboutProps {
  settings: SiteSettings;
}

const About: React.FC<AboutProps> = ({ settings }) => {
  const filmography = [
    {
      label: 'DIRECTING',
      credits: [
        { year: '2025', title: '아부지', role: '각본/감독', note: '24년 명필름 단편스쿨 수료작 / 제4회 경기도예술영화제 대상' },
        { year: '2025', title: '마지막 명령', role: '각본/감독', note: 'AI 단편 / 제5회 금천패션영화제 경쟁작' },
        { year: '2024', title: '도애의 시간', role: '각본/감독', note: '11회 목포국도1호선독립영화제 도움닫기 작품상' },
        { year: '2024', title: '친절한 바바야가', role: '각본/감독', note: 'AI 단편영화' },
        { year: '2023', title: '겨울바람', role: '각본/감독' },
        { year: '2023', title: '그린비치', role: '각본/감독', note: '장편 프로젝트' },
        { year: '2022', title: 'EAST / 주연배우계약서', role: '각본/감독' },
        { year: '2019', title: '나는 프랑스로 갈 거야', role: '각본/감독' },
      ]
    },
    {
      label: 'AD & PRODUCING',
      credits: [
        { year: '2025', title: '방문', role: '조감독', note: '2025 부산국제영화제 Community Biff' },
        { year: '2024', title: '내남자의 브래지어', role: '조감독', note: '2024 부산국제영화제 Community Biff' },
        { year: '2023', title: '죽고 싶다 죽이고 싶다', role: '프로듀서', note: '2024 판타지아국제영화제' },
        { year: '2023', title: '인공세상의 새로운 아침', role: '프로듀서', note: '제28회 부산국제영화제 단편경쟁' },
        { year: '2019', title: '그녀의 문제와 불꽃', role: '조감독', note: '제45회 서울독립영화제 단편경쟁' },
      ]
    },
    {
      label: 'CINEMATOGRAPHY',
      credits: [
        { year: '2023', title: '사라짐을 기억하는 사라지는 ㅁ', role: '촬영감독', note: '무용필름' },
        { year: '2022', title: '복채', role: '촬영감독', note: '부천국제판타스틱영화제 경쟁 / 피렌체한국영화제' },
        { year: '2022', title: '노이즈캔슬링', role: '촬영감독', note: '완주 아동권리영화제 우수상' },
        { year: '2022', title: 'MAN IN DRESS', role: '촬영감독', note: '패션필름' },
      ]
    }
  ];

  return (
    <div className="bg-[#050505] text-white">
      {/* Introduction Section: Modern Asymmetric Layout */}
      <section id="director-intro" className="min-h-screen flex items-center px-6 md:px-24 py-32">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Portrait: Clean Offset */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] overflow-hidden bg-neutral-900 border border-neutral-800">
              <img 
                src={settings.profileImage} 
                alt={settings.directorNameEn} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-[#c5a059] opacity-30"></div>
          </div>

          {/* Text: Modern Typography */}
          <div className="lg:col-span-7 space-y-12">
            <header className="space-y-4">
              <h2 className="text-[10px] tracking-[0.8em] text-[#c5a059] uppercase font-medium">Visionary Artist</h2>
              <h1 className="text-5xl md:text-7xl font-serif-cinematic leading-[1.1] font-bold">
                {settings.directorNameEn}<br/>
                <span className="text-3xl md:text-4xl text-neutral-500 font-light italic">{settings.directorNameKr}</span>
              </h1>
            </header>

            <div className="space-y-8 max-w-xl">
              <p className="text-xl md:text-2xl font-light text-neutral-300 leading-relaxed italic border-l-2 border-[#c5a059] pl-8">
                "{settings.vision}"
              </p>
              <div className="text-sm md:text-base text-neutral-500 leading-relaxed font-light whitespace-pre-line tracking-wide">
                {settings.bio}
              </div>
            </div>

            <div className="pt-12 grid grid-cols-2 gap-12 border-t border-neutral-900">
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-700">Location</span>
                <p className="text-xs tracking-widest uppercase">{settings.location}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-700">Inquiry</span>
                <p className="text-xs tracking-widest lowercase hover:text-[#c5a059] transition-colors cursor-pointer">{settings.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filmography: Editorial Grid Layout */}
      <section className="px-6 md:px-24 py-40">
        <div className="max-w-7xl mx-auto space-y-60">
          {filmography.map((cat, idx) => (
            <div key={cat.label} className="relative">
              {/* Background vertical title */}
              <div className="absolute -left-12 md:-left-20 top-0 h-full flex items-center select-none pointer-events-none overflow-hidden">
                <span className="text-[120px] md:text-[200px] font-serif-cinematic text-neutral-900 leading-none uppercase font-bold tracking-tighter -rotate-90 opacity-40 origin-center whitespace-nowrap">
                  {cat.label}
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-start-4 lg:col-span-8 space-y-16">
                  <header className="flex items-baseline justify-between border-b border-neutral-900 pb-4">
                    <h3 className="text-xl md:text-2xl font-serif-cinematic tracking-widest text-white uppercase">{cat.label}</h3>
                    <span className="text-[10px] text-neutral-700 tracking-[0.5em] uppercase">Credits</span>
                  </header>

                  <div className="space-y-12">
                    {cat.credits.map((item, cidx) => (
                      <div key={cidx} className="group flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 transition-all duration-500">
                        <div className="w-16 text-neutral-700 font-serif-cinematic text-lg">{item.year}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                            <h4 className="text-lg md:text-xl font-medium tracking-tight group-hover:text-[#c5a059] transition-colors duration-300">
                              {item.title}
                            </h4>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-[#c5a059] opacity-60 font-bold">{item.role}</span>
                          </div>
                          {item.note && (
                            <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-xl opacity-80 group-hover:opacity-100">
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

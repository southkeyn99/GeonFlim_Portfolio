
import { Project, SiteSettings } from './types.ts';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200';

export const INITIAL_PROJECTS: Project[] = [
  // --- DIRECTING ---
  {
    id: 'd1', category: 'DIRECTING', year: '2025', titleKr: '아부지', titleEn: 'Panic Disorder', genre: 'Drama', runtime: '27min', aspectRatio: '1.85:1', role: 'Director, Writer',
    synopsis: '24년 명필름 단편스쿨 수료작.\n제 3회 UFO 영화제 초청상영.\n제 4회 경기도예술영화제 대상.',
    awards: ['제 4회 경기도예술영화제 대상', '24년 명필름 단편스쿨 수료작', '제 3회 UFO 영화제 초청상영'],
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200', stillCuts: []
  },
  {
    id: 'd2', category: 'DIRECTING', year: '2025', titleKr: '유서파이널최종', titleEn: 'Last Will: Final', genre: 'Drama', runtime: '-', aspectRatio: '2.35:1', role: 'Director, Writer',
    synopsis: '배우의 감독 프로젝트 시즌 2 제작지원작.',
    awards: ['배우의 감독 프로젝트 시즌 2 제작지원작'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'd3', category: 'DIRECTING', year: '2024', titleKr: '도애의 시간', titleEn: 'Time of Do-ae', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Director, Writer',
    synopsis: '11회 목포국도1호선독립영화제 도움닫기 작품상.\n2024 김해시민영화제 초청상영.\n제 1회 느림독립영화제 입상.\n경기갭이어프로그램 지원작.',
    awards: ['11회 목포국도1호선독립영화제 도움닫기 작품상', '2024 김해시민영화제 초청상영', '제 1회 느림독립영화제 입상', '경기갭이어프로그램 지원작'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'd4', category: 'DIRECTING', year: '2023', titleKr: '그린비치', titleEn: 'Green Beach', genre: 'Drama', runtime: '85min', aspectRatio: '2.35:1', role: 'Director, Writer',
    synopsis: '장편영화 프로젝트 백백백.\n한국영상자료원 상영작.',
    awards: ['프로벡트 백백백', '한국영상자료원 상영'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'd5', category: 'DIRECTING', year: '2023', titleKr: '겨울바람', titleEn: 'Winter Wind', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Director, Writer',
    synopsis: '', awards: [], coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'd6', category: 'DIRECTING', year: '2022', titleKr: 'EAST', titleEn: 'EAST', genre: 'Experimental', runtime: '-', aspectRatio: '1.85:1', role: 'Director, Writer',
    synopsis: '', awards: [], coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'd7', category: 'DIRECTING', year: '2022', titleKr: '주연배우계약서', titleEn: 'The Lead Actor Contract', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Director',
    synopsis: '', awards: [], coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'd8', category: 'DIRECTING', year: '2019', titleKr: '나는 프랑스로 갈 거야', titleEn: "I'm Going to France", genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Director, Writer',
    synopsis: '', awards: [], coverImage: PLACEHOLDER_IMG, stillCuts: []
  },

  // --- AI FILM ---
  {
    id: 'a1', category: 'AI_FILM', year: '2025', titleKr: '마지막 명령', titleEn: 'The Last Command', genre: 'AI, SF', runtime: '4min 30sec', aspectRatio: '2.35:1', role: 'Director, AI Artist',
    synopsis: '제 5회 금천패션영화제 경쟁작.\n제 3회 죽서 AI 영화제 장려상 수상.',
    awards: ['제 5회 금천패션영화제 경쟁작', '제 3회 죽서 AI 영화제 장려상 수상'],
    coverImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200', stillCuts: []
  },
  {
    id: 'a2', category: 'AI_FILM', year: '2024', titleKr: '친절한 바바야가', titleEn: 'Kind Baba-yaga', genre: 'AI, Fantasy', runtime: '-', aspectRatio: '2.35:1', role: 'Director, AI Artist',
    synopsis: '', awards: [], coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'a3', category: 'AI_FILM', year: '2022', titleKr: '학의로에서 안녕', titleEn: 'Goodbye at Hak-ui Road', genre: 'AI, Drama', runtime: '-', aspectRatio: '2.35:1', role: 'Director, Writer',
    synopsis: '2023 볼리 공모전 특별상 수상작.',
    awards: ['2023 볼리 공모전 특별상 수상작'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },

  // --- STAFF (AD & PRODUCER) ---
  {
    id: 's1', category: 'STAFF', year: '2025', titleKr: '방문', titleEn: 'The Visit', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Assistant Director',
    synopsis: '2025 부산국제영화제 Community Biff.\nCJENM & 영상원 30주년 기념.',
    awards: ['2025 부산국제영화제 Community Biff', 'CJENM & 영상원 30주년 기념'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 's2', category: 'STAFF', year: '2024', titleKr: '내남자의 브래지어', titleEn: "My Man's Bra", genre: 'Comedy', runtime: '-', aspectRatio: '1.85:1', role: 'Assistant Director',
    synopsis: '2024 부산국제영화제 Community Biff.',
    awards: ['2024 부산국제영화제 Community Biff'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 's3', category: 'STAFF', year: '2023', titleKr: '인공세상의 새로운 아침', titleEn: 'New Morning in the Artificial World', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Producer',
    synopsis: '제 28회 부산국제영화제 단편경쟁.',
    awards: ['제 28회 부산국제영화제 단편경쟁'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 's4', category: 'STAFF', year: '2023', titleKr: '죽고 싶다 죽이고 싶다', titleEn: 'Wanna Die, Wanna Kill', genre: 'Thriller', runtime: '-', aspectRatio: '1.85:1', role: 'Producer',
    synopsis: '2024 판타지아국제영화제.',
    awards: ['2024 판타지아국제영화제'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 's5', category: 'STAFF', year: '2019', titleKr: '그녀의 문제와 불꽃', titleEn: 'Her Problem and the Spark', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Assistant Director',
    synopsis: '제 45회 서울독립영화제 단편경쟁.',
    awards: ['제 45회 서울독립영화제 단편경쟁'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },

  // --- CINEMATOGRAPHY ---
  {
    id: 'c1', category: 'CINEMATOGRAPHY', year: '2022', titleKr: '복채', titleEn: 'The Fee', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Cinematographer',
    synopsis: '제 28회 부천국제판타스틱영화제 단편경쟁.\n제 23회 피렌체한국영화제 Short부문 상영작.',
    awards: ['제 28회 부천국제판타스틱영화제 단편경쟁', '제 23회 피렌체한국영화제 Short부문 상영작'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  },
  {
    id: 'c2', category: 'CINEMATOGRAPHY', year: '2022', titleKr: '노이즈캔슬링', titleEn: 'Noise Cancelling', genre: 'Drama', runtime: '-', aspectRatio: '1.85:1', role: 'Cinematographer',
    synopsis: '2025 완주아동권리영화제 우수상.',
    awards: ['2025 완주아동권리영화제 우수상'],
    coverImage: PLACEHOLDER_IMG, stillCuts: []
  }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  directorNameKr: '남궁 건',
  directorNameEn: 'NamGung Geon',
  vision: '기술의 진보 너머, 인간의 본질을 담는 시선',
  bio: `남궁건은 영화적 언어와 기술적 혁신의 경계에서 작업하는 연출가입니다. 전통적인 서사 구조를 존중하면서도, AI와 새로운 미디어를 도구로 활용해 인간 내면의 복잡한 감정을 시각화하는 데 집중합니다.\n\n그의 작품들은 정적인 이미지 속에서도 폭발적인 감정의 울림을 전달하며, 관객으로 하여금 스크린 너머의 여운을 오랫동안 간직하게 만듭니다.`,
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  location: 'Seoul, Korea',
  email: 'southkeyn99@naver.com',
  homeHeroTitle: 'GEON FILM',
  homeHeroTagline: 'Film Director & Visual Artist',
  homeBgImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000'
};

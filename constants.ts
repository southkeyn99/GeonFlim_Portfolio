
import { Project, SiteSettings } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    category: 'DIRECTING',
    year: '2025',
    titleKr: '아부지',
    titleEn: 'Abuji',
    genre: 'Drama',
    runtime: '24min',
    role: 'Director, Writer',
    synopsis: '24년 명필름 단편스쿨 수료작. 아버지와의 화해를 다룬 정통 드라마.',
    awards: [
      '제 4회 경기도예술영화제 대상',
      '제 3회 UFO 영화제 초청상영'
    ],
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200',
    stillCuts: []
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
  homeBgImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000'
};

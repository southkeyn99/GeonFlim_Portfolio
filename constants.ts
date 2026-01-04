
import { Project, SiteSettings } from './types.ts';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    category: 'DIRECTING',
    year: '2025',
    titleKr: '아부지',
    titleEn: 'Panic Disorder',
    genre: 'Drama, Thriller',
    runtime: '27min 20sec',
    role: 'Director, Writer',
    synopsis: '어릴적 아버지의 폭력으로 집을 나온 이후, 공황장애를 얻게 된 현수.\n20년만에 누나의 부탁으로 치매에 걸린 아버지를 돌보게 된다.',
    awards: [
      '제 4회 경기도예술영화제 대상',
      '24년 명필름 단편스쿨 수료작',
      '제 3회 UFO 영화제 초청상영'
    ],
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200',
    stillCuts: [
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1535016120720-40c646be8958?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=80&w=1200'
    ]
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

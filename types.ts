
export interface Project {
  id: string;
  category: 'DIRECTING' | 'CINEMATOGRAPHY' | 'AI_FILM' | 'STAFF' | 'OTHER';
  year: string;
  titleKr: string;
  titleEn: string;
  genre: string;
  runtime: string;
  role: string;
  synopsis: string;
  awards: string[];
  coverImage: string;
  stillCuts: string[];
}

export interface SiteSettings {
  directorNameKr: string;
  directorNameEn: string;
  vision: string;
  bio: string;
  profileImage: string;
  location: string;
  email: string;
  homeBgImage: string;
}

export type ViewState = 'HOME' | 'DIRECTING' | 'CINEMATOGRAPHY' | 'AI_FILM' | 'STAFF' | 'ADMIN' | 'CONTACT';

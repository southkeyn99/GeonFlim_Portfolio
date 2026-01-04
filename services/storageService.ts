
import { Project, SiteSettings } from '../types.ts';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants.ts';

// 버전을 v4에서 v5로 변경하여 기존 로컬 스토리지를 초기화하고 최신 데이터를 반영합니다.
const STORAGE_KEYS = {
  PROJECTS: 'cinematic_archive_projects_v5',
  SETTINGS: 'cinematic_archive_settings_v5',
  INITIALIZED: 'cinematic_archive_init_v5'
};

class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      // 명시적으로 초기화되지 않은 경우 최신 constants.ts 데이터를 삽입
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  async getProjects(): Promise<Project[]> {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    try {
      if (!data) return INITIAL_PROJECTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
    } catch (e) {
      console.error("Failed to parse projects", e);
      return INITIAL_PROJECTS;
    }
  }

  async saveProjects(projects: Project[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  async addProject(project: Project): Promise<void> {
    const projects = await this.getProjects();
    const updated = [project, ...projects];
    await this.saveProjects(updated);
  }

  async updateProject(project: Project): Promise<void> {
    const projects = await this.getProjects();
    const updated = projects.map(p => p.id === project.id ? project : p);
    await this.saveProjects(updated);
  }

  async deleteProject(id: string): Promise<void> {
    const projects = await this.getProjects();
    const updated = projects.filter(p => p.id !== id);
    await this.saveProjects(updated);
  }

  async getSettings(): Promise<SiteSettings> {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    try {
      if (!data) return DEFAULT_SETTINGS;
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  async saveSettings(settings: SiteSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}

export const storageService = new StorageService();


import { Project, SiteSettings } from '../types.ts';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants.ts';

const STORAGE_KEYS = {
  PROJECTS: 'cinematic_archive_projects_v8',
  SETTINGS: 'cinematic_archive_settings_v8',
  INITIALIZED: 'cinematic_archive_init_v8'
};

class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    window.location.reload(); // 데이터 초기화 후 리로드
  }

  async getProjects(): Promise<Project[]> {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    try {
      if (!data) return INITIAL_PROJECTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_PROJECTS;
    } catch (e) {
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

  // 전체 상태를 텍스트로 내보내기 위한 헬퍼
  async getRawState() {
    return {
      projects: await this.getProjects(),
      settings: await this.getSettings()
    };
  }
}

export const storageService = new StorageService();


import { Project, SiteSettings } from '../types.ts';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants.ts';

const STORAGE_KEYS = {
  PROJECTS: 'cinematic_archive_projects_v4',
  SETTINGS: 'cinematic_archive_settings_v4',
  INITIALIZED: 'cinematic_archive_init_v4'
};

class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      // 명시적으로 초기화되지 않은 경우에만 기본 데이터 삽입
      if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }
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

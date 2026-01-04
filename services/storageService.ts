
import { Project, SiteSettings } from '../types.ts';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants.ts';

/**
 * [배포 및 업로드 해결책] 
 * 버전을 v7로 변경하여 이미지 업로드 기능이 포함된 데이터를 관리합니다.
 */
const STORAGE_KEYS = {
  PROJECTS: 'cinematic_archive_projects_v7',
  SETTINGS: 'cinematic_archive_settings_v7',
  INITIALIZED: 'cinematic_archive_init_v7'
};

class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
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

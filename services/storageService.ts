
import { Project, SiteSettings } from '../types.ts';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants.ts';

const STORAGE_KEYS = {
  PROJECTS: 'cinematic_portfolio_projects_v2',
  SETTINGS: 'cinematic_portfolio_settings_v2',
  INITIALIZED: 'cinematic_portfolio_initialized'
};

class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    // 최초 실행 시에만 초기 데이터를 로컬 스토리지에 저장
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  async getProjects(): Promise<Project[]> {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : INITIAL_PROJECTS;
  }

  async saveProjects(projects: Project[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  async addProject(project: Project): Promise<void> {
    const projects = await this.getProjects();
    // 새 프로젝트를 목록 맨 앞에 추가
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
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  }

  async saveSettings(settings: SiteSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}

export const storageService = new StorageService();

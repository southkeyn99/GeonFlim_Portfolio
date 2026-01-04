
import { Project, SiteSettings } from '../types';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants';

const DB_NAME = 'CinematicPortfolioDB';
const DB_VERSION = 1;
const STORES = {
  PROJECTS: 'projects',
  SETTINGS: 'settings'
};

class StorageService {
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
          db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS);
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
    });
  }

  async getProjects(): Promise<Project[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readonly');
      const store = transaction.objectStore(STORES.PROJECTS);
      const request = store.getAll();

      request.onsuccess = async () => {
        const results = request.result;
        if (results.length === 0) {
          // Seed initial data if empty
          for (const p of INITIAL_PROJECTS) {
            await this.addProject(p);
          }
          resolve(INITIAL_PROJECTS);
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addProject(project: Project): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readwrite');
      const store = transaction.objectStore(STORES.PROJECTS);
      const request = store.put(project);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateProject(project: Project): Promise<void> {
    return this.addProject(project);
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROJECTS, 'readwrite');
      const store = transaction.objectStore(STORES.PROJECTS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<SiteSettings> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.SETTINGS, 'readonly');
      const store = transaction.objectStore(STORES.SETTINGS);
      const request = store.get('site_config');

      request.onsuccess = () => {
        if (!request.result) {
          this.saveSettings(DEFAULT_SETTINGS);
          resolve(DEFAULT_SETTINGS);
        } else {
          resolve(request.result);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: SiteSettings): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.SETTINGS, 'readwrite');
      const store = transaction.objectStore(STORES.SETTINGS);
      const request = store.put(settings, 'site_config');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const storageService = new StorageService();

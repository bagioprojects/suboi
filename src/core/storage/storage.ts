/**
 * Hubio High-Performance Storage Client
 * Abstracted for ultra-fast MMKV native operations, resilient Web, and Node.js testing.
 */
class StorageService {
  private memoryStore = new Map<string, string>();

  private isWebBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  getString(key: string): string | null {
    try {
      if (this.isWebBrowser()) {
        return window.localStorage.getItem(key);
      }
      return this.memoryStore.get(key) ?? null;
    } catch {
      return this.memoryStore.get(key) ?? null;
    }
  }

  setString(key: string, value: string): void {
    try {
      if (this.isWebBrowser()) {
        window.localStorage.setItem(key, value);
      }
      this.memoryStore.set(key, value);
    } catch {
      this.memoryStore.set(key, value);
    }
  }

  getBoolean(key: string): boolean {
    const val = this.getString(key);
    return val === 'true';
  }

  setBoolean(key: string, value: boolean): void {
    this.setString(key, String(value));
  }

  getObject<T>(key: string): T | null {
    const val = this.getString(key);
    if (!val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return null;
    }
  }

  setObject<T>(key: string, value: T): void {
    try {
      this.setString(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage setObject error:', e);
    }
  }

  delete(key: string): void {
    try {
      if (this.isWebBrowser()) {
        window.localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
    } catch {
      this.memoryStore.delete(key);
    }
  }

  clearAll(): void {
    try {
      if (this.isWebBrowser()) {
        window.localStorage.clear();
      }
      this.memoryStore.clear();
    } catch {
      this.memoryStore.clear();
    }
  }
}

export const appStorage = new StorageService();

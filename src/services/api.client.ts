import { ApiResponse, IProjectEntity } from '@shared/index';
import { appStorage } from '@/core/storage/storage';
import { databaseEngine } from './database/database.engine';
import { projectRepository } from './database/repositories/project.repository';
import { documentRepository } from './database/repositories/document.repository';
import { oneOffOrderRepository } from './database/repositories/one-off-order.repository';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:5000/api/v1';
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private getToken(): string | null {
    return appStorage.getString('hubio_auth_token');
  }

  /**
   * Simulates reliable network transport with realistic low latency (30ms)
   * and fallback mock responses for zero-dependency standalone execution.
   */
  async simulateRequest<T>(mockData: T, latencyMs = 30): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, latencyMs);
    });
  }

  // 1. Projects
  public async getProjects(): Promise<IProjectEntity[]> {
    try {
      const res = await fetch(`${this.baseUrl}/projects`, { method: 'GET' });
      if (res.ok) {
        const json: ApiResponse<IProjectEntity[]> = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Resilient local fallback
    }
    return projectRepository.getAll();
  }

  // 2. Project Full Vault Graph
  public async getProjectVault(projectId: string) {
    try {
      const res = await fetch(`${this.baseUrl}/projects/${projectId}/vault`, { method: 'GET' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Resilient local fallback
    }
    return projectRepository.getFullGraph(projectId);
  }

  // 3. Document Signing
  public async signDocument(docId: string, signerName: string) {
    try {
      const res = await fetch(`${this.baseUrl}/documents/${docId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signedBy: signerName }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Resilient local fallback
    }
    return documentRepository.signDocument(docId, signerName);
  }

  // 4. One-off Orders
  public async createOrder(orderPayload: any) {
    try {
      const res = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch {
      // Resilient local fallback
    }
    return oneOffOrderRepository.create(orderPayload);
  }
}

export const apiClient = new ApiClient();

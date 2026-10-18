import type {
  IProjectEntity,
  IDocumentEntity,
  IMediaAssetEntity,
  IMilestoneRevisionEntity,
  IOneOffServiceOrderEntity,
  IAuditLogEntity,
  IUserEntity,
  IServiceCatalogEntity,
  INotificationEntity,
} from '@shared/types/entities.types';

export class BackendDatabaseService {
  private projects: Map<string, IProjectEntity> = new Map();
  private documents: Map<string, IDocumentEntity> = new Map();
  private media: Map<string, IMediaAssetEntity> = new Map();
  private revisions: Map<string, IMilestoneRevisionEntity> = new Map();
  private orders: Map<string, IOneOffServiceOrderEntity> = new Map();
  private users: Map<string, IUserEntity> = new Map();
  private services: Map<string, IServiceCatalogEntity> = new Map();
  private notifications: Map<string, INotificationEntity> = new Map();
  private auditLogs: IAuditLogEntity[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const defaultProjects: IProjectEntity[] = [
      {
        id: 'prj-101',
        clientId: 'cli-001',
        clientName: 'NovaTech Bilişim A.Ş.',
        title: 'Expo Mobil & B2B Web Portali',
        category: 'mobile_web',
        status: 'in_progress',
        progressPercentage: 85,
        totalBudgetFormatted: '₺140.000',
        spentBudgetFormatted: '₺119.000',
        startDate: '01 Şubat 2026',
        targetLaunchDate: '28 Nisan 2026',
        liveUrl: 'https://novatech.hubio.digital',
        repoUrl: 'github.com/hubio-enterprise/novatech-portal',
        techStack: ['Expo SDK 58', 'React 19', 'Zustand', 'FlashList', 'TurboModules'],
        description: 'React 19 Bridgeless altyapısıyla sıfır gecikmeli kurumsal sipariş ve mobil takip portalı.',
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-04-12T14:30:00Z',
      },
      {
        id: 'prj-102',
        clientId: 'cli-001',
        clientName: 'NovaTech Bilişim A.Ş.',
        title: 'AI GEO & Local SEO Kampanyası',
        category: 'seo_geo',
        status: 'in_progress',
        progressPercentage: 92,
        totalBudgetFormatted: '₺32.000 / Ay',
        spentBudgetFormatted: '₺64.000',
        startDate: '15 Ocak 2026',
        targetLaunchDate: '15 Mayıs 2026',
        techStack: ['ChatGPT 4o Schema', 'Perplexity Engine', 'Google Maps API'],
        description: 'Üretken yapay zeka modelleri ve yerel haritalarda 1. sıraya yükseliş kampanyası.',
        createdAt: '2026-01-15T09:00:00Z',
        updatedAt: '2026-04-14T11:20:00Z',
      },
      {
        id: 'prj-103',
        clientId: 'cli-002',
        clientName: 'Atlas Holding',
        title: 'Core Web Vitals & Redis Caching',
        category: 'performance',
        status: 'completed',
        progressPercentage: 100,
        totalBudgetFormatted: '₺28.000',
        spentBudgetFormatted: '₺28.000',
        startDate: '10 Mart 2026',
        targetLaunchDate: '05 Nisan 2026',
        liveUrl: 'https://atlasholding.com.tr',
        techStack: ['Redis', 'ThumbHash', 'Cloudflare Edge', 'Next.js 15'],
        description: 'LCP süresi 3.4 saniyeden 1.1 saniyeye düşürüldü; PageSpeed skoru 97/100.',
        createdAt: '2026-03-10T08:00:00Z',
        updatedAt: '2026-04-05T18:00:00Z',
      },
    ];

    defaultProjects.forEach((p) => this.projects.set(p.id, p));

    const defaultDocs: IDocumentEntity[] = [
      {
        id: 'doc-001',
        projectId: 'prj-101',
        title: 'Kurumsal Yazılım Hizmet & Lisans Sözleşmesi 2026',
        type: 'contract',
        fileUrl: 'https://hubio.digital/vault/contracts/HUB-CNT-2026-01.pdf',
        fileSizeBytes: 2450000,
        fileSizeFormatted: '2.4 MB',
        mimeType: 'application/pdf',
        version: 'v2.1',
        isSigned: true,
        signedAt: '03 Şubat 2026',
        signedBy: 'Ahmet Yılmaz (Genel Müdür)',
        downloadCount: 14,
        createdAt: '2026-02-03T11:00:00Z',
      },
      {
        id: 'doc-002',
        projectId: 'prj-101',
        title: 'Teknik Mimari Şartnamesi & API Sözlüğü',
        type: 'specification',
        fileUrl: 'https://hubio.digital/vault/specs/HUB-SPEC-NT-01.pdf',
        fileSizeBytes: 4890000,
        fileSizeFormatted: '4.8 MB',
        mimeType: 'application/pdf',
        version: 'v3.0',
        isSigned: true,
        signedAt: '05 Şubat 2026',
        signedBy: 'Bora Tekin (Baş Mimar)',
        downloadCount: 8,
        createdAt: '2026-02-05T14:00:00Z',
      },
    ];

    defaultDocs.forEach((d) => this.documents.set(d.id, d));
  }

  // Projects
  public getAllProjects(): IProjectEntity[] {
    return Array.from(this.projects.values());
  }

  public getProjectById(id: string): IProjectEntity | null {
    return this.projects.get(id) || null;
  }

  public getProjectFullGraph(projectId: string) {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const docs = Array.from(this.documents.values()).filter((d) => d.projectId === projectId);
    const media = Array.from(this.media.values()).filter((m) => m.projectId === projectId);
    const revisions = Array.from(this.revisions.values()).filter((r) => r.projectId === projectId);

    return { project, documents: docs, media, revisions };
  }

  // Documents
  public getDocumentsByProject(projectId: string): IDocumentEntity[] {
    return Array.from(this.documents.values()).filter((d) => d.projectId === projectId);
  }

  public signDocument(docId: string, signerName: string): IDocumentEntity | null {
    const doc = this.documents.get(docId);
    if (!doc) return null;
    const updated: IDocumentEntity = {
      ...doc,
      isSigned: true,
      signedAt: new Date().toISOString(),
      signedBy: signerName,
    };
    this.documents.set(docId, updated);
    return updated;
  }

  public incrementDownload(docId: string): IDocumentEntity | null {
    const doc = this.documents.get(docId);
    if (!doc) return null;
    doc.downloadCount = (doc.downloadCount || 0) + 1;
    this.documents.set(docId, doc);
    return doc;
  }

  // Media
  public getMediaByProject(projectId: string): IMediaAssetEntity[] {
    return Array.from(this.media.values()).filter((m) => m.projectId === projectId);
  }

  // Orders
  public getOrdersByClient(clientId: string): IOneOffServiceOrderEntity[] {
    return Array.from(this.orders.values()).filter((o) => o.clientId === clientId);
  }

  public createOrder(order: IOneOffServiceOrderEntity): IOneOffServiceOrderEntity {
    this.orders.set(order.id, order);
    return order;
  }

  // Users
  public getAllUsers(): IUserEntity[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): IUserEntity | null {
    return this.users.get(id) || null;
  }

  public getUserByEmail(email: string): IUserEntity | null {
    return Array.from(this.users.values()).find((u) => u.email === email) || null;
  }

  public createUser(user: IUserEntity): IUserEntity {
    this.users.set(user.id, user);
    return user;
  }

  // Services
  public getAllServices(): IServiceCatalogEntity[] {
    return Array.from(this.services.values());
  }

  public getServiceById(id: string): IServiceCatalogEntity | null {
    return this.services.get(id) || null;
  }

  // Notifications
  public getNotificationsByUser(userId?: string): INotificationEntity[] {
    if (userId) {
      return Array.from(this.notifications.values()).filter((n) => n.userId === userId);
    }
    return Array.from(this.notifications.values());
  }

  public createNotification(notification: INotificationEntity): INotificationEntity {
    this.notifications.set(notification.id, notification);
    return notification;
  }
}

export const backendDb = new BackendDatabaseService();

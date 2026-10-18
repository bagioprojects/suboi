import { appStorage } from '@/core/storage/storage';
import {
  IProjectEntity,
  IDocumentEntity,
  IMediaAssetEntity,
  IMilestoneRevisionEntity,
  IOneOffServiceOrderEntity,
  IAuditLogEntity,
  IUserEntity,
  IServiceCatalogEntity,
  INotificationEntity,
} from '@/models/database/entities.types';

export type TableName =
  | 'projects'
  | 'documents'
  | 'media'
  | 'revisions'
  | 'orders'
  | 'audit'
  | 'users'
  | 'services'
  | 'notifications';

const INDEXED_FIELDS: Partial<Record<TableName, string[]>> = {
  projects: ['clientId', 'category', 'status'],
  documents: ['projectId', 'type', 'isSigned'],
  media: ['projectId', 'mediaType'],
  revisions: ['projectId', 'milestoneId', 'status'],
  orders: ['clientId', 'serviceId', 'orderStatus', 'paymentStatus'],
  users: ['email', 'clientId', 'userType'],
  services: ['category'],
  notifications: ['userId', 'read', 'category'],
};

export class DatabaseEngine {
  private memoryTables: Record<TableName, Map<string, any>> = {
    projects: new Map(),
    documents: new Map(),
    media: new Map(),
    revisions: new Map(),
    orders: new Map(),
    audit: new Map(),
    users: new Map(),
    services: new Map(),
    notifications: new Map(),
  };

  // Secondary Inverted Indexes: Table -> FieldName -> FieldValue -> Set of Entity IDs
  private indexes: Record<TableName, Map<string, Map<any, Set<string>>>> = {
    projects: new Map(),
    documents: new Map(),
    media: new Map(),
    revisions: new Map(),
    orders: new Map(),
    audit: new Map(),
    users: new Map(),
    services: new Map(),
    notifications: new Map(),
  };

  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  public initialize(): void {
    if (this.isInitialized) return;

    const tableKeys: TableName[] = [
      'projects',
      'documents',
      'media',
      'revisions',
      'orders',
      'audit',
      'users',
      'services',
      'notifications',
    ];

    // Load persisted data for each table
    tableKeys.forEach((table) => {
      this.initTableIndexes(table);
      const stored = appStorage.getObject<any[]>(`hubio_db_${table}`);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        stored.forEach((item) => {
          if (item?.id) {
            this.memoryTables[table].set(item.id, item);
            this.addRecordToIndexes(table, item);
          }
        });
      }
    });

    // Per-Table Self-Healing: Seeds any empty table independently
    this.seedEmptyTables();

    this.isInitialized = true;
  }

  private initTableIndexes(table: TableName): void {
    this.indexes[table] = new Map();
    const fields = INDEXED_FIELDS[table] || [];
    fields.forEach((f) => {
      this.indexes[table].set(f, new Map());
    });
  }

  private addRecordToIndexes(table: TableName, record: any): void {
    const tableIndexes = this.indexes[table];
    if (!tableIndexes || !record?.id) return;

    const fields = INDEXED_FIELDS[table] || [];
    fields.forEach((field) => {
      const val = record[field];
      if (val !== undefined && val !== null) {
        let valIndex = tableIndexes.get(field);
        if (!valIndex) {
          valIndex = new Map();
          tableIndexes.set(field, valIndex);
        }
        let idSet = valIndex.get(val);
        if (!idSet) {
          idSet = new Set();
          valIndex.set(val, idSet);
        }
        idSet.add(record.id);
      }
    });
  }

  private removeRecordFromIndexes(table: TableName, id: string, record: any): void {
    const tableIndexes = this.indexes[table];
    if (!tableIndexes || !record) return;

    const fields = INDEXED_FIELDS[table] || [];
    fields.forEach((field) => {
      const val = record[field];
      if (val !== undefined && val !== null) {
        const valIndex = tableIndexes.get(field);
        if (valIndex) {
          const idSet = valIndex.get(val);
          if (idSet) {
            idSet.delete(id);
            if (idSet.size === 0) {
              valIndex.delete(val);
            }
          }
        }
      }
    });
  }

  public rebuildTableIndexes(table: TableName): void {
    this.initTableIndexes(table);
    for (const record of this.memoryTables[table].values()) {
      this.addRecordToIndexes(table, record);
    }
  }

  private persistTable(table: TableName): void {
    const list = Array.from(this.memoryTables[table].values());
    appStorage.setObject(`hubio_db_${table}`, list);
  }

  // --- QUERY OPERATIONS (O(1) Indexed & Flexible) ---

  public findById<T>(table: TableName, id: string): T | null {
    return (this.memoryTables[table].get(id) as T) || null;
  }

  public find<T>(table: TableName, predicate?: (item: T) => boolean): T[] {
    const items = Array.from(this.memoryTables[table].values()) as T[];
    if (!predicate) return items;
    return items.filter(predicate);
  }

  /**
   * Fast O(1) query using secondary inverted indexes where available
   */
  public findByIndex<T>(table: TableName, key: keyof T, value: any): T[] {
    const tableIndex = this.indexes[table]?.get(key as string);
    if (tableIndex) {
      const idSet = tableIndex.get(value);
      if (!idSet || idSet.size === 0) return [];

      const results: T[] = [];
      idSet.forEach((id) => {
        const item = this.memoryTables[table].get(id);
        if (item) results.push(item as T);
      });
      return results;
    }

    // Fallback to linear scan if key is not explicitly indexed
    return this.find<T>(table, (item) => item[key] === value);
  }

  public search<T>(table: TableName, query: string, fields: (keyof T)[]): T[] {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return this.find<T>(table);

    return this.find<T>(table, (item) => {
      return fields.some((field) => {
        const val = item[field];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(normalized);
        }
        if (Array.isArray(val)) {
          return val.some((v) => typeof v === 'string' && v.toLowerCase().includes(normalized));
        }
        return false;
      });
    });
  }

  // --- MUTATION OPERATIONS ---

  public insert<T extends { id: string }>(table: TableName, record: T): T {
    if (this.memoryTables[table].has(record.id)) {
      const existing = this.memoryTables[table].get(record.id);
      this.removeRecordFromIndexes(table, record.id, existing);
    }

    this.memoryTables[table].set(record.id, record);
    this.addRecordToIndexes(table, record);
    this.persistTable(table);

    if (table !== 'audit') {
      this.logAudit({
        id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        entityType: table === 'projects' ? 'project' : table === 'documents' ? 'document' : 'user',
        entityId: record.id,
        action: 'create',
        performedBy: 'Hubio Engine',
        details: `${table} tablosuna yeni kayıt eklendi: ${record.id}`,
        timestamp: new Date().toISOString(),
      });
    }

    return record;
  }

  public update<T extends { id: string }>(table: TableName, id: string, updates: Partial<T>): T | null {
    const existing = this.findById<T>(table, id);
    if (!existing) return null;

    this.removeRecordFromIndexes(table, id, existing);
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.memoryTables[table].set(id, merged);
    this.addRecordToIndexes(table, merged);
    this.persistTable(table);

    if (table !== 'audit') {
      this.logAudit({
        id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        entityType: table === 'projects' ? 'project' : 'document',
        entityId: id,
        action: 'update',
        performedBy: 'Hubio Engine',
        details: `${table} tablosundaki ${id} kaydı güncellendi`,
        timestamp: new Date().toISOString(),
      });
    }

    return merged;
  }

  /**
   * Cascading Relational Delete: Automatically cleans up children
   */
  public delete(table: TableName, id: string): boolean {
    const existing = this.memoryTables[table].get(id);
    if (!existing) return false;

    // Relational Foreign Key Cascades
    if (table === 'projects') {
      const childDocs = this.findByIndex<IDocumentEntity>('documents', 'projectId', id);
      childDocs.forEach((d) => this.delete('documents', d.id));

      const childMedia = this.findByIndex<IMediaAssetEntity>('media', 'projectId', id);
      childMedia.forEach((m) => this.delete('media', m.id));

      const childRevs = this.findByIndex<IMilestoneRevisionEntity>('revisions', 'projectId', id);
      childRevs.forEach((r) => this.delete('revisions', r.id));
    }

    this.removeRecordFromIndexes(table, id, existing);
    const existed = this.memoryTables[table].delete(id);
    if (existed) {
      this.persistTable(table);
    }
    return existed;
  }

  public bulkInsert<T extends { id: string }>(table: TableName, records: T[]): void {
    records.forEach((rec) => {
      this.memoryTables[table].set(rec.id, rec);
      this.addRecordToIndexes(table, rec);
    });
    this.persistTable(table);
  }

  public logAudit(entry: IAuditLogEntity): void {
    this.memoryTables.audit.set(entry.id, entry);
    if (this.memoryTables.audit.size > 200) {
      const firstKey = this.memoryTables.audit.keys().next().value;
      if (firstKey) this.memoryTables.audit.delete(firstKey);
    }
    this.persistTable('audit');
  }

  // --- ACID TRANSACTION MANAGER ---

  /**
   * Runs an atomic transaction with automatic rollback if an error occurs
   */
  public transaction<T>(operation: (db: DatabaseEngine) => T): T {
    // Snapshot of table state
    const snapshot: Record<TableName, Map<string, any>> = {} as any;
    (Object.keys(this.memoryTables) as TableName[]).forEach((t) => {
      snapshot[t] = new Map(this.memoryTables[t]);
    });

    try {
      const result = operation(this);
      (Object.keys(this.memoryTables) as TableName[]).forEach((t) => {
        this.persistTable(t);
      });
      return result;
    } catch (error) {
      // Rollback to initial snapshot
      (Object.keys(snapshot) as TableName[]).forEach((t) => {
        this.memoryTables[t] = snapshot[t];
        this.rebuildTableIndexes(t);
      });
      throw error;
    }
  }

  // --- ADMINISTRATION & SNAPSHOTS ---

  public exportSnapshot(): Record<TableName, any[]> {
    const dump: any = {};
    (Object.keys(this.memoryTables) as TableName[]).forEach((t) => {
      dump[t] = Array.from(this.memoryTables[t].values());
    });
    return dump;
  }

  public importSnapshot(snapshot: Partial<Record<TableName, any[]>>): void {
    Object.entries(snapshot).forEach(([table, records]) => {
      if (this.memoryTables[table as TableName] && Array.isArray(records)) {
        this.memoryTables[table as TableName].clear();
        this.bulkInsert(table as TableName, records);
      }
    });
  }

  public resetToFactorySeed(): void {
    (Object.keys(this.memoryTables) as TableName[]).forEach((t) => {
      this.memoryTables[t].clear();
      appStorage.delete(`hubio_db_${t}`);
      this.initTableIndexes(t);
    });
    this.seedEmptyTables();
  }

  // --- PER-TABLE SELF-HEALING SEEDER ---

  private seedEmptyTables(): void {
    // 1. Projects
    if (this.memoryTables.projects.size === 0) {
      const projects: IProjectEntity[] = [
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
      this.bulkInsert('projects', projects);
    }

    // 2. Documents
    if (this.memoryTables.documents.size === 0) {
      const documents: IDocumentEntity[] = [
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
          signedBy: 'Burak Demir (Lead Architect)',
          downloadCount: 38,
          createdAt: '2026-02-05T15:30:00Z',
        },
        {
          id: 'doc-003',
          projectId: 'prj-101',
          title: 'Gizlilik ve Veri Güvenliği Taahhütnamesi (NDA)',
          type: 'nda',
          fileUrl: 'https://hubio.digital/vault/nda/HUB-NDA-2026.pdf',
          fileSizeBytes: 1120000,
          fileSizeFormatted: '1.1 MB',
          mimeType: 'application/pdf',
          version: 'v1.0',
          isSigned: true,
          signedAt: '01 Şubat 2026',
          signedBy: 'Ahmet Yılmaz & Hubio Hukuk',
          downloadCount: 9,
          createdAt: '2026-02-01T09:00:00Z',
        },
        {
          id: 'doc-004',
          projectId: 'prj-101',
          title: '1. Sprint Teslim ve Hakediş Faturası #INV-891',
          type: 'invoice',
          fileUrl: 'https://hubio.digital/vault/invoices/INV-2026-891.pdf',
          fileSizeBytes: 420000,
          fileSizeFormatted: '420 KB',
          mimeType: 'application/pdf',
          version: 'v1.0',
          isSigned: false,
          downloadCount: 5,
          createdAt: '2026-03-01T12:00:00Z',
        },
        {
          id: 'doc-005',
          projectId: 'prj-102',
          title: 'Generative AI SEO Alıntı Strateji & Anahtar Kelime Raporu',
          type: 'deliverable',
          fileUrl: 'https://hubio.digital/vault/reports/GEO-Q1-STRATEGY.pdf',
          fileSizeBytes: 3100000,
          fileSizeFormatted: '3.1 MB',
          mimeType: 'application/pdf',
          version: 'v1.2',
          isSigned: false,
          downloadCount: 22,
          createdAt: '2026-03-20T10:00:00Z',
        },
        {
          id: 'doc-006',
          projectId: 'prj-103',
          title: 'Google Core Web Vitals 97/100 Başarı Kabul Tutanağı',
          type: 'deliverable',
          fileUrl: 'https://hubio.digital/vault/reports/CWV-ACCEPTANCE.pdf',
          fileSizeBytes: 890000,
          fileSizeFormatted: '890 KB',
          mimeType: 'application/pdf',
          version: 'v1.0',
          isSigned: true,
          signedAt: '06 Nisan 2026',
          signedBy: 'Atlas Holding BT Direktörü',
          downloadCount: 16,
          createdAt: '2026-04-06T14:00:00Z',
        },
      ];
      this.bulkInsert('documents', documents);
    }

    // 3. Media
    if (this.memoryTables.media.size === 0) {
      const media: IMediaAssetEntity[] = [
        {
          id: 'med-001',
          projectId: 'prj-101',
          title: 'Figma 4K B2B Checkout & Dashboard UI Tasarım Prototipi',
          mediaType: 'image',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
          resolution: '3840x2160 (4K)',
          tags: ['Figma', 'UI/UX', 'Checkout', 'Dark Theme'],
          uploaderName: 'Elif Doğan (UI Lead)',
          fileSizeBytes: 5400000,
          createdAt: '2026-03-12T16:00:00Z',
        },
        {
          id: 'med-002',
          projectId: 'prj-101',
          title: 'Bridgeless TurboModules 120 FPS Kaydırma Demo Videosu',
          mediaType: 'video',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
          durationSeconds: 42,
          resolution: '1080p FHD',
          tags: ['60FPS', 'FlashList', 'Benchmark', 'iOS'],
          uploaderName: 'Burak Demir (Lead)',
          fileSizeBytes: 14200000,
          createdAt: '2026-03-24T18:30:00Z',
        },
        {
          id: 'med-003',
          projectId: 'prj-102',
          title: 'Perplexity & ChatGPT 4o 1. Sıra Alıntı Kanıt Kaydı',
          mediaType: 'video',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
          durationSeconds: 28,
          resolution: '1080p',
          tags: ['AI GEO', 'ChatGPT 4o', 'Perplexity Pro'],
          uploaderName: 'Kaan Sezer (SEO Lead)',
          fileSizeBytes: 9800000,
          createdAt: '2026-04-02T11:00:00Z',
        },
        {
          id: 'med-004',
          projectId: 'prj-103',
          title: 'Lighthouse 97/100 Core Web Vitals Benchmark Grafiği',
          mediaType: 'image',
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
          resolution: '2560x1440',
          tags: ['PageSpeed', 'LCP', 'Redis'],
          uploaderName: 'Sistem Robotu',
          fileSizeBytes: 2100000,
          createdAt: '2026-04-05T17:30:00Z',
        },
      ];
      this.bulkInsert('media', media);
    }

    // 4. Revisions
    if (this.memoryTables.revisions.size === 0) {
      const revisions: IMilestoneRevisionEntity[] = [
        {
          id: 'rev-001',
          projectId: 'prj-101',
          milestoneId: 'ms-001',
          title: 'Sepet Ödeme Adımı 3D Secure Kart Alanı',
          tag: 'UI/UX',
          notes: 'Mobil görünümde kart numarası girdiğinde otomatik boşluk eklenmesi ve CVC yardım balonu eklendi.',
          status: 'resolved',
          requestedAt: '2026-03-15T14:00:00Z',
          resolvedAt: '2026-03-16T17:00:00Z',
        },
        {
          id: 'rev-002',
          projectId: 'prj-101',
          milestoneId: 'ms-002',
          title: 'Canlı Bildirim Sesi ve Titreşim Frekansı',
          tag: 'Performance',
          notes: 'iOS bildirimlerinde varsayılan ton yerine çift çan tonu ve haptik titreşim ayarlandı.',
          status: 'resolved',
          requestedAt: '2026-04-01T10:00:00Z',
          resolvedAt: '2026-04-02T12:00:00Z',
        },
        {
          id: 'rev-003',
          projectId: 'prj-102',
          milestoneId: 'ms-003',
          title: 'Harita Koordinat Pinlemesi & Semt Eşleştirmesi',
          tag: 'Content',
          notes: 'Anadolu yakası lojistik merkezinin Google Haritalar üzerinde 3 ayrı şube olarak bölünmesi.',
          status: 'in_progress',
          requestedAt: '2026-04-10T09:00:00Z',
        },
      ];
      this.bulkInsert('revisions', revisions);
    }

    // 5. Orders
    if (this.memoryTables.orders.size === 0) {
      const orders: IOneOffServiceOrderEntity[] = [
        {
          id: 'ord-801',
          clientId: 'cli-001',
          serviceId: 'srv-003',
          serviceTitle: 'Core Web Vitals 95+ PageSpeed Hızlandırma',
          category: 'maintenance',
          priceFormatted: '₺24.000',
          invoiceNumber: 'HUB-INV-2026-801',
          paymentStatus: 'paid',
          orderStatus: 'delivered',
          deliverables: [
            { name: 'Redis Cache Konfigürasyon Dosyası', url: 'https://hubio.digital/dl/redis.conf', size: '42 KB' },
            { name: 'Görsel WebP Dönüştürücü Betik', url: 'https://hubio.digital/dl/convert.py', size: '18 KB' },
            { name: 'Lighthouse Hız Raporu (PDF)', url: 'https://hubio.digital/dl/pagespeed.pdf', size: '1.2 MB' },
          ],
          orderedAt: '2026-02-14T11:00:00Z',
          deliveredAt: '2026-02-18T16:00:00Z',
        },
        {
          id: 'ord-802',
          clientId: 'cli-001',
          serviceId: 'srv-002',
          serviceTitle: 'AI GEO & Harita SEO Kampanyası',
          category: 'seo_geo',
          priceFormatted: '₺32.000',
          invoiceNumber: 'HUB-INV-2026-802',
          paymentStatus: 'paid',
          orderStatus: 'in_progress',
          deliverables: [
            { name: 'Haftalık AI Alıntı Denetim Tablosu', url: 'https://hubio.digital/dl/geo-audit.xlsx', size: '250 KB' },
          ],
          orderedAt: '2026-03-01T09:30:00Z',
        },
      ];
      this.bulkInsert('orders', orders);
    }

    // 6. Users (New Table)
    if (this.memoryTables.users.size === 0) {
      const users: IUserEntity[] = [
        {
          id: 'usr-001',
          clientId: 'cli-001',
          email: 'yonetim@novatech.com.tr',
          fullName: 'Ahmet Yılmaz',
          companyTitle: 'NovaTech Bilişim & E-Ticaret A.Ş.',
          userType: 'corporate',
          taxNumber: '6310928374',
          phone: '+90 532 100 2030',
          role: 'client_admin',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          createdAt: '2026-01-01T08:00:00Z',
        },
        {
          id: 'usr-002',
          clientId: 'cli-002',
          email: 'info@atlasholding.com.tr',
          fullName: 'Bora Tekin',
          companyTitle: 'Atlas Holding A.Ş.',
          userType: 'corporate',
          taxNumber: '9840192834',
          phone: '+90 533 222 3344',
          role: 'client_admin',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          createdAt: '2026-02-01T09:00:00Z',
        },
        {
          id: 'usr-003',
          email: 'ahmet.yilmaz@novatech.com.tr',
          fullName: 'Ahmet Yılmaz (Bireysel)',
          userType: 'individual',
          phone: '+90 542 333 4455',
          role: 'client_viewer',
          createdAt: '2026-03-01T10:00:00Z',
        },
      ];
      this.bulkInsert('users', users);
    }

    // 7. Services (New Table)
    if (this.memoryTables.services.size === 0) {
      const services: IServiceCatalogEntity[] = [
        {
          id: 'srv-001',
          title: 'Kurumsal Mobil Uygulama & Expo SDK 58 Geliştirme',
          category: 'development',
          priceFormatted: '₺75.000',
          priceAmount: 75000,
          deliverablesCount: 4,
          turnaroundDays: 21,
          description: 'React 19 Bridgeless yerel mimariyle iOS ve Android mağaza teslimi.',
          features: ['Expo Router v4', 'Offline Caching', 'Push Notifications', 'Store Submission'],
          isPopular: true,
        },
        {
          id: 'srv-002',
          title: 'AI GEO & Harita SEO Kampanyası',
          category: 'seo_geo',
          priceFormatted: '₺32.000',
          priceAmount: 32000,
          deliverablesCount: 3,
          turnaroundDays: 14,
          description: 'ChatGPT, Perplexity ve Google Haritalarda 1. sıraya yükseliş stratejisi.',
          features: ['Schema.org Markup', 'LLM Crawler Optimizasyonu', 'Yerel Harita Doğrulama'],
          isPopular: true,
        },
        {
          id: 'srv-003',
          title: 'Core Web Vitals 95+ PageSpeed Hızlandırma',
          category: 'maintenance',
          priceFormatted: '₺24.000',
          priceAmount: 24000,
          deliverablesCount: 3,
          turnaroundDays: 5,
          description: 'LCP ve FID metriklerini yeşile çekerek sayfa açılış hızını %60 artırın.',
          features: ['Redis Edge Cache', 'ThumbHash Sıkıştırma', 'Render-blocking JS Temizliği'],
        },
      ];
      this.bulkInsert('services', services);
    }

    // 8. Notifications (New Table)
    if (this.memoryTables.notifications.size === 0) {
      const notifications: INotificationEntity[] = [
        {
          id: 'notif-001',
          userId: 'usr-001',
          title: 'Yeni Canlı Dağıtım (Deploy v2.4.1)',
          message: 'Ödeme modülü 3D Secure 2.2 canlı sunucuya aktarıldı.',
          category: 'commit',
          targetPath: '/(tabs)/changelog',
          read: false,
          timestamp: '15 dk önce',
        },
        {
          id: 'notif-002',
          userId: 'usr-001',
          title: 'Haftalık AI GEO Raporu Hazır',
          message: 'Perplexity ve ChatGPT alıntılanma oranınız %24 arttı.',
          category: 'seo',
          targetPath: '/(tabs)/analytics',
          read: false,
          timestamp: '2 saat önce',
        },
      ];
      this.bulkInsert('notifications', notifications);
    }

    // 9. Audit Logs (Self-Healing Seeder)
    if (this.memoryTables.audit.size === 0) {
      const initialLogs: IAuditLogEntity[] = [
        {
          id: 'aud-001',
          entityType: 'project',
          entityId: 'prj-101',
          action: 'create',
          performedBy: 'Hubio System Seed',
          details: 'Sistem ilk kurulumu: NovaTech B2B E-Ticaret & Mobil Portal projesi oluşturuldu.',
          timestamp: '2026-02-01T10:00:00Z',
        },
        {
          id: 'aud-002',
          entityType: 'document',
          entityId: 'doc-001',
          action: 'sign',
          performedBy: 'Ahmet Yılmaz (Genel Müdür)',
          details: 'Yazılım Lisans ve Hizmet Sözleşmesi dijital olarak onaylandı.',
          timestamp: '2026-02-03T11:00:00Z',
        },
      ];
      this.bulkInsert('audit', initialLogs);
    }
  }
}

export const databaseEngine = new DatabaseEngine();

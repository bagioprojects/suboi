import { databaseEngine } from '../database.engine';
import { IDocumentEntity, DocumentType } from '@/models/database/entities.types';

export class DocumentRepository {
  public getAll(): IDocumentEntity[] {
    return databaseEngine.find<IDocumentEntity>('documents');
  }

  public getById(id: string): IDocumentEntity | null {
    return databaseEngine.findById<IDocumentEntity>('documents', id);
  }

  public getByProject(projectId: string, type?: DocumentType): IDocumentEntity[] {
    const docs = databaseEngine.findByIndex<IDocumentEntity>('documents', 'projectId', projectId);
    if (!type) return docs;
    return docs.filter((d) => d.type === type);
  }

  public signDocument(docId: string, signedBy: string): IDocumentEntity | null {
    const doc = this.getById(docId);
    if (!doc) return null;

    const updated = databaseEngine.update<IDocumentEntity>('documents', docId, {
      isSigned: true,
      signedAt: new Date().toISOString(),
      signedBy,
    });

    databaseEngine.logAudit({
      id: 'aud_sign_' + Date.now(),
      entityType: 'document',
      entityId: docId,
      action: 'sign',
      performedBy: signedBy,
      details: `Belge dijital olarak imzalandı: ${doc.title}`,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  public incrementDownload(docId: string): void {
    const doc = this.getById(docId);
    if (!doc) return;
    databaseEngine.update<IDocumentEntity>('documents', docId, {
      downloadCount: (doc.downloadCount || 0) + 1,
    });
  }

  public create(data: Omit<IDocumentEntity, 'id' | 'createdAt' | 'downloadCount'>): IDocumentEntity {
    const id = 'doc_' + Date.now().toString(36);
    const newRecord: IDocumentEntity = {
      ...data,
      id,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
    };
    return databaseEngine.insert<IDocumentEntity>('documents', newRecord);
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('documents', id);
  }
}

export const documentRepository = new DocumentRepository();

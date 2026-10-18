import { databaseEngine } from '../database.engine';
import { IAuditLogEntity } from '@/models/database/entities.types';

export class AuditRepository {
  public getAll(): IAuditLogEntity[] {
    return databaseEngine.find<IAuditLogEntity>('audit');
  }

  public getById(id: string): IAuditLogEntity | null {
    return databaseEngine.findById<IAuditLogEntity>('audit', id);
  }

  public getByEntityType(entityType: IAuditLogEntity['entityType']): IAuditLogEntity[] {
    return databaseEngine.find<IAuditLogEntity>('audit', (item) => item.entityType === entityType);
  }

  public getByEntityId(entityId: string): IAuditLogEntity[] {
    return databaseEngine.find<IAuditLogEntity>('audit', (item) => item.entityId === entityId);
  }

  public record(entry: Omit<IAuditLogEntity, 'id' | 'timestamp'>): IAuditLogEntity {
    const fullEntry: IAuditLogEntity = {
      ...entry,
      id: 'aud_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    databaseEngine.logAudit(fullEntry);
    return fullEntry;
  }
}

export const auditRepository = new AuditRepository();

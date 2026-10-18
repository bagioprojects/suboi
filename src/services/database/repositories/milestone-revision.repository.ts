import { databaseEngine } from '../database.engine';
import { IMilestoneRevisionEntity, RevisionStatus } from '@/models/database/entities.types';

export class MilestoneRevisionRepository {
  public getAll(): IMilestoneRevisionEntity[] {
    return databaseEngine.find<IMilestoneRevisionEntity>('revisions');
  }

  public getById(id: string): IMilestoneRevisionEntity | null {
    return databaseEngine.findById<IMilestoneRevisionEntity>('revisions', id);
  }

  public getByProject(projectId: string): IMilestoneRevisionEntity[] {
    return databaseEngine.findByIndex<IMilestoneRevisionEntity>('revisions', 'projectId', projectId);
  }

  public getByMilestone(milestoneId: string): IMilestoneRevisionEntity[] {
    return databaseEngine.findByIndex<IMilestoneRevisionEntity>('revisions', 'milestoneId', milestoneId);
  }

  public getByStatus(status: RevisionStatus): IMilestoneRevisionEntity[] {
    return databaseEngine.findByIndex<IMilestoneRevisionEntity>('revisions', 'status', status);
  }

  public create(data: Omit<IMilestoneRevisionEntity, 'id' | 'requestedAt'>): IMilestoneRevisionEntity {
    const id = 'rev_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newRecord: IMilestoneRevisionEntity = {
      ...data,
      id,
      requestedAt: new Date().toISOString(),
    };
    return databaseEngine.insert<IMilestoneRevisionEntity>('revisions', newRecord);
  }

  public resolveRevision(id: string, notes?: string): IMilestoneRevisionEntity | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const updates: Partial<IMilestoneRevisionEntity> = {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    };
    if (notes) {
      updates.notes = `${existing.notes} | Çözüm: ${notes}`;
    }

    return databaseEngine.update<IMilestoneRevisionEntity>('revisions', id, updates);
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('revisions', id);
  }
}

export const milestoneRevisionRepository = new MilestoneRevisionRepository();

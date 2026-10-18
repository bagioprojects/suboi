import { databaseEngine } from '../database.engine';
import {
  IProjectEntity,
  IDocumentEntity,
  IMediaAssetEntity,
  IMilestoneRevisionEntity,
} from '@/models/database/entities.types';

export interface IProjectFullGraph {
  project: IProjectEntity;
  documents: IDocumentEntity[];
  media: IMediaAssetEntity[];
  revisions: IMilestoneRevisionEntity[];
}

export class ProjectRepository {
  public getAll(clientId?: string): IProjectEntity[] {
    if (clientId) {
      return databaseEngine.findByIndex<IProjectEntity>('projects', 'clientId', clientId);
    }
    return databaseEngine.find<IProjectEntity>('projects');
  }

  public getById(id: string): IProjectEntity | null {
    return databaseEngine.findById<IProjectEntity>('projects', id);
  }

  public getFullGraph(projectId: string): IProjectFullGraph | null {
    const project = this.getById(projectId);
    if (!project) return null;

    const documents = databaseEngine.findByIndex<IDocumentEntity>('documents', 'projectId', projectId);
    const media = databaseEngine.findByIndex<IMediaAssetEntity>('media', 'projectId', projectId);
    const revisions = databaseEngine.findByIndex<IMilestoneRevisionEntity>('revisions', 'projectId', projectId);

    return {
      project,
      documents,
      media,
      revisions,
    };
  }

  public search(query: string): IProjectEntity[] {
    return databaseEngine.search<IProjectEntity>('projects', query, ['title', 'clientName', 'description', 'techStack']);
  }

  public create(data: Omit<IProjectEntity, 'id' | 'createdAt' | 'updatedAt'>): IProjectEntity {
    const now = new Date().toISOString();
    const id = 'proj_' + Date.now().toString(36);
    const newRecord: IProjectEntity = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    return databaseEngine.insert<IProjectEntity>('projects', newRecord);
  }

  public update(id: string, updates: Partial<IProjectEntity>): IProjectEntity | null {
    return databaseEngine.update<IProjectEntity>('projects', id, updates);
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('projects', id);
  }
}

export const projectRepository = new ProjectRepository();

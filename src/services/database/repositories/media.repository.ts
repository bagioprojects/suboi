import { databaseEngine } from '../database.engine';
import { IMediaAssetEntity, MediaType } from '@/models/database/entities.types';

export class MediaRepository {
  public getAll(): IMediaAssetEntity[] {
    return databaseEngine.find<IMediaAssetEntity>('media');
  }

  public getById(id: string): IMediaAssetEntity | null {
    return databaseEngine.findById<IMediaAssetEntity>('media', id);
  }

  public getByProject(projectId: string, type?: MediaType): IMediaAssetEntity[] {
    const assets = databaseEngine.findByIndex<IMediaAssetEntity>('media', 'projectId', projectId);
    if (!type) return assets;
    return assets.filter((m) => m.mediaType === type);
  }

  public create(data: Omit<IMediaAssetEntity, 'id' | 'createdAt'>): IMediaAssetEntity {
    const id = 'med_' + Date.now().toString(36);
    const newRecord: IMediaAssetEntity = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    return databaseEngine.insert<IMediaAssetEntity>('media', newRecord);
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('media', id);
  }
}

export const mediaRepository = new MediaRepository();

import { databaseEngine } from '../database.engine';
import { IServiceCatalogEntity } from '@/models/database/entities.types';

export class ServiceCatalogRepository {
  public getAll(): IServiceCatalogEntity[] {
    return databaseEngine.find<IServiceCatalogEntity>('services');
  }

  public getById(id: string): IServiceCatalogEntity | null {
    return databaseEngine.findById<IServiceCatalogEntity>('services', id);
  }

  public getByCategory(category: string): IServiceCatalogEntity[] {
    return databaseEngine.findByIndex<IServiceCatalogEntity>('services', 'category', category);
  }

  public search(query: string): IServiceCatalogEntity[] {
    return databaseEngine.search<IServiceCatalogEntity>('services', query, ['title', 'description', 'features']);
  }

  public create(data: Omit<IServiceCatalogEntity, 'id'>): IServiceCatalogEntity {
    const newRecord: IServiceCatalogEntity = {
      ...data,
      id: 'srv_' + Date.now().toString(36),
    };
    return databaseEngine.insert<IServiceCatalogEntity>('services', newRecord);
  }

  public update(id: string, updates: Partial<IServiceCatalogEntity>): IServiceCatalogEntity | null {
    return databaseEngine.update<IServiceCatalogEntity>('services', id, updates);
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('services', id);
  }
}

export const serviceCatalogRepository = new ServiceCatalogRepository();

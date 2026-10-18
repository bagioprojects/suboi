import { databaseEngine } from '../database.engine';
import { IUserEntity } from '@/models/database/entities.types';

export class UserRepository {
  public getAll(): IUserEntity[] {
    return databaseEngine.find<IUserEntity>('users');
  }

  public getById(id: string): IUserEntity | null {
    return databaseEngine.findById<IUserEntity>('users', id);
  }

  public findByEmail(email: string): IUserEntity | null {
    const list = databaseEngine.findByIndex<IUserEntity>('users', 'email', email);
    return list[0] || null;
  }

  public getByClient(clientId: string): IUserEntity[] {
    return databaseEngine.findByIndex<IUserEntity>('users', 'clientId', clientId);
  }

  public create(user: Omit<IUserEntity, 'id' | 'createdAt'>): IUserEntity {
    const newRecord: IUserEntity = {
      ...user,
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    return databaseEngine.insert<IUserEntity>('users', newRecord);
  }

  public update(id: string, updates: Partial<IUserEntity>): IUserEntity | null {
    return databaseEngine.update<IUserEntity>('users', id, updates);
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('users', id);
  }
}

export const userRepository = new UserRepository();

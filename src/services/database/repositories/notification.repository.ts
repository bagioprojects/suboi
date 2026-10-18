import { databaseEngine } from '../database.engine';
import { INotificationEntity } from '@/models/database/entities.types';

export class NotificationRepository {
  public getAll(userId?: string): INotificationEntity[] {
    if (userId) {
      return databaseEngine.findByIndex<INotificationEntity>('notifications', 'userId', userId);
    }
    return databaseEngine.find<INotificationEntity>('notifications');
  }

  public getUnread(userId?: string): INotificationEntity[] {
    return this.getAll(userId).filter((n) => !n.read);
  }

  public getById(id: string): INotificationEntity | null {
    return databaseEngine.findById<INotificationEntity>('notifications', id);
  }

  public create(data: Omit<INotificationEntity, 'id' | 'timestamp'>): INotificationEntity {
    const newRecord: INotificationEntity = {
      ...data,
      id: 'notif_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      timestamp: 'Şimdi',
    };
    return databaseEngine.insert<INotificationEntity>('notifications', newRecord);
  }

  public markAsRead(id: string): INotificationEntity | null {
    return databaseEngine.update<INotificationEntity>('notifications', id, { read: true });
  }

  public markAllAsRead(userId?: string): void {
    const items = this.getUnread(userId);
    items.forEach((item) => {
      databaseEngine.update<INotificationEntity>('notifications', item.id, { read: true });
    });
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('notifications', id);
  }
}

export const notificationRepository = new NotificationRepository();

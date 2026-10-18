import { databaseEngine } from '../database.engine';
import {
  IOneOffServiceOrderEntity,
  OrderFulfillmentStatus,
  OrderPaymentStatus,
} from '@/models/database/entities.types';

export class OneOffOrderRepository {
  public getAll(): IOneOffServiceOrderEntity[] {
    return databaseEngine.find<IOneOffServiceOrderEntity>('orders');
  }

  public getById(id: string): IOneOffServiceOrderEntity | null {
    return databaseEngine.findById<IOneOffServiceOrderEntity>('orders', id);
  }

  public getByClient(clientId: string): IOneOffServiceOrderEntity[] {
    return databaseEngine.findByIndex<IOneOffServiceOrderEntity>('orders', 'clientId', clientId);
  }

  public updateStatus(id: string, status: OrderFulfillmentStatus): IOneOffServiceOrderEntity | null {
    const updates: Partial<IOneOffServiceOrderEntity> = { orderStatus: status };
    if (status === 'delivered') {
      updates.deliveredAt = new Date().toISOString();
    }
    return databaseEngine.update<IOneOffServiceOrderEntity>('orders', id, updates);
  }

  public updatePayment(id: string, status: OrderPaymentStatus): IOneOffServiceOrderEntity | null {
    return databaseEngine.update<IOneOffServiceOrderEntity>('orders', id, { paymentStatus: status });
  }

  public create(data: Omit<IOneOffServiceOrderEntity, 'id' | 'orderedAt'>): IOneOffServiceOrderEntity {
    const id = 'ord_' + Date.now().toString(36);
    const newRecord: IOneOffServiceOrderEntity = {
      ...data,
      id,
      orderedAt: new Date().toISOString(),
    };
    return databaseEngine.insert<IOneOffServiceOrderEntity>('orders', newRecord);
  }

  public delete(id: string): boolean {
    return databaseEngine.delete('orders', id);
  }
}

export const oneOffOrderRepository = new OneOffOrderRepository();

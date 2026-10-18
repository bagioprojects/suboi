import { Request, Response } from 'express';
import { backendDb } from '../services/database.service';
import type { IOneOffServiceOrderEntity } from '@shared/types/entities.types';

export class OrderController {
  public getByClient(req: Request, res: Response) {
    const { clientId } = req.query;
    const orders = backendDb.getOrdersByClient(String(clientId || 'cli-001'));
    return res.json({ success: true, data: orders });
  }

  public create(req: Request, res: Response) {
    const body = req.body;
    const newOrder: IOneOffServiceOrderEntity = {
      id: 'ord_' + Date.now().toString(36),
      clientId: body.clientId || 'cli-001',
      serviceId: body.serviceId || 'srv_general',
      serviceTitle: body.serviceTitle || 'Özel Hizmet Talebi',
      category: body.category || 'development',
      priceFormatted: body.priceFormatted || '₺15.000',
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      paymentStatus: 'paid',
      orderStatus: 'queued',
      deliverables: [],
      orderedAt: new Date().toISOString(),
    };

    backendDb.createOrder(newOrder);
    return res.status(201).json({ success: true, data: newOrder });
  }
}

export const orderController = new OrderController();

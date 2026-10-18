import { useState, useCallback, useMemo } from 'react';
import { oneOffOrderRepository } from '@/services/database/repositories/one-off-order.repository';
import { IOneOffServiceOrderEntity } from '@/models/database/entities.types';
import { useAppStore } from '@/core/store/app.store';
import { soundService } from '@/core/audio/sound.service';

export function useOneOffOrdersController() {
  const { user } = useAppStore();
  const [tick, setTick] = useState(0);

  const clientId = user?.id || 'cli-001';

  const orders = useMemo(() => {
    // depend on tick for reactive updates
    const _t = tick;
    return oneOffOrderRepository.getByClient(clientId);
  }, [clientId, tick]);

  const placeOrder = useCallback(
    (params: {
      serviceId: string;
      serviceTitle: string;
      category: 'development' | 'seo_geo' | 'maintenance' | 'ui_ux';
      priceFormatted: string;
    }) => {
      const order = oneOffOrderRepository.create({
        clientId,
        serviceId: params.serviceId,
        serviceTitle: params.serviceTitle,
        category: params.category,
        priceFormatted: params.priceFormatted,
        invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        paymentStatus: 'paid',
        orderStatus: 'queued',
        deliverables: [],
      });

      soundService.playSuccess();
      setTick((prev) => prev + 1);
      return order;
    },
    [clientId]
  );

  return {
    orders,
    placeOrder,
    refreshOrders: () => setTick((p) => p + 1),
  };
}

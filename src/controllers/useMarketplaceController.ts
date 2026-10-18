import { useState, useEffect, useCallback } from 'react';
import {
  ServiceItem,
  ServiceCategory,
  NewProjectWizardValues,
} from '@/models/service-catalog.model';
import { marketplaceService } from '@/services/marketplace.service';
import { useAppStore } from '@/core/store/app.store';

export function useMarketplaceController() {
  const [catalog, setCatalog] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getCatalog();
      setCatalog(data);
    } catch (e) {
      console.warn('Error fetching catalog:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const filteredCatalog = catalog.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const onOpenWizard = (service?: ServiceItem) => {
    setSelectedService(service || null);
    setIsWizardOpen(true);
    setOrderSuccess(false);
  };

  const onCloseWizard = () => {
    setIsWizardOpen(false);
    setSelectedService(null);
    setOrderSuccess(false);
  };

  const onSubmitWizard = async (values: NewProjectWizardValues) => {
    try {
      setSubmitting(true);
      await marketplaceService.createProjectRequest(values);
      useAppStore.getState().addProjectRequest(values);
      setOrderSuccess(true);
    } catch (e) {
      console.warn('Failed to submit project wizard:', e);
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    catalog: filteredCatalog,
    allCount: catalog.length,
    selectedCategory,
    setSelectedCategory,
    loading,
    isWizardOpen,
    selectedService,
    submitting,
    orderSuccess,
    onOpenWizard,
    onCloseWizard,
    onSubmitWizard,
    refresh: fetchCatalog,
  };
}

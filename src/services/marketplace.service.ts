import {
  ServiceItem,
  NewProjectWizardValues,
  mapServiceDTO,
} from '@/models/service-catalog.model';
import { ProjectItem, mapProjectDTO } from '@/models/project.model';
import { serviceCatalogRepository } from './database/repositories/service-catalog.repository';
import { projectRepository } from './database/repositories/project.repository';
import { apiClient } from './api.client';

class MarketplaceService {
  async getCatalog(): Promise<ServiceItem[]> {
    const dbServices = serviceCatalogRepository.getAll();
    if (dbServices.length > 0) {
      const mapped = dbServices.map((s) => ({
        id: s.id,
        title: s.title,
        category: s.category as any,
        priceFormatted: s.priceFormatted,
        deliveryTimeDays: s.turnaroundDays,
        deliveryFormatted: `${s.turnaroundDays} İş Günü`,
        badgeText: s.isPopular ? 'Çok Tercih Edilen' : undefined,
        description: s.description,
        features: s.features,
        popular: s.isPopular,
      }));
      return apiClient.simulateRequest(mapped.map(mapServiceDTO), 30);
    }
    return apiClient.simulateRequest([], 30);
  }

  async createProjectRequest(
    data: NewProjectWizardValues
  ): Promise<ProjectItem> {
    const created = projectRepository.create({
      clientId: 'cli-001',
      clientName: 'Kurumsal Müşteri',
      title: data.projectTitle,
      category: 'mobile_web',
      status: 'in_progress',
      progressPercentage: 5,
      totalBudgetFormatted: '₺75.000',
      spentBudgetFormatted: '₺0',
      startDate: new Date().toLocaleDateString('tr-TR'),
      targetLaunchDate: '30 Gün Sonra',
      description: data.scopeDescription,
      techStack: ['Expo SDK 58', 'React 19'],
    });

    return apiClient.simulateRequest(mapProjectDTO(created), 50);
  }
}

export const marketplaceService = new MarketplaceService();

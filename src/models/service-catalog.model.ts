import { z } from 'zod';

export type ServiceCategory =
  | 'development'
  | 'seo_geo'
  | 'maintenance'
  | 'ui_ux';

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  priceFormatted: string;
  deliveryTimeDays: number;
  deliveryFormatted: string;
  badgeText?: string;
  description: string;
  features: string[];
  imageUrl: string;
  popular?: boolean;
}

export const NewProjectWizardSchema = z.object({
  serviceId: z.string().min(1, 'Hizmet veya proje tipi seçilmelidir'),
  projectTitle: z.string().min(3, 'Proje başlığı en az 3 karakter olmalıdır'),
  scopeDescription: z.string().min(10, 'Lütfen talebinizi detaylandırın (en az 10 karakter)'),
  priority: z.enum(['standard', 'urgent']),
  estimatedBudget: z.string().min(1, 'Bütçe aralığı seçiniz'),
  targetLaunchDate: z.string().min(1, 'Hedef tarih seçiniz'),
  approvedTerms: z.boolean().refine((val) => val === true, {
    message: 'Şartları onaylamanız gerekmektedir',
  }),
});

export type NewProjectWizardValues = z.infer<typeof NewProjectWizardSchema>;

export function mapServiceDTO(raw: any): ServiceItem {
  return {
    id: String(raw.id),
    title: String(raw.title),
    category: raw.category || 'development',
    priceFormatted: String(raw.priceFormatted || 'Özel Teklif'),
    deliveryTimeDays: Number(raw.deliveryTimeDays || 7),
    deliveryFormatted: String(raw.deliveryFormatted || `${raw.deliveryTimeDays || 7} İş Günü`),
    badgeText: raw.badgeText,
    description: String(raw.description || ''),
    features: Array.isArray(raw.features) ? raw.features : [],
    imageUrl: String(raw.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'),
    popular: Boolean(raw.popular),
  };
}

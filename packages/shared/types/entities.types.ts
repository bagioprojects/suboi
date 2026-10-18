/**
 * Hubio Enterprise Monorepo - Shared Relational Entities
 * Shared between Mobile Client, Web Admin, and Backend REST API.
 */

export type DocumentType = 'contract' | 'specification' | 'invoice' | 'nda' | 'deliverable';
export type MediaType = 'image' | 'video' | 'figma' | 'document';
export type RevisionStatus = 'pending' | 'in_progress' | 'resolved';
export type OrderPaymentStatus = 'paid' | 'pending' | 'refunded';
export type OrderFulfillmentStatus = 'queued' | 'in_progress' | 'delivered';
export type UserRole = 'client_admin' | 'client_viewer' | 'hubio_superadmin' | 'hubio_developer';

export interface IProjectEntity {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  category: 'mobile_web' | 'seo_geo' | 'performance' | 'security' | 'cloud';
  status: 'planning' | 'in_progress' | 'client_review' | 'completed';
  progressPercentage: number;
  totalBudgetFormatted: string;
  spentBudgetFormatted: string;
  startDate: string;
  targetLaunchDate: string;
  liveUrl?: string;
  repoUrl?: string;
  techStack: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDocumentEntity {
  id: string;
  projectId: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  mimeType: string;
  version: string;
  isSigned: boolean;
  signedAt?: string;
  signedBy?: string;
  downloadCount: number;
  createdAt: string;
}

export interface IMediaAssetEntity {
  id: string;
  projectId: string;
  title: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl: string;
  durationSeconds?: number;
  resolution?: string;
  width?: number;
  height?: number;
  tags: string[];
  uploaderName: string;
  fileSizeBytes: number;
  createdAt: string;
}

export interface IMilestoneRevisionEntity {
  id: string;
  projectId: string;
  milestoneId: string;
  title: string;
  tag: 'UI/UX' | 'Backend' | 'Content' | 'Performance';
  notes: string;
  attachedMediaUrl?: string;
  status: RevisionStatus;
  requestedAt: string;
  resolvedAt?: string;
}

export interface IDeliverableFile {
  name: string;
  url: string;
  size: string;
}

export interface IOneOffServiceOrderEntity {
  id: string;
  clientId: string;
  serviceId: string;
  serviceTitle: string;
  category: 'development' | 'seo_geo' | 'maintenance' | 'ui_ux';
  priceFormatted: string;
  invoiceNumber: string;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderFulfillmentStatus;
  deliverables: IDeliverableFile[];
  orderedAt: string;
  deliveredAt?: string;
}

export interface IAuditLogEntity {
  id: string;
  entityType: 'project' | 'document' | 'media' | 'revision' | 'order' | 'auth' | 'user' | 'service';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'sign' | 'deliver' | 'login';
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface IUserEntity {
  id: string;
  clientId?: string;
  email: string;
  fullName: string;
  companyTitle?: string;
  userType: 'corporate' | 'individual';
  taxNumber?: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface IServiceCatalogEntity {
  id: string;
  title: string;
  category: 'development' | 'seo_geo' | 'maintenance' | 'ui_ux';
  priceFormatted: string;
  priceAmount: number;
  deliverablesCount: number;
  turnaroundDays: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface INotificationEntity {
  id: string;
  userId?: string;
  title: string;
  message: string;
  category: 'commit' | 'seo' | 'approval' | 'system';
  targetPath: string;
  read: boolean;
  timestamp: string;
}

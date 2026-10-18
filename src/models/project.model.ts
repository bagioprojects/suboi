import { z } from 'zod';

export type ProjectStatus = 'in_progress' | 'client_review' | 'completed' | 'on_hold';
export type ProjectCategory = 'web' | 'mobile' | 'fullstack' | 'seo_geo';
export type MilestoneStatus = 'pending_approval' | 'approved' | 'revision_requested';
export type UpdatePeriod = 'daily' | 'weekly' | 'monthly';

export interface ProjectMilestone {
  id: string;
  projectId: string;
  projectTitle: string;
  period: UpdatePeriod;
  title: string;
  description: string;
  category: 'Performance' | 'Feature' | 'Design' | 'SEO' | 'Security';
  timestamp: string;
  status: MilestoneStatus;
  metricsGain?: string; // e.g. "+%40 Hız Artışı"
  revisionNotes?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  clientName: string;
  category: ProjectCategory;
  status: ProjectStatus;
  progressPercentage: number;
  activeSprint: string;
  lastUpdated: string;
  nextMilestone: string;
  liveUrl?: string;
  repository?: string;
}

export const MilestoneActionSchema = z.object({
  milestoneId: z.string().min(1),
  action: z.enum(['approve', 'request_revision']),
  revisionNote: z.string().optional(),
});

export type MilestoneActionInput = z.infer<typeof MilestoneActionSchema>;

export function mapProjectDTO(raw: any): ProjectItem {
  return {
    id: String(raw.id),
    title: String(raw.title || 'İsimsiz Proje'),
    clientName: String(raw.clientName || 'Kurumsal Müşteri'),
    category: raw.category || 'web',
    status: raw.status || 'in_progress',
    progressPercentage: Number(raw.progressPercentage ?? 0),
    activeSprint: String(raw.activeSprint || 'Faz 1'),
    lastUpdated: String(raw.lastUpdated || 'Bugün'),
    nextMilestone: String(raw.nextMilestone || 'Genel Kontrol'),
    liveUrl: raw.liveUrl,
    repository: raw.repository,
  };
}

export function mapMilestoneDTO(raw: any): ProjectMilestone {
  return {
    id: String(raw.id),
    projectId: String(raw.projectId),
    projectTitle: String(raw.projectTitle || 'Proje'),
    period: raw.period || 'daily',
    title: String(raw.title),
    description: String(raw.description),
    category: raw.category || 'Feature',
    timestamp: String(raw.timestamp || 'Yeni'),
    status: raw.status || 'pending_approval',
    metricsGain: raw.metricsGain,
    revisionNotes: raw.revisionNotes,
  };
}

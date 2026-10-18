export type ChangeCategory =
  | 'Design'
  | 'SEO_GEO'
  | 'Security'
  | 'Performance'
  | 'Feature';

export interface ChangelogItem {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  category: ChangeCategory;
  timestamp: string;
  dateFormatted: string;
  commitHash?: string;
  liveUrl?: string;
  beforeSummary: string;
  afterSummary: string;
  impactScore?: string;
  authorName: string;
  deepLinkPath?: string;
}

export function mapChangelogDTO(raw: any): ChangelogItem {
  return {
    id: String(raw.id),
    projectId: String(raw.projectId || 'prj-101'),
    projectTitle: String(raw.projectTitle || 'Portal'),
    title: String(raw.title),
    category: raw.category || 'Feature',
    timestamp: String(raw.timestamp || 'Yeni'),
    dateFormatted: String(raw.dateFormatted || '17 Ekim 2026'),
    commitHash: raw.commitHash,
    liveUrl: raw.liveUrl,
    beforeSummary: String(raw.beforeSummary || ''),
    afterSummary: String(raw.afterSummary || ''),
    impactScore: raw.impactScore,
    authorName: String(raw.authorName || 'Hubio Lead Dev'),
    deepLinkPath: raw.deepLinkPath,
  };
}

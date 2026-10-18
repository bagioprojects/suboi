import { SeoGeoReport, mapSeoGeoDTO } from '@/models/seo-geo.model';
import { apiClient } from './api.client';

const MOCK_REPORT: SeoGeoReport = {
  id: 'rep-2026-latest',
  siteUrl: 'https://novatech.com.tr',
  lastAudited: 'Bugün 09:30',
  aiGeoScore: 88,
  aiGeoDelta: '+%24 Bu Ay',
  aiEngines: [
    {
      engineName: 'ChatGPT',
      mentionRate: 86,
      citationCount: 168,
      rankPosition: 1.2,
      sentiment: 'positive',
    },
    {
      engineName: 'Perplexity',
      mentionRate: 91,
      citationCount: 210,
      rankPosition: 1.1,
      sentiment: 'positive',
    },
    {
      engineName: 'Google Gemini',
      mentionRate: 84,
      citationCount: 145,
      rankPosition: 1.4,
      sentiment: 'positive',
    },
    {
      engineName: 'Claude',
      mentionRate: 79,
      citationCount: 112,
      rankPosition: 1.6,
      sentiment: 'positive',
    },
  ],
  localGeoScore: 94,
  localGeoDelta: '+%18 Bu Ay',
  topRegions: [
    {
      region: 'İstanbul (Marmara Bölgesi)',
      mapPackRank: 1,
      localKeywordShare: 92,
      callActions: 412,
      directionRequests: 1180,
    },
    {
      region: 'Ankara (İç Anadolu)',
      mapPackRank: 2,
      localKeywordShare: 87,
      callActions: 280,
      directionRequests: 740,
    },
    {
      region: 'İzmir (Ege Bölgesi)',
      mapPackRank: 1,
      localKeywordShare: 89,
      callActions: 310,
      directionRequests: 820,
    },
  ],
  organicMonthlyVisits: 84600,
  organicTrafficDelta: '+%32',
  pageSpeedScore: 97,
  lcpSeconds: 1.1,
  aiGeoTrend: [
    { label: 'Pzt', value: 72, date: '12 Eki' },
    { label: 'Sal', value: 75, date: '13 Eki' },
    { label: 'Çar', value: 81, date: '14 Eki' },
    { label: 'Per', value: 79, date: '15 Eki' },
    { label: 'Cum', value: 85, date: '16 Eki' },
    { label: 'Cmt', value: 87, date: '17 Eki' },
    { label: 'Paz', value: 88, date: 'Bugün' },
  ],
  localGeoTrend: [
    { label: 'Pzt', value: 86, date: '12 Eki' },
    { label: 'Sal', value: 88, date: '13 Eki' },
    { label: 'Çar', value: 89, date: '14 Eki' },
    { label: 'Per', value: 91, date: '15 Eki' },
    { label: 'Cum', value: 93, date: '16 Eki' },
    { label: 'Cmt', value: 94, date: '17 Eki' },
    { label: 'Paz', value: 94, date: 'Bugün' },
  ],
  organicTrend: [
    { label: 'Pzt', value: 68, date: '12 Eki' },
    { label: 'Sal', value: 71, date: '13 Eki' },
    { label: 'Çar', value: 74, date: '14 Eki' },
    { label: 'Per', value: 78, date: '15 Eki' },
    { label: 'Cum', value: 81, date: '16 Eki' },
    { label: 'Cmt', value: 83, date: '17 Eki' },
    { label: 'Paz', value: 86, date: 'Bugün' },
  ],
};

class AnalyticsService {
  async getLatestReport(): Promise<SeoGeoReport> {
    return apiClient.simulateRequest(mapSeoGeoDTO(MOCK_REPORT), 120);
  }
}

export const analyticsService = new AnalyticsService();

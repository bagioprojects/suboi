import { z } from 'zod';

export interface DataPoint {
  label: string;
  value: number;
  date: string;
}

export interface AiGeoEngineMetrics {
  engineName: 'ChatGPT' | 'Google Gemini' | 'Perplexity' | 'Claude';
  mentionRate: number;     // e.g. 78%
  citationCount: number;   // e.g. 142
  rankPosition: number;    // e.g. 1.4
  sentiment: 'positive' | 'neutral';
}

export interface LocalGeoMetrics {
  region: string;
  mapPackRank: number;     // e.g. #1 or #2
  localKeywordShare: number; // e.g. 84%
  callActions: number;     // e.g. 320
  directionRequests: number; // e.g. 890
}

export interface SeoGeoReport {
  id: string;
  siteUrl: string;
  lastAudited: string;
  // Core AI GEO
  aiGeoScore: number;       // 0-100 (e.g. 88)
  aiGeoDelta: string;       // e.g. "+%24 Bu Ay"
  aiEngines: AiGeoEngineMetrics[];
  // Local Map GEO
  localGeoScore: number;    // 0-100 (e.g. 92)
  localGeoDelta: string;    // e.g. "+%18 Bu Ay"
  topRegions: LocalGeoMetrics[];
  // Classic SEO & Web Vitals
  organicMonthlyVisits: number; // e.g. 84200
  organicTrafficDelta: string;  // e.g. "+%31"
  pageSpeedScore: number;       // e.g. 96
  lcpSeconds: number;           // e.g. 1.2
  // Chart Series
  aiGeoTrend: DataPoint[];
  localGeoTrend: DataPoint[];
  organicTrend: DataPoint[];
}

export function mapSeoGeoDTO(raw: any): SeoGeoReport {
  return {
    id: String(raw.id || 'rep-latest'),
    siteUrl: raw.siteUrl || 'https://novatech.com.tr',
    lastAudited: raw.lastAudited || 'Bugün 09:00',
    aiGeoScore: Number(raw.aiGeoScore ?? 88),
    aiGeoDelta: raw.aiGeoDelta || '+%24',
    aiEngines: raw.aiEngines || [],
    localGeoScore: Number(raw.localGeoScore ?? 92),
    localGeoDelta: raw.localGeoDelta || '+%18',
    topRegions: raw.topRegions || [],
    organicMonthlyVisits: Number(raw.organicMonthlyVisits ?? 84200),
    organicTrafficDelta: raw.organicTrafficDelta || '+%31',
    pageSpeedScore: Number(raw.pageSpeedScore ?? 96),
    lcpSeconds: Number(raw.lcpSeconds ?? 1.2),
    aiGeoTrend: raw.aiGeoTrend || [],
    localGeoTrend: raw.localGeoTrend || [],
    organicTrend: raw.organicTrend || [],
  };
}

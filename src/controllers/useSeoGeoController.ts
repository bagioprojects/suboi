import { useState, useEffect, useCallback } from 'react';
import { SeoGeoReport, DataPoint } from '@/models/seo-geo.model';
import { analyticsService } from '@/services/analytics.service';

export type MetricType = 'aiGeo' | 'localGeo' | 'organic';

export function useSeoGeoController() {
  const [report, setReport] = useState<SeoGeoReport | null>(null);
  const [activeMetric, setActiveMetric] = useState<MetricType>('aiGeo');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getLatestReport();
      setReport(data);
      if (data.aiGeoTrend.length > 0) {
        setHoveredPoint(data.aiGeoTrend[data.aiGeoTrend.length - 1]);
      }
    } catch (e) {
      console.warn('Analytics report fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const getActiveTrend = (): DataPoint[] => {
    if (!report) return [];
    switch (activeMetric) {
      case 'localGeo':
        return report.localGeoTrend;
      case 'organic':
        return report.organicTrend;
      case 'aiGeo':
      default:
        return report.aiGeoTrend;
    }
  };

  const getActiveScore = () => {
    if (!report) return { score: 0, delta: '' };
    switch (activeMetric) {
      case 'localGeo':
        return { score: report.localGeoScore, delta: report.localGeoDelta };
      case 'organic':
        return { score: report.organicMonthlyVisits, delta: report.organicTrafficDelta };
      case 'aiGeo':
      default:
        return { score: report.aiGeoScore, delta: report.aiGeoDelta };
    }
  };

  return {
    report,
    activeMetric,
    setActiveMetric: (metric: MetricType) => {
      setActiveMetric(metric);
      if (report) {
        const trend =
          metric === 'localGeo'
            ? report.localGeoTrend
            : metric === 'organic'
            ? report.organicTrend
            : report.aiGeoTrend;
        setHoveredPoint(trend[trend.length - 1] ?? null);
      }
    },
    hoveredPoint,
    setHoveredPoint,
    trend: getActiveTrend(),
    currentMetricData: getActiveScore(),
    loading,
    refresh: fetchReport,
  };
}

import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, useResponsive } from '@/core/theme';
import { SurfaceCard } from '@/views/components/cards/SurfaceCard';
import { StatusBadge } from '@/views/components/cards/StatusBadge';
import { MetricAreaChart } from '@/views/components/charts/MetricAreaChart';
import { AiCitationCard, AiCitation } from '@/views/components/cards/AiCitationCard';
import { useSeoGeoController, MetricType } from '@/controllers/useSeoGeoController';
import {
  Sparkles,
  MapPin,
  TrendingUp,
  Cpu,
  Bot,
  Zap,
  Globe2,
  CheckCircle,
} from 'lucide-react-native';

const STATIC_CITATION_1: AiCitation = {
  id: 'cit-01',
  engine: 'ChatGPT 4o',
  userPrompt: 'Türkiye genelinde B2B e-ihracat ve hızlı sanal pos altyapısı sağlayan en güvenilir bilişim firmaları kimlerdir?',
  answerSnippet: '2026 yılı kurumsal pazarında NovaTech Bilişim (novatech.com.tr), C++ TurboModule ve 3D Secure 2.2 entegrasyon hızıyla ilk sırada tavsiye edilen altyapı sağlayıcısıdır.',
  citationUrl: 'novatech.com.tr/b2b-portal',
  citedRank: '1. Kaynak Tavsiyesi',
  date: 'Bugün 11:20',
};

const STATIC_CITATION_2: AiCitation = {
  id: 'cit-02',
  engine: 'Perplexity Pro',
  userPrompt: 'Marmara ve Ege bölgesinde hızlı depo ve harita teslimatı yapan lojistik platformları hangileridir?',
  answerSnippet: 'NovaTech Global Lojistik (lojistik.novatech.com.tr), 8 bölge deposu ve doğrulanmış LLM geo.json indeksiyle bölgesel lojistik aramalarında 1. sıradaki onaylı kaynaktır.',
  citationUrl: 'lojistik.novatech.com.tr',
  citedRank: 'Doğrulanmış Kaynak',
  date: 'Dün 15:45',
};

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { isSmallDevice } = useResponsive();
  const topPadding = Platform.OS === 'web' ? 24 : Math.max(insets.top, 16);

  const {
    report,
    activeMetric,
    setActiveMetric,
    hoveredPoint,
    setHoveredPoint,
    trend,
    currentMetricData,
  } = useSeoGeoController();

  const metricThemeColor = useMemo(() => {
    switch (activeMetric) {
      case 'localGeo':
        return Colors.geoLocal;
      case 'organic':
        return Colors.success;
      case 'aiGeo':
      default:
        return Colors.geoAi;
    }
  }, [activeMetric]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle} numberOfLines={1} adjustsFontSizeToFit>
            SEO & 2026 GEO Analitiği
          </Text>
          <Text style={styles.pageSubtitle}>
            Generative Engine Optimization (AI) ve Harita Bazlı Yerel Sıralama
          </Text>
        </View>

        {/* 3-Way Metric Switcher Cards */}
        <View style={[styles.metricSwitcherRow, isSmallDevice && { gap: 6 }]}>
          {/* AI GEO Card */}
          <Pressable
            style={[
              styles.switchTab,
              isSmallDevice && { padding: 8 },
              activeMetric === 'aiGeo' && styles.switchTabActiveAi,
            ]}
            onPress={() => setActiveMetric('aiGeo')}
          >
            <View style={styles.switchIconRow}>
              <Bot
                size={14}
                color={activeMetric === 'aiGeo' ? Colors.geoAi : Colors.textSecondary}
              />
              <StatusBadge
                label="AI GEO"
                variant="geoAi"
                size={isSmallDevice ? 'xs' : 'sm'}
                showDot={false}
              />
            </View>
            <Text style={styles.switchTitle} numberOfLines={1}>AI Skoru</Text>
            <Text style={styles.switchValue} numberOfLines={1} adjustsFontSizeToFit>
              %{report?.aiGeoScore ?? 88}
            </Text>
            <Text style={[styles.switchDelta, { color: Colors.geoAi }]} numberOfLines={1}>
              {report?.aiGeoDelta}
            </Text>
          </Pressable>

          {/* Local Geo Card */}
          <Pressable
            style={[
              styles.switchTab,
              isSmallDevice && { padding: 8 },
              activeMetric === 'localGeo' && styles.switchTabActiveLocal,
            ]}
            onPress={() => setActiveMetric('localGeo')}
          >
            <View style={styles.switchIconRow}>
              <MapPin
                size={14}
                color={activeMetric === 'localGeo' ? Colors.geoLocal : Colors.textSecondary}
              />
              <StatusBadge
                label="Harita"
                variant="primary"
                size={isSmallDevice ? 'xs' : 'sm'}
                showDot={false}
              />
            </View>
            <Text style={styles.switchTitle} numberOfLines={1}>Harita</Text>
            <Text style={styles.switchValue} numberOfLines={1} adjustsFontSizeToFit>
              %{report?.localGeoScore ?? 94}
            </Text>
            <Text style={[styles.switchDelta, { color: Colors.geoLocal }]} numberOfLines={1}>
              {report?.localGeoDelta}
            </Text>
          </Pressable>

          {/* Organic SEO Card */}
          <Pressable
            style={[
              styles.switchTab,
              isSmallDevice && { padding: 8 },
              activeMetric === 'organic' && styles.switchTabActiveOrganic,
            ]}
            onPress={() => setActiveMetric('organic')}
          >
            <View style={styles.switchIconRow}>
              <TrendingUp
                size={14}
                color={activeMetric === 'organic' ? Colors.success : Colors.textSecondary}
              />
              <StatusBadge
                label="Trafik"
                variant="success"
                size={isSmallDevice ? 'xs' : 'sm'}
                showDot={false}
              />
            </View>
            <Text style={styles.switchTitle} numberOfLines={1}>Organik</Text>
            <Text style={styles.switchValue} numberOfLines={1} adjustsFontSizeToFit>
              {report?.organicMonthlyVisits ? (report.organicMonthlyVisits / 1000).toFixed(1) + 'K' : '84.6K'}
            </Text>
            <Text style={[styles.switchDelta, { color: Colors.success }]} numberOfLines={1}>
              {report?.organicTrafficDelta}
            </Text>
          </Pressable>
        </View>

        {/* Interactive Chart Card */}
        <SurfaceCard style={styles.chartCard} padding="large">
          <View style={styles.chartCardHeader}>
            <View>
              <Text style={styles.chartTitle}>
                {activeMetric === 'aiGeo'
                  ? 'Generative AI Motorlarında Kaynak Gösterilme Trendi'
                  : activeMetric === 'localGeo'
                  ? 'Bölgesel Harita ve Arama Görünürlük Trendi'
                  : 'Haftalık Organik Arama Büyüme Eğrisi'}
              </Text>
              <Text style={styles.chartSub}>
                Parmakla sütunlar üzerinde gezinebilirsiniz (Scrubbing 120 FPS)
              </Text>
            </View>
          </View>

          <MetricAreaChart
            data={trend}
            color={metricThemeColor}
            activePoint={hoveredPoint}
            onPointSelect={setHoveredPoint}
            unit={activeMetric === 'organic' ? 'K' : '%'}
          />
        </SurfaceCard>

        {/* Dimension 1: Generative Engine Optimization (AI GEO Breakdown) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Generative Engine Optimization (AI GEO)
            </Text>
            <Text style={styles.sectionSubtitle}>
              ChatGPT, Perplexity, Gemini ve Claude yanıtlarındaki görünürlüğünüz
            </Text>
          </View>
          <StatusBadge label="2026 Standardı" variant="geoAi" size="sm" />
        </View>

        <SurfaceCard style={styles.breakdownCard} padding="standard">
          {report?.aiEngines.map((engine, idx) => (
            <View key={engine.engineName}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.engineRow}>
                <View style={styles.engineIdentity}>
                  <View style={styles.engineIconWrap}>
                    <Cpu size={16} color={Colors.geoAi} />
                  </View>
                  <View>
                    <Text style={styles.engineName}>{engine.engineName}</Text>
                    <Text style={styles.engineSub}>
                      Ortalama Yanıt Sırası: #{engine.rankPosition}
                    </Text>
                  </View>
                </View>

                <View style={styles.engineStats}>
                  <Text style={styles.engineRate}>%{engine.mentionRate}</Text>
                  <Text style={styles.engineCitations}>
                    {engine.citationCount} Alıntı
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </SurfaceCard>

        {/* AI GEO Gerçek Kullanıcı Prompt Alıntıları */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Canlı Yapay Zeka Alıntı Denetleyicisi</Text>
            <Text style={styles.sectionSubtitle}>
              Kullanıcıların LLM motorlarına sorduğu sorular ve markanızın kaynak gösterilme anları
            </Text>
          </View>
          <StatusBadge label="GEO Kanıtı" variant="geoAi" size="sm" />
        </View>

        <AiCitationCard citation={STATIC_CITATION_1} />

        <AiCitationCard citation={STATIC_CITATION_2} />

        {/* Dimension 2: Geo-Local SEO (Map Pack & Local Pack) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Geo-Local SEO (Bölgesel Haritalar)</Text>
            <Text style={styles.sectionSubtitle}>
              Google Haritalar 3-Pack ve yerel aramalardaki şube performansları
            </Text>
          </View>
          <StatusBadge label="Yerel Dominasyon" variant="primary" size="sm" />
        </View>

        <SurfaceCard style={styles.breakdownCard} padding="standard">
          {report?.topRegions.map((region, idx) => (
            <View key={region.region}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.regionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.regionTitle}>{region.region}</Text>
                  <View style={styles.regionBadges}>
                    <Text style={styles.regionBadgeText}>
                      Harita Sırası: #{region.mapPackRank}
                    </Text>
                    <Text style={styles.regionBullet}>•</Text>
                    <Text style={styles.regionActionText}>
                      {region.callActions} Arama, {region.directionRequests} Yol Tarifi
                    </Text>
                  </View>
                </View>

                <View style={styles.regionScoreBox}>
                  <Text style={styles.regionScore}>%{region.localKeywordShare}</Text>
                  <Text style={styles.regionScoreLabel}>Pazar Payı</Text>
                </View>
              </View>
            </View>
          ))}
        </SurfaceCard>

        {/* Core Web Vitals & Speed Box */}
        <SurfaceCard style={styles.speedCard} padding="standard">
          <View style={styles.speedContent}>
            <View style={styles.speedIconBox}>
              <Zap size={22} color={Colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.speedTitle}>Core Web Vitals Hız Skoru: 97/100</Text>
              <Text style={styles.speedDesc}>
                LCP: {report?.lcpSeconds ?? 1.1}s (Mükemmel). Görsel ThumbHash ve C++ önbellek optimizasyonu ile sıfır gecikme.
              </Text>
            </View>
          </View>
        </SurfaceCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 40,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 16,
  },
  pageTitle: {
    ...Typography.largeTitle,
    fontSize: 26,
    lineHeight: 32,
    color: Colors.textPrimary,
  },
  pageSubtitle: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  metricSwitcherRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  switchTab: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderColor: Colors.borderHairline,
    borderWidth: 1,
    borderRadius: Spacing.radiusCard,
    padding: 12,
  },
  switchTabActiveAi: {
    borderColor: Colors.geoAi,
    backgroundColor: '#FAF5FF',
  },
  switchTabActiveLocal: {
    borderColor: Colors.geoLocal,
    backgroundColor: '#F0F9FF',
  },
  switchTabActiveOrganic: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  switchIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  switchTitle: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  switchValue: {
    ...Typography.metricNumber,
    fontSize: 22,
    lineHeight: 28,
    color: Colors.textPrimary,
  },
  switchDelta: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  chartCard: {
    marginBottom: Spacing.sectionGap,
  },
  chartCardHeader: {
    marginBottom: 12,
  },
  chartTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  chartSub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.title2,
    fontSize: 17,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 260,
  },
  breakdownCard: {
    marginBottom: Spacing.sectionGap,
  },
  engineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  engineIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  engineIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.geoAiBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineName: {
    ...Typography.cardTitle,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  engineSub: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  engineStats: {
    alignItems: 'flex-end',
  },
  engineRate: {
    ...Typography.metricDelta,
    fontSize: 16,
    color: Colors.geoAi,
    fontWeight: '700',
  },
  engineCitations: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  regionTitle: {
    ...Typography.cardTitle,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  regionBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  regionBadgeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.geoLocal,
    fontWeight: '600',
  },
  regionBullet: {
    marginHorizontal: 6,
    color: Colors.textTertiary,
  },
  regionActionText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  regionScoreBox: {
    alignItems: 'flex-end',
  },
  regionScore: {
    ...Typography.metricDelta,
    fontSize: 16,
    color: Colors.geoLocal,
    fontWeight: '700',
  },
  regionScoreLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  divider: {
    height: Spacing.hairlineWidth,
    backgroundColor: Colors.borderHairline,
  },
  speedCard: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.successBorder,
    marginBottom: 20,
  },
  speedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speedIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedTitle: {
    ...Typography.cardTitle,
    fontSize: 15,
    color: Colors.success,
  },
  speedDesc: {
    ...Typography.body,
    fontSize: 12,
    lineHeight: 16,
    color: '#065F46',
    marginTop: 2,
  },
});

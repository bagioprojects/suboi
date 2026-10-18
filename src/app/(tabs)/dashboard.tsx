import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, useResponsive } from '@/core/theme';
import { AppButton } from '@/views/components/buttons/AppButton';
import { SurfaceCard } from '@/views/components/cards/SurfaceCard';
import { StatusBadge } from '@/views/components/cards/StatusBadge';
import { ProjectCard } from '@/views/components/cards/ProjectCard';
import { ProfileSheet } from '@/views/components/modals/ProfileSheet';
import { useDashboardController } from '@/controllers/useDashboardController';
import { useAuthController } from '@/controllers/useAuthController';
import { ProjectItem } from '@/models/project.model';
import {
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Bell,
  Sparkles,
  GitCommit,
} from 'lucide-react-native';

const DashboardProjectItem = React.memo(
  ({
    item,
    onSelect,
  }: {
    item: ProjectItem;
    onSelect: (id: string) => void;
  }) => {
    const handlePress = React.useCallback(() => {
      onSelect(item.id);
    }, [item.id, onSelect]);

    return <ProjectCard project={item} onPressDetails={handlePress} />;
  }
);

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthController();
  const {
    summary,
    projects,
    loading,
    refreshing,
    onRefresh,
    simulateNewDeployWebhook,
    simulateSeoReportWebhook,
  } = useDashboardController();

  const insets = useSafeAreaInsets();
  const { isSmallDevice } = useResponsive();
  const topPadding = Platform.OS === 'web' ? 24 : Math.max(insets.top, 16);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleOpenProjectsTab = React.useCallback(() => {
    router.push('/(tabs)/projects');
  }, [router]);

  const handleOpenMarketplace = React.useCallback(() => {
    router.push('/(tabs)/marketplace');
  }, [router]);

  const handleOpenChangelog = React.useCallback(() => {
    router.push('/(tabs)/changelog');
  }, [router]);

  const handleOpenProject = React.useCallback(
    (projectId: string) => {
      router.push(`/project/${projectId}` as any);
    },
    [router]
  );

  const topProjects = React.useMemo(() => projects.slice(0, 2), [projects]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Executive Welcome Bar */}
        <View style={styles.headerBar}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.clientSubtitle}>
              {user?.companyTitle || 'Kurumsal Portalı'}
            </Text>
            <Text
              style={styles.clientGreeting}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Merhaba, {user?.fullName || 'Değerli Müşterimiz'}
            </Text>
          </View>
          <Pressable
            onPress={() => setIsProfileOpen(true)}
            style={styles.headerBadges}
          >
            <StatusBadge
              label={user?.userType === 'corporate' ? 'Kurumsal VIP' : 'Bireysel'}
              variant="accent"
              size="sm"
            />
          </Pressable>
        </View>

        {/* Primary CTA Banner (High CTR Electric Cobalt) */}
        <SurfaceCard style={styles.ctaBanner} padding="large" variant="default">
          <View style={styles.ctaContent}>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Yeni Geliştirme Talebi</Text>
              <Text style={styles.ctaDescription}>
                Web sitenize veya mobil uygulamanıza anında yeni özellik, SEO çalışması veya tasarım revizyonu başlatın.
              </Text>
            </View>
            <View style={styles.ctaButtonWrapper}>
              <AppButton
                title="+ Yeni Proje / Görev Başlat"
                variant="primary"
                size="md"
                onPress={handleOpenMarketplace}
                icon={<Plus size={16} color={Colors.textInverse} />}
              />
            </View>
          </View>
        </SurfaceCard>

        {/* Executive KPI Overview Cards */}
        <View style={[styles.kpiGrid, isSmallDevice && { gap: 6 }]}>
          <SurfaceCard style={styles.kpiCard} padding="compact">
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel} numberOfLines={1}>Aktif Projeler</Text>
              <View style={[styles.kpiIconWrap, { backgroundColor: Colors.primaryLight }]}>
                <Clock size={12} color={Colors.primary} />
              </View>
            </View>
            <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
              {summary?.activeProjectsCount ?? 3}
            </Text>
            <Text style={styles.kpiSub} numberOfLines={1}>Tüm fazlar aktif</Text>
          </SurfaceCard>

          <SurfaceCard style={styles.kpiCard} padding="compact">
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel} numberOfLines={1}>Haftalık Görev</Text>
              <View style={[styles.kpiIconWrap, { backgroundColor: Colors.successBg }]}>
                <CheckCircle2 size={12} color={Colors.success} />
              </View>
            </View>
            <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
              {summary?.completedTasksCount ?? 42}
            </Text>
            <Text style={[styles.kpiSub, { color: Colors.success }]} numberOfLines={1}>
              {summary?.weeklyVelocity ?? '+%14 Artış'}
            </Text>
          </SurfaceCard>

          <SurfaceCard style={styles.kpiCard} padding="compact">
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel} numberOfLines={1}>Ortalama</Text>
              <View style={[styles.kpiIconWrap, { backgroundColor: Colors.accentLight }]}>
                <TrendingUp size={12} color={Colors.accent} />
              </View>
            </View>
            <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
              %{summary?.averageProgress ?? 72}
            </Text>
            <Text style={styles.kpiSub} numberOfLines={1}>Genel takvimde</Text>
          </SurfaceCard>
        </View>

        {/* Section: Aktif Projeler */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Aktif Geliştirme Projeleri</Text>
            <Text style={styles.sectionSubtitle}>
              Mevcut web ve mobil altyapı ilerleme durumu
            </Text>
          </View>
          <AppButton
            title="Tümünü Gör"
            variant="ghost"
            size="sm"
            onPress={handleOpenProjectsTab}
          />
        </View>

        {topProjects.map((item) => (
          <DashboardProjectItem
            key={item.id}
            item={item}
            onSelect={handleOpenProject}
          />
        ))}

        {/* Section: Canlı Webhook & Kuyruk Test İstasyonu */}
        <SurfaceCard style={styles.webhookTestCard} padding="standard">
          <View style={styles.webhookHeader}>
            <Bell size={16} color={Colors.warning} />
            <Text style={styles.webhookTitle}>2026 Canlı Webhook & Push Test İstasyonu</Text>
          </View>
          <Text style={styles.webhookDesc}>
            Müşteri web sitesinde bir Git push veya SEO sıralama artışı olduğunda tetiklenen anlık bildirim ve derin bağlantıyı test edin:
          </Text>
          <View style={styles.webhookBtnRow}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <AppButton
                title="Git Deploy Tetikle"
                variant="outline"
                size="sm"
                onPress={simulateNewDeployWebhook}
                icon={<GitCommit size={13} color={Colors.primary} />}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <AppButton
                title="AI GEO Uyarısı"
                variant="outline"
                size="sm"
                onPress={simulateSeoReportWebhook}
                icon={<Sparkles size={13} color={Colors.geoAi} />}
              />
            </View>
          </View>
        </SurfaceCard>

        {/* Section: Son Canlı Değişiklik Bildirimleri (Changelog Preview) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Son Canlı Değişiklikler</Text>
            <Text style={styles.sectionSubtitle}>
              Sitenizde yayına alınan son güncellemeler
            </Text>
          </View>
          <AppButton
            title="Geçmiş"
            variant="ghost"
            size="sm"
            onPress={handleOpenChangelog}
          />
        </View>

        <SurfaceCard style={styles.feedCard} padding="standard">
          <View style={styles.feedItem}>
            <View style={[styles.feedDot, { backgroundColor: Colors.success }]} />
            <View style={{ flex: 1 }}>
              <View style={styles.feedTitleRow}>
                <Text style={styles.feedTitle}>Ödeme Sayfası 3D Secure 2.2 Yayında</Text>
                <Text style={styles.feedTime}>Bugün 14:32</Text>
              </View>
              <Text style={styles.feedDesc}>
                Iyzico ve Garanti BBVA C++ TurboModule entegrasyonu tamamlandı.
              </Text>
            </View>
          </View>

          <View style={styles.feedDivider} />

          <View style={styles.feedItem}>
            <View style={[styles.feedDot, { backgroundColor: Colors.primary }]} />
            <View style={{ flex: 1 }}>
              <View style={styles.feedTitleRow}>
                <Text style={styles.feedTitle}>Core Web Vitals & LCP Optimizasyonu</Text>
                <Text style={styles.feedTime}>Dün 16:40</Text>
              </View>
              <Text style={styles.feedDesc}>
                ThumbHash görsel sıkıştırma ile mobil açılış skoru 94 puana yükseltildi.
              </Text>
            </View>
          </View>

          <View style={styles.feedDivider} />

          <View style={styles.feedItem}>
            <View style={[styles.feedDot, { backgroundColor: Colors.accent }]} />
            <View style={{ flex: 1 }}>
              <View style={styles.feedTitleRow}>
                <Text style={styles.feedTitle}>AI GEO & Harita Schema Güncellemesi</Text>
                <Text style={styles.feedTime}>14 Eki</Text>
              </View>
              <Text style={styles.feedDesc}>
                8 şube Google Haritalar ve Perplexity LLM crawler için geo.json indekslendi.
              </Text>
            </View>
          </View>
        </SurfaceCard>
      </ScrollView>

      <ProfileSheet
        visible={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clientSubtitle: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clientGreeting: {
    ...Typography.title2,
    fontSize: 22,
    lineHeight: 28,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaBanner: {
    marginBottom: Spacing.sectionGap,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
  },
  ctaContent: {
    flexDirection: 'column',
    gap: 12,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    ...Typography.cardTitle,
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ctaDescription: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  ctaButtonWrapper: {
    alignSelf: 'flex-start',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.sectionGap,
  },
  kpiCard: {
    flex: 1,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  kpiLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  kpiIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    ...Typography.metricNumber,
    fontSize: 24,
    lineHeight: 30,
    color: Colors.textPrimary,
  },
  kpiSub: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.title2,
    fontSize: 18,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  webhookTestCard: {
    marginBottom: Spacing.sectionGap,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  webhookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  webhookTitle: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '700',
  },
  webhookDesc: {
    ...Typography.body,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  webhookBtnRow: {
    flexDirection: 'row',
  },
  feedCard: {
    marginBottom: 20,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  feedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  feedTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  feedTitle: {
    ...Typography.cardTitle,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.textPrimary,
    flex: 1,
  },
  feedTime: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
  feedDesc: {
    ...Typography.body,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
  },
  feedDivider: {
    height: Spacing.hairlineWidth,
    backgroundColor: Colors.borderHairline,
    marginVertical: 12,
  },
});

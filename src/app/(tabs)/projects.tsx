import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SegmentedPeriodControl } from '@/views/components/buttons/SegmentedPeriodControl';
import { MilestoneItem } from '@/views/components/timelines/MilestoneItem';
import { RevisionModal } from '@/views/components/modals/RevisionModal';
import { useProjectTrackerController } from '@/controllers/useProjectTrackerController';
import { ProjectMilestone } from '@/models/project.model';
import { History, CheckCircle, Clock } from 'lucide-react-native';

export default function ProjectsTrackerScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 24 : Math.max(insets.top, 16);

  const {
    selectedPeriod,
    setSelectedPeriod,
    milestones,
    loading,
    actionLoadingId,
    onApproveMilestone,
    onRequestRevision,
  } = useProjectTrackerController();

  const [activeRevisionMilestone, setActiveRevisionMilestone] = React.useState<ProjectMilestone | null>(null);

  const handleOpenRevision = React.useCallback((id: string) => {
    const item = milestones.find((m) => m.id === id);
    if (item) {
      setActiveRevisionMilestone(item);
    }
  }, [milestones]);

  const handleSubmitRevision = React.useCallback((id: string, note: string) => {
    onRequestRevision(id, note);
    setActiveRevisionMilestone(null);
  }, [onRequestRevision]);

  const keyExtractor = React.useCallback((item: ProjectMilestone) => item.id, []);

  const renderMilestoneItem = React.useCallback(
    ({ item }: { item: ProjectMilestone }) => (
      <MilestoneItem
        milestone={item}
        onApprove={onApproveMilestone}
        onRequestRevision={handleOpenRevision}
        isLoading={actionLoadingId === item.id}
      />
    ),
    [onApproveMilestone, handleOpenRevision, actionLoadingId]
  );

  const pendingCount = React.useMemo(
    () => milestones.filter((m) => m.status === 'pending_approval').length,
    [milestones]
  );

  const renderHeader = React.useMemo(() => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.mainTitle} numberOfLines={1} adjustsFontSizeToFit>
            Geliştirme Takibi
          </Text>
          <Text style={styles.subtitle}>
            Web ve mobil projelerinizdeki canlı sprint ilerlemeleri
          </Text>
        </View>
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Clock size={12} color={Colors.warning} />
            <Text style={styles.pendingBadgeText}>{pendingCount} Onay Bekliyor</Text>
          </View>
        )}
      </View>

      {/* Segmented Period Switcher (Günlük / Haftalık / Aylık) */}
      <View style={styles.periodSwitcherWrapper}>
        <SegmentedPeriodControl
          selected={selectedPeriod}
          onChange={setSelectedPeriod}
        />
      </View>

      <View style={styles.timelineLegend}>
        <History size={14} color={Colors.textTertiary} />
        <Text style={styles.legendText}>
          {selectedPeriod === 'daily'
            ? 'Son 24 saatteki canlı sprint teslimleri'
            : selectedPeriod === 'weekly'
            ? 'Bu haftaki modül ve altyapı güncellemeleri'
            : 'Aylık konsolide büyüme ve teknik raporlar'}
        </Text>
      </View>
    </View>
  ), [pendingCount, selectedPeriod, setSelectedPeriod]);

  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Geliştirmeler yükleniyor...</Text>
          </View>
        ) : (
          <FlashList
            data={milestones}
            keyExtractor={keyExtractor}
            renderItem={renderMilestoneItem}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={[styles.listContent, { paddingTop: topPadding }]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <RevisionModal
        visible={!!activeRevisionMilestone}
        milestoneId={activeRevisionMilestone?.id || ''}
        milestoneTitle={activeRevisionMilestone?.title || ''}
        onClose={() => setActiveRevisionMilestone(null)}
        onSubmit={handleSubmitRevision}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listWrapper: {
    flex: 1,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  listContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: Spacing.cardGap,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mainTitle: {
    ...Typography.largeTitle,
    fontSize: 26,
    lineHeight: 32,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warningBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingBadgeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '700',
  },
  periodSwitcherWrapper: {
    marginBottom: 14,
  },
  timelineLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  legendText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textTertiary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  loadingText: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});

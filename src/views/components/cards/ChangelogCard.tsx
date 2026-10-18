import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { ChangelogItem } from '@/models/changelog.model';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SurfaceCard } from './SurfaceCard';
import { StatusBadge } from './StatusBadge';
import { AppButton } from '../buttons/AppButton';
import {
  ExternalLink,
  GitCommit,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';

interface ChangelogCardProps {
  item: ChangelogItem;
  onOpenDeepLink?: (path?: string) => void;
}

const ChangelogCardComponent: React.FC<ChangelogCardProps> = ({
  item,
  onOpenDeepLink,
}) => {
  const getCategoryBadge = () => {
    switch (item.category) {
      case 'SEO_GEO':
        return <StatusBadge label="SEO & AI GEO" variant="geoAi" size="sm" />;
      case 'Performance':
        return <StatusBadge label="Performans" variant="success" size="sm" />;
      case 'Security':
        return <StatusBadge label="Güvenlik" variant="accent" size="sm" />;
      case 'Design':
        return <StatusBadge label="UI / UX" variant="warning" size="sm" />;
      default:
        return <StatusBadge label="Yeni Özellik" variant="primary" size="sm" />;
    }
  };

  const handleOpenLiveUrl = () => {
    if (item.liveUrl) {
      Linking.openURL(item.liveUrl).catch(() => {});
    }
  };

  return (
    <SurfaceCard style={styles.card} padding="standard">
      {/* Header */}
      <View style={styles.headerRow}>
        {getCategoryBadge()}
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>

      {/* Meta Bar */}
      <View style={styles.metaBar}>
        <View style={styles.commitWrap}>
          <GitCommit size={13} color={Colors.textTertiary} />
          <Text style={styles.commitHash}>{item.commitHash || 'master'}</Text>
        </View>
        <Text style={styles.metaAuthor}>• {item.authorName}</Text>
        {item.impactScore && (
          <View style={styles.impactBadge}>
            <Text style={styles.impactText}>🚀 {item.impactScore}</Text>
          </View>
        )}
      </View>

      {/* Before / After Comparison Box */}
      <View style={styles.comparisonBox}>
        {/* Before */}
        <View style={styles.diffSection}>
          <View style={styles.diffHeader}>
            <View style={[styles.diffIndicator, { backgroundColor: '#F87171' }]} />
            <Text style={[styles.diffLabel, { color: '#B91C1C' }]}>
              Önceki Durum (Before)
            </Text>
          </View>
          <Text style={styles.diffText}>{item.beforeSummary}</Text>
        </View>

        <View style={styles.diffDivider} />

        {/* After */}
        <View style={styles.diffSection}>
          <View style={styles.diffHeader}>
            <View style={[styles.diffIndicator, { backgroundColor: '#34D399' }]} />
            <Text style={[styles.diffLabel, { color: '#047857' }]}>
              Yayına Alınan Değişiklik (After)
            </Text>
          </View>
          <Text style={styles.diffText}>{item.afterSummary}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {item.liveUrl && (
          <AppButton
            title="Canlı Önizleme"
            variant="outline"
            size="sm"
            onPress={handleOpenLiveUrl}
            icon={<ExternalLink size={13} color={Colors.textPrimary} />}
          />
        )}
        <View style={{ flex: 1 }} />
        {item.deepLinkPath && (
          <AppButton
            title="Rapor Detayı"
            variant="ghost"
            size="sm"
            onPress={() => onOpenDeepLink?.(item.deepLinkPath)}
            icon={<ArrowRight size={13} color={Colors.primary} />}
            iconPosition="right"
          />
        )}
      </View>
    </SurfaceCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.cardGap,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    ...Typography.footnote,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  title: {
    ...Typography.cardTitle,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  commitWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commitHash: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
  },
  metaAuthor: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  impactBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  impactText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  comparisonBox: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.borderHairline,
    borderWidth: 1,
    borderRadius: Spacing.radiusInner,
    padding: 10,
    marginBottom: 12,
  },
  diffSection: {
    paddingVertical: 2,
  },
  diffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  diffIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  diffLabel: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  diffText: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  diffDivider: {
    height: 1,
    backgroundColor: Colors.borderHairline,
    marginVertical: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export const ChangelogCard = React.memo(ChangelogCardComponent);


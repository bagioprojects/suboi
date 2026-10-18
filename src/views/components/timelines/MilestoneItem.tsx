import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProjectMilestone } from '@/models/project.model';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SurfaceCard } from '../cards/SurfaceCard';
import { StatusBadge } from '../cards/StatusBadge';
import { AppButton } from '../buttons/AppButton';
import { Check, RotateCcw, Zap, Shield, Search, Sparkles } from 'lucide-react-native';

interface MilestoneItemProps {
  milestone: ProjectMilestone;
  onApprove: (id: string) => void;
  onRequestRevision: (id: string) => void;
  isLoading?: boolean;
}

const MilestoneItemComponent: React.FC<MilestoneItemProps> = ({
  milestone,
  onApprove,
  onRequestRevision,
  isLoading = false,
}) => {
  const getCategoryIcon = () => {
    switch (milestone.category) {
      case 'Performance':
        return <Zap size={13} color={Colors.warning} />;
      case 'Security':
        return <Shield size={13} color={Colors.accent} />;
      case 'SEO':
        return <Search size={13} color={Colors.success} />;
      default:
        return <Sparkles size={13} color={Colors.primary} />;
    }
  };

  const getStatusBadge = () => {
    switch (milestone.status) {
      case 'approved':
        return <StatusBadge label="Müşteri Onayladı" variant="success" size="sm" />;
      case 'revision_requested':
        return <StatusBadge label="Revize İstendi" variant="warning" size="sm" />;
      case 'pending_approval':
      default:
        return <StatusBadge label="Onay Bekliyor" variant="primary" size="sm" />;
    }
  };

  return (
    <SurfaceCard style={styles.card} padding="standard">
      <View style={styles.headerRow}>
        <View style={styles.projectTagContainer}>
          {getCategoryIcon()}
          <Text style={styles.projectTagText} numberOfLines={1} ellipsizeMode="tail">
            {milestone.projectTitle}
          </Text>
        </View>
        <Text style={styles.timeText}>{milestone.timestamp}</Text>
      </View>

      <Text style={styles.title}>{milestone.title}</Text>
      <Text style={styles.description}>{milestone.description}</Text>

      {/* Metrics Gain & Status Row */}
      <View style={styles.metricsRow}>
        {milestone.metricsGain && (
          <View style={styles.gainBadge}>
            <Text style={styles.gainText}>⚡ {milestone.metricsGain}</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        {getStatusBadge()}
      </View>

      {/* Action Buttons for Client Engagement */}
      {milestone.status === 'pending_approval' && (
        <View style={styles.actionsRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppButton
              title="Revize İste"
              variant="outline"
              size="sm"
              loading={isLoading}
              onPress={() => onRequestRevision(milestone.id)}
              icon={<RotateCcw size={13} color={Colors.textSecondary} />}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <AppButton
              title="Onayla"
              variant="primary"
              size="sm"
              loading={isLoading}
              onPress={() => onApprove(milestone.id)}
              icon={<Check size={14} color={Colors.textInverse} />}
            />
          </View>
        </View>
      )}

      {milestone.revisionNotes && (
        <View style={styles.revisionBox}>
          <Text style={styles.revisionTitle}>Revizyon Notu:</Text>
          <Text style={styles.revisionText}>{milestone.revisionNotes}</Text>
        </View>
      )}
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
    marginBottom: 6,
  },
  projectTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 1,
    maxWidth: '72%',
  },
  projectTagText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  timeText: {
    ...Typography.footnote,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  title: {
    ...Typography.cardTitle,
    fontSize: 16,
    lineHeight: 21,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gainBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gainText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: Spacing.hairlineWidth,
    borderTopColor: Colors.borderHairline,
  },
  revisionBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warningBorder,
    borderWidth: 1,
    borderRadius: 8,
  },
  revisionTitle: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
  },
  revisionText: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 2,
  },
});

export const MilestoneItem = React.memo(MilestoneItemComponent);


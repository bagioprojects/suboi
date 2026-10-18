import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProjectItem } from '@/models/project.model';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SurfaceCard } from './SurfaceCard';
import { StatusBadge } from './StatusBadge';
import { AppButton } from '../buttons/AppButton';
import { ArrowRight, Layers, Clock } from 'lucide-react-native';

interface ProjectCardProps {
  project: ProjectItem;
  onPressDetails?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({
  project,
  onPressDetails,
}) => {
  const getStatusBadgeVariant = () => {
    switch (project.status) {
      case 'completed':
        return 'success';
      case 'client_review':
        return 'warning';
      case 'in_progress':
      default:
        return 'primary';
    }
  };

  const getStatusLabel = () => {
    switch (project.status) {
      case 'completed':
        return 'Tamamlandı';
      case 'client_review':
        return 'Müşteri Kabulünde';
      case 'in_progress':
      default:
        return 'Geliştiriliyor';
    }
  };

  return (
    <SurfaceCard style={styles.card} padding="standard">
      <View style={styles.headerRow}>
        <View style={styles.categoryBadge}>
          <Layers size={13} color={Colors.primary} />
          <Text style={styles.categoryText}>
            {project.category.toUpperCase()}
          </Text>
        </View>
        <StatusBadge
          label={getStatusLabel()}
          variant={getStatusBadgeVariant()}
          size="sm"
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {project.title}
      </Text>

      <View style={styles.metaRow}>
        <Clock size={12} color={Colors.textSecondary} />
        <Text style={styles.metaText}>Son Güncelleme: {project.lastUpdated}</Text>
      </View>

      {/* Progress Bar Container */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Tamamlanma Oranı</Text>
          <Text style={styles.progressValue}>%{project.progressPercentage}</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${project.progressPercentage}%`,
                backgroundColor:
                  project.progressPercentage >= 90
                    ? Colors.success
                    : Colors.primary,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.milestoneBox}>
          <Text style={styles.milestoneLabel}>Sıradaki Adım:</Text>
          <Text style={styles.milestoneValue} numberOfLines={1}>
            {project.nextMilestone}
          </Text>
        </View>

        {onPressDetails && (
          <AppButton
            title="Detay"
            size="sm"
            variant="outline"
            onPress={onPressDetails}
            icon={<ArrowRight size={14} color={Colors.primary} />}
            iconPosition="right"
          />
        )}
      </View>
    </SurfaceCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.cardGap,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressContainer: {
    marginVertical: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressValue: {
    ...Typography.footnote,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: Spacing.hairlineWidth,
    borderTopColor: Colors.borderHairline,
  },
  milestoneBox: {
    flex: 1,
    marginRight: 10,
  },
  milestoneLabel: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  milestoneValue: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing } from '@/core/theme';

export type StatusBadgeVariant =
  | 'success'
  | 'warning'
  | 'primary'
  | 'accent'
  | 'geoAi'
  | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  showDot?: boolean;
  size?: 'xs' | 'sm' | 'md';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({
  label,
  variant = 'primary',
  showDot = true,
  size = 'md',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: Colors.successBg,
          text: Colors.success,
          border: Colors.successBorder,
          dot: Colors.success,
        };
      case 'warning':
        return {
          bg: Colors.warningBg,
          text: Colors.warning,
          border: Colors.warningBorder,
          dot: Colors.warning,
        };
      case 'accent':
        return {
          bg: Colors.accentLight,
          text: Colors.accent,
          border: '#C7D2FE',
          dot: Colors.accent,
        };
      case 'geoAi':
        return {
          bg: Colors.geoAiBg,
          text: Colors.geoAi,
          border: '#DDD6FE',
          dot: Colors.geoAi,
        };
      case 'neutral':
        return {
          bg: Colors.surfaceSubtle,
          text: Colors.textSecondary,
          border: Colors.borderHairline,
          dot: Colors.textSecondary,
        };
      case 'primary':
      default:
        return {
          bg: Colors.primaryLight,
          text: Colors.primary,
          border: '#BFDBFE',
          dot: Colors.primary,
        };
    }
  };

  const scheme = getColors();
  const isXs = size === 'xs';
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
          paddingVertical: isXs ? 2 : isSm ? 3 : 5,
          paddingHorizontal: isXs ? 5 : isSm ? 8 : 10,
        },
        style,
      ]}
    >
      {showDot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: scheme.dot,
              width: isXs ? 4 : isSm ? 5 : 6,
              height: isXs ? 4 : isSm ? 5 : 6,
              borderRadius: 3,
              marginRight: isXs ? 4 : isSm ? 5 : 6,
            },
          ]}
        />
      )}
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            color: scheme.text,
            fontSize: isXs ? 10 : isSm ? 11 : 12,
            lineHeight: isXs ? 13 : isSm ? 14 : 16,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.radiusInner,
    borderWidth: Spacing.hairlineWidth,
    alignSelf: 'flex-start',
  },
  dot: {
    // defined dynamically
  },
  text: {
    ...Typography.caption,
    fontWeight: '600',
  },
});

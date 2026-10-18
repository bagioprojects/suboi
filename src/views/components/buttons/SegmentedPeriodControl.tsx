import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing } from '@/core/theme';

export type PeriodType = 'daily' | 'weekly' | 'monthly';

interface Option {
  id: PeriodType;
  label: string;
}

const DEFAULT_OPTIONS: Option[] = [
  { id: 'daily', label: 'Günlük' },
  { id: 'weekly', label: 'Haftalık' },
  { id: 'monthly', label: 'Aylık' },
];

interface SegmentedPeriodControlProps {
  selected: PeriodType;
  onChange: (val: PeriodType) => void;
  options?: Option[];
  style?: ViewStyle;
}

export const SegmentedPeriodControl: React.FC<SegmentedPeriodControlProps> = ({
  selected,
  onChange,
  options = DEFAULT_OPTIONS,
  style,
}) => {
  const handleSelect = (id: PeriodType) => {
    if (id === selected) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Safe fallback
      }
    }
    onChange(id);
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((opt) => {
        const isSelected = opt.id === selected;
        return (
          <Pressable
            key={opt.id}
            onPress={() => handleSelect(opt.id)}
            style={[
              styles.tab,
              isSelected && styles.tabSelected,
            ]}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                styles.tabText,
                isSelected ? styles.tabTextSelected : styles.tabTextUnselected,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9', // Subtle background container
    borderRadius: Spacing.radiusInner,
    padding: 3,
    borderWidth: Spacing.hairlineWidth,
    borderColor: Colors.borderHairline,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.radiusInner - 2,
  },
  tabSelected: {
    backgroundColor: Colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
      },
    }),
  },
  tabText: {
    ...Typography.footnote,
    fontWeight: '500',
  },
  tabTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  tabTextUnselected: {
    color: Colors.textSecondary,
  },
});

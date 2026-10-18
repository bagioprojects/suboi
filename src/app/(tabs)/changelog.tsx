import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, useResponsive } from '@/core/theme';
import { ChangelogCard } from '@/views/components/cards/ChangelogCard';
import { useChangelogController } from '@/controllers/useChangelogController';
import { ChangelogItem } from '@/models/changelog.model';
import { GitPullRequest, Bell, Sparkles } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'ALL', label: 'Tümü' },
  { id: 'Feature', label: 'Yeni Özellik' },
  { id: 'Performance', label: 'Performans' },
  { id: 'SEO_GEO', label: 'SEO & AI GEO' },
  { id: 'Security', label: 'Güvenlik' },
];

export default function ChangelogScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 24 : Math.max(insets.top, 16);

  const {
    items,
    selectedCategory,
    setSelectedCategory,
    onOpenDeepLink,
  } = useChangelogController();

  const keyExtractor = useCallback((item: ChangelogItem) => item.id, []);

  const renderCard = useCallback(
    ({ item }: { item: ChangelogItem }) => (
      <ChangelogCard item={item} onOpenDeepLink={onOpenDeepLink} />
    ),
    [onOpenDeepLink]
  );

  const renderHeader = useMemo(
    () => (
      <View>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.mainTitle} numberOfLines={1} adjustsFontSizeToFit>
                Canlı Değişiklik Kayıtları
              </Text>
              <Text style={styles.subtitle}>
                Web siteniz ve mobil uygulamanızda yayına alınan anlık güncellemeler
              </Text>
            </View>
            <View style={styles.badge}>
              <GitPullRequest size={13} color={Colors.primary} />
              <Text style={styles.badgeText}>{items.length} Kayıt</Text>
            </View>
          </View>
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    ),
    [items.length, selectedCategory, setSelectedCategory]
  );

  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        <FlashList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderCard}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 40,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.cardGap,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Spacing.radiusPill,
    backgroundColor: Colors.surface,
    borderColor: Colors.borderHairline,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.footnote,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
});

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
import { ServiceCard } from '@/views/components/cards/ServiceCard';
import { ProjectWizardModal } from '@/views/components/modals/ProjectWizardModal';
import { useMarketplaceController } from '@/controllers/useMarketplaceController';
import { ServiceItem } from '@/models/service-catalog.model';
import { Sparkles, ShoppingBag, Plus } from 'lucide-react-native';
import { AppButton } from '@/views/components/buttons/AppButton';

const CATEGORIES = [
  { id: 'ALL', label: 'Tüm Hizmetler' },
  { id: 'development', label: 'Web & Mobil' },
  { id: 'seo_geo', label: 'SEO & AI GEO' },
  { id: 'maintenance', label: 'Performans & Hız' },
  { id: 'ui_ux', label: 'UI / UX Yenileme' },
];

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 24 : Math.max(insets.top, 16);

  const {
    catalog,
    selectedCategory,
    setSelectedCategory,
    isWizardOpen,
    selectedService,
    submitting,
    onOpenWizard,
    onCloseWizard,
    onSubmitWizard,
  } = useMarketplaceController();

  const handleSelectService = useCallback(
    (srv: ServiceItem) => {
      onOpenWizard(srv);
    },
    [onOpenWizard]
  );

  const keyExtractor = useCallback((item: ServiceItem) => item.id, []);

  const renderServiceItem = useCallback(
    ({ item }: { item: ServiceItem }) => (
      <ServiceCard service={item} onSelect={handleSelectService} />
    ),
    [handleSelectService]
  );

  const renderHeader = useMemo(
    () => (
      <View>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.mainTitle} numberOfLines={1} adjustsFontSizeToFit>
                Dijital Hizmet Mağazası
              </Text>
              <Text style={styles.subtitle}>
                Mevcut projenize ek sprint başlatın veya yeni dijital altyapı satın alın
              </Text>
            </View>
            <AppButton
              title="Özel Talep"
              variant="outline"
              size="sm"
              onPress={() => onOpenWizard()}
              icon={<Plus size={14} color={Colors.primary} />}
            />
          </View>
        </View>

        {/* Category Filters */}
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
    [selectedCategory, setSelectedCategory, onOpenWizard]
  );

  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        <FlashList
          data={catalog}
          keyExtractor={keyExtractor}
          renderItem={renderServiceItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 3-Step Project Wizard Modal */}
      <ProjectWizardModal
        visible={isWizardOpen}
        selectedService={selectedService}
        onClose={onCloseWizard}
        onSubmit={onSubmitWizard}
        submitting={submitting}
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
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
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

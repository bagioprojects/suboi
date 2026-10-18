import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { ServiceItem } from '@/models/service-catalog.model';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SurfaceCard } from './SurfaceCard';
import { StatusBadge } from './StatusBadge';
import { AppButton } from '../buttons/AppButton';
import { Clock, Check, Sparkles, ShoppingBag } from 'lucide-react-native';

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
}

const ServiceCardComponent: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
}) => {
  return (
    <SurfaceCard style={styles.card} padding="none">
      {/* Visual Header with Expo Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: service.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {service.badgeText && (
          <View style={styles.badgeOverlay}>
            <StatusBadge
              label={service.badgeText}
              variant={service.popular ? 'accent' : 'primary'}
              size="sm"
            />
          </View>
        )}
      </View>

      {/* Content Body */}
      <View style={styles.body}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{service.priceFormatted}</Text>
          <View style={styles.deliveryBadge}>
            <Clock size={12} color={Colors.textSecondary} />
            <Text style={styles.deliveryText}>{service.deliveryFormatted}</Text>
          </View>
        </View>

        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.description}>{service.description}</Text>

        {/* Feature List */}
        <View style={styles.featureList}>
          {service.features.map((feat, idx) => (
            <View key={idx} style={styles.featureItem}>
              <View style={styles.checkIconWrap}>
                <Check size={11} color={Colors.success} />
              </View>
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* High CTR CTA Button (#4F46E5 Royal Indigo / #2563EB) */}
        <View style={styles.ctaWrapper}>
          <AppButton
            title="Projeme Ekle / Hemen Başlat"
            variant={service.popular ? 'accent' : 'primary'}
            size="md"
            onPress={() => onSelect(service)}
            icon={<ShoppingBag size={15} color={Colors.textInverse} />}
          />
        </View>
      </View>
    </SurfaceCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.cardGap,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  body: {
    padding: Spacing.cardPadding,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    ...Typography.metricNumber,
    fontSize: 20,
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deliveryText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  title: {
    ...Typography.cardTitle,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  featureList: {
    gap: 6,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkIconWrap: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  ctaWrapper: {
    marginTop: 4,
  },
});

export const ServiceCard = React.memo(ServiceCardComponent);


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/core/store/app.store';
import { Colors, Typography, Spacing } from '@/core/theme';
import { GitCommit, TrendingUp, Bell, X, ArrowRight } from 'lucide-react-native';

export const NotificationBanner: React.FC = () => {
  const router = useRouter();
  const { activeBanner, dismissBanner } = useAppStore();

  if (!activeBanner) return null;

  const handleBannerPress = () => {
    if (activeBanner.targetPath) {
      router.push(activeBanner.targetPath as any);
    }
    dismissBanner();
  };

  const getCategoryIcon = () => {
    switch (activeBanner.category) {
      case 'seo':
        return <TrendingUp size={16} color={Colors.geoAi} />;
      case 'approval':
        return <Bell size={16} color={Colors.warning} />;
      case 'commit':
      default:
        return <GitCommit size={16} color={Colors.primary} />;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={handleBannerPress}
        style={styles.banner}
      >
        <View style={styles.iconBox}>{getCategoryIcon()}</View>

        <View style={styles.textBox}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {activeBanner.title}
            </Text>
            <Text style={styles.badgeLabel}>Canlı Webhook</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {activeBanner.message}
          </Text>
        </View>

        <View style={styles.actionWrap}>
          <ArrowRight size={14} color={Colors.primary} />
        </View>

        <Pressable
          onPress={(e: any) => {
            e?.stopPropagation?.();
            dismissBanner();
          }}
          style={styles.dismissBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={14} color={Colors.textTertiary} />
        </Pressable>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 12 : 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    maxWidth: 540,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
      },
    }),
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textBox: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  title: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  badgeLabel: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '700',
  },
  message: {
    ...Typography.footnote,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  actionWrap: {
    paddingHorizontal: 4,
  },
  dismissBtn: {
    padding: 6,
    marginLeft: 4,
  },
});

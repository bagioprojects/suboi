import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Colors, Typography, Spacing } from '@/core/theme';
import { soundService } from '@/core/audio/sound.service';
import {
  LayoutDashboard,
  Send,
  Layers,
  GitCommit,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Server,
  Activity,
  Zap,
} from 'lucide-react-native';

const ADMIN_NAV = [
  { id: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
  { id: '/admin/push', label: 'Push Bildirim Konsolu', icon: Send, badge: 'Canlı' },
  { id: '/admin/projects', label: 'Proje & Sprint Yönetimi', icon: Layers },
  { id: '/admin/changelog', label: 'Changelog Yayıncısı', icon: GitCommit },
  { id: '/admin/seo', label: 'SEO & AI GEO Konsolu', icon: TrendingUp },
];

export default function AdminLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (path: string) => {
    soundService.playClick();
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      {/* Top Executive Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.adminLogoWrap}>
            <Zap size={18} color="#3B82F6" />
          </View>
          <View>
            <Text style={styles.brandTitle}>HUBIO COMMAND CENTER</Text>
            <Text style={styles.brandSubtitle}>Executive Web Admin Suite 2026</Text>
          </View>
        </View>

        {/* System Health Indicators */}
        <View style={styles.healthBar}>
          <View style={styles.healthItem}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.healthText}>Expo Gateway: APNs/FCM Hazır</Text>
          </View>
          <View style={styles.healthItem}>
            <View style={[styles.statusDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.healthText}>PgBouncer: Aktif</Text>
          </View>
          <Pressable
            onPress={() => {
              soundService.playPop();
              router.replace('/(tabs)/dashboard');
            }}
            style={styles.switchAppBtn}
          >
            <ArrowLeft size={14} color="#94A3B8" />
            <Text style={styles.switchAppText}>Müşteri Portalı</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Admin Body: Sidebar + Dynamic Content Slot */}
      <View style={styles.mainWrapper}>
        {/* Desktop Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarSectionTitle}>YÖNETİM KONSOLU</Text>
          {ADMIN_NAV.map((item) => {
            const isSelected =
              pathname === item.id ||
              (item.id === '/admin' && pathname === '/admin/');
            const Icon = item.icon;

            return (
              <Pressable
                key={item.id}
                onPress={() => handleNav(item.id)}
                style={[
                  styles.navItem,
                  isSelected && styles.navItemActive,
                ]}
              >
                <Icon
                  size={17}
                  color={isSelected ? '#3B82F6' : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.navLabel,
                    isSelected && styles.navLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {item.badge && (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}

          <View style={styles.sidebarFooter}>
            <View style={styles.adminProfileCard}>
              <View style={styles.avatarWrap}>
                <ShieldCheck size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminName}>Super Admin</Text>
                <Text style={styles.adminRole}>Ajans Baş Yöneticisi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content View */}
        <View style={styles.contentSlot}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16', // Deep Obsidian Slate
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#0D1322',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminLogoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    ...Typography.caption,
    fontSize: 13,
    color: '#F8FAFC',
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandSubtitle: {
    ...Typography.caption,
    fontSize: 11,
    color: '#64748B',
  },
  healthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  healthText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  switchAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchAppText: {
    ...Typography.caption,
    fontSize: 12,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#0D1322',
    borderRightWidth: 1,
    borderRightColor: '#1E293B',
    paddingVertical: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  sidebarSectionTitle: {
    ...Typography.caption,
    fontSize: 10,
    color: '#475569',
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  navLabel: {
    ...Typography.footnote,
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
  },
  navLabelActive: {
    color: '#F8FAFC',
    fontWeight: '600',
  },
  navBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  navBadgeText: {
    ...Typography.caption,
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sidebarFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  adminProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminName: {
    ...Typography.cardTitle,
    fontSize: 12,
    color: '#F8FAFC',
  },
  adminRole: {
    ...Typography.caption,
    fontSize: 10,
    color: '#64748B',
  },
  contentSlot: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/core/store/app.store';
import { Typography, Spacing } from '@/core/theme';
import { soundService } from '@/core/audio/sound.service';
import {
  Send,
  Users,
  Activity,
  GitCommit,
  Layers,
  ArrowRight,
  TrendingUp,
  Radio,
  CheckCircle2,
} from 'lucide-react-native';

export default function AdminOverviewScreen() {
  const router = useRouter();
  const { projects, milestones, notifications } = useAppStore();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Title Bar */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>Ajans Yönetim Paneli</Text>
          <Text style={styles.pageSubtitle}>
            Tüm müşteri projeleri, canlı push dağıtımları ve sistem metrikleri
          </Text>
        </View>

        <Pressable
          onPress={() => {
            soundService.playPop();
            router.push('/admin/push');
          }}
          style={styles.primaryActionBtn}
        >
          <Send size={15} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Yeni Push Bildirimi Gönder</Text>
        </Pressable>
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>Toplam Kurumsal Müşteri</Text>
            <View style={[styles.kpiIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Users size={16} color="#3B82F6" />
            </View>
          </View>
          <Text style={styles.kpiValue}>18 Firma</Text>
          <Text style={[styles.kpiSub, { color: '#10B981' }]}>+%22 Bu Ay Büyüme</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>Aktif Sprint & Proje</Text>
            <View style={[styles.kpiIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Layers size={16} color="#10B981" />
            </View>
          </View>
          <Text style={styles.kpiValue}>{projects.length} Proje</Text>
          <Text style={styles.kpiSub}>12 Sprint Canlıda</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>İletilen Push Bildirimi</Text>
            <View style={[styles.kpiIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Send size={16} color="#F59E0B" />
            </View>
          </View>
          <Text style={styles.kpiValue}>1.420 Adet</Text>
          <Text style={[styles.kpiSub, { color: '#F59E0B' }]}>%99.4 Teslimat Oranı</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>Ortalama Bildirim CTR</Text>
            <View style={[styles.kpiIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <TrendingUp size={16} color="#8B5CF6" />
            </View>
          </View>
          <Text style={styles.kpiValue}>%48.6</Text>
          <Text style={[styles.kpiSub, { color: '#10B981' }]}>Yüksek Müşteri Etkileşimi</Text>
        </View>
      </View>

      {/* Main Grid: Live Queue & Quick Actions */}
      <View style={styles.twoColumnGrid}>
        {/* Left Column: Recent Push & Webhook Broadcasts */}
        <View style={styles.panelCard}>
          <View style={styles.panelHeader}>
            <View style={styles.panelTitleRow}>
              <Radio size={16} color="#3B82F6" />
              <Text style={styles.panelTitle}>Son Bildirim ve Webhook Yayınları</Text>
            </View>
            <Pressable onPress={() => router.push('/admin/push')}>
              <Text style={styles.linkText}>Konsolu Aç →</Text>
            </Pressable>
          </View>

          {notifications.slice(0, 4).map((notif) => (
            <View key={notif.id} style={styles.notifRow}>
              <View style={styles.notifDot} />
              <View style={{ flex: 1 }}>
                <View style={styles.notifTitleRow}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifTime}>{notif.timestamp}</Text>
                </View>
                <Text style={styles.notifMsg}>{notif.message}</Text>
                <Text style={styles.notifTarget}>Hedef Rota: {notif.targetPath}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Right Column: Active Projects Control */}
        <View style={styles.panelCard}>
          <View style={styles.panelHeader}>
            <View style={styles.panelTitleRow}>
              <Layers size={16} color="#10B981" />
              <Text style={styles.panelTitle}>Yönetilen Aktif Projeler</Text>
            </View>
            <Pressable onPress={() => router.push('/admin/projects')}>
              <Text style={styles.linkText}>Tümünü Yönet →</Text>
            </Pressable>
          </View>

          {projects.map((p) => (
            <View key={p.id} style={styles.projectRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.projTitle}>{p.title}</Text>
                <Text style={styles.projClient}>{p.clientName} • {p.activeSprint}</Text>
              </View>
              <View style={styles.projProgressBox}>
                <Text style={styles.projPercent}>%{p.progressPercentage}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    ...Typography.largeTitle,
    fontSize: 24,
    lineHeight: 30,
    color: '#F8FAFC',
    fontWeight: '800',
  },
  pageSubtitle: {
    ...Typography.footnote,
    color: '#64748B',
    marginTop: 3,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryActionText: {
    ...Typography.caption,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    ...Typography.metricNumber,
    fontSize: 24,
    lineHeight: 30,
    color: '#F8FAFC',
    marginVertical: 4,
  },
  kpiSub: {
    ...Typography.caption,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  panelCard: {
    flex: 1,
    minWidth: 340,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 18,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  panelTitle: {
    ...Typography.cardTitle,
    fontSize: 15,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  linkText: {
    ...Typography.caption,
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2234',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 6,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: '#F8FAFC',
  },
  notifTime: {
    ...Typography.caption,
    fontSize: 10,
    color: '#64748B',
  },
  notifMsg: {
    ...Typography.body,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 3,
  },
  notifTarget: {
    ...Typography.caption,
    fontSize: 10,
    color: '#3B82F6',
    fontFamily: 'monospace',
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2234',
  },
  projTitle: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: '#F8FAFC',
  },
  projClient: {
    ...Typography.footnote,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  projProgressBox: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  projPercent: {
    ...Typography.caption,
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

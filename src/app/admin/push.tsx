import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useAppStore } from '@/core/store/app.store';
import { Typography, Spacing } from '@/core/theme';
import { soundService } from '@/core/audio/sound.service';
import {
  Send,
  Smartphone,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Volume2,
  Compass,
} from 'lucide-react-native';

const TARGET_AUDIENCES = [
  { id: 'all', label: 'Tüm Müşteriler (Broadcast - 18 Firma)' },
  { id: 'novatech', label: 'NovaTech B2B (VIP Kurumsal)' },
  { id: 'logistics', label: 'Global Lojistik Web' },
];

const ROUTE_OPTIONS = [
  { id: '/(tabs)/analytics', label: 'SEO & AI GEO Raporu (/analytics)' },
  { id: '/(tabs)/changelog', label: 'Canlı Değişiklikler (/changelog)' },
  { id: '/(tabs)/projects', label: 'Geliştirme & Sprint Takibi (/projects)' },
  { id: '/(tabs)/marketplace', label: 'Dijital Hizmet Mağazası (/marketplace)' },
];

const SOUND_OPTIONS = [
  { id: 'chime', label: 'Harmonic Chime (VIP)' },
  { id: 'pop', label: 'Bubbly Pop' },
  { id: 'default', label: 'Sistem Zili (Default)' },
];

export default function AdminPushConsoleScreen() {
  const { triggerWebhookNotification, notifications } = useAppStore();

  const [target, setTarget] = useState<string>('all');
  const [title, setTitle] = useState<string>('Ödeme Modülü 3D Secure 2.2 Yayında! ⚡');
  const [message, setMessage] = useState<string>(
    'NovaTech portalınızda mobil ödeme hızlandırması canlı sunucuya aktarıldı. İncelemek için dokunun.'
  );
  const [route, setRoute] = useState<string>('/(tabs)/changelog');
  const [sound, setSound] = useState<string>('chime');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const handleSendPush = () => {
    soundService.playClick();
    setIsSending(true);

    setTimeout(() => {
      triggerWebhookNotification(title, message, route, 'commit');
      soundService.playNotification();
      setIsSending(false);
      setSentSuccess(true);

      setTimeout(() => setSentSuccess(false), 4000);
    }, 400);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>Canlı Push Bildirim Konsolu</Text>
          <Text style={styles.pageSubtitle}>
            Expo Push API ile iOS (APNs) ve Android (FCM) cihazlara anında zengin bildirim gönderimi
          </Text>
        </View>
      </View>

      {/* Main 2-Panel Layout: Editor on Left, Live iPhone Mockup on Right */}
      <View style={styles.consoleLayout}>
        {/* Left: Dispatcher Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionHeading}>1. Hedef Kitle & İletim Parametreleri</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Hedef Müşteri Grubu</Text>
            <View style={styles.pillRow}>
              {TARGET_AUDIENCES.map((aud) => {
                const isSelected = target === aud.id;
                return (
                  <Pressable
                    key={aud.id}
                    onPress={() => {
                      soundService.playPop();
                      setTarget(aud.id);
                    }}
                    style={[styles.pillBtn, isSelected && styles.pillBtnActive]}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {aud.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bildirim Başlığı *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Bildirim başlığı girin..."
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bildirim Mesajı (Body) *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Müşteriye iletilecek mesaj..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tıklandığında Açılacak Rota (Deep Link)</Text>
            <View style={styles.routeCol}>
              {ROUTE_OPTIONS.map((r) => {
                const isSelected = route === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => {
                      soundService.playPop();
                      setRoute(r.id);
                    }}
                    style={[styles.routeBtn, isSelected && styles.routeBtnActive]}
                  >
                    <Compass size={14} color={isSelected ? '#3B82F6' : '#64748B'} />
                    <Text style={[styles.routeText, isSelected && styles.routeTextActive]}>
                      {r.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bildirim Ses Efekti</Text>
            <View style={styles.pillRow}>
              {SOUND_OPTIONS.map((s) => {
                const isSelected = sound === s.id;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => {
                      if (s.id === 'chime') soundService.playSuccess();
                      else soundService.playNotification();
                      setSound(s.id);
                    }}
                    style={[styles.pillBtn, isSelected && styles.pillBtnActive]}
                  >
                    <Volume2 size={13} color={isSelected ? '#3B82F6' : '#94A3B8'} />
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Send Trigger */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleSendPush}
              disabled={isSending}
              style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            >
              <Send size={16} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>
                {isSending ? 'APNs & FCM Gateway İletiliyor...' : 'Cihazlara Anında Push Gönder'}
              </Text>
            </Pressable>

            {sentSuccess && (
              <View style={styles.successBox}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.successText}>Bildirim başarıyla kuyruğa alındı ve iletildi!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right: Live Interactive iPhone Lock Screen Mockup */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Smartphone size={16} color="#3B82F6" />
            <Text style={styles.previewHeading}>Canlı iOS 18 Kilit Ekranı Önizlemesi</Text>
          </View>

          {/* iPhone Mockup Frame */}
          <View style={styles.iphoneFrame}>
            {/* Dynamic Island / Speaker Notch */}
            <View style={styles.dynamicIsland}>
              <View style={styles.sensorDot} />
            </View>

            {/* Lock Screen Clock */}
            <View style={styles.lockScreenClock}>
              <Text style={styles.lockDate}>Pazar, 18 Ekim</Text>
              <Text style={styles.lockTime}>09:41</Text>
            </View>

            {/* Apple iOS Notification Card */}
            <View style={styles.iosNotification}>
              <View style={styles.iosNotifHeader}>
                <View style={styles.iosAppIdentity}>
                  <View style={styles.iosAppIconWrap}>
                    <Zap size={11} color="#FFFFFF" />
                  </View>
                  <Text style={styles.iosAppName}>HUBIO</Text>
                </View>
                <Text style={styles.iosNotifTime}>şimdi</Text>
              </View>

              <Text style={styles.iosNotifTitle}>{title || 'Bildirim Başlığı'}</Text>
              <Text style={styles.iosNotifBody}>{message || 'Bildirim mesajı buraya gelecek...'}</Text>
            </View>

            {/* Footer Bottom Bar */}
            <View style={styles.homeIndicator} />
          </View>
          <Text style={styles.previewFootnote}>
            Yazdığınız metinler anında kilit ekranı simülasyonunda canlı güncellenir.
          </Text>
        </View>
      </View>

      {/* Delivery Log History */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Clock size={16} color="#94A3B8" />
          <Text style={styles.historyTitle}>Son Gönderim & Teslimat Günlüğü</Text>
        </View>

        {notifications.map((n) => (
          <View key={n.id} style={styles.historyRow}>
            <View style={styles.historyColMain}>
              <Text style={styles.hTitle}>{n.title}</Text>
              <Text style={styles.hMsg}>{n.message}</Text>
            </View>
            <View style={styles.historyColMeta}>
              <Text style={styles.hTarget}>Rota: {n.targetPath}</Text>
              <Text style={styles.hStatus}>✓ İletildi (APNs/FCM 200 OK)</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  titleRow: {
    marginBottom: 20,
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
  consoleLayout: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  formCard: {
    flex: 3,
    minWidth: 420,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 22,
  },
  sectionHeading: {
    ...Typography.title2,
    fontSize: 16,
    color: '#F8FAFC',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '600',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillBtnActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  pillText: {
    ...Typography.caption,
    fontSize: 12,
    color: '#94A3B8',
  },
  pillTextActive: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#0D1322',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  routeCol: {
    gap: 6,
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0D1322',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  routeBtnActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  routeText: {
    ...Typography.footnote,
    fontSize: 12,
    color: '#94A3B8',
  },
  routeTextActive: {
    color: '#60A5FA',
    fontWeight: '600',
  },
  actionRow: {
    marginTop: 10,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  successText: {
    ...Typography.footnote,
    fontSize: 12,
    color: '#34D399',
    fontWeight: '600',
  },
  previewCard: {
    flex: 2,
    minWidth: 320,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  previewHeading: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  iphoneFrame: {
    width: 290,
    height: 480,
    backgroundColor: '#000000',
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#334155',
    padding: 14,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
      },
    }),
  },
  dynamicIsland: {
    width: 86,
    height: 22,
    backgroundColor: '#18181B',
    borderRadius: 11,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#09090B',
  },
  lockScreenClock: {
    alignItems: 'center',
    marginVertical: 24,
  },
  lockDate: {
    ...Typography.caption,
    fontSize: 12,
    color: '#E4E4E7',
    fontWeight: '600',
  },
  lockTime: {
    ...Typography.metricNumber,
    fontSize: 48,
    lineHeight: 52,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: -1,
  },
  iosNotification: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  iosNotifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  iosAppIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iosAppIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosAppName: {
    ...Typography.caption,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iosNotifTime: {
    ...Typography.caption,
    fontSize: 10,
    color: '#D4D4D8',
  },
  iosNotifTitle: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 2,
  },
  iosNotifBody: {
    ...Typography.body,
    fontSize: 11,
    lineHeight: 15,
    color: '#E4E4E7',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 100,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    opacity: 0.8,
  },
  previewFootnote: {
    ...Typography.caption,
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 14,
  },
  historyCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  historyTitle: {
    ...Typography.cardTitle,
    fontSize: 15,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2234',
  },
  historyColMain: {
    flex: 1,
    marginRight: 16,
  },
  hTitle: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: '#F8FAFC',
  },
  hMsg: {
    ...Typography.body,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  historyColMeta: {
    alignItems: 'flex-end',
  },
  hTarget: {
    ...Typography.caption,
    fontSize: 11,
    color: '#3B82F6',
    fontFamily: 'monospace',
  },
  hStatus: {
    ...Typography.caption,
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
});

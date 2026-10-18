import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useAppStore } from '@/core/store/app.store';
import { Typography, Spacing } from '@/core/theme';
import { soundService } from '@/core/audio/sound.service';
import {
  GitCommit,
  Send,
  Plus,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react-native';

export default function AdminChangelogScreen() {
  const { triggerWebhookNotification } = useAppStore();

  const [title, setTitle] = useState<string>('ThumbHash Görsel Pipeline ve CDN Önbellekleme');
  const [category, setCategory] = useState<string>('Performance');
  const [beforeSummary, setBeforeSummary] = useState<string>(
    'Ağır JPEG/PNG bannerlar yüzünden mobil açılış hızı 3.4s sürüyordu.'
  );
  const [afterSummary, setAfterSummary] = useState<string>(
    'ThumbHash ve Cloudflare Edge CDN ile görseller 80ms içinde açılıyor.'
  );
  const [impactScore, setImpactScore] = useState<string>('PageSpeed: 98/100');
  const [liveUrl, setLiveUrl] = useState<string>('https://novatech.com.tr');
  const [commitHash, setCommitHash] = useState<string>('d9a1f2b');
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const handlePublish = () => {
    soundService.playSuccess();
    triggerWebhookNotification(
      `Sitenizde Yeni Güncelleme: ${title}`,
      `Değişiklik canlı sunucuya alındı (${impactScore}). İncelemek için dokunun.`,
      '/(tabs)/changelog',
      'commit'
    );
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 4000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>Canlı Değişiklik Yayıncısı (Changelog)</Text>
          <Text style={styles.pageSubtitle}>
            Web sitesinde ve mobil uygulamada yapılan geliştirmeleri yayınlayıp anlık Push bildirimi gönderme konsolu
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>+ Yeni Web Sitesi / Mobil Değişiklik Dağıtımı</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Değişiklik Başlığı *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Örn: 3D Secure 2.2 ve Apple Pay Entegrasyonu"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.rowTwo}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Etki Skoru / Kazanç</Text>
            <TextInput
              style={styles.textInput}
              value={impactScore}
              onChangeText={setImpactScore}
              placeholder="Örn: +%35 Hız Artışı"
              placeholderTextColor="#64748B"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Git Commit Hash</Text>
            <TextInput
              style={styles.textInput}
              value={commitHash}
              onChangeText={setCommitHash}
              placeholder="Örn: a1b2c3d"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Önceki Durum (Before Summary) *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={beforeSummary}
            onChangeText={setBeforeSummary}
            placeholder="Değişiklikten önceki teknik veya görsel durum..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Yayına Alınan Durum (After Summary) *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={afterSummary}
            onChangeText={setAfterSummary}
            placeholder="Yapılan iyileştirme ve canlıya alınan sonuç..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Canlı Önizleme Bağlantısı (Live URL)</Text>
          <TextInput
            style={styles.textInput}
            value={liveUrl}
            onChangeText={setLiveUrl}
            placeholder="https://novatech.com.tr/..."
            placeholderTextColor="#64748B"
          />
        </View>

        <Pressable onPress={handlePublish} style={styles.publishBtn}>
          <Send size={16} color="#FFFFFF" />
          <Text style={styles.publishBtnText}>
            Değişikliği Canlıya Al ve Müşteriye Anında Push Bildirimi Gönder
          </Text>
        </Pressable>

        {isPublished && (
          <View style={styles.successBox}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.successText}>
              Changelog yayına alındı ve müşteriye canlı push bildirimi iletildi!
            </Text>
          </View>
        )}
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
    color: '#F8FAFC',
    fontWeight: '800',
  },
  pageSubtitle: {
    ...Typography.footnote,
    color: '#64748B',
    marginTop: 3,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 22,
    maxWidth: 720,
  },
  cardHeading: {
    ...Typography.title2,
    fontSize: 16,
    color: '#F8FAFC',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    ...Typography.caption,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#0D1322',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 8,
    padding: 10,
    color: '#F8FAFC',
    fontSize: 13,
  },
  textArea: {
    height: 65,
    textAlignVertical: 'top',
  },
  rowTwo: {
    flexDirection: 'row',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  publishBtnText: {
    ...Typography.caption,
    fontSize: 13,
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
});

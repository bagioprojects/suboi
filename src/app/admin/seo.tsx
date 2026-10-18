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
  TrendingUp,
  Bot,
  MapPin,
  Send,
  CheckCircle2,
  Cpu,
} from 'lucide-react-native';

export default function AdminSeoScreen() {
  const { triggerWebhookNotification } = useAppStore();

  const [aiScore, setAiScore] = useState('88');
  const [localScore, setLocalScore] = useState('94');
  const [speedScore, setSpeedScore] = useState('97');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    soundService.playSuccess();
    triggerWebhookNotification(
      'Haftalık SEO & AI GEO Raporu Güncellendi 📈',
      `ChatGPT ve Perplexity alıntılanma skorunuz %${aiScore}'e yükseldi. Raporu inceleyin.`,
      '/(tabs)/analytics',
      'seo'
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>SEO & 2026 AI GEO Veri Konsolu</Text>
          <Text style={styles.pageSubtitle}>
            Müşterinin Generative AI motorlarındaki alıntılanma oranlarını ve harita görünürlük verilerini yönetin
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Temel Performans Metrikleri</Text>

        <View style={styles.metricRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>AI GEO Skoru (%)</Text>
            <TextInput
              style={styles.textInput}
              value={aiScore}
              onChangeText={setAiScore}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 8 }]}>
            <Text style={styles.label}>Yerel Harita GEO (%)</Text>
            <TextInput
              style={styles.textInput}
              value={localScore}
              onChangeText={setLocalScore}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Core Web Vitals Hız Skoru</Text>
            <TextInput
              style={styles.textInput}
              value={speedScore}
              onChangeText={setSpeedScore}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <Send size={15} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>
            Skorları Güncelle ve Müşteriye Bildirim Gönder
          </Text>
        </Pressable>

        {isSaved && (
          <View style={styles.successBox}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.successText}>
              SEO/GEO metrikleri güncellendi ve analitik bildirimi müşteriye iletildi!
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
  metricRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 10,
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
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  saveBtnText: {
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

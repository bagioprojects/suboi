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
  Layers,
  Plus,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react-native';

export default function AdminProjectsScreen() {
  const {
    projects,
    milestones,
    approveMilestone,
    triggerWebhookNotification,
  } = useAppStore();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'prj-101');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Feature' | 'Performance' | 'Security' | 'SEO'>('Feature');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectMilestones = milestones.filter((m) => m.projectId === selectedProjectId);

  const handleResolveRevision = (milestoneId: string, milestoneTitle: string) => {
    soundService.playSuccess();
    approveMilestone(milestoneId);
    triggerWebhookNotification(
      'Revizyon Tamamlandı! 🎉',
      `"${milestoneTitle}" için ilettiğiniz revizyon talepleri tamamlandı ve canlıya alındı.`,
      '/project/' + selectedProjectId,
      'commit'
    );
  };

  const handleAddMilestone = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    soundService.playPop();

    const newM = {
      id: 'ms-adm-' + Date.now(),
      projectId: selectedProjectId,
      projectTitle: selectedProject?.title || 'Proje',
      period: 'daily' as const,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      timestamp: 'Bugün (Yeni Teslimat)',
      status: 'pending_approval' as const,
      metricsGain: '+%30 İyileşme',
    };

    useAppStore.setState((state) => ({
      milestones: [newM, ...state.milestones],
    }));

    triggerWebhookNotification(
      `Yeni Teslimat: ${newTitle.trim()} 🚀`,
      `"${selectedProject?.title}" projenizde yeni bir geliştirme onayınıza sunuldu.`,
      '/(tabs)/projects',
      'approval'
    );

    setNewTitle('');
    setNewDesc('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>Proje & Sprint Yönetimi</Text>
          <Text style={styles.pageSubtitle}>
            Müşteri projelerine yeni kilometre taşı ekleme ve revizyon çözümleme konsolu
          </Text>
        </View>
      </View>

      {/* Project Selector Chips */}
      <View style={styles.selectorBar}>
        {projects.map((p) => {
          const isSelected = p.id === selectedProjectId;
          return (
            <Pressable
              key={p.id}
              onPress={() => {
                soundService.playClick();
                setSelectedProjectId(p.id);
              }}
              style={[styles.projChip, isSelected && styles.projChipActive]}
            >
              <Text style={[styles.projChipText, isSelected && styles.projChipTextActive]}>
                {p.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 2-Column: Left = Add Sprint Milestone, Right = Review & Resolve Revisions */}
      <View style={styles.contentGrid}>
        {/* Left: Add Milestone */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>+ Yeni Sprint / Kilometre Taşı Ekle</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Geliştirme Başlığı *</Text>
            <TextInput
              style={styles.textInput}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Örn: Apple Pay TurboModule Entegrasyonu"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teknik Açıklama & Teslimat Kapsamı *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="Yapılan kod geliştirmesi ve müşteri faydası..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kategori</Text>
            <View style={styles.catRow}>
              {(['Feature', 'Performance', 'Security', 'SEO'] as const).map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => {
                    soundService.playPop();
                    setNewCategory(cat);
                  }}
                  style={[styles.catBtn, newCategory === cat && styles.catBtnActive]}
                >
                  <Text style={[styles.catBtnText, newCategory === cat && styles.catBtnTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable onPress={handleAddMilestone} style={styles.submitBtn}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>Yayınla ve Müşteriye Onay İste</Text>
          </Pressable>
        </View>

        {/* Right: Active Milestones & Client Revision Feedback */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Mevcut Kilometre Taşları & Revizyonlar</Text>

          {projectMilestones.map((m) => (
            <View key={m.id} style={styles.milestoneItem}>
              <View style={styles.mTopRow}>
                <Text style={styles.mTitle}>{m.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    m.status === 'approved'
                      ? styles.badgeApproved
                      : m.status === 'revision_requested'
                      ? styles.badgeRevision
                      : styles.badgePending,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {m.status === 'approved'
                      ? 'Müşteri Onayladı'
                      : m.status === 'revision_requested'
                      ? 'Revize İstendi'
                      : 'Onay Bekliyor'}
                  </Text>
                </View>
              </View>

              <Text style={styles.mDesc}>{m.description}</Text>

              {/* Revision note from client if any */}
              {m.revisionNotes && (
                <View style={styles.revBox}>
                  <Text style={styles.revTitle}>Müşterinin İlettiği Revizyon Notu:</Text>
                  <Text style={styles.revText}>{m.revisionNotes}</Text>
                  {m.status === 'revision_requested' && (
                    <Pressable
                      onPress={() => handleResolveRevision(m.id, m.title)}
                      style={styles.resolveBtn}
                    >
                      <CheckCircle2 size={13} color="#FFFFFF" />
                      <Text style={styles.resolveBtnText}>Revizyonu Tamamla ve Onayla</Text>
                    </Pressable>
                  )}
                </View>
              )}
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
  selectorBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  projChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  projChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  projChipText: {
    ...Typography.caption,
    fontSize: 12,
    color: '#94A3B8',
  },
  projChipTextActive: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  contentGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: 360,
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 20,
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
    height: 70,
    textAlignVertical: 'top',
  },
  catRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1E293B',
  },
  catBtnActive: {
    backgroundColor: '#2563EB',
  },
  catBtnText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#94A3B8',
  },
  catBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  submitBtnText: {
    ...Typography.caption,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  milestoneItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  mTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mTitle: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: '#F8FAFC',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeApproved: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgeRevision: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  badgePending: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 10,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  mDesc: {
    ...Typography.body,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  revBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  revTitle: {
    ...Typography.caption,
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
  },
  revText: {
    ...Typography.body,
    fontSize: 12,
    color: '#FEF3C7',
    marginVertical: 4,
  },
  resolveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  resolveBtnText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

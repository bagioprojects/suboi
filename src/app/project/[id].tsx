import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/core/store/app.store';
import { Colors, Typography, Spacing, useResponsive } from '@/core/theme';
import { SurfaceCard } from '@/views/components/cards/SurfaceCard';
import { StatusBadge } from '@/views/components/cards/StatusBadge';
import { AppButton } from '@/views/components/buttons/AppButton';
import { MilestoneItem } from '@/views/components/timelines/MilestoneItem';
import { RevisionModal } from '@/views/components/modals/RevisionModal';
import { ProjectMilestone } from '@/models/project.model';
import { useProjectVaultController, VaultTab } from '@/controllers/useProjectVaultController';
import {
  DocumentType,
  MediaType,
  IDocumentEntity,
  IMediaAssetEntity,
  IMilestoneRevisionEntity,
} from '@/models/database/entities.types';
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Layers,
  Cpu,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Receipt,
  Video,
  Download,
  Play,
  Sparkles,
  AlertCircle,
  FileCheck,
} from 'lucide-react-native';

interface DocumentItemCardProps {
  doc: IDocumentEntity;
  onSign: (id: string, title: string) => void;
  onDownload: (id: string) => void;
}

const DocumentItemCard = React.memo<DocumentItemCardProps>(({ doc, onSign, onDownload }) => {
  const handleSign = React.useCallback(() => {
    onSign(doc.id, doc.title);
  }, [doc.id, doc.title, onSign]);

  const handleDownload = React.useCallback(() => {
    onDownload(doc.id);
  }, [doc.id, onDownload]);

  return (
    <SurfaceCard style={styles.docCard} padding="standard">
      <View style={styles.docHeader}>
        <View style={styles.docIconBox}>
          {doc.type === 'contract' ? (
            <ShieldCheck size={20} color={Colors.primary} />
          ) : doc.type === 'invoice' ? (
            <Receipt size={20} color={Colors.accent} />
          ) : (
            <FileText size={20} color={Colors.warning} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>{doc.title}</Text>
          <View style={styles.docMetaRow}>
            <Text style={styles.docMetaBadge}>{doc.version}</Text>
            <Text style={styles.docMetaText}>{doc.fileSizeFormatted}</Text>
            <Text style={styles.docMetaBullet}>•</Text>
            <Text style={styles.docMetaText}>{doc.downloadCount} indirme</Text>
          </View>
        </View>
      </View>

      <View style={styles.docDivider} />

      <View style={styles.docFooter}>
        {doc.isSigned ? (
          <View style={styles.signedBadge}>
            <CheckCircle2 size={14} color="#10B981" />
            <Text style={styles.signedText}>
              İmzalandı: {doc.signedBy}
            </Text>
          </View>
        ) : (
          <View style={styles.unsignedBadge}>
            <AlertCircle size={14} color="#F59E0B" />
            <Text style={styles.unsignedText}>E-İmza Bekleniyor</Text>
          </View>
        )}

        <View style={styles.docActions}>
          {!doc.isSigned && (
            <AppButton
              title="E-İmzala"
              variant="secondary"
              size="sm"
              icon={<FileCheck size={13} color={Colors.primary} />}
              onPress={handleSign}
            />
          )}
          <AppButton
            title="İndir"
            variant="outline"
            size="sm"
            icon={<Download size={13} color={Colors.textPrimary} />}
            onPress={handleDownload}
          />
        </View>
      </View>
    </SurfaceCard>
  );
});

interface MediaItemCardProps {
  med: IMediaAssetEntity;
}

const MediaItemCard = React.memo<MediaItemCardProps>(({ med }) => {
  return (
    <SurfaceCard style={styles.mediaCard} padding="standard">
      <View style={styles.mediaThumbnailBox}>
        <View style={styles.mediaPlayOverlay}>
          <Play size={24} color="#FFFFFF" />
        </View>
        {med.resolution && (
          <View style={styles.resBadge}>
            <Text style={styles.resBadgeText}>{med.resolution}</Text>
          </View>
        )}
        {med.durationSeconds && (
          <View style={styles.durationBadge}>
            <Clock size={10} color="#FFFFFF" />
            <Text style={styles.durationText}>
              {Math.floor(med.durationSeconds / 60)}:
              {(med.durationSeconds % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.mediaBody}>
        <Text style={styles.mediaTitle}>{med.title}</Text>
        <View style={styles.tagsRow}>
          {med.tags.map((t) => (
            <View key={t} style={styles.tagBadge}>
              <Text style={styles.tagText}>#{t}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.mediaUploader}>
          Yükleyen: {med.uploaderName} • {(med.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
        </Text>
      </View>
    </SurfaceCard>
  );
});

interface RevisionItemCardProps {
  rev: IMilestoneRevisionEntity;
}

const RevisionItemCard = React.memo<RevisionItemCardProps>(({ rev }) => {
  return (
    <SurfaceCard style={styles.revCard} padding="standard">
      <View style={styles.revHeader}>
        <View
          style={[
            styles.revTag,
            rev.tag === 'UI/UX'
              ? { backgroundColor: '#6366F120' }
              : rev.tag === 'Performance'
              ? { backgroundColor: '#10B98120' }
              : { backgroundColor: '#F59E0B20' },
          ]}
        >
          <Text
            style={[
              styles.revTagText,
              rev.tag === 'UI/UX'
                ? { color: '#6366F1' }
                : rev.tag === 'Performance'
                ? { color: '#10B981' }
                : { color: '#F59E0B' },
            ]}
          >
            {rev.tag}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View
          style={[
            styles.revStatusPill,
            rev.status === 'resolved'
              ? styles.statusResolved
              : styles.statusInProgress,
          ]}
        >
          <Text style={styles.revStatusText}>
            {rev.status === 'resolved'
              ? 'Çözüldü & Onaylandı'
              : rev.status === 'in_progress'
              ? 'Geliştiriliyor'
              : 'İnceleniyor'}
          </Text>
        </View>
      </View>

      <Text style={styles.revTitle}>{rev.title}</Text>
      <Text style={styles.revNotes}>{rev.notes}</Text>
      <Text style={styles.revDate}>
        Talep Tarihi: {new Date(rev.requestedAt).toLocaleDateString('tr-TR')}
      </Text>
    </SurfaceCard>
  );
});

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { projects, milestones, approveMilestone, requestRevision } = useAppStore();

  const projectId = (Array.isArray(id) ? id[0] : id) || 'proj_1';
  const legacyProject = projects.find((p) => p.id === projectId) || projects[0];

  const vault = useProjectVaultController(projectId);

  const [activeRevisionMilestone, setActiveRevisionMilestone] =
    React.useState<ProjectMilestone | null>(null);

  const projectMilestones = React.useMemo(
    () => milestones.filter((m) => m.projectId === legacyProject?.id),
    [milestones, legacyProject?.id]
  );

  const handleOpenLiveUrl = React.useCallback(() => {
    const url = vault.project?.liveUrl || legacyProject?.liveUrl;
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  }, [vault.project?.liveUrl, legacyProject?.liveUrl]);

  const handleOpenRevision = React.useCallback((mId: string) => {
    const item = milestones.find((m) => m.id === mId);
    if (item) setActiveRevisionMilestone(item);
  }, [milestones]);

  const handleSubmitRevision = React.useCallback((mId: string, note: string) => {
    requestRevision(mId, note);
    setActiveRevisionMilestone(null);
  }, [requestRevision]);

  const handleSignConfirm = React.useCallback((docId: string, title: string) => {
    vault.signDocument(docId);
    if (Platform.OS === 'web') {
      window.alert(`"${title}" başarıyla dijital olarak onaylandı ve e-imza blokzincirine işlendi.`);
    } else {
      Alert.alert('E-İmza Onayı', `"${title}" belgesi başarıyla imzalandı.`);
    }
  }, [vault]);

  const handleDownloadDoc = React.useCallback((docId: string) => {
    vault.downloadDocument(docId);
  }, [vault]);

  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 24 : Math.max(insets.top, 16);

  const displayTitle = vault.project?.title || legacyProject?.title || 'Proje Detayı';
  const displayClient = vault.project?.clientName || legacyProject?.clientName || 'Müşteri';
  const displayCategory = vault.project?.category || legacyProject?.category || 'Mobil & Web';
  const displayProgress = vault.project?.progressPercentage ?? legacyProject?.progressPercentage ?? 80;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={Colors.textPrimary} />
            <Text style={styles.backText}>Geri</Text>
          </Pressable>
          <StatusBadge
            label={displayCategory.toUpperCase()}
            variant="primary"
            size="sm"
          />
        </View>

        {/* Project Header Card */}
        <SurfaceCard style={styles.headerCard} padding="large">
          <Text style={styles.clientLabel}>{displayClient}</Text>
          <Text style={styles.projectTitle}>{displayTitle}</Text>

          {/* Progress Indicator */}
          <View style={styles.progressWrap}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Genel İlerleme</Text>
              <Text style={styles.progressPercent}>%{displayProgress}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${displayProgress}%` },
                ]}
              />
            </View>
          </View>

          {/* Live Link & Repo actions */}
          <View style={styles.linkRow}>
            {(vault.project?.liveUrl || legacyProject?.liveUrl) && (
              <AppButton
                title="Canlı Staging Önizleme"
                variant="primary"
                size="sm"
                onPress={handleOpenLiveUrl}
                icon={<ExternalLink size={13} color={Colors.textInverse} />}
              />
            )}
            <View style={{ flex: 1 }} />
            {legacyProject?.repository && (
              <View style={styles.repoBox}>
                <GitBranch size={13} color={Colors.textSecondary} />
                <Text style={styles.repoText}>{legacyProject.repository}</Text>
              </View>
            )}
          </View>
        </SurfaceCard>

        {/* Relational Enterprise Tab Navigator */}
        <View style={styles.segmentedContainer}>
          <Pressable
            onPress={() => vault.setActiveTab('milestones')}
            style={[
              styles.segmentedTab,
              vault.activeTab === 'milestones' && styles.segmentedTabActive,
            ]}
          >
            <Layers
              size={14}
              color={vault.activeTab === 'milestones' ? Colors.primary : Colors.textTertiary}
            />
            <Text
              style={[
                styles.segmentedTabText,
                vault.activeTab === 'milestones' && styles.segmentedTabTextActive,
              ]}
            >
              Sprintler
            </Text>
          </Pressable>

          <Pressable
            onPress={() => vault.setActiveTab('documents')}
            style={[
              styles.segmentedTab,
              vault.activeTab === 'documents' && styles.segmentedTabActive,
            ]}
          >
            <FileText
              size={14}
              color={vault.activeTab === 'documents' ? Colors.primary : Colors.textTertiary}
            />
            <Text
              style={[
                styles.segmentedTabText,
                vault.activeTab === 'documents' && styles.segmentedTabTextActive,
              ]}
            >
              Belgeler ({vault.allDocumentsCount})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => vault.setActiveTab('media')}
            style={[
              styles.segmentedTab,
              vault.activeTab === 'media' && styles.segmentedTabActive,
            ]}
          >
            <Video
              size={14}
              color={vault.activeTab === 'media' ? Colors.primary : Colors.textTertiary}
            />
            <Text
              style={[
                styles.segmentedTabText,
                vault.activeTab === 'media' && styles.segmentedTabTextActive,
              ]}
            >
              Medya ({vault.allMediaCount})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => vault.setActiveTab('revisions')}
            style={[
              styles.segmentedTab,
              vault.activeTab === 'revisions' && styles.segmentedTabActive,
            ]}
          >
            <Sparkles
              size={14}
              color={vault.activeTab === 'revisions' ? Colors.primary : Colors.textTertiary}
            />
            <Text
              style={[
                styles.segmentedTabText,
                vault.activeTab === 'revisions' && styles.segmentedTabTextActive,
              ]}
            >
              Revizyonlar ({vault.revisions.length})
            </Text>
          </Pressable>
        </View>

        {/* TAB 1: SPRINTLER & MILESTONES */}
        {vault.activeTab === 'milestones' && (
          <>
            {/* Sprint Roadmap & Architecture Card */}
            <SurfaceCard style={styles.metaCard} padding="standard">
              <View style={styles.metaItem}>
                <View style={styles.metaIcon}>
                  <Layers size={16} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metaLabel}>Aktif Sprint & Hedef</Text>
                  <Text style={styles.metaValue}>{legacyProject?.activeSprint || 'Sprint 4: Enterprise MVC Engine'}</Text>
                </View>
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.metaItem}>
                <View style={styles.metaIcon}>
                  <Clock size={16} color={Colors.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metaLabel}>Sıradaki Teslimat</Text>
                  <Text style={styles.metaValue}>{legacyProject?.nextMilestone || 'Staging Deployment & QA'}</Text>
                </View>
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.metaItem}>
                <View style={styles.metaIcon}>
                  <Cpu size={16} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metaLabel}>Teknik Altyapı</Text>
                  <Text style={styles.metaValue}>
                    {vault.project?.techStack.join(' • ') || 'Expo SDK 54 • React 19 • TurboModules • MMKV'}
                  </Text>
                </View>
              </View>
            </SurfaceCard>

            {/* Milestones list */}
            <View style={styles.milestonesSection}>
              <Text style={styles.sectionTitle}>Sprint Kilometre Taşları</Text>
              <Text style={styles.sectionSubtitle}>
                Bu projeye ait onay bekleyen ve tamamlanan adımlar
              </Text>

              {projectMilestones.length === 0 ? (
                <SurfaceCard style={styles.emptyCard} padding="standard">
                  <Text style={styles.emptyText}>
                    Bu proje için henüz açık bir kilometre taşı bulunmuyor.
                  </Text>
                </SurfaceCard>
              ) : (
                projectMilestones.map((m) => (
                  <MilestoneItem
                    key={m.id}
                    milestone={m}
                    onApprove={approveMilestone}
                    onRequestRevision={handleOpenRevision}
                  />
                ))
              )}
            </View>
          </>
        )}

        {/* TAB 2: BELGELER & SÖZLEŞMELER */}
        {vault.activeTab === 'documents' && (
          <View style={styles.tabContent}>
            {/* Filter pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
              {(['all', 'contract', 'specification', 'invoice', 'nda'] as const).map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => vault.setDocFilter(cat)}
                  style={[
                    styles.filterPill,
                    vault.docFilter === cat && styles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      vault.docFilter === cat && styles.filterPillTextActive,
                    ]}
                  >
                    {cat === 'all'
                      ? 'Tümü'
                      : cat === 'contract'
                      ? 'Sözleşmeler'
                      : cat === 'specification'
                      ? 'Şartnameler'
                      : cat === 'invoice'
                      ? 'Faturalar'
                      : 'NDA & Gizlilik'}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {vault.documents.length === 0 ? (
              <SurfaceCard style={styles.emptyCard} padding="standard">
                <Text style={styles.emptyText}>Bu kategoride belge bulunamadı.</Text>
              </SurfaceCard>
            ) : (
              vault.documents.map((doc) => (
                <DocumentItemCard
                  key={doc.id}
                  doc={doc}
                  onSign={handleSignConfirm}
                  onDownload={handleDownloadDoc}
                />
              ))
            )}
          </View>
        )}

        {/* TAB 3: MEDYA & VİDEOLAR */}
        {vault.activeTab === 'media' && (
          <View style={styles.tabContent}>
            {/* Filter pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
              {(['all', 'video', 'image', 'figma'] as const).map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => vault.setMediaFilter(cat)}
                  style={[
                    styles.filterPill,
                    vault.mediaFilter === cat && styles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      vault.mediaFilter === cat && styles.filterPillTextActive,
                    ]}
                  >
                    {cat === 'all'
                      ? 'Tümü'
                      : cat === 'video'
                      ? 'Videolar (1080p/4K)'
                      : cat === 'image'
                      ? 'Görseller & UI'
                      : 'Figma Prototipleri'}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {vault.media.length === 0 ? (
              <SurfaceCard style={styles.emptyCard} padding="standard">
                <Text style={styles.emptyText}>Bu formatta medya dosyası bulunamadı.</Text>
              </SurfaceCard>
            ) : (
              vault.media.map((med) => (
                <MediaItemCard key={med.id} med={med} />
              ))
            )}
          </View>
        )}

        {/* TAB 4: REVİZYONLAR & AUDİT */}
        {vault.activeTab === 'revisions' && (
          <View style={styles.tabContent}>
            {vault.revisions.length === 0 ? (
              <SurfaceCard style={styles.emptyCard} padding="standard">
                <Text style={styles.emptyText}>Henüz kaydedilmiş bir revizyon kaydı yok.</Text>
              </SurfaceCard>
            ) : (
              vault.revisions.map((rev) => (
                <RevisionItemCard key={rev.id} rev={rev} />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Revision Modal */}
      <RevisionModal
        visible={!!activeRevisionMilestone}
        milestoneId={activeRevisionMilestone?.id || ''}
        milestoneTitle={activeRevisionMilestone?.title || ''}
        onClose={() => setActiveRevisionMilestone(null)}
        onSubmit={handleSubmitRevision}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: 40,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: {
    ...Typography.cardTitle,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  headerCard: {
    marginBottom: 16,
  },
  clientLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  projectTitle: {
    ...Typography.largeTitle,
    fontSize: 22,
    lineHeight: 28,
    color: Colors.textPrimary,
    marginTop: 4,
    marginBottom: 16,
  },
  progressWrap: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  progressPercent: {
    ...Typography.cardTitle,
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  repoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  repoText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F1523',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 16,
    gap: 4,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  segmentedTabActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
  segmentedTabText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  segmentedTabTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  metaCard: {
    marginBottom: Spacing.cardGap,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  metaDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  milestonesSection: {
    gap: 12,
  },
  sectionTitle: {
    ...Typography.cardTitle,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: -8,
    marginBottom: 4,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  emptyText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  tabContent: {
    gap: 12,
  },
  filterPillsRow: {
    gap: 8,
    paddingBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterPillActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: Colors.primary,
  },
  filterPillText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  filterPillTextActive: {
    color: Colors.textPrimary,
  },
  docCard: {
    marginBottom: 8,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitle: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  docMetaBadge: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  docMetaText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  docMetaBullet: {
    color: Colors.textTertiary,
    fontSize: 10,
  },
  docDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 12,
  },
  docFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  signedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signedText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  unsignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unsignedText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
  docActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mediaCard: {
    marginBottom: 10,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  mediaThumbnailBox: {
    width: 90,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#0F1626',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mediaPlayOverlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  resBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  durationText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mediaBody: {
    flex: 1,
  },
  mediaTitle: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
  mediaUploader: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  revCard: {
    marginBottom: 10,
  },
  revHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  revTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  revTagText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
  },
  revStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusResolved: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusInProgress: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  revStatusText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  revTitle: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  revNotes: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  revDate: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
});

import { useState, useCallback, useMemo } from 'react';
import { projectRepository } from '@/services/database/repositories/project.repository';
import { documentRepository } from '@/services/database/repositories/document.repository';
import { mediaRepository } from '@/services/database/repositories/media.repository';
import {
  IProjectEntity,
  IDocumentEntity,
  IMediaAssetEntity,
  IMilestoneRevisionEntity,
  DocumentType,
  MediaType,
} from '@/models/database/entities.types';
import { soundService } from '@/core/audio/sound.service';
import { useAppStore } from '@/core/store/app.store';

export type VaultTab = 'milestones' | 'documents' | 'media' | 'revisions';

export function useProjectVaultController(projectId: string) {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<VaultTab>('milestones');
  const [docFilter, setDocFilter] = useState<DocumentType | 'all'>('all');
  const [mediaFilter, setMediaFilter] = useState<MediaType | 'all'>('all');
  const [tick, setTick] = useState(0);

  const refreshVault = useCallback(() => {
    setTick((prev) => prev + 1);
  }, []);

  const fullGraph = useMemo(() => {
    // depend on tick for reactive re-render
    const _t = tick;
    const direct = projectRepository.getFullGraph(projectId);
    if (direct) return direct;
    const all = projectRepository.getAll();
    if (all.length > 0) {
      return projectRepository.getFullGraph(all[0].id);
    }
    return null;
  }, [projectId, tick]);

  const project = fullGraph?.project || null;

  const filteredDocuments = useMemo(() => {
    if (!fullGraph?.documents) return [];
    if (docFilter === 'all') return fullGraph.documents;
    return fullGraph.documents.filter((d) => d.type === docFilter);
  }, [fullGraph?.documents, docFilter]);

  const filteredMedia = useMemo(() => {
    if (!fullGraph?.media) return [];
    if (mediaFilter === 'all') return fullGraph.media;
    return fullGraph.media.filter((m) => m.mediaType === mediaFilter);
  }, [fullGraph?.media, mediaFilter]);

  const revisions = fullGraph?.revisions || [];

  const signDocument = useCallback(
    (docId: string) => {
      const signer = user?.fullName || 'Müşteri Yetkilisi';
      const updated = documentRepository.signDocument(docId, signer);
      if (updated) {
        soundService.playSuccess();
        refreshVault();
      }
      return updated;
    },
    [user, refreshVault]
  );

  const downloadDocument = useCallback(
    (docId: string) => {
      documentRepository.incrementDownload(docId);
      soundService.playPop();
      refreshVault();
    },
    [refreshVault]
  );

  return {
    activeTab,
    setActiveTab,
    docFilter,
    setDocFilter,
    mediaFilter,
    setMediaFilter,
    project,
    documents: filteredDocuments,
    allDocumentsCount: fullGraph?.documents.length || 0,
    media: filteredMedia,
    allMediaCount: fullGraph?.media.length || 0,
    revisions,
    signDocument,
    downloadDocument,
    refreshVault,
  };
}

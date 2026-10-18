import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing } from '@/core/theme';
import { AppButton } from '../buttons/AppButton';
import { StatusBadge } from '../cards/StatusBadge';
import { MediaPicker, SelectedMedia } from '../media/MediaPicker';
import { X, RotateCcw, AlertCircle } from 'lucide-react-native';

interface RevisionModalProps {
  visible: boolean;
  milestoneTitle: string;
  milestoneId: string;
  onClose: () => void;
  onSubmit: (id: string, note: string) => void;
}

const REVISION_TAGS = [
  'Tasarım / UI Düzeltmesi',
  'İşlev / Fonksiyon Hatası',
  'Metin / İçerik Değişimi',
  'Hız / Performans Talebi',
];

export const RevisionModal: React.FC<RevisionModalProps> = ({
  visible,
  milestoneTitle,
  milestoneId,
  onClose,
  onSubmit,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(REVISION_TAGS[0]);
  const [note, setNote] = useState<string>('');
  const [attachedMedia, setAttachedMedia] = useState<SelectedMedia | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!note.trim() || note.trim().length < 5) {
      setError('Lütfen en az 5 karakterlik bir revizyon açıklaması yazınız');
      return;
    }
    const fullNote = `[${selectedTag}] ${note.trim()}`;
    onSubmit(milestoneId, fullNote);
    setNote('');
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <RotateCcw size={18} color={Colors.warning} />
              <Text style={styles.headerTitle}>Revizyon Talebi</Text>
            </View>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.milestoneBox}>
            <Text style={styles.milestoneLabel}>Geliştirme / Görev:</Text>
            <Text style={styles.milestoneTitle} numberOfLines={2}>
              {milestoneTitle}
            </Text>
          </View>

          <Text style={styles.label}>Revizyon Kategorisi</Text>
          <View style={styles.tagGrid}>
            {REVISION_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <Pressable
                  key={tag}
                  onPress={() => setSelectedTag(tag)}
                  style={[styles.tag, isSelected && styles.tagActive]}
                >
                  <Text
                    style={[styles.tagText, isSelected && styles.tagTextActive]}
                  >
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Revizyon Detayları & Açıklama *</Text>
          <TextInput
            style={styles.textArea}
            value={note}
            onChangeText={(text) => {
              setNote(text);
              if (error) setError(null);
            }}
            placeholder="Nelerin değiştirilmesini veya revize edilmesini istediğinizi detaylandırın..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            numberOfLines={4}
          />

          <MediaPicker
            media={attachedMedia}
            onMediaSelected={setAttachedMedia}
            label="Ekran Görüntüsü / Hata Videosu Ekle"
          />

          {error && (
            <View style={styles.errorBox}>
              <AlertCircle size={14} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.actions}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <AppButton
                title="Vazgeç"
                variant="outline"
                size="md"
                onPress={handleClose}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <AppButton
                title="Talebi İlet"
                variant="primary"
                size="md"
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenHorizontal,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusCard,
    padding: 20,
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      web: {
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.12)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...Typography.title2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  milestoneBox: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.borderHairline,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  milestoneLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  milestoneTitle: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  label: {
    ...Typography.footnote,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderColor: Colors.borderHairline,
    borderWidth: 1,
  },
  tagActive: {
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warningBorder,
  },
  tagText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  tagTextActive: {
    color: Colors.warning,
    fontWeight: '700',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.dangerBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  errorText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 6,
  },
});

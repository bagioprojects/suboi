import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing } from '@/core/theme';
import { soundService } from '@/core/audio/sound.service';
import { Camera, Image as ImageIcon, Video, X, Plus } from 'lucide-react-native';

export interface SelectedMedia {
  uri: string;
  type: 'image' | 'video';
  name?: string;
  size?: number;
}

interface MediaPickerProps {
  onMediaSelected: (media: SelectedMedia | null) => void;
  media: SelectedMedia | null;
  label?: string;
  allowVideo?: boolean;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  onMediaSelected,
  media,
  label = 'Görsel veya Video Ekle (Opsiyonel)',
  allowVideo = true,
}) => {
  const pickImage = async () => {
    soundService.playPop();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowVideo
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onMediaSelected({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          name: asset.fileName || 'eklenen_medya',
          size: asset.fileSize,
        });
      }
    } catch (e) {
      console.warn('Image picker error:', e);
    }
  };

  const removeMedia = () => {
    soundService.playClick();
    onMediaSelected(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {media ? (
        <View style={styles.previewContainer}>
          {media.type === 'video' ? (
            <View style={styles.videoPlaceholder}>
              <Video size={28} color={Colors.primary} />
              <Text style={styles.videoName} numberOfLines={1}>
                {media.name || 'Seçilen Video'}
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: media.uri }}
              style={styles.imagePreview}
              contentFit="cover"
            />
          )}

          <Pressable onPress={removeMedia} style={styles.deleteBtn}>
            <X size={14} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={pickImage} style={styles.uploadButton}>
          <View style={styles.iconCircle}>
            <Plus size={16} color={Colors.primary} />
          </View>
          <View style={styles.uploadTextWrap}>
            <Text style={styles.uploadTitle}>Fotoğraf veya Video Seç</Text>
            <Text style={styles.uploadSubtitle}>
              PNG, JPG, MP4 (Maks. 25MB)
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: '#F8FAFC',
    borderRadius: Spacing.radiusInner,
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTextWrap: {
    flex: 1,
  },
  uploadTitle: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  uploadSubtitle: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  previewContainer: {
    position: 'relative',
    height: 120,
    borderRadius: Spacing.radiusInner,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    backgroundColor: '#F1F5F9',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
  },
  videoName: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

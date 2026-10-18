import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/core/store/app.store';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SurfaceCard } from '../cards/SurfaceCard';
import { StatusBadge } from '../cards/StatusBadge';
import { AppButton } from '../buttons/AppButton';
import {
  X,
  Building2,
  FileText,
  Mail,
  Phone,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react-native';

interface ProfileSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    onClose();
    router.replace('/(auth)/login');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Firma & Müşteri Profili</Text>
              <Text style={styles.sub}>Hubio Executive Portal Kimliği</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.badgeRow}>
            <StatusBadge
              label={user?.userType === 'corporate' ? 'Kurumsal Onaylı Müşteri' : 'Bireysel Girişim'}
              variant="accent"
              size="md"
            />
          </View>

          {/* Details Card */}
          <SurfaceCard style={styles.infoCard} padding="standard">
            <View style={styles.infoItem}>
              <Building2 size={16} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Firma Unvanı</Text>
                <Text style={styles.infoValue}>
                  {user?.companyTitle || 'NovaTech Bilişim & E-Ticaret A.Ş.'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <FileText size={16} color={Colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Vergi Numarası & Dairesi</Text>
                <Text style={styles.infoValue}>
                  {user?.taxNumber || '6310928374 (Kadıköy V.D.)'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <User size={16} color={Colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Yetkili Temsilci</Text>
                <Text style={styles.infoValue}>
                  {user?.fullName || 'Ahmet Yılmaz'} (
                  {user?.authorizedPersonTitle || 'Genel Müdür'})
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <Mail size={16} color={Colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>İletişim E-Posta</Text>
                <Text style={styles.infoValue}>
                  {user?.email || 'ahmet.yilmaz@novatech.com.tr'}
                </Text>
              </View>
            </View>
          </SurfaceCard>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <AppButton
              title="Oturumu Kapat"
              variant="outline"
              size="md"
              onPress={handleLogout}
              icon={<LogOut size={16} color={Colors.danger} />}
              textStyle={{ color: Colors.danger }}
            />
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
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    ...Typography.title2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  sub: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
  },
  badgeRow: {
    marginBottom: 14,
  },
  infoCard: {
    marginBottom: 18,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  infoValue: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderHairline,
    marginVertical: 4,
  },
  actionRow: {
    marginTop: 4,
  },
});

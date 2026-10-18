import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/core/theme';
import { AppButton } from '@/views/components/buttons/AppButton';
import { SurfaceCard } from '@/views/components/cards/SurfaceCard';
import { useAuthController } from '@/controllers/useAuthController';
import { UserType, RegisterSchema } from '@/models/auth.model';
import { Building2, User, Mail, Lock, Phone, FileText } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, submitting, error } = useAuthController();

  const [userType, setUserType] = useState<UserType>('corporate');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  // Kurumsal alanlar
  const [companyTitle, setCompanyTitle] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [authorizedPersonTitle, setAuthorizedPersonTitle] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setLocalError(null);
      const parsed = RegisterSchema.safeParse({
        userType,
        fullName,
        email,
        phone,
        password,
        companyTitle: userType === 'corporate' ? companyTitle : undefined,
        taxNumber: userType === 'corporate' ? taxNumber : undefined,
        authorizedPersonTitle: userType === 'corporate' ? authorizedPersonTitle : undefined,
      });

      if (!parsed.success) {
        setLocalError(parsed.error.issues[0]?.message || 'Lütfen bilgileri kontrol ediniz');
        return;
      }

      await register(parsed.data);
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      setLocalError(e.message || 'Kayıt işlemi başarısız');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandHeader}>
          <Text style={styles.brandTitle}>HUBIO Müşteri Portalı</Text>
          <Text style={styles.brandSubtitle}>Yeni Müşteri Kaydı</Text>
        </View>

        <SurfaceCard style={styles.card} padding="large">
          {/* User Type Switcher */}
          <Text style={styles.inputLabel}>Hesap Tipi</Text>
          <View style={styles.typeSwitcher}>
            <Pressable
              style={[
                styles.typeButton,
                userType === 'individual' && styles.typeButtonActive,
              ]}
              onPress={() => setUserType('individual')}
            >
              <User
                size={16}
                color={userType === 'individual' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  userType === 'individual' && styles.typeButtonTextActive,
                ]}
              >
                Bireysel Girişim
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.typeButton,
                userType === 'corporate' && styles.typeButtonActive,
              ]}
              onPress={() => setUserType('corporate')}
            >
              <Building2
                size={16}
                color={userType === 'corporate' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  userType === 'corporate' && styles.typeButtonTextActive,
                ]}
              >
                Kurumsal Firma
              </Text>
            </Pressable>
          </View>

          {(localError || error) && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{localError || error}</Text>
            </View>
          )}

          {/* Kurumsal Özel Alanlar */}
          {userType === 'corporate' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Firma Unvanı *</Text>
                <View style={styles.inputContainer}>
                  <Building2 size={16} color={Colors.textTertiary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Örn: NovaTech Bilişim A.Ş."
                    placeholderTextColor={Colors.textTertiary}
                    value={companyTitle}
                    onChangeText={setCompanyTitle}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vergi Numarası / Vergi Dairesi *</Text>
                <View style={styles.inputContainer}>
                  <FileText size={16} color={Colors.textTertiary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="10 Haneli Vergi No"
                    placeholderTextColor={Colors.textTertiary}
                    value={taxNumber}
                    onChangeText={setTaxNumber}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yetkili Unvanı</Text>
                <View style={styles.inputContainer}>
                  <User size={16} color={Colors.textTertiary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Örn: Genel Müdür, Pazarlama Direktörü"
                    placeholderTextColor={Colors.textTertiary}
                    value={authorizedPersonTitle}
                    onChangeText={setAuthorizedPersonTitle}
                  />
                </View>
              </View>
            </>
          )}

          {/* Ortak Alanlar */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Yetkili Adı Soyadı *</Text>
            <View style={styles.inputContainer}>
              <User size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.textInput}
                placeholder="Ad Soyad"
                placeholderTextColor={Colors.textTertiary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-Posta Adresi *</Text>
            <View style={styles.inputContainer}>
              <Mail size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.textInput}
                placeholder="iletisim@firma.com"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Telefon Numarası *</Text>
            <View style={styles.inputContainer}>
              <Phone size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.textInput}
                placeholder="+90 5XX XXX XX XX"
                placeholderTextColor={Colors.textTertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şifre Belirleyin *</Text>
            <View style={styles.inputContainer}>
              <Lock size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.textInput}
                placeholder="En az 6 karakter"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <AppButton
              title="Kaydı Tamamla ve Giriş Yap"
              variant="primary"
              size="lg"
              loading={submitting}
              onPress={handleRegister}
            />
          </View>
        </SurfaceCard>

        <View style={styles.footerRow}>
          <Text style={styles.footerPrompt}>Zaten Hubio hesabınız var mı?</Text>
          <AppButton
            title="Giriş Yap"
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Platform.OS === 'web' ? 30 : 50,
    paddingBottom: 40,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  brandSubtitle: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    marginBottom: 20,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Spacing.radiusInner,
    padding: 3,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: Spacing.radiusInner - 2,
  },
  typeButtonActive: {
    backgroundColor: Colors.surface,
  },
  typeButtonText: {
    ...Typography.footnote,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    ...Typography.footnote,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 5,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    borderRadius: Spacing.radiusInner,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    height: 46,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  errorBox: {
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.dangerBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  footerPrompt: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
});

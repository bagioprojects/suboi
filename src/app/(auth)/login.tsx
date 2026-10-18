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
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, useResponsive } from '@/core/theme';
import { AppButton } from '@/views/components/buttons/AppButton';
import { SurfaceCard } from '@/views/components/cards/SurfaceCard';
import { useAuthController } from '@/controllers/useAuthController';
import { socialAuthService } from '@/services/social-auth.service';
import { soundService } from '@/core/audio/sound.service';
import { RegisterSchema, UserType } from '@/models/auth.model';
import { AppleBrandIcon, GoogleBrandIcon } from '@/views/components/icons/BrandIcons';
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';

const calculatePasswordStrength = (pass: string) => {
  if (!pass) return { score: 0, label: '', color: '#CBD5E1' };
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score === 1) return { score: 33, label: 'Zayıf', color: '#EF4444' };
  if (score === 2) return { score: 66, label: 'Orta', color: '#F59E0B' };
  return { score: 100, label: 'Güçlü', color: '#10B981' };
};

export default function UnifiedAuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSmallDevice } = useResponsive();
  const { login, register, submitting, error } = useAuthController();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('yonetim@novatech.com.tr');
  const [loginPassword, setLoginPassword] = useState('hubio2026!');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [userType, setUserType] = useState<UserType>('corporate');
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [companyTitle, setCompanyTitle] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [sector, setSector] = useState('');
  const [authorizedPersonTitle, setAuthorizedPersonTitle] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [localError, setLocalError] = useState<string | null>(null);

  // Quick Demo account switcher with instant touch reaction
  const handleQuickDemo = React.useCallback((type: 'novatech' | 'atlas' | 'individual') => {
    soundService.playPop();
    setLocalError(null);
    if (type === 'novatech') {
      setLoginEmail('yonetim@novatech.com.tr');
      setLoginPassword('hubio2026!');
    } else if (type === 'atlas') {
      setLoginEmail('info@atlasholding.com.tr');
      setLoginPassword('atlas2026!');
    } else {
      setLoginEmail('ahmet.yilmaz@novatech.com.tr');
      setLoginPassword('password123');
    }
  }, []);

  const handleLoginSubmit = React.useCallback(async () => {
    try {
      setLocalError(null);
      await login({ email: loginEmail, password: loginPassword });
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      setLocalError(e.message || 'Giriş yapılamadı');
    }
  }, [login, loginEmail, loginPassword, router]);

  const handleRegisterSubmit = React.useCallback(async () => {
    try {
      setLocalError(null);

      if (!acceptTerms) {
        setLocalError('Lütfen KVKK ve Kurumsal Kullanıcı Sözleşmesini onaylayınız');
        return;
      }

      const parsed = RegisterSchema.safeParse({
        userType,
        fullName,
        email: regEmail,
        phone,
        password: regPassword,
        companyTitle: userType === 'corporate' ? companyTitle : undefined,
        taxNumber: userType === 'corporate' ? taxNumber : undefined,
        authorizedPersonTitle: userType === 'corporate' ? authorizedPersonTitle : undefined,
      });

      if (!parsed.success) {
        setLocalError(parsed.error.issues[0]?.message || 'Lütfen form alanlarını kontrol ediniz');
        return;
      }

      await register(parsed.data);
      router.replace('/(tabs)/dashboard');
    } catch (e: any) {
      setLocalError(e.message || 'Kayıt işlemi başarısız');
    }
  }, [acceptTerms, userType, fullName, regEmail, phone, regPassword, companyTitle, taxNumber, authorizedPersonTitle, register, router]);

  const passStrength = React.useMemo(() => calculatePasswordStrength(regPassword), [regPassword]);

  const topPadding = Platform.OS === 'web' ? 32 : Math.max(insets.top + 16, 24);
  const bottomPadding = Math.max(insets.bottom + 24, 30);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: bottomPadding },
        ]}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Ultra-HD Transparent Hubio 3D Emblem Header */}
        <View style={styles.brandHeader}>
          <View style={[styles.logoWrapper, isSmallDevice && styles.logoWrapperSmall]}>
            <Image
              source={require('../../../assets/hubio_logo_light.png')}
              style={styles.logoImage}
              contentFit="contain"
              priority="high"
            />
          </View>
          <Text style={styles.brandTitle}>HUBIO</Text>
        </View>

        {/* Auth Mode Switcher Tab Bar */}
        <View style={styles.tabSwitcher}>
          <Pressable
            style={({ pressed }) => [
              styles.tabButton,
              activeTab === 'login' && styles.tabButtonActive,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => {
              soundService.playPop();
              setLocalError(null);
              setActiveTab('login');
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'login' && styles.tabTextActive,
              ]}
            >
              Giriş Yap
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.tabButton,
              activeTab === 'register' && styles.tabButtonActive,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => {
              soundService.playPop();
              setLocalError(null);
              setActiveTab('register');
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'register' && styles.tabTextActive,
              ]}
            >
              Kayıt Ol
            </Text>
          </Pressable>
        </View>

        {/* Global Error Notice */}
        {(localError || error) && (
          <View style={styles.errorBox}>
            <AlertCircle size={15} color={Colors.danger} />
            <Text style={styles.errorText}>{localError || error}</Text>
          </View>
        )}

        {/* -------------------- TAB 1: LOGIN -------------------- */}
        {activeTab === 'login' && (
          <SurfaceCard style={styles.card} padding="large">
            {/* Quick Demo Switcher */}
            <View style={styles.demoProfileRow}>
              <Text style={styles.demoLabel}>Hızlı Demo Profili (Tek Tıkla Doldur):</Text>
              <View style={styles.demoChips}>
                <Pressable
                  style={({ pressed }) => [
                    styles.demoChip,
                    pressed && styles.demoChipPressed,
                  ]}
                  onPress={() => handleQuickDemo('novatech')}
                  hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                >
                  <Text style={styles.demoChipText}>NovaTech VIP</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.demoChip,
                    pressed && styles.demoChipPressed,
                  ]}
                  onPress={() => handleQuickDemo('atlas')}
                  hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                >
                  <Text style={styles.demoChipText}>Atlas Holding</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.demoChip,
                    pressed && styles.demoChipPressed,
                  ]}
                  onPress={() => handleQuickDemo('individual')}
                  hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                >
                  <Text style={styles.demoChipText}>Bireysel</Text>
                </Pressable>
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kurumsal E-Posta</Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color={Colors.textTertiary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="ornek@firma.com"
                  placeholderTextColor={Colors.textTertiary}
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Şifre</Text>
                <Pressable
                  onPress={() => router.push('/(auth)/forgot-password')}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.forgotPasswordLink}>Şifremi Unuttum?</Text>
                </Pressable>
              </View>
              <View style={styles.inputContainer}>
                <Lock size={18} color={Colors.textTertiary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textTertiary}
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry={!showLoginPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={() => setShowLoginPassword(!showLoginPassword)}
                  hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                  style={styles.eyeBtn}
                >
                  {showLoginPassword ? (
                    <EyeOff size={19} color={Colors.textTertiary} />
                  ) : (
                    <Eye size={19} color={Colors.textTertiary} />
                  )}
                </Pressable>
              </View>
            </View>

            <AppButton
              title="Güvenli Giriş Yap"
              variant="primary"
              size="lg"
              loading={submitting}
              onPress={handleLoginSubmit}
              icon={<ShieldCheck size={18} color={Colors.textInverse} />}
            />

            {/* Social Auth Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>VEYA KURUMSAL SSO İLE BAĞLAN</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialButtonsRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <AppButton
                  title="Apple"
                  variant="outline"
                  size="md"
                  icon={<AppleBrandIcon size={16} color="#0F172A" />}
                  onPress={async () => {
                    const res = await socialAuthService.signInWithApple();
                    if (res?.id) router.replace('/(tabs)/dashboard');
                  }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <AppButton
                  title="Google"
                  variant="outline"
                  size="md"
                  icon={<GoogleBrandIcon size={16} />}
                  onPress={async () => {
                    const res = await socialAuthService.signInWithGoogle();
                    if (res?.id) router.replace('/(tabs)/dashboard');
                  }}
                />
              </View>
            </View>
          </SurfaceCard>
        )}

        {/* -------------------- TAB 2: REGISTER -------------------- */}
        {activeTab === 'register' && (
          <SurfaceCard style={styles.card} padding="large">
            {/* User Type Toggle */}
            <View style={styles.userTypeRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.userTypeCard,
                  userType === 'corporate' && styles.userTypeCardActive,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() => {
                  soundService.playPop();
                  setUserType('corporate');
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Building2
                  size={18}
                  color={userType === 'corporate' ? Colors.primary : Colors.textTertiary}
                />
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'corporate' && styles.userTypeTextActive,
                  ]}
                >
                  Kurumsal Şirket
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.userTypeCard,
                  userType === 'individual' && styles.userTypeCardActive,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() => {
                  soundService.playPop();
                  setUserType('individual');
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <User
                  size={18}
                  color={userType === 'individual' ? Colors.primary : Colors.textTertiary}
                />
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'individual' && styles.userTypeTextActive,
                  ]}
                >
                  Bireysel Girişim
                </Text>
              </Pressable>
            </View>

            {/* Corporate Specific Fields */}
            {userType === 'corporate' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Firma Resmi Unvanı *</Text>
                  <View style={styles.inputContainer}>
                    <Building2 size={18} color={Colors.textTertiary} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Örn: NovaTech Bilişim & E-Ticaret A.Ş."
                      placeholderTextColor={Colors.textTertiary}
                      value={companyTitle}
                      onChangeText={setCompanyTitle}
                    />
                  </View>
                </View>

                <View style={styles.twoColRow}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
                    <Text style={styles.inputLabel}>Vergi Kimlik No (VKN) *</Text>
                    <TextInput
                      style={styles.textInputSingle}
                      placeholder="10 Haneli VKN"
                      placeholderTextColor={Colors.textTertiary}
                      value={taxNumber}
                      onChangeText={setTaxNumber}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
                    <Text style={styles.inputLabel}>Vergi Dairesi</Text>
                    <TextInput
                      style={styles.textInputSingle}
                      placeholder="Örn: Kadıköy V.D."
                      placeholderTextColor={Colors.textTertiary}
                      value={taxOffice}
                      onChangeText={setTaxOffice}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Yetkili Unvanı</Text>
                  <TextInput
                    style={styles.textInputSingle}
                    placeholder="Örn: Genel Müdür / CTO / Pazarlama Lideri"
                    placeholderTextColor={Colors.textTertiary}
                    value={authorizedPersonTitle}
                    onChangeText={setAuthorizedPersonTitle}
                  />
                </View>
              </>
            )}

            {/* Common Contact Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yetkili Adı Soyadı *</Text>
              <View style={styles.inputContainer}>
                <User size={18} color={Colors.textTertiary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ahmet Yılmaz"
                  placeholderTextColor={Colors.textTertiary}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kurumsal E-Posta *</Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color={Colors.textTertiary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="ahmet@firma.com"
                  placeholderTextColor={Colors.textTertiary}
                  value={regEmail}
                  onChangeText={setRegEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon Numarası</Text>
              <View style={styles.inputContainer}>
                <Phone size={18} color={Colors.textTertiary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="+90 532 000 00 00"
                  placeholderTextColor={Colors.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password Field with Strength Meter */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Güvenli Şifre * (En az 8 Karakter)</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color={Colors.textTertiary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textTertiary}
                  value={regPassword}
                  onChangeText={setRegPassword}
                  secureTextEntry={!showRegPassword}
                />
                <Pressable
                  onPress={() => setShowRegPassword(!showRegPassword)}
                  hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                  style={styles.eyeBtn}
                >
                  {showRegPassword ? (
                    <EyeOff size={19} color={Colors.textTertiary} />
                  ) : (
                    <Eye size={19} color={Colors.textTertiary} />
                  )}
                </Pressable>
              </View>

              {regPassword.length > 0 && (
                <View style={styles.strengthMeterContainer}>
                  <View style={styles.strengthBarTrack}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        { width: `${passStrength.score}%`, backgroundColor: passStrength.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthText, { color: passStrength.color }]}>
                    Şifre Gücü: {passStrength.label}
                  </Text>
                </View>
              )}
            </View>

            {/* Terms and KVKK Consent (Whole row is clickable) */}
            <Pressable
              style={({ pressed }) => [
                styles.termsRow,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {
                soundService.playPop();
                setAcceptTerms(!acceptTerms);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
                {acceptTerms && <CheckCircle2 size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                KVKK Aydınlatma Metnini ve Hubio Kurumsal Müşteri Hizmet Sözleşmesini kabul ediyorum.
              </Text>
            </Pressable>

            <AppButton
              title="Kurumsal Hesabımı Oluştur"
              variant="primary"
              size="lg"
              loading={submitting}
              onPress={handleRegisterSubmit}
              icon={<Sparkles size={16} color={Colors.textInverse} />}
            />
          </SurfaceCard>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoWrapperSmall: {
    width: 72,
    height: 72,
    marginBottom: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    ...Typography.largeTitle,
    fontSize: 26,
    lineHeight: 32,
    color: '#0F172A',
    letterSpacing: 2.5,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 4,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabText: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  card: {
    marginBottom: 24,
  },
  demoProfileRow: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
  },
  demoChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  demoChip: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.borderHairline,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoChipPressed: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.primary,
  },
  demoChipText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  twoColRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 5,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  forgotPasswordLink: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    height: '100%',
    paddingVertical: 0,
  },
  textInputSingle: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eyeBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderHairline,
  },
  dividerText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
    paddingHorizontal: 10,
    fontWeight: '700',
  },
  socialButtonsRow: {
    flexDirection: 'row',
  },
  userTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  userTypeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  userTypeCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.primary,
  },
  userTypeText: {
    ...Typography.cardTitle,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  userTypeTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  strengthMeterContainer: {
    marginTop: 6,
  },
  strengthBarTrack: {
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: {
    ...Typography.footnote,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    fontSize: 12,
    flex: 1,
  },
});

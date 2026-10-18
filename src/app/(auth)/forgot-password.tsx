import React, { useState, useEffect } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, useResponsive } from '@/core/theme';
import { AppButton } from '@/views/components/buttons/AppButton';
import { SurfaceCard } from '@/views/components/cards/SurfaceCard';
import { soundService } from '@/core/audio/sound.service';
import {
  ArrowLeft,
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSmallDevice } = useResponsive();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('yonetim@novatech.com.tr');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let timer: any;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendCode = async () => {
    setErrorMsg(null);
    if (!email || !email.includes('@')) {
      setErrorMsg('Lütfen geçerli bir kurumsal e-posta adresi giriniz');
      return;
    }
    setLoading(true);
    soundService.playPop();
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setCountdown(60);
      setCanResend(false);
      setOtpCode('849201'); // Pre-fill simulated OTP for effortless test
    }, 700);
  };

  const handleVerifyOtp = async () => {
    setErrorMsg(null);
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz');
      return;
    }
    setLoading(true);
    soundService.playPop();
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 600);
  };

  const handleResetPassword = async () => {
    setErrorMsg(null);
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Yeni şifreniz en az 8 karakter olmalıdır');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Girdiğiniz şifreler birbiriyle eşleşmiyor');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      soundService.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1400);
    }, 800);
  };

  const topPadding = Platform.OS === 'web' ? 32 : Math.max(insets.top + 16, 24);
  const bottomPadding = Math.max(insets.bottom + 20, 28);

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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={10}
          >
            <ArrowLeft size={20} color={Colors.textPrimary} />
            <Text style={styles.backText}>Girişe Dön</Text>
          </Pressable>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Adım {step} / 3</Text>
          </View>
        </View>

        {/* Brand Icon Header */}
        <View style={styles.iconHeader}>
          <View style={styles.iconBox}>
            <KeyRound size={28} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>
            Hubio kurumsal hesabınızın şifresini 3 güvenli adımda yenileyin
          </Text>
        </View>

        <SurfaceCard style={styles.card} padding="large">
          {errorMsg && (
            <View style={styles.errorBox}>
              <AlertCircle size={15} color={Colors.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {isSuccess ? (
            <View style={styles.successState}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={44} color={Colors.success} />
              </View>
              <Text style={styles.successTitle}>Şifreniz Yenilendi!</Text>
              <Text style={styles.successSub}>
                Yeni şifreniz başarıyla kaydedildi. Güvenli giriş ekranına yönlendiriliyorsunuz...
              </Text>
            </View>
          ) : (
            <>
              {/* STEP 1: Email Input */}
              {step === 1 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepHeading}>
                    1. Kurumsal E-Postanızı Doğrulayın
                  </Text>
                  <Text style={styles.stepDesc}>
                    Hesabınıza kayıtlı kurumsal e-posta adresinize tek kullanımlık 6 haneli güvenlik kodu göndereceğiz.
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Kurumsal E-Posta</Text>
                    <View style={styles.inputWrap}>
                      <Mail size={18} color={Colors.textTertiary} />
                      <TextInput
                        style={styles.textInput}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="ad.soyad@firma.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <AppButton
                    title="Doğrulama Kodu Gönder"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    onPress={handleSendCode}
                  />
                </View>
              )}

              {/* STEP 2: 6-Digit OTP */}
              {step === 2 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepHeading}>
                    2. Güvenlik Kodunu Girin
                  </Text>
                  <Text style={styles.stepDesc}>
                    <Text style={{ fontWeight: '700', color: Colors.textPrimary }}>{email}</Text> adresine gönderilen 6 haneli kodu giriniz.
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>6 Haneli Güvenlik Kodu (OTP)</Text>
                    <TextInput
                      style={[styles.textInput, styles.otpInput]}
                      value={otpCode}
                      onChangeText={setOtpCode}
                      placeholder="849201"
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <View style={styles.resendRow}>
                    <Text style={styles.timerText}>
                      {countdown > 0 ? `Kalan süre: ${countdown}s` : 'Süre doldu'}
                    </Text>
                    {canResend ? (
                      <Pressable
                        onPress={() => {
                          setCountdown(60);
                          setCanResend(false);
                          soundService.playPop();
                        }}
                      >
                        <Text style={styles.resendBtnText}>Tekrar Kod Gönder</Text>
                      </Pressable>
                    ) : (
                      <Text style={styles.disabledResend}>Yeni kod talep edilebilir</Text>
                    )}
                  </View>

                  <AppButton
                    title="Kodu Doğrula ve Devam Et"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    onPress={handleVerifyOtp}
                  />
                </View>
              )}

              {/* STEP 3: Set New Password */}
              {step === 3 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepHeading}>
                    3. Yeni Şifrenizi Belirleyin
                  </Text>
                  <Text style={styles.stepDesc}>
                    Güvenliğiniz için en az 8 karakterli, harf ve rakam içeren güçlü bir şifre seçiniz.
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Yeni Şifre</Text>
                    <View style={styles.inputWrap}>
                      <Lock size={18} color={Colors.textTertiary} />
                      <TextInput
                        style={styles.textInput}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="••••••••"
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
                    <View style={styles.inputWrap}>
                      <Lock size={18} color={Colors.textTertiary} />
                      <TextInput
                        style={styles.textInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="••••••••"
                        secureTextEntry
                      />
                    </View>
                  </View>

                  <AppButton
                    title="Şifreyi Güncelle ve Giriş Yap"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    onPress={handleResetPassword}
                  />
                </View>
              )}
            </>
          )}
        </SurfaceCard>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  backText: {
    ...Typography.footnote,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  stepBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  stepBadgeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    ...Typography.largeTitle,
    fontSize: 24,
    lineHeight: 30,
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    marginBottom: 24,
  },
  stepContainer: {
    width: '100%',
  },
  stepHeading: {
    ...Typography.cardTitle,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  stepDesc: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  otpInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    height: 52,
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '700',
    color: Colors.primary,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textTertiary,
  },
  resendBtnText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  disabledResend: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
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
  successState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    ...Typography.title2,
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: 6,
  },
  successSub: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

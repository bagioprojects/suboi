import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import {
  ServiceItem,
  NewProjectWizardSchema,
} from '@/models/service-catalog.model';
import { Colors, Typography, Spacing } from '@/core/theme';
import { SurfaceCard } from '../cards/SurfaceCard';
import { AppButton } from '../buttons/AppButton';
import { StatusBadge } from '../cards/StatusBadge';
import { MediaPicker, SelectedMedia } from '../media/MediaPicker';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Rocket,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react-native';

interface ProjectWizardModalProps {
  visible: boolean;
  selectedService: ServiceItem | null;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  submitting?: boolean;
}

export const ProjectWizardModal: React.FC<ProjectWizardModalProps> = ({
  visible,
  selectedService,
  onClose,
  onSubmit,
  submitting = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serviceId, setServiceId] = useState<string>(selectedService?.id || 'srv-001');
  const [projectTitle, setProjectTitle] = useState<string>(
    selectedService ? `${selectedService.title} Entegrasyonu` : ''
  );
  const [scopeDescription, setScopeDescription] = useState<string>('');
  const [priority, setPriority] = useState<'standard' | 'urgent'>('standard');
  const [estimatedBudget, setEstimatedBudget] = useState<string>('₺30.000 - ₺60.000');
  const [targetLaunchDate, setTargetLaunchDate] = useState<string>('2-3 Hafta İçinde');
  const [approvedTerms, setApprovedTerms] = useState<boolean>(true);
  const [wizardMedia, setWizardMedia] = useState<SelectedMedia | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!serviceId) {
        setErrorMsg('Lütfen bir hizmet seçiniz');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!projectTitle || projectTitle.length < 3) {
        setErrorMsg('Proje başlığı en az 3 karakter olmalıdır');
        return;
      }
      if (!scopeDescription || scopeDescription.length < 10) {
        setErrorMsg('Lütfen talebinizi biraz daha detaylandırın (en az 10 karakter)');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleFinalSubmit = async () => {
    try {
      setErrorMsg(null);
      const values = {
        serviceId,
        projectTitle,
        scopeDescription,
        priority,
        estimatedBudget,
        targetLaunchDate,
        approvedTerms,
      };

      const parsed = NewProjectWizardSchema.safeParse(values);
      if (!parsed.success) {
        setErrorMsg(parsed.error.issues[0]?.message || 'Lütfen zorunlu alanları doldurunuz');
        return;
      }

      await onSubmit(parsed.data);
      setIsSuccess(true);
    } catch (e: any) {
      setErrorMsg(e.message || 'Gönderim sırasında hata oluştu');
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setStep(1);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.headerTitle}>Yeni Çalışma Sihirbazı</Text>
              <Text style={styles.headerSubtitle}>
                {isSuccess ? 'İşlem Başarılı' : `Adım ${step} / 3`}
              </Text>
            </View>
            <Pressable onPress={handleModalClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>

          {/* Stepper Dots (if not success) */}
          {!isSuccess && (
            <View style={styles.stepperRow}>
              <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
              <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
              <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
              <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
              <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
            </View>
          )}

          <ScrollView style={styles.bodyScroll} keyboardShouldPersistTaps="handled">
            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {isSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconWrap}>
                  <CheckCircle2 size={48} color={Colors.success} />
                </View>
                <Text style={styles.successTitle}>Proje Talebiniz Alındı!</Text>
                <Text style={styles.successDesc}>
                  Teknik mimarımız ve proje yöneticimiz talebinizi inceledi. Sprint planlamanız oluşturuldu ve Geliştirme Takibi paneline eklendi.
                </Text>
                <View style={{ marginTop: 24, width: '100%' }}>
                  <AppButton
                    title="Geliştirme Paneline Git"
                    variant="primary"
                    size="lg"
                    onPress={handleModalClose}
                  />
                </View>
              </View>
            ) : (
              <>
                {/* STEP 1 */}
                {step === 1 && (
                  <View style={styles.stepContent}>
                    <Text style={styles.stepHeading}>
                      1. Adım: Hizmet ve Çalışma Alanı Seçimi
                    </Text>
                    <Text style={styles.stepInstruction}>
                      Başlatmak istediğiniz dijital çalışma alanını teyit edin:
                    </Text>

                    <Pressable
                      style={[
                        styles.optionCard,
                        serviceId === 'srv-001' && styles.optionCardActive,
                      ]}
                      onPress={() => {
                        setServiceId('srv-001');
                        setProjectTitle('Expo Mobil & Web Entegrasyonu');
                      }}
                    >
                      <View style={styles.optionHeader}>
                        <Text style={styles.optionTitle}>Mobil & Web Geliştirme</Text>
                        <Text style={styles.optionPrice}>₺85.000</Text>
                      </View>
                      <Text style={styles.optionDesc}>
                        Bridgeless Expo SDK 58, React 19 ve FlashList ile sıfır takılma.
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.optionCard,
                        serviceId === 'srv-002' && styles.optionCardActive,
                      ]}
                      onPress={() => {
                        setServiceId('srv-002');
                        setProjectTitle('AI GEO & Local SEO Kampanyası');
                      }}
                    >
                      <View style={styles.optionHeader}>
                        <Text style={styles.optionTitle}>AI GEO & Harita SEO</Text>
                        <Text style={styles.optionPrice}>₺32.000 / Ay</Text>
                      </View>
                      <Text style={styles.optionDesc}>
                        ChatGPT, Perplexity ve Harita sıralamalarında 1. sıraya yükseliş.
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.optionCard,
                        serviceId === 'srv-003' && styles.optionCardActive,
                      ]}
                      onPress={() => {
                        setServiceId('srv-003');
                        setProjectTitle('Core Web Vitals Hızlandırma');
                      }}
                    >
                      <View style={styles.optionHeader}>
                        <Text style={styles.optionTitle}>95+ PageSpeed Hızlandırma</Text>
                        <Text style={styles.optionPrice}>₺24.000</Text>
                      </View>
                      <Text style={styles.optionDesc}>
                        LCP 1.1 saniye, ThumbHash görsel pipeline ve Redis önbellek.
                      </Text>
                    </Pressable>
                  </View>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <View style={styles.stepContent}>
                    <Text style={styles.stepHeading}>
                      2. Adım: Proje Hedefi ve Teknik Detaylar
                    </Text>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Proje / Çalışma Başlığı *</Text>
                      <TextInput
                        style={styles.textInput}
                        value={projectTitle}
                        onChangeText={setProjectTitle}
                        placeholder="Örn: B2B Ödeme Modülü Yenilemesi"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Kapsam & Talebiniz *</Text>
                      <TextInput
                        style={[styles.textInput, styles.textArea]}
                        value={scopeDescription}
                        onChangeText={setScopeDescription}
                        placeholder="Hangi özelliklerin eklenmesini veya nelerin optimize edilmesini istiyorsunuz?"
                        multiline
                        numberOfLines={4}
                      />
                    </View>

                    <MediaPicker
                      media={wizardMedia}
                      onMediaSelected={setWizardMedia}
                      label="Tasarım Mockup / Proje Dosyası Ekleyin"
                    />

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Öncelik Derecesi</Text>
                      <View style={styles.priorityRow}>
                        <Pressable
                          style={[
                            styles.priorityBtn,
                            priority === 'standard' && styles.priorityBtnActive,
                          ]}
                          onPress={() => setPriority('standard')}
                        >
                          <Text
                            style={[
                              styles.priorityBtnText,
                              priority === 'standard' && styles.priorityBtnTextActive,
                            ]}
                          >
                            Standart Sprint
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.priorityBtn,
                            priority === 'urgent' && styles.priorityBtnActiveUrgent,
                          ]}
                          onPress={() => setPriority('urgent')}
                        >
                          <Text
                            style={[
                              styles.priorityBtnText,
                              priority === 'urgent' && styles.priorityBtnTextActiveUrgent,
                            ]}
                          >
                            Kritik / Acil (Hızlandırılmış)
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <View style={styles.stepContent}>
                    <Text style={styles.stepHeading}>
                      3. Adım: Bütçe, Zaman Planı ve Onay
                    </Text>

                    <View style={styles.summaryBox}>
                      <Text style={styles.summaryLabel}>Seçilen Hizmet:</Text>
                      <Text style={styles.summaryValue}>{projectTitle}</Text>
                      <View style={{ height: 8 }} />
                      <Text style={styles.summaryLabel}>Öncelik:</Text>
                      <Text style={styles.summaryValue}>
                        {priority === 'urgent' ? 'Acil / Hızlandırılmış' : 'Standart'}
                      </Text>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Tahmini Bütçe Aralığı</Text>
                      <TextInput
                        style={styles.textInput}
                        value={estimatedBudget}
                        onChangeText={setEstimatedBudget}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Hedef Canlıya Çıkış Tarihi</Text>
                      <TextInput
                        style={styles.textInput}
                        value={targetLaunchDate}
                        onChangeText={setTargetLaunchDate}
                      />
                    </View>

                    <Pressable
                      style={styles.termsRow}
                      onPress={() => setApprovedTerms(!approvedTerms)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          approvedTerms && styles.checkboxChecked,
                        ]}
                      >
                        {approvedTerms && <Check size={12} color="#FFFFFF" />}
                      </View>
                      <Text style={styles.termsText}>
                        Hubio Kurumsal Hizmet ve SLA Şartlarını okudum, onaylıyorum.
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Footer Controls */}
          {!isSuccess && (
            <View style={styles.modalFooter}>
              {step > 1 ? (
                <AppButton
                  title="Geri"
                  variant="outline"
                  size="md"
                  onPress={handleBack}
                  icon={<ChevronLeft size={16} color={Colors.textPrimary} />}
                />
              ) : (
                <View />
              )}

              {step < 3 ? (
                <AppButton
                  title="İlerle"
                  variant="primary"
                  size="md"
                  onPress={handleNext}
                  icon={<ChevronRight size={16} color={Colors.textInverse} />}
                  iconPosition="right"
                />
              ) : (
                <AppButton
                  title="Talebi Başlat ve Onayla"
                  variant="accent"
                  size="md"
                  loading={submitting}
                  onPress={handleFinalSubmit}
                  icon={<Rocket size={16} color={Colors.textInverse} />}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: 520,
    paddingTop: 16,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    ...Typography.title2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  bodyScroll: {
    flex: 1,
  },
  stepContent: {
    paddingVertical: 8,
  },
  stepHeading: {
    ...Typography.cardTitle,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  stepInstruction: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.borderHairline,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#EFF6FF',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  optionPrice: {
    ...Typography.metricDelta,
    fontSize: 14,
    color: Colors.primary,
  },
  optionDesc: {
    ...Typography.body,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 5,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    backgroundColor: '#F8FAFC',
  },
  priorityBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#EFF6FF',
  },
  priorityBtnActiveUrgent: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warningBg,
  },
  priorityBtnText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  priorityBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  priorityBtnTextActiveUrgent: {
    color: Colors.warning,
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  summaryLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  summaryValue: {
    ...Typography.cardTitle,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  termsText: {
    ...Typography.footnote,
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: Spacing.hairlineWidth,
    borderTopColor: Colors.borderHairline,
  },
  errorBox: {
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.dangerBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  errorText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  successDesc: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

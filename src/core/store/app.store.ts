import { create } from 'zustand';
import { ProjectItem, ProjectMilestone, UpdatePeriod } from '@/models/project.model';
import { AuthUser } from '@/models/auth.model';
import { NewProjectWizardValues } from '@/models/service-catalog.model';
import { appStorage } from '@/core/storage/storage';
import { soundService } from '@/core/audio/sound.service';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  category: 'commit' | 'seo' | 'approval' | 'system';
  targetPath: string; // deep link
  timestamp: string;
  read: boolean;
}

interface AppState {
  // Auth
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;

  // Projects & Milestones
  projects: ProjectItem[];
  milestones: ProjectMilestone[];
  selectedPeriod: UpdatePeriod;
  setSelectedPeriod: (period: UpdatePeriod) => void;

  // Actions
  approveMilestone: (id: string) => void;
  requestRevision: (id: string, note: string) => void;
  addProjectRequest: (values: NewProjectWizardValues) => ProjectItem;

  // Notifications & Webhooks
  notifications: InAppNotification[];
  activeBanner: InAppNotification | null;
  triggerWebhookNotification: (
    title: string,
    message: string,
    targetPath?: string,
    category?: InAppNotification['category']
  ) => void;
  dismissBanner: () => void;
  markNotificationRead: (id: string) => void;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj-101',
    title: 'NovaTech B2B E-Ticaret & Mobil Portal',
    clientName: 'NovaTech A.Ş.',
    category: 'fullstack',
    status: 'in_progress',
    progressPercentage: 78,
    activeSprint: 'Sprint 6 - Ödeme & GEO Entegrasyonu',
    lastUpdated: '12 dk önce',
    nextMilestone: 'Canlıya Çıkış & Skia GEO Testi',
    liveUrl: 'https://novatech.hubio.digital',
    repository: 'github.com/novatech/b2b-portal',
  },
  {
    id: 'prj-102',
    title: 'Global Lojistik Web Platformu & AI Ajanı',
    clientName: 'NovaTech A.Ş.',
    category: 'web',
    status: 'client_review',
    progressPercentage: 92,
    activeSprint: 'Son Müşteri Kabul Testi (UAT)',
    lastUpdated: '2 saat önce',
    nextMilestone: 'Müşteri Canlıya Alma Onayı',
    liveUrl: 'https://lojistik.novatech.com.tr',
    repository: 'github.com/novatech/logistics-web',
  },
  {
    id: 'prj-103',
    title: 'Mobil Sadakat & Kampanya Uygulaması',
    clientName: 'NovaTech A.Ş.',
    category: 'mobile',
    status: 'in_progress',
    progressPercentage: 45,
    activeSprint: 'Sprint 3 - Push Bildirim & DeepLink',
    lastUpdated: 'Dün 18:40',
    nextMilestone: 'iOS TestFlight Dağıtımı',
    repository: 'github.com/novatech/loyalty-app',
  },
];

const INITIAL_MILESTONES: ProjectMilestone[] = [
  {
    id: 'ms-001',
    projectId: 'prj-101',
    projectTitle: 'NovaTech B2B Portal',
    period: 'daily',
    title: 'iOS Ödeme Modülü 3D Secure 2.2 Güncellendi',
    description: 'Iyzico & Garanti BBVA sanal poslarında yeni C++ TurboModule entegrasyonu tamamlandı. Ödeme ekranı açılış süresi 180ms düşürüldü.',
    category: 'Performance',
    timestamp: 'Bugün, 14:32',
    status: 'pending_approval',
    metricsGain: '+%45 Hız Artışı',
  },
  {
    id: 'ms-002',
    projectId: 'prj-101',
    projectTitle: 'NovaTech B2B Portal',
    period: 'daily',
    title: 'Ana Sayfa LCP & Core Web Vitals İyileştirmesi',
    description: 'Bulanık görsel yükleyicisi (ThumbHash) devreye alındı. Mobil açılış hızı Google PageSpeed üzerinde 94 puana ulaştı.',
    category: 'SEO',
    timestamp: 'Bugün, 10:15',
    status: 'approved',
    metricsGain: 'PageSpeed: 94/100',
  },
  {
    id: 'ms-003',
    projectId: 'prj-102',
    projectTitle: 'Global Lojistik Web',
    period: 'daily',
    title: 'Depo Haritası Yerel GEO & Yapay Zeka Etiketleri Eklendi',
    description: 'Müşterinin 8 bölge deposu Google Haritalar Schema.org ile işaretlendi ve Perplexity/Gemini LLM crawler için geo.json yayına alındı.',
    category: 'SEO',
    timestamp: 'Dün, 17:50',
    status: 'pending_approval',
    metricsGain: '8 Şube İndekslendi',
  },
  {
    id: 'ms-101',
    projectId: 'prj-101',
    projectTitle: 'NovaTech B2B Portal',
    period: 'weekly',
    title: 'Haftalık Sprint 5: Sepet & Ödeme Akışı Dönüşüm Optimizasyonu',
    description: 'Kullanıcı terk oranını düşürmek için tek sayfada ödeme (One-step Checkout) ve Apple Pay / Google Pay entegrasyonu tamamlandı.',
    category: 'Feature',
    timestamp: '14 Ekim 2026',
    status: 'approved',
    metricsGain: '+%28 Tahmini Dönüşüm',
  },
  {
    id: 'ms-102',
    projectId: 'prj-102',
    projectTitle: 'Global Lojistik Web',
    period: 'weekly',
    title: 'Haftalık Güvenlik & Penetrasyon Yaması (CVE-2026)',
    description: 'Next.js 16 ve Fastify API sunucularında güvenlik denetimi yapıldı, tüm bağımlılıklar sıfır güvenlik açığı ile kilitlendi.',
    category: 'Security',
    timestamp: '12 Ekim 2026',
    status: 'approved',
    metricsGain: 'A+ Güvenlik Skoru',
  },
  {
    id: 'ms-201',
    projectId: 'prj-101',
    projectTitle: 'NovaTech B2B Portal',
    period: 'monthly',
    title: 'Eylül Ayı Büyüme & Altyapı Konsolidasyon Raporu',
    description: 'Toplam 14 sprint tamamlandı, veritabanı sorgu süreleri PgBouncer havuzu ile %60 hızlandı. SEO organik ziyaretçi sayısı 14.800 arttı.',
    category: 'Performance',
    timestamp: '1 Ekim 2026',
    status: 'approved',
    metricsGain: '+14.8K Ziyaretçi',
  },
];

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-01',
    title: 'Yeni Canlı Dağıtım (Deploy)',
    message: 'Ödeme modülü 3D Secure 2.2 canlı sunucuya aktarıldı.',
    category: 'commit',
    targetPath: '/(tabs)/changelog',
    timestamp: '15 dk önce',
    read: false,
  },
  {
    id: 'notif-02',
    title: 'Haftalık AI GEO Raporu Hazır',
    message: 'Perplexity ve ChatGPT alıntılanma oranınız %24 arttı.',
    category: 'seo',
    targetPath: '/(tabs)/analytics',
    timestamp: '2 saat önce',
    read: false,
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    appStorage.delete('hubio_current_user');
    appStorage.delete('hubio_auth_token');
    set({ user: null });
  },

  projects: INITIAL_PROJECTS,
  milestones: INITIAL_MILESTONES,
  selectedPeriod: 'daily',
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  approveMilestone: (id) => {
    soundService.playSuccess();
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === id ? { ...m, status: 'approved' as const } : m
      ),
    }));
  },

  requestRevision: (id, note) => {
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'revision_requested' as const,
              revisionNotes: note,
            }
          : m
      ),
    }));
  },

  addProjectRequest: (values) => {
    const newProject: ProjectItem = {
      id: 'prj-' + Date.now(),
      title: values.projectTitle,
      clientName: get().user?.companyTitle || 'Kurumsal Firma',
      category: 'web',
      status: 'in_progress',
      progressPercentage: 10,
      activeSprint: 'Sprint 1 - Kapsam & Mimari Analiz',
      lastUpdated: 'Şimdi',
      nextMilestone: 'Sprint Başlangıç Onayı',
    };

    const newMilestone: ProjectMilestone = {
      id: 'ms-' + Date.now(),
      projectId: newProject.id,
      projectTitle: newProject.title,
      period: 'daily',
      title: `Yeni Talep Başlatıldı: ${newProject.title}`,
      description: values.scopeDescription,
      category: 'Feature',
      timestamp: 'Şimdi',
      status: 'pending_approval',
      metricsGain: values.priority === 'urgent' ? '⚡ Acil Sprint' : 'Standart Sprint',
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
      milestones: [newMilestone, ...state.milestones],
    }));

    // Trigger immediate simulated Webhook notification
    get().triggerWebhookNotification(
      'Yeni Proje Başlatıldı! 🚀',
      `"${values.projectTitle}" talebiniz sprint takvimine eklendi.`,
      '/(tabs)/projects',
      'approval'
    );

    return newProject;
  },

  notifications: INITIAL_NOTIFICATIONS,
  activeBanner: null,

  triggerWebhookNotification: (title, message, targetPath = '/(tabs)/changelog', category = 'commit') => {
    soundService.playNotification();
    const notif: InAppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      category,
      targetPath,
      timestamp: 'Şimdi',
      read: false,
    };

    set((state) => ({
      notifications: [notif, ...state.notifications],
      activeBanner: notif,
    }));
  },

  dismissBanner: () => set({ activeBanner: null }),

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
}));

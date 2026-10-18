import {
  ProjectItem,
  ProjectMilestone,
  UpdatePeriod,
  mapProjectDTO,
  mapMilestoneDTO,
} from '@/models/project.model';
import { projectRepository } from './database/repositories/project.repository';
import { apiClient } from './api.client';

// Initial Mock Data
let MOCK_PROJECTS: ProjectItem[] = [
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
  },
];

let MOCK_MILESTONES: ProjectMilestone[] = [
  // Günlük
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
  // Haftalık
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
  // Aylık
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

class ProjectService {
  async getActiveProjects(): Promise<ProjectItem[]> {
    const dbProjects = projectRepository.getAll();
    if (dbProjects.length > 0) {
      const mapped: ProjectItem[] = dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        clientName: p.clientName,
        category: p.category === 'mobile_web' ? 'fullstack' : (p.category as any),
        status: p.status as any,
        progressPercentage: p.progressPercentage,
        activeSprint: 'Sprint 6 - Ödeme & GEO Entegrasyonu',
        lastUpdated: '10 dk önce',
        nextMilestone: 'Canlıya Çıkış & Skia GEO Testi',
        liveUrl: p.liveUrl,
        repository: p.repoUrl,
      }));
      return apiClient.simulateRequest(mapped.map(mapProjectDTO), 30);
    }
    return apiClient.simulateRequest(MOCK_PROJECTS.map(mapProjectDTO), 30);
  }

  async getMilestones(period?: UpdatePeriod): Promise<ProjectMilestone[]> {
    const filtered = period
      ? MOCK_MILESTONES.filter((m) => m.period === period)
      : MOCK_MILESTONES;
    return apiClient.simulateRequest(filtered.map(mapMilestoneDTO), 120);
  }

  async approveMilestone(id: string): Promise<ProjectMilestone> {
    const item = MOCK_MILESTONES.find((m) => m.id === id);
    if (!item) throw new Error('Kilometre taşı bulunamadı');
    item.status = 'approved';
    return apiClient.simulateRequest(mapMilestoneDTO(item), 150);
  }

  async requestRevision(id: string, note?: string): Promise<ProjectMilestone> {
    const item = MOCK_MILESTONES.find((m) => m.id === id);
    if (!item) throw new Error('Kilometre taşı bulunamadı');
    item.status = 'revision_requested';
    item.revisionNotes = note || 'Müşteri revizyon talebi iletti';
    return apiClient.simulateRequest(mapMilestoneDTO(item), 150);
  }

  async getDashboardSummary() {
    const activeCount = MOCK_PROJECTS.length;
    const completedTasksCount = 42;
    const pendingApprovalsCount = MOCK_MILESTONES.filter(
      (m) => m.status === 'pending_approval'
    ).length;
    const avgProgress = Math.round(
      MOCK_PROJECTS.reduce((acc, p) => acc + p.progressPercentage, 0) /
        (activeCount || 1)
    );

    return apiClient.simulateRequest(
      {
        activeProjectsCount: activeCount,
        completedTasksCount,
        pendingApprovalsCount,
        averageProgress: avgProgress,
        weeklyVelocity: '+%14 Verimlilik Artışı',
      },
      80
    );
  }
}

export const projectService = new ProjectService();

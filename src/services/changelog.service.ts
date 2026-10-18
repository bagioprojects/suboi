import { ChangelogItem, mapChangelogDTO } from '@/models/changelog.model';
import { apiClient } from './api.client';

const MOCK_CHANGELOG: ChangelogItem[] = [
  {
    id: 'ch-301',
    projectId: 'prj-101',
    projectTitle: 'NovaTech B2B Portal',
    title: 'Ödeme Sayfası 3D Secure 2.2 ve Apple Pay / Google Pay Canlıda',
    category: 'Feature',
    timestamp: 'Bugün 14:32',
    dateFormatted: '17 Ekim 2026',
    commitHash: 'c8f42e1',
    liveUrl: 'https://novatech.com.tr/checkout',
    beforeSummary: 'Yalnızca klasik iFrame kredi kartı formu ve 3D Secure 1.0 protokolü mevcuttu. Mobil terk oranı %38 idi.',
    afterSummary: 'C++ TurboModule ile doğrudan native Apple Pay ve Google Pay entegre edildi. Ödeme süresi 4.2 saniyeden 1.1 saniyeye indi.',
    impactScore: '+%28 Dönüşüm Artışı',
    authorName: 'Hubio FinTech Ekibi',
    deepLinkPath: '/(tabs)/projects',
  },
  {
    id: 'ch-302',
    projectId: 'prj-101',
    projectTitle: 'NovaTech B2B Portal',
    title: 'Ana Sayfa LCP ve Core Web Vitals İyileştirmesi',
    category: 'Performance',
    timestamp: 'Dün 16:40',
    dateFormatted: '16 Ekim 2026',
    commitHash: 'a19bc34',
    liveUrl: 'https://novatech.com.tr',
    beforeSummary: 'Ağır PNG bannerlar yüzünden Largest Contentful Paint (LCP) süresi 2.8 saniye ve PageSpeed skoru 64 idi.',
    afterSummary: 'Python asset pipeline ve ThumbHash ile tüm görseller WebP @1x/@2x/@3x boyutlarına sıkıştırıldı. LCP 1.1s oldu, PageSpeed 97 puana fırladı.',
    impactScore: 'PageSpeed: 97/100',
    authorName: 'Hubio Web Ekibi',
    deepLinkPath: '/(tabs)/analytics',
  },
  {
    id: 'ch-303',
    projectId: 'prj-102',
    projectTitle: 'Global Lojistik Web',
    title: 'Perplexity & ChatGPT Ajanları İçin GEO geo.json Dağıtımı',
    category: 'SEO_GEO',
    timestamp: '15 Ekim 11:20',
    dateFormatted: '15 Ekim 2026',
    commitHash: 'f72da09',
    liveUrl: 'https://lojistik.novatech.com.tr/.well-known/geo.json',
    beforeSummary: 'Yapay zeka modelleri lojistik depolarını ve bölgesel hizmetleri harici dizinlerden hatalı okuyordu.',
    afterSummary: 'Generative Engine Optimization (GEO) standardında yapılandırılmış JSON-LD ve LLM referanslama etiketleri eklendi. AI kaynak gösterilme oranı %42 arttı.',
    impactScore: 'AI GEO: 88/100',
    authorName: 'Hubio AI & SEO Ekibi',
    deepLinkPath: '/(tabs)/analytics',
  },
  {
    id: 'ch-304',
    projectId: 'prj-102',
    projectTitle: 'Global Lojistik Web',
    title: 'CVE-2026 Güvenlik ve Kimlik Doğrulama Yaması',
    category: 'Security',
    timestamp: '14 Ekim 09:15',
    dateFormatted: '14 Ekim 2026',
    commitHash: 'e319a42',
    beforeSummary: 'Eski oturum yenileme algoritmasında potansiyel rate-limiting açığı tespit edilmişti.',
    afterSummary: 'Redis tabanlı Upstash sliding window rate limiting ve Argon2id şifreleme entegre edildi.',
    impactScore: 'A+ Kurumsal Güvenlik',
    authorName: 'Hubio Siber Güvenlik',
  },
];

class ChangelogService {
  async getChangelog(): Promise<ChangelogItem[]> {
    return apiClient.simulateRequest(MOCK_CHANGELOG.map(mapChangelogDTO), 100);
  }
}

export const changelogService = new ChangelogService();

import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
});

export const Typography: Record<string, TextStyle> = {
  // Ekran Ana Başlığı (Large Title) - 34pt / 41pt Bold (+0.37pt letter spacing)
  largeTitle: {
    fontFamily,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: 0.37,
  },

  // Bölüm Başlığı (Title 2) - 22pt / 28pt Bold (+0.35pt letter spacing)
  title2: {
    fontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0.35,
  },

  // Kart Başlığı & Anahtar Metrik - 17pt / 22pt Semibold (-0.41pt letter spacing)
  cardTitle: {
    fontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.41,
  },

  // Gövde Metni (Günlük Raporlar) - 16pt / 22pt Regular (-0.32pt letter spacing)
  body: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.32,
  },

  // Alt Bilgi & Tarih/Saat Özeti - 14pt / 19pt Medium (-0.15pt letter spacing)
  footnote: {
    fontFamily,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
    letterSpacing: -0.15,
  },

  // Durum Rozetleri (Badge / Tag) - 12pt / 16pt Semibold (+0.20pt letter spacing)
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Sayısal Metrikler ve Göstergeler (Tabular Nums ile rakam kayması engellenir)
  metricNumber: {
    fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },

  metricDelta: {
    fontFamily,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
};

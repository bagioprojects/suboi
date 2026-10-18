/**
 * Hubio 8pt Geometrical Grid & Symmetric Layout Metrics
 * Designed for mathematically balanced, modern Apple-grade layouts.
 */
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,

  // Layout-specific metrics
  screenHorizontal: 20, // Sabit 20pt (Sol ve sağdan simetrik)
  cardPadding: 16,       // Standart bilgi kartları
  cardPaddingLarge: 20,  // Büyük özet kartları
  cardGap: 12,           // Aynı gruptaki kartlar arası
  sectionGap: 24,        // Farklı bölümler (Section) arası

  // Squircle & Rounded Metrics
  radiusCard: 16,        // Dış kart yuvarlaklığı (continuous)
  radiusInner: 10,       // İç yarıçap = Dış - Boşluk optik simetri kuralı
  radiusPill: 9999,      // Tam yuvarlak rozet / buton
  radiusInput: 12,       // Form girdi alanları

  // Interaction Metrics
  minTouchTarget: 44,    // Apple HIG minimum dokunma alanı (44x44pt)
  hairlineWidth: 1,      // 1pt keskin çerçeve
} as const;

export const HitSlop = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
} as const;

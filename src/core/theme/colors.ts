/**
 * Hubio 2026 Executive Light Mode Color Palette
 * Designed for high CTR, psychological authority and crisp contrast.
 */
export const Colors = {
  // Background & Surfaces
  background: '#F8FAFC', // Cool Alabaster
  surface: '#FFFFFF',    // Pure Crisp White
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9', // Light Slate for subtle backgrounds
  
  // Borders & Dividers
  borderHairline: '#E2E8F0', // Slate Hairline
  borderFocus: '#2563EB',    // Electric Cobalt highlight

  // Text Hierarchy
  textPrimary: '#0F172A',   // Executive Navy
  textSecondary: '#475569', // Muted Slate
  textTertiary: '#94A3B8',  // Light Slate
  textInverse: '#FFFFFF',

  // Actions & CTR Focus
  primary: '#2563EB',       // Electric Cobalt (High CTR Primary CTA)
  primaryPressed: '#1D4ED8',
  primaryLight: '#EFF6FF',

  // Marketplace & Upsell Accent
  accent: '#4F46E5',        // Royal Indigo (Premium Digital Services)
  accentPressed: '#4338CA',
  accentLight: '#EEF2FF',

  // Status & Growth Indicators
  success: '#059669',       // Emerald Growth (SEO/GEO positive growth & approval)
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',

  warning: '#D97706',       // Amber Pulse (Live update / Client action needed)
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',

  danger: '#DC2626',        // Alert Red
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',

  // GEO & AI Indicators
  geoAi: '#7C3AED',         // AI Generative Engine Optimization
  geoAiBg: '#F5F3FF',
  geoLocal: '#0284C7',      // Local Maps / Regional SEO
  geoLocalBg: '#F0F9FF',
} as const;

export type ColorTheme = typeof Colors;

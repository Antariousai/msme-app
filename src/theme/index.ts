/** Antarious Blue brand tokens — see antarious-theme-antarious.md */

export { Colors, ThemeProvider, useTheme } from './ThemeContext';
export type { ThemeMode } from './ThemeContext';
export { lightPalette, darkPalette } from './palettes';
export type { ColorPalette } from './palettes';

/** Motion — slide entrance, ripple, pulse */
export const Motion = {
  duration: 340,
  rippleIn: 180,
  rippleOut: 260,
  pulseDuration: 1400,
  stagger: 50,
  slide: { damping: 18, stiffness: 280, mass: 0.8 },
};

export const PrimaryShades = {
  50: '#eef8fd',
  100: '#d8effa',
  200: '#addef4',
  300: '#7dcaed',
  400: '#4eb7e6',
  500: '#27a7e1',
  600: '#228fc1',
  700: '#1c77a2',
  800: '#175f82',
  900: '#134b67',
};

export const BrandShades = { ...PrimaryShades };

/** Diagonal hero gradient 135deg */
export const Gradients = {
  hero: ['#27a7e1', '#4fb8e8', '#8fd2f0'] as const,
  heroLocations: [0, 0.55, 1] as const,
  soft: ['#eef8fd', '#f3fbff'] as const,
  softDark: ['#0f3a52', '#134b67'] as const,
  button: ['#27a7e1', '#4fb8e8'] as const,
};

export const Typography = {
  fontFamily: {
    regular: 'BalooDa2_400Regular',
    medium: 'BalooDa2_500Medium',
    semibold: 'BalooDa2_600SemiBold',
    bold: 'BalooDa2_700Bold',
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
  },
  lineHeight: {
    tight: 1.15,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 14,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 36,
  '4xl': 44,
};

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 20,
  '2xl': 24,
  /** Button radius — studio --btn-radius */
  btn: 16,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#27a7e1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  /** studio --shadow-card: 0 4px 18px -6px rgba(0,0,0,.12) */
  card: {
    shadowColor: '#1f1633',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
  /** studio --shadow-soft: 0 8px 24px -8px rgba(0,0,0,.18) */
  soft: {
    shadowColor: '#1f1633',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  md: {
    shadowColor: '#27a7e1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1f87b8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
};

import { Colors } from './ThemeContext';

export const TierConfig = {
  0: {
    name: 'অফলাইন',
    nameEn: 'Offline',
    color: Colors.tier0,
    price: '২০০',
    priceEn: '200',
    tagline: 'মৌলিক হিসাব রক্ষা',
  },
  1: {
    name: 'স্টার্টার',
    nameEn: 'Starter',
    color: Colors.tier1,
    price: '৭০০–৮০০',
    priceEn: '700–800',
    tagline: 'সোশ্যাল কমার্স ও অর্থ ব্যবস্থাপনা',
  },
  2: {
    name: 'গ্রোথ',
    nameEn: 'Growth',
    color: Colors.tier2,
    price: '১৫০০–১৭০০',
    priceEn: '1500–1700',
    tagline: 'ওয়েবসাইট ও ইনভেন্টরি ব্যবস্থাপনা',
  },
  3: {
    name: 'প্রো',
    nameEn: 'Pro',
    color: Colors.tier3,
    price: '৩০০০–৩৫০০',
    priceEn: '3000–3500',
    tagline: 'লিড ক্যাপচার ও গ্রাহক ব্যবস্থাপনা',
  },
  4: {
    name: 'এন্টারপ্রাইজ',
    nameEn: 'Enterprise',
    color: Colors.tier4,
    price: '৫০০০–৭০০০',
    priceEn: '5000–7000',
    tagline: 'সম্পূর্ণ ব্যবসা বিশ্লেষণ',
  },
};

export const BrandStudioAddOn = {
  price: '৩০০',
  priceEn: '300',
  tagline: 'লোগো, ক্যাপশন ও ওয়েব টেমপ্লেট',
  color: Colors.brandStudio,
};

/** Antarious Ocean brand tokens — see antarious-theme-ocean.md */

export { Colors, ThemeProvider, useTheme } from './ThemeContext';
export type { ThemeMode } from './ThemeContext';
export { lightPalette, darkPalette } from './palettes';
export type { ColorPalette } from './palettes';

/** Motion & play — 1× speed, pop entrance, ripple, pulse */
export const Motion = {
  duration: 320,
  rippleIn: 180,
  rippleOut: 260,
  pulseDuration: 1400,
  stagger: 45,
  pop: { damping: 14, stiffness: 420, mass: 0.65 },
};

export const PrimaryShades = {
  50: '#ecf4f6',
  100: '#d4e6eb',
  200: '#a3cad5',
  300: '#6eacbc',
  400: '#398da4',
  500: '#0e7490',
  600: '#0d647d',
  700: '#0b556b',
  800: '#0a4558',
  900: '#093748',
};

export const BrandShades = {
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

/** Diagonal gradient — light defaults; OceanGradient uses theme-aware values */
export const Gradients = {
  hero: ['#0e7490', '#0891b2', '#22d3ee'] as const,
  heroLocations: [0, 0.55, 1] as const,
  soft: ['#ecfeff', '#f0fdfa'] as const,
  softDark: ['#083344', '#093748'] as const,
};

export const Typography = {
  fontFamily: {
    regular: 'TiroBangla_400Regular',
    medium: 'TiroBangla_400Regular',
    semibold: 'TiroBangla_400Regular',
    bold: 'TiroBangla_400Regular',
  },
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 15,
    lg: 17,
    xl: 19,
    '2xl': 22,
    '3xl': 26,
    '4xl': 30,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.45,
    relaxed: 1.65,
  },
};

/** Compact density */
export const Spacing = {
  xs: 3,
  sm: 6,
  md: 10,
  base: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  '3xl': 36,
  '4xl': 44,
};

/** Base corner radius 20px (soft) */
export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#0e7490',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#0e7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0e7490',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
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
    tagline: 'সম্পূর্ণ বিশ্লেষণ ও রিপোর্টিং',
  },
};

export const BrandStudioAddOn = {
  price: '৩০০',
  priceEn: '300',
  tagline: 'লোগো, ক্যাপশন ও ওয়েব টেমপ্লেট',
  color: Colors.brandStudio,
};

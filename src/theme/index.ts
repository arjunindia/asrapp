// AssemblyAI-Inspired Design System

export const colors = {
  primary: '#2545D3',
  primaryDark: '#1C3BB8',
  primaryPressed: '#1628A0',
  secondary: '#0067CE',
  accentCoral: '#F18345',
  accentGold: '#FFA800',
  alertGold: '#F9D74D',

  // Neutrals
  heading: '#1C2024',
  black: '#000000',
  darkGray: '#222222',
  midGray: '#4B5565',
  lightGray: '#697586',
  lighterGray: '#60646C',
  veryLightGray: '#8B8D98',

  // Surfaces
  white: '#FFFFFF',
  offWhite: '#F8F8F8',
  cream: '#F5F3EB',
  lightBorder: '#E0E0E0',
  subtleBorder: '#DDDDDD',

  // States
  warning: '#FFA800',
  lightWarning: '#F9D74D',
  disabled: '#CCCCCC',
  disabledText: '#999999',

  // Shadows
  shadowSm: 'rgba(0,0,0,0.04)',
  shadowMd: 'rgba(0,0,0,0.08)',
  shadowLg: 'rgba(0,0,0,0.12)',
  shadowXl: 'rgba(0,0,0,0.16)',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  section: 48,
  hero: 60,
  max: 64,
};

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  pill: 50,
  full: 9999,
};

// Primary button gradient: Deep Navy to slightly lighter
export const gradients = {
  primary: ['#2545D3', '#1C3BB8'],
  accent: ['#F18345', '#E06A2A'],
  // Overlay card gradient (from AssemblyAI docs)
  overlay: ['#2545D3', '#E8A8B0'],
  // Dark mood gradient for record button ring
  recordRing: ['#2545D3', '#6B8AFF'],
  recordRingHot: ['#F18345', '#FF6B35'],
};

export const typography = {
  display: { fontSize: 64, fontWeight: '400' as const, lineHeight: 64 },
  h1: { fontSize: 56, fontWeight: '400' as const, lineHeight: 56 },
  h2: { fontSize: 48, fontWeight: '400' as const, lineHeight: 52.8 },
  h3: { fontSize: 32, fontWeight: '400' as const, lineHeight: 40 },
  body: { fontSize: 18, fontWeight: '400' as const, lineHeight: 27 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  button: { fontSize: 12, fontWeight: '600' as const, lineHeight: 18 },
  label: { fontSize: 14.08, fontWeight: '600' as const, lineHeight: 21.12 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
};

export const shadows = {
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  maximum: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 8,
  },
};

// Grain overlay opacity for texture effect
export const GRAIN_OPACITY = 0.035;
// Design tokens extracted from Figma (Mobile dark theme + Web light theme)
// Mobile shells are dark forest green; web pages are light with the same green as sidebar accent.

export const colors = {
  // Mobile / dark surfaces
  bg: '#0E2A1E',
  bgElevated: '#143729',
  bgSurface: '#1A4231',
  bgSubtle: 'rgba(255,255,255,0.05)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA89E',
  textTertiary: '#6B7B6E',
  textOnAccent: '#FFFFFF',

  // Brand
  accent: '#22C55E',
  accentDim: '#16A34A',
  accentDark: '#15803D',
  accentSoft: 'rgba(34, 197, 94, 0.15)',

  // Status
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.18)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.15)',
  success: '#22C55E',

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const font = {
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 17,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 32,
    hero: 40,
    timer: 56,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

export type Colors = typeof colors;

import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  background: '#F7F3EC',
  backgroundSoft: '#F1ECE2',
  surface: '#FFFCF7',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F4EFE6',
  surfaceTint: '#EDF3EE',
  border: '#E5DED2',
  borderStrong: '#D7CFBF',
  text: '#1B201C',
  textSecondary: '#697066',
  textMuted: '#8A9087',
  primary: '#7D9E86',
  primaryDeep: '#55715E',
  primarySoft: '#E6EFE8',
  sage: '#B6C5B4',
  sageMuted: '#D9E5DA',
  ivory: '#FAF7F1',
  stone: '#D3CBBC',
  gold: '#B99A67',
  success: '#4D8465',
  warning: '#B78943',
  danger: '#B0615D',
} as const;

export const gradients = {
  hero: ['#FBFCF8', '#E8EEE7'] as const,
  card: ['#FFFFFF', '#F4F0E7'] as const,
  accent: ['#EEF4EF', '#F6F2E9'] as const,
  primary: [colors.primary, colors.primaryDeep] as const,
  muted: ['#FFFCF7', '#F2EDE4'] as const,
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  jumbo: 52,
} as const;

export const radius = {
  sm: 16,
  md: 22,
  lg: 30,
  xl: 36,
  pill: 999,
} as const;

export const shadows: Record<'soft' | 'medium' | 'glow', ViewStyle> = {
  soft: {
    shadowColor: '#18231A',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  medium: {
    shadowColor: '#18231A',
    shadowOpacity: 0.1,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    elevation: 8,
  },
  glow: {
    shadowColor: '#6E8F78',
    shadowOpacity: 0.18,
    shadowRadius: 32,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    elevation: 10,
  },
};

export const typography: Record<
  | 'eyebrow'
  | 'caption'
  | 'bodySmall'
  | 'body'
  | 'bodyStrong'
  | 'title'
  | 'hero'
  | 'display'
  | 'sectionTitle',
  TextStyle
> = {
  eyebrow: {
    fontSize: 12,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    fontWeight: '700',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    fontWeight: '500',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.6,
  },
  hero: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1,
  },
  display: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1.4,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.4,
  },
};

export const layout = {
  pagePadding: 22,
  maxWidth: 560,
};

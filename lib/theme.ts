import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  background: '#F7FAF7',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F2',
  border: '#E3EAE4',
  borderStrong: '#CFD9D1',
  text: '#122117',
  textSecondary: '#607066',
  textMuted: '#859187',
  primary: '#68A882',
  primaryDeep: '#3D7A59',
  primarySoft: '#E7F3EB',
  accent: '#B9D9C5',
  success: '#2B8A57',
  warning: '#D18A29',
  danger: '#C75B56',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radius = {
  sm: 14,
  md: 20,
  lg: 26,
  pill: 999,
} as const;

export const shadows: Record<'soft' | 'medium', ViewStyle> = {
  soft: {
    shadowColor: '#102117',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  medium: {
    shadowColor: '#102117',
    shadowOpacity: 0.1,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    elevation: 7,
  },
};

export const typography: Record<
  'eyebrow' | 'body' | 'bodyStrong' | 'title' | 'hero' | 'sectionTitle',
  TextStyle
> = {
  eyebrow: {
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    fontWeight: '600',
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
    lineHeight: 36,
    fontWeight: '700',
    color: colors.text,
  },
  hero: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.text,
  },
};

export const layout = {
  pagePadding: 20,
  maxWidth: 520,
};

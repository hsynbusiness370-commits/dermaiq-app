import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/lib/theme';

type BadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'premium';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneStyles = {
  default: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    color: colors.textSecondary,
  },
  success: {
    backgroundColor: '#E7F2EB',
    borderColor: '#D1E5D8',
    color: colors.success,
  },
  warning: {
    backgroundColor: '#F5EEE3',
    borderColor: '#EADBC1',
    color: colors.warning,
  },
  danger: {
    backgroundColor: '#F7ECEA',
    borderColor: '#EBCFCA',
    color: colors.danger,
  },
  premium: {
    backgroundColor: '#F5EFE2',
    borderColor: '#E7D8BC',
    color: colors.gold,
  },
} as const;

export function Badge({ label, tone = 'default' }: BadgeProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.backgroundColor, borderColor: toneStyle.borderColor }]}>
      <Text style={[styles.label, { color: toneStyle.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    maxWidth: '100%',
  },
  label: {
    ...typography.eyebrow,
    fontSize: 11,
    letterSpacing: 0.7,
    flexShrink: 1,
  },
});

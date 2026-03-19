import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/lib/theme';

type PremiumCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'tinted' | 'elevated';
}>;

export function PremiumCard({ children, style, variant = 'default' }: PremiumCardProps) {
  return <View style={[styles.card, variant === 'tinted' && styles.tintedCard, variant === 'elevated' && styles.elevatedCard, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.soft,
  },
  tintedCard: {
    backgroundColor: colors.surfaceTint,
    borderColor: '#D7E2D9',
  },
  elevatedCard: {
    backgroundColor: colors.surfaceElevated,
    borderColor: '#ECE5DA',
    ...shadows.medium,
  },
});

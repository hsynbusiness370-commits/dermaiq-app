import { DimensionValue, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

type ScoreCardProps = {
  label: string;
  score: number;
  style?: StyleProp<ViewStyle>;
};

export function ScoreCard({ label, score, style }: ScoreCardProps) {
  const fillWidth = `${score}%` as DimensionValue;
  const toneStyle = score >= 90 ? styles.successFill : score >= 80 ? styles.warningFill : styles.dangerFill;

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.outOf}>/100</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, toneStyle, { width: fillWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 108,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  label: {
    ...typography.eyebrow,
    color: colors.textMuted,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.8,
  },
  outOf: {
    marginLeft: spacing.xxs,
    marginBottom: spacing.xxs,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  successFill: {
    backgroundColor: colors.success,
  },
  warningFill: {
    backgroundColor: colors.warning,
  },
  dangerFill: {
    backgroundColor: colors.danger,
  },
});

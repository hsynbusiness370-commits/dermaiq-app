import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/lib/theme';

type ScoreCardProps = {
  label: string;
  score: number;
};

export function ScoreCard({ label, score }: ScoreCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.score}>{score}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${score}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: {
    ...typography.eyebrow,
    color: colors.textMuted,
  },
  score: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.text,
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});

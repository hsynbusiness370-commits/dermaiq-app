import { StyleSheet, Text, View } from 'react-native';

import { PremiumCard } from '@/components/PremiumCard';
import { Screen } from '@/components/Screen';
import { recentScans } from '@/lib/mock-data';
import { colors, radius, spacing, typography } from '@/lib/theme';

export default function HistoryScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.kicker}>History</Text>
        <Text style={styles.title}>Your recent skincare evaluations.</Text>
        <Text style={styles.subtitle}>
          Browse previous scans, compare scores, and revisit product notes.
        </Text>
      </View>

      <View style={styles.list}>
        {recentScans.map((scan) => (
          <PremiumCard key={scan.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.productMeta}>
                <Text style={styles.productName}>{scan.productName}</Text>
                <Text style={styles.timestamp}>{scan.scannedAt}</Text>
              </View>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryLabel}>{scan.category}</Text>
              </View>
            </View>

            <Text style={styles.summary}>{scan.summary}</Text>

            <View style={styles.scoreGrid}>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreHeading}>Safety</Text>
                <Text style={styles.scoreValue}>{scan.safetyScore}</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreHeading}>Match</Text>
                <Text style={styles.scoreValue}>{scan.skinMatchScore}</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreHeading}>Effectiveness</Text>
                <Text style={styles.scoreValue}>{scan.effectivenessScore}</Text>
              </View>
            </View>
          </PremiumCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  kicker: {
    ...typography.eyebrow,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  productMeta: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  timestamp: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
  },
  categoryLabel: {
    color: colors.primaryDeep,
    fontWeight: '700',
    fontSize: 13,
  },
  summary: {
    ...typography.body,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scoreBox: {
    flex: 1,
    minWidth: 100,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  scoreHeading: {
    ...typography.eyebrow,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  scoreValue: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.text,
  },
});

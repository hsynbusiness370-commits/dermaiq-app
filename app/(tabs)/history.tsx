import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { recentScans } from '@/lib/mock-data';
import { colors, radius, spacing, typography } from '@/lib/theme';

const verdictTone = {
  'Great Match': 'success',
  'Use with Caution': 'warning',
  'Not Ideal': 'danger',
} as const;

export default function HistoryScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>History</Text>
        <Text style={styles.title}>A refined archive of your recent product scans.</Text>
        <Text style={styles.subtitle}>
          Compare scores, revisit verdicts, and keep past product decisions in one quiet place.
        </Text>
      </View>

      {recentScans.length === 0 ? (
        <PremiumCard variant="elevated" style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="sparkles-outline" size={22} color={colors.primaryDeep} />
          </View>
          <Text style={styles.emptyTitle}>No scans saved yet</Text>
          <Text style={styles.emptyText}>
            Once you scan a product, your results will live here in a clean, easy-to-browse history.
          </Text>
        </PremiumCard>
      ) : (
        <View style={styles.list}>
          {recentScans.map((scan) => (
            <PremiumCard key={scan.id} variant="elevated" style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.productMeta}>
                  <Text style={styles.brand}>{scan.brand}</Text>
                  <Text style={styles.productName}>{scan.productName}</Text>
                  <Text style={styles.timestamp}>{scan.scannedAt}</Text>
                </View>
                <Badge label={scan.category} tone="premium" />
              </View>

              <SectionHeader title={scan.verdict} subtitle={scan.summary} />

              <View style={styles.badgeRow}>
                <Badge label={scan.verdict} tone={verdictTone[scan.verdict]} />
                <Badge label={scan.status} tone="default" />
              </View>

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
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  kicker: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
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
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  productMeta: {
    flex: 1,
  },
  brand: {
    ...typography.eyebrow,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  productName: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  timestamp: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...typography.sectionTitle,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
});

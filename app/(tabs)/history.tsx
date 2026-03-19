import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useSavedAnalyses } from '@/lib/saved-analyses-context';
import { formatSavedAnalysisDate, savedAnalysisToPayload } from '@/lib/storage';
import { colors, radius, spacing, typography } from '@/lib/theme';
import { SavedAnalysis } from '@/lib/types';

const verdictIcon = {
  'Great Match': 'checkmark-circle',
  'Use with Caution': 'alert-circle',
  'Not Ideal': 'close-circle',
} as const;

const filterOptions = ['All', 'Great Match', 'Caution', 'Review'] as const;
type FilterOption = (typeof filterOptions)[number];

function encodePayload(payload: ReturnType<typeof savedAnalysisToPayload>) {
  return encodeURIComponent(JSON.stringify(payload));
}

export default function HistoryScreen() {
  const { savedAnalyses } = useSavedAnalyses();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const filteredScans = useMemo(() => {
    switch (activeFilter) {
      case 'Great Match':
        return savedAnalyses.filter((scan) => scan.verdict === 'Great Match');
      case 'Caution':
        return savedAnalyses.filter((scan) => scan.verdict === 'Use with Caution');
      case 'Review':
        return savedAnalyses.filter((scan) => scan.status === 'Needs review' || scan.verdict === 'Not Ideal');
      default:
        return savedAnalyses;
    }
  }, [activeFilter, savedAnalyses]);

  const averageScore =
    savedAnalyses.length > 0
      ? Math.round(savedAnalyses.reduce((total, scan) => total + scan.overallScore, 0) / savedAnalyses.length)
      : 0;
  const greatMatchCount = savedAnalyses.filter((scan) => scan.verdict === 'Great Match').length;

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Your scan history</Text>
        <Text style={styles.subtitle}>Saved reads live here and become more useful over time.</Text>
      </View>

      {savedAnalyses.length === 0 ? (
        <PremiumCard variant="elevated" style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="sparkles-outline" size={22} color={colors.primaryDeep} />
          </View>
          <Text style={styles.emptyTitle}>No saved analyses yet</Text>
          <Text style={styles.emptyText}>
            Start scanning products to build a clearer picture of what consistently works for your skin.
          </Text>
          <PrimaryButton
            label="Go to Scan"
            size="md"
            leftIcon={<Ionicons name="scan-outline" size={16} color={colors.surfaceElevated} />}
            onPress={() => router.push('/(tabs)/scan')}
          />
        </PremiumCard>
      ) : (
        <>
          <PremiumCard variant="tinted" style={styles.summaryCard}>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{savedAnalyses.length}</Text>
              <Text style={styles.summaryLabel}>Saved analyses</Text>
            </View>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{greatMatchCount}</Text>
              <Text style={styles.summaryLabel}>Great matches</Text>
            </View>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{averageScore}</Text>
              <Text style={styles.summaryLabel}>Avg score</Text>
            </View>
          </PremiumCard>

          <View style={styles.filterRow}>
            {filterOptions.map((option) => {
              const isActive = activeFilter === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setActiveFilter(option)}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>

          {filteredScans.length === 0 ? (
            <PremiumCard variant="elevated" style={styles.filteredEmptyState}>
              <Text style={styles.filteredEmptyTitle}>Nothing in this view yet</Text>
              <Text style={styles.filteredEmptyText}>
                Try another filter to compare products over time or return to all saved analyses.
              </Text>
            </PremiumCard>
          ) : (
            <View style={styles.list}>
              {filteredScans.map((scan) => {
                return (
                  <Pressable
                    key={scan.id}
                    onPress={() =>
                      router.push({
                        pathname: '/result',
                        params: {
                          payload: encodePayload(savedAnalysisToPayload(scan)),
                        },
                      })
                    }
                    style={({ pressed }) => [pressed && styles.cardPressed]}
                  >
                    <PremiumCard variant="elevated" style={styles.card}>
                      <View style={styles.topRow}>
                        <View style={styles.productMeta}>
                          <Text style={styles.brand}>{scan.brand}</Text>
                          <Text style={styles.productName}>{scan.productName}</Text>
                          <Text style={styles.secondaryLine}>
                            {scan.category} · {formatSavedAnalysisDate(scan.createdAt)}
                          </Text>
                        </View>

                        <View style={styles.scoreBubble}>
                          <Text style={styles.scoreBubbleValue}>{scan.overallScore}</Text>
                          <Text style={styles.scoreBubbleLabel}>Overall</Text>
                        </View>
                      </View>

                      <View style={styles.middleRow}>
                        <View
                          style={[
                            styles.verdictChip,
                            scan.verdict === 'Great Match' && styles.verdictChipSuccess,
                            scan.verdict === 'Use with Caution' && styles.verdictChipWarning,
                            scan.verdict === 'Not Ideal' && styles.verdictChipDanger,
                          ]}
                        >
                          <Ionicons
                            name={verdictIcon[scan.verdict]}
                            size={15}
                            color={
                              scan.verdict === 'Great Match'
                                ? colors.success
                                : scan.verdict === 'Use with Caution'
                                  ? colors.warning
                                  : colors.danger
                            }
                          />
                          <Text
                            style={[
                              styles.verdictChipText,
                              scan.verdict === 'Great Match' && styles.verdictChipTextSuccess,
                              scan.verdict === 'Use with Caution' && styles.verdictChipTextWarning,
                              scan.verdict === 'Not Ideal' && styles.verdictChipTextDanger,
                            ]}
                          >
                            {scan.verdict}
                          </Text>
                        </View>

                        <Badge label={scan.status} tone={scan.status === 'Needs review' ? 'warning' : 'default'} />
                      </View>

                      <Text style={styles.summary}>{scan.summary}</Text>

                      <View style={styles.metricRow}>
                        <Text style={styles.metricText}>Safety {scan.safetyScore}</Text>
                        <Text style={styles.metricSeparator}>•</Text>
                        <Text style={styles.metricText}>Match {scan.skinMatchScore}</Text>
                        <Text style={styles.metricSeparator}>•</Text>
                        <Text style={styles.metricText}>Effectiveness {scan.effectivenessScore}</Text>
                      </View>

                      <View style={styles.footerRow}>
                        <Text style={styles.footerHint}>Tap to reopen full analysis</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                      </View>
                    </PremiumCard>
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
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
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xxs,
    maxWidth: 320,
  },
  summaryCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  summaryMetric: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.68)',
  },
  summaryValue: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: '#D1DECF',
  },
  filterChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: colors.primaryDeep,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
  cardPressed: {
    opacity: 0.96,
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
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  secondaryLine: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  scoreBubble: {
    minWidth: 82,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
  },
  scoreBubbleValue: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
  },
  scoreBubbleLabel: {
    ...typography.caption,
    color: colors.primaryDeep,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  verdictChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verdictChipSuccess: {
    backgroundColor: '#EAF4ED',
    borderColor: '#D5E5D9',
  },
  verdictChipWarning: {
    backgroundColor: '#F7F0E6',
    borderColor: '#EBDDC8',
  },
  verdictChipDanger: {
    backgroundColor: '#F8ECEA',
    borderColor: '#EBCFCA',
  },
  verdictChipText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '700',
  },
  verdictChipTextSuccess: {
    color: colors.success,
  },
  verdictChipTextWarning: {
    color: colors.warning,
  },
  verdictChipTextDanger: {
    color: colors.danger,
  },
  summary: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  metricSeparator: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  footerHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  filteredEmptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  filteredEmptyTitle: {
    ...typography.sectionTitle,
    textAlign: 'center',
  },
  filteredEmptyText: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 300,
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
    maxWidth: 300,
  },
});

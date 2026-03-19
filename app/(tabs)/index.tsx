import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { dailyTip } from '@/lib/mock-data';
import { usePlan } from '@/lib/plan-context';
import { usePreferences } from '@/lib/preferences-context';
import { useSavedAnalyses } from '@/lib/saved-analyses-context';
import { formatSavedAnalysisDate, savedAnalysisToPayload } from '@/lib/storage';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';

function encodePayload(payload: ReturnType<typeof savedAnalysisToPayload>) {
  return encodeURIComponent(JSON.stringify(payload));
}

export default function HomeScreen() {
  const { name, skinGoal, skinType } = usePreferences();
  const { savedAnalyses } = useSavedAnalyses();
  const { isPremium, remainingAnalyses, currentPlan } = usePlan();
  const hasHistory = savedAnalyses.length > 0;
  const latestScan = savedAnalyses[0];
  const recentPreview = savedAnalyses.slice(0, 3);
  const greatMatchCount = savedAnalyses.filter((scan) => scan.verdict === 'Great Match').length;
  const averageConfidence =
    savedAnalyses.length > 0
      ? Math.round(
          savedAnalyses.reduce((total, scan) => total + (scan.confidenceScore ?? 60), 0) / savedAnalyses.length
        )
      : 0;
  const confidenceTone = averageConfidence >= 75 ? 'High' : averageConfidence >= 50 ? 'Moderate' : 'Low';
  const insightText = hasHistory
    ? `You have ${greatMatchCount} strong matches saved. Your skin profile continues to lean toward hydration-led, glow-supporting formulas.`
    : `Your skin profile suggests a calmer response to hydration-first formulas tailored to ${skinType.toLowerCase()} skin.`;
  const intelligenceStatus = hasHistory
    ? `Confidence ${confidenceTone.toLowerCase()} and improving with more ingredient-level analyses.`
    : 'Confidence improves with every saved analysis.';

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.topStack}>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.greeting}>Hi, {name}</Text>
            <Text style={styles.title}>Your skincare intelligence</Text>
            <Text style={styles.subtitle}>Scan products and get AI-powered insights tailored to you.</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile')} style={({ pressed }) => [styles.avatarPressable, pressed && styles.avatarPressed]}>
            <LinearGradient colors={gradients.accent} style={styles.avatar}>
              <Text style={styles.avatarLabel}>{name.charAt(0)}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <LinearGradient
          colors={['#F8FBF8', '#E6EEE5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryActionCard}
        >
          <View style={styles.primaryActionTopRow}>
            <View style={styles.primaryActionIcon}>
              <Ionicons name="scan" size={24} color={colors.primaryDeep} />
            </View>
          </View>

          <Text style={styles.primaryActionEyebrow}>Primary action</Text>
          <Text style={styles.primaryActionTitle}>Scan a product</Text>
          <Text style={styles.primaryActionBody}>Paste ingredients or scan a label to get a confident DermaIQ read in seconds.</Text>

          <View style={styles.primaryActionFooter}>
            <View style={styles.primaryActionHint}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
              <Text style={styles.primaryActionHintText}>Paste ingredients or scan a label</Text>
            </View>
          </View>

          <View style={styles.primaryActionButtonWrap}>
            <PrimaryButton
              label="Analyze ingredients"
              leftIcon={<Ionicons name="sparkles" size={18} color={colors.surfaceElevated} />}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
              onPress={() => router.push('/(tabs)/scan')}
            />
          </View>
        </LinearGradient>
      </View>

      <PremiumCard variant="tinted" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Skin profile</Text>
            <Text style={styles.profileTitle}>Built around your current skin priorities.</Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.editProfile}>Edit profile</Text>
          </Pressable>
        </View>

        <View style={styles.profileMetrics}>
          <View style={styles.profileMetric}>
            <View style={styles.profileMetricIcon}>
              <Ionicons name="water-outline" size={16} color={colors.primaryDeep} />
            </View>
            <Text style={styles.profileMetricLabel}>Skin type</Text>
            <Text style={styles.profileMetricValue}>{skinType}</Text>
          </View>
          <View style={styles.profileMetric}>
            <View style={styles.profileMetricIcon}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
            </View>
            <Text style={styles.profileMetricLabel}>Goal</Text>
            <Text style={styles.profileMetricValue}>{skinGoal}</Text>
          </View>
          <View style={styles.profileMetric}>
            <View style={styles.profileMetricIcon}>
              <Ionicons name="leaf-outline" size={16} color={colors.primaryDeep} />
            </View>
            <Text style={styles.profileMetricLabel}>Current state</Text>
            <Text style={styles.profileMetricValue}>Calm</Text>
          </View>
        </View>
      </PremiumCard>

      <PremiumCard variant="tinted" style={styles.insightCard}>
        <View style={styles.insightIcon}>
          <Ionicons name="sparkles-outline" size={18} color={colors.primaryDeep} />
        </View>
        <View style={styles.insightCopy}>
          <Text style={styles.insightEyebrow}>Personal insight</Text>
          <Text style={styles.sectionEyebrow}>DermaIQ Insight</Text>
          <Text style={styles.insightText}>{insightText}</Text>
          <View style={styles.intelligenceStrip}>
            <View style={styles.intelligencePill}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.primaryDeep} />
              <Text style={styles.intelligencePillText}>
                {hasHistory ? `Avg confidence ${averageConfidence}/100` : intelligenceStatus}
              </Text>
            </View>
            <View style={styles.intelligencePill}>
              <Ionicons
                name={currentPlan === 'premium' ? 'sparkles-outline' : 'time-outline'}
                size={14}
                color={colors.primaryDeep}
              />
              <Text style={styles.intelligencePillText}>
                {isPremium ? 'Premium unlocked' : `${remainingAnalyses} analyses left today`}
              </Text>
            </View>
          </View>
        </View>
      </PremiumCard>

      {hasHistory ? (
        <>
          <SectionHeader title="Latest analysis" subtitle="Pick up where you left off." />

          <Pressable
            onPress={() =>
              router.push({
                pathname: '/result',
                params: {
                  payload: encodePayload(savedAnalysisToPayload(latestScan)),
                },
              })
            }
            style={({ pressed }) => [styles.latestPressable, pressed && styles.latestPressed]}
          >
            <PremiumCard variant="elevated" style={styles.latestCard}>
              <View style={styles.latestTopRow}>
                <View style={styles.latestCopy}>
                  <Text style={styles.latestBrand}>{latestScan.brand}</Text>
                  <Text style={styles.latestName}>{latestScan.productName}</Text>
                  <Text style={styles.latestMeta}>
                    {latestScan.category} · {formatSavedAnalysisDate(latestScan.createdAt)}
                  </Text>
                </View>

                <View style={styles.latestScoreBubble}>
                  <Text style={styles.latestScoreValue}>{latestScan.overallScore}</Text>
                  <Text style={styles.latestScoreLabel}>Overall</Text>
                </View>
              </View>

              <View style={styles.latestBottomRow}>
                <View style={styles.latestBadgeRow}>
                  <Badge label={latestScan.verdict} tone={latestScan.verdict === 'Great Match' ? 'success' : 'warning'} />
                  <Badge
                    label={`${latestScan.confidenceLevel ?? 'Moderate'} confidence`}
                    tone={
                      (latestScan.confidenceLevel ?? 'Moderate') === 'High'
                        ? 'success'
                        : (latestScan.confidenceLevel ?? 'Moderate') === 'Low'
                          ? 'warning'
                          : 'default'
                    }
                  />
                </View>
                <View style={styles.viewHintPill}>
                  <Text style={styles.viewHintText}>View full analysis</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
              </View>
            </PremiumCard>
          </Pressable>

          <SectionHeader
            title="Recent analyses"
            subtitle="A compact view of your latest product reads."
            actionLabel="View all"
            onActionPress={() => router.push('/(tabs)/history')}
          />

          <View style={styles.recentList}>
            {recentPreview.map((scan) => (
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
                style={({ pressed }) => [styles.recentPressable, pressed && styles.recentPressed]}
              >
                <PremiumCard style={styles.recentItem}>
                  <View style={styles.recentRow}>
                    <View style={styles.recentCopy}>
                      <Text style={styles.recentName}>{scan.productName}</Text>
                      <Text style={styles.recentMeta}>
                        {scan.verdict} · {formatSavedAnalysisDate(scan.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.recentScorePill}>
                      <Text style={styles.recentScoreValue}>{scan.overallScore}</Text>
                    </View>
                  </View>
                </PremiumCard>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => router.push('/(tabs)/scan')} style={({ pressed }) => [styles.secondaryCtaCard, pressed && styles.secondaryCtaPressed]}>
            <View style={styles.secondaryCtaCopy}>
              <Text style={styles.secondaryCtaTitle}>Analyze another formula</Text>
              <Text style={styles.secondaryCtaText}>Keep building your product intelligence archive.</Text>
            </View>
            <Ionicons name="arrow-forward-circle-outline" size={24} color={colors.primaryDeep} />
          </Pressable>
        </>
      ) : (
        <PremiumCard variant="elevated" style={styles.emptyHistoryCard}>
          <View style={styles.emptyHistoryIcon}>
            <Ionicons name="scan-outline" size={22} color={colors.primaryDeep} />
          </View>
          <Text style={styles.emptyHistoryTitle}>Start by scanning your first product</Text>
          <Text style={styles.emptyHistoryText}>
            Once you run an analysis, your saved reads and product patterns will start building here.
          </Text>
          <PrimaryButton
            label="Scan your first product"
            leftIcon={<Ionicons name="sparkles" size={18} color={colors.surfaceElevated} />}
            onPress={() => router.push('/(tabs)/scan')}
          />
        </PremiumCard>
      )}

      <PremiumCard variant="tinted" style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Ionicons name="leaf-outline" size={20} color={colors.primaryDeep} />
        </View>
        <View style={styles.tipCopy}>
          <Text style={styles.sectionEyebrow}>Daily tip</Text>
          <Text style={styles.tipText}>{dailyTip}</Text>
          <Text style={styles.tipMeta}>Based on ingredient-level analysis patterns and your saved routine signals.</Text>
        </View>
      </PremiumCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  topStack: {
    gap: spacing.xxl,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  heroCopy: {
    flex: 1,
  },
  greeting: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.hero,
    fontSize: 42,
    lineHeight: 46,
    maxWidth: 320,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.sm,
    maxWidth: 330,
  },
  avatarPressable: {
    borderRadius: radius.pill,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    ...shadows.soft,
  },
  avatarPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
  avatarLabel: {
    color: colors.primaryDeep,
    fontSize: 20,
    fontWeight: '700',
  },
  primaryActionCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E8E0D2',
    gap: spacing.lg,
    ...shadows.medium,
  },
  primaryActionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  primaryActionEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  primaryActionIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.68)',
  },
  primaryActionTitle: {
    ...typography.title,
    fontSize: 32,
    lineHeight: 38,
    maxWidth: 300,
  },
  primaryActionBody: {
    ...typography.body,
    maxWidth: 340,
  },
  primaryActionFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  primaryActionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.64)',
  },
  primaryActionHintText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  primaryActionButtonWrap: {
    marginTop: spacing.xs,
  },
  sectionEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  profileCard: {
    gap: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  profileTitle: {
    ...typography.sectionTitle,
    maxWidth: 260,
    marginTop: spacing.xxs,
  },
  editProfile: {
    color: colors.primaryDeep,
    fontSize: 14,
    fontWeight: '700',
  },
  profileMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  profileMetric: {
    flex: 1,
    minWidth: 96,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.xs,
  },
  profileMetricIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMetricValue: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
  },
  profileMetricLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surfaceTint,
    borderColor: '#D8E4DA',
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCopy: {
    flex: 1,
  },
  insightEyebrow: {
    ...typography.eyebrow,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  insightText: {
    ...typography.body,
    marginTop: spacing.xs,
    color: colors.text,
  },
  intelligenceStrip: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  intelligencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '100%',
  },
  intelligencePillText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
    flexShrink: 1,
  },
  latestPressable: {
    borderRadius: radius.lg,
  },
  latestPressed: {
    opacity: 0.97,
    transform: [{ scale: 0.992 }],
  },
  latestCard: {
    gap: spacing.md,
  },
  latestTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  latestCopy: {
    flex: 1,
  },
  latestBrand: {
    ...typography.eyebrow,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  latestName: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  latestMeta: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  latestScoreBubble: {
    minWidth: 84,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
  },
  latestScoreValue: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
  },
  latestScoreLabel: {
    ...typography.caption,
    color: colors.primaryDeep,
  },
  latestBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  latestBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    flex: 1,
  },
  viewHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  viewHintText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  recentList: {
    gap: spacing.md,
  },
  recentPressable: {
    borderRadius: radius.md,
  },
  recentPressed: {
    opacity: 0.97,
  },
  recentItem: {
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  recentCopy: {
    flex: 1,
  },
  recentName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
  },
  recentMeta: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  recentScorePill: {
    minWidth: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
  },
  recentScoreValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryCtaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryCtaPressed: {
    opacity: 0.97,
  },
  secondaryCtaCopy: {
    flex: 1,
  },
  secondaryCtaTitle: {
    ...typography.bodyStrong,
  },
  secondaryCtaText: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  emptyHistoryCard: {
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  emptyHistoryIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHistoryTitle: {
    ...typography.sectionTitle,
    maxWidth: 280,
  },
  emptyHistoryText: {
    ...typography.body,
    maxWidth: 320,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingVertical: spacing.xl,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCopy: {
    flex: 1,
  },
  tipText: {
    ...typography.body,
    marginTop: spacing.xs,
    color: colors.text,
  },
  tipMeta: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
});

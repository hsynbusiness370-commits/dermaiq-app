import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScoreCard } from '@/components/ScoreCard';
import { Screen } from '@/components/Screen';
import { usePreferences } from '@/lib/preferences-context';
import { analyzeProduct } from '@/lib/scoring';
import { sampleAnalysisProduct } from '@/lib/sample-products';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';
import { Ingredient, ManualAnalysisPayload } from '@/lib/types';

const verdictTone = {
  'Great Match': 'success',
  'Use with Caution': 'warning',
  'Not Ideal': 'danger',
} as const;

const verdictHeadline = {
  'Great Match': 'Mostly compatible with your skin',
  'Use with Caution': 'Promising, but with a few risks',
  'Not Ideal': 'Likely not the best fit for your skin',
  'Limited match': 'We need a little more clarity',
} as const;

const verdictGradient = {
  success: ['#F7FBF7', '#E4EFE7'] as const,
  warning: ['#FBF7F0', '#F2E4CF'] as const,
  danger: ['#FBF5F4', '#F1E1DE'] as const,
};

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function decodePayload(value?: string | string[]): ManualAnalysisPayload | null {
  const rawValue = getParamValue(value);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(rawValue)) as ManualAnalysisPayload;
  } catch {
    return null;
  }
}

function renderIngredientMeta(ingredient: Ingredient) {
  const benefitSummary = ingredient.benefits.slice(0, 1).join(' • ');
  return benefitSummary || 'Known ingredient';
}

function toTitleCase(value: string) {
  return value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function ResultScreen() {
  const { userProfile } = usePreferences();
  const params = useLocalSearchParams<{ payload?: string | string[] }>();
  const payload = useMemo(() => decodePayload(params.payload), [params.payload]);
  const fallbackAnalysis = useMemo(() => analyzeProduct(sampleAnalysisProduct, userProfile), [userProfile]);

  const analysis = payload?.analysis ?? fallbackAnalysis;
  const matchedIngredients = payload?.matchedIngredients ?? fallbackAnalysis.product.ingredients;
  const unknownIngredients = payload?.unknownIngredients ?? [];
  const hasMatchedIngredients = matchedIngredients.length > 0;
  const verdictLabel = hasMatchedIngredients ? analysis.verdict : 'Limited match';
  const verdictColorTone = hasMatchedIngredients ? verdictTone[analysis.verdict] : 'warning';
  const heroColors =
    verdictColorTone === 'success'
      ? verdictGradient.success
      : verdictColorTone === 'danger'
        ? verdictGradient.danger
        : verdictGradient.warning;
  const overallScore = Math.round(
    analysis.safetyScore * 0.4 + analysis.skinMatchScore * 0.35 + analysis.effectivenessScore * 0.25
  );
  const compactInsight = hasMatchedIngredients
    ? analysis.explanation
    : 'We found too few recognizable ingredients to deliver a confident DermaIQ verdict.';

  return (
    <Screen contentContainerStyle={styles.content}>
      <LinearGradient colors={heroColors} style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Badge label={verdictLabel} tone={verdictColorTone} />
          <View style={styles.productMetaPill}>
            <Text style={styles.productMetaPillText}>{toTitleCase(analysis.product.category)}</Text>
          </View>
        </View>

        <View style={styles.heroContent}>
          <View style={styles.productHeader}>
            <Text style={styles.heroEyebrow}>{analysis.product.brand}</Text>
            <Text style={styles.productName}>{analysis.product.name}</Text>
            <Text style={styles.productCategory}>{toTitleCase(analysis.product.category)}</Text>
          </View>

          <View style={styles.heroHeaderBlock}>
            <Text style={styles.heroTitle}>{verdictHeadline[verdictLabel]}</Text>
            <Text style={styles.heroSummary}>{compactInsight}</Text>
          </View>
        </View>
      </LinearGradient>

      {hasMatchedIngredients ? (
        <>
          <PremiumCard variant="elevated" style={styles.scoreReportCard}>
            <Text style={styles.sectionEyebrow}>Overall read</Text>
            <View style={styles.overallScoreCard}>
              <View>
                <Text style={styles.overallScoreLabel}>Overall Compatibility</Text>
                <Text style={styles.overallScoreHeadline}>{verdictHeadline[analysis.verdict]}</Text>
                <Text style={styles.overallScoreSummary}>
                  A quick DermaIQ read blending safety, skin fit, and expected usefulness.
                </Text>
              </View>
              <View style={styles.overallScoreBubble}>
                <Text style={styles.overallScoreValue}>{overallScore}</Text>
                <Text style={styles.overallScoreOutOf}>/100</Text>
              </View>
            </View>

            <View style={styles.detailScoreStack}>
              <ScoreCard label="Safety" score={analysis.safetyScore} style={styles.detailScoreCard} />
              <ScoreCard label="Skin Match" score={analysis.skinMatchScore} style={styles.detailScoreCard} />
              <ScoreCard label="Effectiveness" score={analysis.effectivenessScore} style={styles.detailScoreCard} />
            </View>
          </PremiumCard>

          <PremiumCard style={styles.explanationCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIcon}>
                <Ionicons name="sparkles" size={18} color={colors.primaryDeep} />
              </View>
              <View style={styles.insightCopy}>
                <Text style={styles.insightTitle}>DermaIQ Insight</Text>
                <Text style={styles.insightSubtitle}>Your distilled AI skincare read, simplified.</Text>
              </View>
            </View>
            <Text style={styles.explanationText}>{analysis.verdictSummary}</Text>
          </PremiumCard>

          <View style={styles.splitSection}>
            <PremiumCard style={styles.splitCard}>
              <Text style={styles.splitTitle}>Why it works for you</Text>
              <View style={styles.bulletList}>
                {analysis.whyItMatches.map((item) => (
                  <View key={item} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, styles.successDot]} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </PremiumCard>

            <PremiumCard style={styles.splitCard}>
              <Text style={styles.splitTitle}>What to watch out for</Text>
              <View style={styles.bulletList}>
                {analysis.possibleConcerns.map((item) => (
                  <View key={item} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, styles.warningDot]} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            </PremiumCard>
          </View>

          <PremiumCard variant="tinted" style={styles.routineCard}>
            <Text style={styles.sectionEyebrow}>Recommended use</Text>
            <Text style={styles.routineTitle}>Where this fits best</Text>
            <View style={styles.recommendedGrid}>
              {analysis.recommendedFor.map((item) => (
                <View key={item} style={styles.recommendationChip}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={colors.primaryDeep} />
                  <Text style={styles.recommendationText}>{item}</Text>
                </View>
              ))}
            </View>
          </PremiumCard>
        </>
      ) : (
        <PremiumCard variant="tinted" style={styles.emptyStateCard}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="help-buoy-outline" size={22} color={colors.warning} />
          </View>
          <Text style={styles.emptyStateTitle}>We couldn&apos;t confidently identify these ingredients yet.</Text>
          <Text style={styles.emptyStateText}>
            Try pasting a shorter list, correcting spelling, or using the sample input to see how the analysis flow works with known ingredients.
          </Text>
        </PremiumCard>
      )}

      <PremiumCard style={styles.listCard}>
        <View style={styles.ingredientsHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Ingredients</Text>
            <Text style={styles.ingredientsTitle}>Matched ingredients</Text>
          </View>
          {matchedIngredients.length > 0 ? <Badge label="Recognized locally" tone="success" /> : null}
        </View>
        <View style={styles.ingredientGrid}>
          {matchedIngredients.length > 0 ? (
            matchedIngredients.map((ingredient) => (
              <View key={ingredient.name} style={styles.ingredientCard}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientMeta}>{renderIngredientMeta(ingredient)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sectionEmptyText}>No known ingredients were confidently matched from the input.</Text>
          )}
        </View>
      </PremiumCard>

      <PremiumCard variant="tinted" style={styles.listCard}>
        <View style={styles.ingredientsHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Review notes</Text>
            <Text style={styles.ingredientsTitle}>Unknown ingredients</Text>
          </View>
          {unknownIngredients.length === 0 ? <Badge label="All ingredients recognized" tone="success" /> : null}
        </View>
        <View style={styles.unknownIngredientsList}>
          {unknownIngredients.length > 0 ? (
            unknownIngredients.map((ingredient) => (
              <View key={ingredient} style={styles.unknownIngredientCard}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
                <Text style={styles.unknownIngredientName}>{ingredient}</Text>
              </View>
            ))
          ) : (
            <View style={styles.successStateCard}>
              <View style={styles.successStateIcon}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              </View>
              <View style={styles.successStateCopy}>
                <Text style={styles.successStateTitle}>All ingredients recognized</Text>
                <Text style={styles.successStateText}>
                  DermaIQ confidently matched every ingredient in this list against the current local database.
                </Text>
              </View>
            </View>
          )}
        </View>
      </PremiumCard>

      <View style={styles.actions}>
        <PrimaryButton
          label="Analyze another list"
          leftIcon={<Ionicons name="create-outline" size={18} color={colors.surfaceElevated} />}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
          onPress={() => router.back()}
        />
        <PrimaryButton
          label="Save to history"
          variant="secondary"
          size="md"
          leftIcon={<Ionicons name="bookmark-outline" size={16} color={colors.text} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.xl,
    borderWidth: 1,
    borderColor: '#E7E0D2',
    ...shadows.medium,
  },
  heroTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  productMetaPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.64)',
  },
  productMetaPillText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  heroContent: {
    gap: spacing.lg,
  },
  productHeader: {
    gap: spacing.xxs,
  },
  heroHeaderBlock: {
    gap: spacing.sm,
  },
  heroEyebrow: {
    ...typography.eyebrow,
    color: colors.textMuted,
  },
  heroTitle: {
    ...typography.hero,
    fontSize: 40,
    lineHeight: 44,
    maxWidth: 360,
  },
  heroSummary: {
    ...typography.body,
    color: colors.text,
    maxWidth: 360,
  },
  productName: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  productCategory: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  scoreReportCard: {
    gap: spacing.lg,
  },
  sectionEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  overallScoreCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceTint,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#D8E4DA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  overallScoreLabel: {
    ...typography.caption,
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  overallScoreHeadline: {
    ...typography.sectionTitle,
    marginTop: spacing.xs,
    maxWidth: 250,
  },
  overallScoreSummary: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    maxWidth: 260,
  },
  overallScoreBubble: {
    minWidth: 104,
    minHeight: 104,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  overallScoreValue: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.9,
  },
  overallScoreOutOf: {
    ...typography.caption,
    color: colors.textMuted,
  },
  detailScoreStack: {
    gap: spacing.md,
  },
  detailScoreCard: {
    width: '100%',
    minWidth: 0,
  },
  explanationCard: {
    gap: spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCopy: {
    flex: 1,
  },
  insightTitle: {
    ...typography.sectionTitle,
    fontSize: 20,
    lineHeight: 24,
  },
  insightSubtitle: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  explanationText: {
    ...typography.bodyStrong,
    color: colors.text,
    lineHeight: 25,
  },
  splitSection: {
    gap: spacing.md,
  },
  splitCard: {
    gap: spacing.md,
  },
  splitTitle: {
    ...typography.sectionTitle,
    fontSize: 19,
    lineHeight: 24,
  },
  routineCard: {
    gap: spacing.md,
  },
  routineTitle: {
    ...typography.sectionTitle,
    fontSize: 20,
    lineHeight: 26,
  },
  listCard: {
    gap: spacing.md,
  },
  emptyStateCard: {
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  emptyStateIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#F7EEE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    ...typography.sectionTitle,
    maxWidth: 320,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.text,
  },
  bulletList: {
    gap: spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    marginTop: 7,
  },
  successDot: {
    backgroundColor: colors.success,
  },
  warningDot: {
    backgroundColor: colors.warning,
  },
  bulletText: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
  recommendedGrid: {
    gap: spacing.sm,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  ingredientsTitle: {
    ...typography.sectionTitle,
    fontSize: 20,
    lineHeight: 25,
    marginTop: spacing.xxs,
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  ingredientCard: {
    minWidth: 136,
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ingredientName: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.text,
  },
  ingredientMeta: {
    ...typography.caption,
    marginTop: spacing.xxs,
    fontSize: 12,
    lineHeight: 16,
  },
  unknownIngredientsList: {
    gap: spacing.sm,
  },
  unknownIngredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#F8EFE5',
    borderWidth: 1,
    borderColor: '#EBDCC9',
  },
  unknownIngredientName: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  sectionEmptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  successStateCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#EAF4ED',
    borderWidth: 1,
    borderColor: '#D5E5D9',
  },
  successStateIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FCF8',
  },
  successStateCopy: {
    flex: 1,
  },
  successStateTitle: {
    ...typography.bodyStrong,
    color: colors.success,
  },
  successStateText: {
    ...typography.bodySmall,
    marginTop: spacing.xxs,
    color: colors.textSecondary,
  },
  recommendationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  recommendationText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingTop: spacing.md,
  },
});

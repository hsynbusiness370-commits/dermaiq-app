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
import { SectionHeader } from '@/components/SectionHeader';
import { usePreferences } from '@/lib/preferences-context';
import { analyzeProduct } from '@/lib/scoring';
import { sampleAnalysisProduct } from '@/lib/sample-products';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';
import { Ingredient, ManualAnalysisPayload } from '@/lib/types';

const verdictTone = {
  'Great Match': 'success',
  'Use with Caution': 'warning',
  'Not Ideal': 'danger',
} as const;

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
  const benefitSummary = ingredient.benefits.slice(0, 2).join(' • ');
  return benefitSummary || 'Known ingredient';
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

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>AI report</Text>
        <Text style={styles.title}>Your premium skin analysis preview.</Text>
        <Text style={styles.subtitle}>
          A polished mock report structure for how DermaIQ can present a product verdict and the reasons behind it.
        </Text>
      </View>

      <LinearGradient colors={gradients.hero} style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Badge
            label={hasMatchedIngredients ? analysis.verdict : 'Limited match'}
            tone={hasMatchedIngredients ? verdictTone[analysis.verdict] : 'warning'}
          />
          <Badge label={analysis.product.category} tone="premium" />
        </View>

        <View style={styles.heroBody}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={colors.primaryDeep} />
            <Text style={styles.imageLabel}>Product image</Text>
          </View>

          <View style={styles.productCopy}>
            <Text style={styles.productBrand}>{analysis.product.brand}</Text>
            <Text style={styles.productName}>{analysis.product.name}</Text>
            <Text style={styles.productCategory}>{analysis.product.category}</Text>
          </View>
        </View>
      </LinearGradient>

      {hasMatchedIngredients ? (
        <>
          <PremiumCard variant="elevated" style={styles.scoreReportCard}>
            <SectionHeader
              title="Score overview"
              subtitle="A quick read of safety, compatibility, and expected payoff."
            />

            <View style={styles.scoreRow}>
              <ScoreCard label="Safety" score={analysis.safetyScore} />
              <ScoreCard label="Skin Match" score={analysis.skinMatchScore} />
              <ScoreCard label="Effectiveness" score={analysis.effectivenessScore} />
            </View>
          </PremiumCard>

          <PremiumCard variant="tinted" style={styles.verdictCard}>
            <Text style={styles.verdictEyebrow}>Summary verdict</Text>
            <Text style={styles.verdictTitle}>{analysis.verdict}</Text>
            <Text style={styles.verdictText}>{analysis.verdictSummary}</Text>
          </PremiumCard>

          <PremiumCard style={styles.explanationCard}>
            <SectionHeader
              title="AI explanation"
              subtitle="A calm editorial-style summary of what stands out in the formula."
            />
            <Text style={styles.explanationText}>{analysis.explanation}</Text>
          </PremiumCard>

          <PremiumCard style={styles.listCard}>
            <SectionHeader title="Why it matches" subtitle="Signals supporting the positive fit." />
            <View style={styles.bulletList}>
              {analysis.whyItMatches.map((item) => (
                <View key={item} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, styles.successDot]} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </PremiumCard>

          <PremiumCard style={styles.listCard}>
            <SectionHeader title="Possible concerns" subtitle="Important notes worth keeping in mind." />
            <View style={styles.bulletList}>
              {analysis.possibleConcerns.map((item) => (
                <View key={item} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, styles.warningDot]} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </PremiumCard>

          <PremiumCard style={styles.listCard}>
            <SectionHeader
              title="Recommended for your skin goals"
              subtitle="Where this product could fit best in a goal-led routine."
            />
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
        <SectionHeader
          title="Matched ingredients"
          subtitle="Recognized locally from the current DermaIQ ingredient database."
        />
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
        <SectionHeader
          title="Unknown ingredients"
          subtitle="These were not confidently matched yet and are shown separately so nothing feels hidden."
        />
        <View style={styles.ingredientGrid}>
          {unknownIngredients.length > 0 ? (
            unknownIngredients.map((ingredient) => (
              <View key={ingredient} style={styles.unknownIngredientCard}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
                <Text style={styles.unknownIngredientName}>{ingredient}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.sectionEmptyText}>Everything in this input matched the current local ingredient database.</Text>
          )}
        </View>
      </PremiumCard>

      <View style={styles.actions}>
        <PrimaryButton
          label="Analyze another list"
          leftIcon={<Ionicons name="create-outline" size={18} color={colors.surfaceElevated} />}
          onPress={() => router.back()}
        />
        <PrimaryButton label="Save result" variant="secondary" />
      </View>
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
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
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
  heroBody: {
    gap: spacing.lg,
  },
  imagePlaceholder: {
    minHeight: 220,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(85, 113, 94, 0.12)',
    backgroundColor: 'rgba(255,255,255,0.68)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  imageLabel: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  productCopy: {
    gap: spacing.xs,
  },
  productBrand: {
    ...typography.eyebrow,
    color: colors.textMuted,
  },
  productName: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.7,
  },
  productCategory: {
    ...typography.body,
  },
  scoreReportCard: {
    gap: spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  verdictCard: {
    gap: spacing.xs,
  },
  verdictEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  verdictTitle: {
    ...typography.title,
    fontSize: 28,
    lineHeight: 34,
  },
  verdictText: {
    ...typography.body,
    color: colors.text,
  },
  explanationCard: {
    gap: spacing.md,
  },
  explanationText: {
    ...typography.body,
    color: colors.text,
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
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  ingredientCard: {
    minWidth: 150,
    flexGrow: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  ingredientName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.text,
  },
  ingredientMeta: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  unknownIngredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#F8EFE5',
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
  },
});

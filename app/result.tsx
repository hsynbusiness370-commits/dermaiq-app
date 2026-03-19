import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScoreCard } from '@/components/ScoreCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { resultPreview } from '@/lib/mock-data';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';

const verdictTone = {
  'Great Match': 'success',
  'Use with Caution': 'warning',
  'Not Ideal': 'danger',
} as const;

export default function ResultScreen() {
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
          <Badge label={resultPreview.verdict} tone={verdictTone[resultPreview.verdict]} />
          <Badge label={resultPreview.category} tone="premium" />
        </View>

        <View style={styles.heroBody}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={colors.primaryDeep} />
            <Text style={styles.imageLabel}>Product image</Text>
          </View>

          <View style={styles.productCopy}>
            <Text style={styles.productBrand}>{resultPreview.brand}</Text>
            <Text style={styles.productName}>{resultPreview.productName}</Text>
            <Text style={styles.productCategory}>{resultPreview.category}</Text>
          </View>
        </View>
      </LinearGradient>

      <PremiumCard variant="elevated" style={styles.scoreReportCard}>
        <SectionHeader
          title="Score overview"
          subtitle="A quick read of safety, compatibility, and expected payoff."
        />

        <View style={styles.scoreRow}>
          <ScoreCard label="Safety" score={resultPreview.safetyScore} />
          <ScoreCard label="Skin Match" score={resultPreview.skinMatchScore} />
          <ScoreCard label="Effectiveness" score={resultPreview.effectivenessScore} />
        </View>
      </PremiumCard>

      <PremiumCard variant="tinted" style={styles.verdictCard}>
        <Text style={styles.verdictEyebrow}>Summary verdict</Text>
        <Text style={styles.verdictTitle}>{resultPreview.verdict}</Text>
        <Text style={styles.verdictText}>{resultPreview.verdictSummary}</Text>
      </PremiumCard>

      <PremiumCard style={styles.explanationCard}>
        <SectionHeader
          title="AI explanation"
          subtitle="A calm editorial-style summary of what stands out in the formula."
        />
        <Text style={styles.explanationText}>{resultPreview.explanation}</Text>
      </PremiumCard>

      <PremiumCard style={styles.listCard}>
        <SectionHeader title="Why it matches" subtitle="Signals supporting the positive fit." />
        <View style={styles.bulletList}>
          {resultPreview.whyItMatches.map((item) => (
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
          {resultPreview.possibleConcerns.map((item) => (
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
          {resultPreview.recommendedFor.map((item) => (
            <View key={item} style={styles.recommendationChip}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primaryDeep} />
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      <View style={styles.actions}>
        <PrimaryButton
          label="Scan another product"
          leftIcon={<Ionicons name="scan" size={18} color={colors.surfaceElevated} />}
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

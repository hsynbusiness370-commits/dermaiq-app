import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScoreCard } from '@/components/ScoreCard';
import { Screen } from '@/components/Screen';
import { resultPreview } from '@/lib/mock-data';
import { colors, radius, spacing, typography } from '@/lib/theme';

export default function ResultScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Result</Text>
        <Text style={styles.title}>Premium product evaluation preview.</Text>
        <Text style={styles.subtitle}>
          This is a visual placeholder for the future AI output flow. No analysis logic is connected yet.
        </Text>
      </View>

      <PremiumCard style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={36} color={colors.primaryDeep} />
          <Text style={styles.imageLabel}>Product image placeholder</Text>
        </View>

        <View style={styles.productCopy}>
          <Text style={styles.productName}>{resultPreview.productName}</Text>
          <Text style={styles.productBrand}>{resultPreview.brand}</Text>
        </View>

        <View style={styles.scoreRow}>
          <ScoreCard label="Safety Score" score={resultPreview.safetyScore} />
          <ScoreCard label="Skin Match Score" score={resultPreview.skinMatchScore} />
        </View>
        <ScoreCard label="Effectiveness Score" score={resultPreview.effectivenessScore} />

        <View style={styles.explanationBox}>
          <Text style={styles.explanationLabel}>AI explanation</Text>
          <Text style={styles.explanationText}>{resultPreview.explanation}</Text>
        </View>
      </PremiumCard>

      <View style={styles.actions}>
        <PrimaryButton label="Scan another product" onPress={() => router.back()} />
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
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  card: {
    gap: spacing.lg,
  },
  imagePlaceholder: {
    minHeight: 220,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  imageLabel: {
    color: colors.primaryDeep,
    fontWeight: '600',
  },
  productCopy: {
    gap: spacing.xs,
  },
  productName: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
  },
  productBrand: {
    ...typography.body,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  explanationBox: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    gap: spacing.sm,
  },
  explanationLabel: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  explanationText: {
    ...typography.body,
    color: colors.text,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
});

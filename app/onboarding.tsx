import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/OptionChip';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { skinGoals, skinTypes } from '@/lib/mock-data';
import { usePreferences } from '@/lib/preferences-context';
import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

const onboardingSteps = [
  {
    key: 'skin-type',
    title: 'What is your skin type?',
    description: 'Pick the profile that feels closest today. You can adjust it later.',
  },
  {
    key: 'skin-goal',
    title: 'What are you focusing on?',
    description: 'This helps DermaIQ tailor how your scan results are framed.',
  },
] as const;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { skinGoal, skinType, setSkinGoal, setSkinType } = usePreferences();

  const isLastStep = step === onboardingSteps.length - 1;
  const progressWidth = useMemo<DimensionValue>(
    () => `${((step + 1) / onboardingSteps.length) * 100}%`,
    [step]
  );

  const handleContinue = () => {
    if (isLastStep) {
      router.replace('/(tabs)');
      return;
    }

    setStep((current) => current + 1);
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles" size={18} color={colors.primaryDeep} />
          <Text style={styles.heroBadgeText}>DermaIQ</Text>
        </View>
        <Text style={styles.heroTitle}>Personalized skincare guidance in two quick steps.</Text>
        <Text style={styles.heroBody}>
          A premium AI companion for product scans, ingredient clarity, and skin-aware insights.
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressLabel}>
          Step {step + 1} of {onboardingSteps.length}
        </Text>
      </View>

      <PremiumCard>
        <Text style={styles.stepTitle}>{onboardingSteps[step].title}</Text>
        <Text style={styles.stepBody}>{onboardingSteps[step].description}</Text>

        <View style={styles.optionStack}>
          {step === 0
            ? skinTypes.map((option) => (
                <OptionChip
                  key={option}
                  label={option}
                  selected={skinType === option}
                  onPress={() => setSkinType(option)}
                />
              ))
            : skinGoals.map((option) => (
                <OptionChip
                  key={option}
                  label={option}
                  selected={skinGoal === option}
                  onPress={() => setSkinGoal(option)}
                />
              ))}
        </View>

        <View style={styles.footerRow}>
          {step > 0 ? (
            <PrimaryButton label="Back" variant="secondary" onPress={() => setStep((current) => current - 1)} />
          ) : null}
          <View style={styles.flexButton}>
            <PrimaryButton label={isLastStep ? 'Start exploring' : 'Continue'} onPress={handleContinue} />
          </View>
        </View>
      </PremiumCard>

      <View style={styles.featureRow}>
        <View style={styles.featurePill}>
          <Ionicons name="scan" size={16} color={colors.primaryDeep} />
          <Text style={styles.featureText}>Fast product scans</Text>
        </View>
        <View style={styles.featurePill}>
          <Ionicons name="leaf-outline" size={16} color={colors.primaryDeep} />
          <Text style={styles.featureText}>Skin-aware scoring</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  heroCard: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: '#D6E8DD',
    ...shadows.soft,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  heroBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  heroTitle: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  heroBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#DCE9E0',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  progressLabel: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  stepTitle: {
    ...typography.sectionTitle,
    marginBottom: spacing.xs,
  },
  stepBody: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  optionStack: {
    gap: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  flexButton: {
    flex: 1,
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

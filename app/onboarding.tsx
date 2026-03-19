import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/OptionChip';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { skinGoals, skinTypes } from '@/lib/mock-data';
import { usePreferences } from '@/lib/preferences-context';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';

const stepMeta = [
  {
    key: 'skin-type',
    eyebrow: 'Skin profile',
    title: 'Build a skincare profile that already feels personal.',
    description: 'Choose the skin type that best reflects how your skin behaves most days.',
    options: [
      { label: skinTypes[0], description: 'Comforted by richer moisture', icon: 'water-outline' },
      { label: skinTypes[1], description: 'Shine-prone through the day', icon: 'sunny-outline' },
      { label: skinTypes[2], description: 'Balanced with occasional shifts', icon: 'shuffle-outline' },
      { label: skinTypes[3], description: 'Easily reactive or delicate', icon: 'leaf-outline' },
    ],
  },
  {
    key: 'skin-goal',
    eyebrow: 'Focus',
    title: 'Tell DermaIQ what you want to improve next.',
    description: 'We will frame each future scan around the outcome you care about most.',
    options: [
      { label: skinGoals[0], description: 'Reduce congestion and breakouts', icon: 'sparkles-outline' },
      { label: skinGoals[1], description: 'Support firmness and smoothness', icon: 'hourglass-outline' },
      { label: skinGoals[2], description: 'Boost softness and moisture retention', icon: 'water-outline' },
      { label: skinGoals[3], description: 'Prioritize radiance and clarity', icon: 'sunny-outline' },
    ],
  },
] as const;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { skinGoal, skinType, setSkinGoal, setSkinType } = usePreferences();

  const isLastStep = step === stepMeta.length - 1;
  const progressWidth = useMemo<DimensionValue>(() => `${((step + 1) / stepMeta.length) * 100}%`, [step]);

  const handleContinue = () => {
    if (isLastStep) {
      router.replace('/(tabs)');
      return;
    }

    setStep((current) => current + 1);
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={16} color={colors.primaryDeep} />
            <Text style={styles.heroBadgeText}>DermaIQ</Text>
          </View>
          <Text style={styles.progressText}>
            {step + 1}/{stepMeta.length}
          </Text>
        </View>

        <Text style={styles.heroTitle}>Premium skincare analysis, tailored in moments.</Text>
        <Text style={styles.heroBody}>
          A softer setup before smarter scans: set your profile once and get cleaner, more relevant product insights.
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <View style={styles.progressDots}>
          {stepMeta.map((item, index) => (
            <View key={item.key} style={[styles.progressDot, index === step && styles.progressDotActive]} />
          ))}
        </View>
      </LinearGradient>

      <PremiumCard variant="elevated" style={styles.stepCard}>
        <Text style={styles.stepEyebrow}>{stepMeta[step].eyebrow}</Text>
        <Text style={styles.stepTitle}>{stepMeta[step].title}</Text>
        <Text style={styles.stepBody}>{stepMeta[step].description}</Text>

        <View style={styles.optionStack}>
          {step === 0
            ? stepMeta[0].options.map((option) => (
                <OptionChip
                  key={option.label}
                  label={option.label}
                  description={option.description}
                  selected={skinType === option.label}
                  icon={<Ionicons name={option.icon} size={20} color={colors.primaryDeep} />}
                  onPress={() => setSkinType(option.label)}
                />
              ))
            : stepMeta[1].options.map((option) => (
                <OptionChip
                  key={option.label}
                  label={option.label}
                  description={option.description}
                  selected={skinGoal === option.label}
                  icon={<Ionicons name={option.icon} size={20} color={colors.primaryDeep} />}
                  onPress={() => setSkinGoal(option.label)}
                />
              ))}
        </View>

        <View style={styles.footerRow}>
          {step > 0 ? (
            <View style={styles.secondaryButton}>
              <PrimaryButton label="Back" size="md" variant="secondary" onPress={() => setStep((current) => current - 1)} />
            </View>
          ) : null}
          <View style={styles.flexButton}>
            <PrimaryButton
              label={isLastStep ? 'Enter DermaIQ' : 'Continue'}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
              onPress={handleContinue}
            />
          </View>
        </View>
      </PremiumCard>

      <View style={styles.trustRow}>
        <View style={styles.trustPill}>
          <Ionicons name="scan-outline" size={16} color={colors.primaryDeep} />
          <Text style={styles.trustText}>Two-step setup</Text>
        </View>
        <View style={styles.trustPill}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.primaryDeep} />
          <Text style={styles.trustText}>Elegant AI summaries</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    justifyContent: 'space-between',
  },
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E7E0D2',
    ...shadows.soft,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  heroBadgeText: {
    color: colors.primaryDeep,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  heroTitle: {
    ...typography.title,
    fontSize: 32,
    lineHeight: 38,
    marginBottom: spacing.sm,
    maxWidth: 320,
  },
  heroBody: {
    ...typography.body,
    marginBottom: spacing.lg,
    maxWidth: 360,
  },
  progressTrack: {
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(85, 113, 94, 0.12)',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDeep,
  },
  progressDots: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(85, 113, 94, 0.2)',
  },
  progressDotActive: {
    width: 24,
    backgroundColor: colors.primaryDeep,
  },
  stepCard: {
    gap: spacing.md,
  },
  stepEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  stepTitle: {
    ...typography.sectionTitle,
    fontSize: 28,
    lineHeight: 34,
  },
  stepBody: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  optionStack: {
    gap: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  secondaryButton: {
    width: 108,
  },
  flexButton: {
    flex: 1,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
});

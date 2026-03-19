import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { usePlan } from '@/lib/plan-context';
import { colors, gradients, radius, spacing, typography } from '@/lib/theme';

export default function PremiumScreen() {
  const { currentPlan, dailyFreeLimit, upgradeToPremium, isPremium, remainingAnalyses } = usePlan();

  return (
    <Screen contentContainerStyle={styles.content}>
      <LinearGradient colors={gradients.hero} style={styles.heroCard}>
        <View style={styles.iconShell}>
          <Ionicons name="sparkles-outline" size={22} color={colors.gold} />
        </View>
        <Text style={styles.title}>Unlock deeper skin intelligence</Text>
        <Text style={styles.subtitle}>
          Get smarter insights tailored to your skin, plus unlimited analysis flow that keeps learning with every product you review.
        </Text>
      </LinearGradient>

      <PremiumCard variant="tinted" style={styles.benefitsCard}>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primaryDeep} />
          <Text style={styles.benefitText}>Unlimited analyses</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primaryDeep} />
          <Text style={styles.benefitText}>Deeper ingredient insights</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={18} color={colors.primaryDeep} />
          <Text style={styles.benefitText}>Smarter skincare recommendations</Text>
        </View>
        <Text style={styles.benefitFooter}>Premium is about better intelligence, not just more access.</Text>
      </PremiumCard>

      <PremiumCard style={styles.statusCard}>
        <Text style={styles.statusLabel}>Current plan</Text>
        <Text style={styles.statusValue}>{currentPlan === 'premium' ? 'Premium' : 'Free'}</Text>
        {!isPremium ? (
          <Text style={styles.statusBody}>
            Free users can run up to {dailyFreeLimit} analyses per day. You currently have{' '}
            {remainingAnalyses === Infinity ? dailyFreeLimit : remainingAnalyses} remaining today.
          </Text>
        ) : (
          <Text style={styles.statusBody}>Premium is active. Your analysis flow is fully unlocked.</Text>
        )}
      </PremiumCard>

      <View style={styles.actions}>
        <PrimaryButton
          label={isPremium ? 'Premium active' : 'Upgrade to Premium'}
          leftIcon={<Ionicons name="sparkles" size={18} color={colors.surfaceElevated} />}
          onPress={async () => {
            if (!isPremium) {
              await upgradeToPremium();
            }
            router.back();
          }}
        />
        <PrimaryButton label="Continue with free" variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#E7E0D2',
  },
  iconShell: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    maxWidth: 300,
  },
  subtitle: {
    ...typography.body,
    maxWidth: 340,
  },
  benefitsCard: {
    gap: spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    ...typography.bodyStrong,
  },
  benefitFooter: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusCard: {
    gap: spacing.sm,
  },
  statusLabel: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  statusValue: {
    ...typography.sectionTitle,
  },
  statusBody: {
    ...typography.body,
  },
  actions: {
    gap: spacing.sm,
  },
});

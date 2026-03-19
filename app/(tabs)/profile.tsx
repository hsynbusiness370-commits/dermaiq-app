import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert } from 'react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { usePreferences } from '@/lib/preferences-context';
import { useSavedAnalyses } from '@/lib/saved-analyses-context';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';
import { SavedAnalysis } from '@/lib/types';

const actionItems = [
  {
    id: 'edit-profile',
    title: 'Edit profile',
    subtitle: 'Adjust how DermaIQ understands your skin.',
    icon: 'create-outline',
  },
  {
    id: 'reset-profile',
    title: 'Reset skin profile',
    subtitle: 'Start fresh if your needs have shifted recently.',
    icon: 'refresh-outline',
  },
  {
    id: 'logout',
    title: 'Log out',
    subtitle: 'Leave this account and return later.',
    icon: 'log-out-outline',
  },
  {
    id: 'manage-subscription',
    title: 'Manage subscription',
    subtitle: 'Review plan options and future premium access.',
    icon: 'card-outline',
  },
  {
    id: 'data-privacy',
    title: 'Data & privacy',
    subtitle: 'Review how your analysis history supports personalization.',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'clear-history',
    title: 'Clear history',
    subtitle: 'Remove saved analyses and reset your archive view.',
    icon: 'trash-outline',
  },
] as const;

const noop = () => undefined;

function getOverallScore(score: SavedAnalysis) {
  return Math.round(score.safetyScore * 0.4 + score.skinMatchScore * 0.35 + score.effectivenessScore * 0.25);
}

export default function ProfileScreen() {
  const { name, skinGoal, skinType, subscriptionStatus } = usePreferences();
  const { clearSavedAnalyses, savedAnalyses } = useSavedAnalyses();
  const usageStats = useMemo(() => {
    const totalAnalyses = savedAnalyses.length;
    const greatMatches = savedAnalyses.filter((scan) => scan.verdict === 'Great Match').length;
    const averageScore =
      totalAnalyses > 0
        ? Math.round(savedAnalyses.reduce((total, scan) => total + getOverallScore(scan), 0) / totalAnalyses)
        : 0;

    return { totalAnalyses, greatMatches, averageScore };
  }, [savedAnalyses]);

  const intelligenceText =
    savedAnalyses.length > 0
      ? 'Your skin is trending toward hydration-focused routines with calmer, lower-friction formulas.'
      : 'Your profile suggests a calmer response to hydration-led formulas and low-irritation routines.';
  const confidenceText =
    savedAnalyses.length > 1
      ? 'Confidence: High (based on recent analyses)'
      : 'Confidence: Building as you scan more products';

  const handleActionPress = async (actionId: (typeof actionItems)[number]['id']) => {
    if (actionId !== 'clear-history') {
      return;
    }

    Alert.alert('Clear history', 'Remove all saved analyses from this device?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          void clearSavedAnalyses();
        },
      },
    ]);
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <LinearGradient colors={gradients.hero} style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <Pressable onPress={noop} style={({ pressed }) => [styles.avatarPressable, pressed && styles.avatarPressed]}>
            <LinearGradient colors={['#F8FBF8', '#DDE9DE']} style={styles.avatarOuter}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              </View>
              <View style={styles.avatarEditPill}>
                <Ionicons name="create-outline" size={12} color={colors.primaryDeep} />
              </View>
            </LinearGradient>
          </Pressable>
          <Badge label="Skin profile" tone="premium" />
        </View>

        <View style={styles.identityCopy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.handle}>Your profile shapes every DermaIQ analysis and keeps recommendations personal.</Text>
        </View>
      </LinearGradient>

      <PremiumCard variant="tinted" style={styles.intelligenceCard}>
        <View style={styles.intelligenceHeader}>
          <View style={styles.intelligenceIcon}>
            <Ionicons name="sparkles-outline" size={18} color={colors.primaryDeep} />
          </View>
          <View style={styles.intelligenceCopy}>
            <Text style={styles.intelligenceEyebrow}>AI Skin Intelligence</Text>
            <Text style={styles.intelligenceTitle}>{intelligenceText}</Text>
          </View>
        </View>
        <View style={styles.confidencePill}>
          <Text style={styles.confidenceText}>{confidenceText}</Text>
        </View>
      </PremiumCard>

      <PremiumCard variant="elevated" style={styles.usageCard}>
        <SectionHeader title="Usage & Activity" subtitle="A compact look at how your archive is taking shape." />
        <View style={styles.usageGrid}>
          <View style={styles.usageItem}>
            <Text style={styles.usageValue}>{usageStats.totalAnalyses}</Text>
            <Text style={styles.usageLabel}>Total analyses</Text>
          </View>
          <View style={styles.usageItem}>
            <Text style={styles.usageValue}>{usageStats.greatMatches}</Text>
            <Text style={styles.usageLabel}>Great matches</Text>
          </View>
          <View style={styles.usageItem}>
            <Text style={styles.usageValue}>{usageStats.averageScore}</Text>
            <Text style={styles.usageLabel}>Average score</Text>
          </View>
        </View>
      </PremiumCard>

      <PremiumCard variant="tinted" style={styles.summaryCard}>
        <SectionHeader title="Skin profile summary" subtitle="A clear view of what DermaIQ is optimizing for right now." />
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="water-outline" size={16} color={colors.primaryDeep} />
            </View>
            <Text style={styles.summaryLabel}>Skin type</Text>
            <Text style={styles.summaryValue}>{skinType}</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
            </View>
            <Text style={styles.summaryLabel}>Goal</Text>
            <Text style={styles.summaryValue}>{skinGoal}</Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="leaf-outline" size={16} color={colors.primaryDeep} />
            </View>
            <Text style={styles.summaryLabel}>Current state</Text>
            <Text style={styles.summaryValue}>Calm</Text>
          </View>
        </View>
      </PremiumCard>

      <LinearGradient colors={gradients.accent} style={styles.subscriptionCard}>
        <View style={styles.subscriptionTopRow}>
          <View style={styles.subscriptionIcon}>
            <Ionicons name="sparkles-outline" size={18} color={colors.gold} />
          </View>
          <Badge label={`${subscriptionStatus} plan`} tone="premium" />
        </View>
        <Text style={styles.subscriptionTitle}>Upgrade your skincare intelligence.</Text>
        <Text style={styles.subscriptionBody}>Unlock premium guidance designed to make DermaIQ more useful over time.</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.gold} />
            <Text style={styles.benefitText}>Deeper ingredient breakdowns</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.gold} />
            <Text style={styles.benefitText}>Long-term skin tracking</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.gold} />
            <Text style={styles.benefitText}>Smarter AI recommendations</Text>
          </View>
        </View>
        <View style={styles.subscriptionButtonWrap}>
          <PrimaryButton
            label="Explore premium"
            size="md"
            leftIcon={<Ionicons name="sparkles" size={16} color={colors.surfaceElevated} />}
            onPress={noop}
          />
        </View>
      </LinearGradient>

      <PremiumCard variant="elevated" style={styles.listCard}>
        <SectionHeader title="Account details" subtitle="Core profile information that powers your experience." />
        <View style={styles.detailsGroup}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Name</Text>
            <Text style={styles.rowValue}>{name}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Skin type</Text>
            <Text style={styles.rowValue}>{skinType}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Skin goal</Text>
            <Text style={styles.rowValue}>{skinGoal}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subscription</Text>
            <Text style={styles.rowValue}>{subscriptionStatus}</Text>
          </View>
        </View>
      </PremiumCard>

      <PremiumCard style={styles.actionsCard}>
        <SectionHeader title="Actions" subtitle="Quick profile-level actions and account controls." />
        <View style={styles.actionList}>
          {actionItems.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => {
                void handleActionPress(item.id);
              }}
              style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
            >
              <View style={styles.actionRowLeft}>
                <View style={styles.actionIcon}>
                  <Ionicons name={item.icon} size={18} color={colors.primaryDeep} />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.actionTitle}>{item.title}</Text>
                  <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              {index < actionItems.length - 1 ? <View style={styles.actionDivider} /> : null}
            </Pressable>
          ))}
        </View>
      </PremiumCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  headerCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E7E0D2',
    gap: spacing.md,
    ...shadows.soft,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatarPressable: {
    borderRadius: radius.pill,
  },
  avatarPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.985 }],
  },
  avatarOuter: {
    position: 'relative',
    padding: 4,
    borderRadius: radius.pill,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
  },
  avatarEditPill: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  identityCopy: {
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    fontSize: 34,
    lineHeight: 40,
  },
  handle: {
    ...typography.body,
    maxWidth: 330,
    color: colors.textSecondary,
  },
  intelligenceCard: {
    gap: spacing.md,
    backgroundColor: colors.surfaceTint,
    borderColor: '#D8E4DA',
  },
  intelligenceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  intelligenceIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intelligenceCopy: {
    flex: 1,
  },
  intelligenceEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
    marginBottom: spacing.xxs,
  },
  intelligenceTitle: {
    ...typography.sectionTitle,
    fontSize: 21,
    lineHeight: 27,
  },
  confidencePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confidenceText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  usageCard: {
    gap: spacing.lg,
  },
  usageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  usageItem: {
    flex: 1,
    minWidth: 96,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  usageValue: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  usageLabel: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  summaryCard: {
    gap: spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryItem: {
    flex: 1,
    minWidth: 104,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.72)',
    gap: spacing.xs,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  summaryValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  subscriptionCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E8DEC8',
    gap: spacing.md,
    ...shadows.soft,
  },
  subscriptionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subscriptionIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.68)',
  },
  subscriptionTitle: {
    ...typography.sectionTitle,
    maxWidth: 320,
  },
  subscriptionBody: {
    ...typography.body,
    maxWidth: 340,
  },
  benefitsList: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
  subscriptionButtonWrap: {
    paddingTop: spacing.xs,
  },
  listCard: {
    gap: spacing.md,
  },
  detailsGroup: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.bodyStrong,
    textAlign: 'right',
    flexShrink: 1,
  },
  actionsCard: {
    gap: spacing.md,
  },
  actionList: {
    gap: spacing.xs,
  },
  actionRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionRowPressed: {
    opacity: 0.96,
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    ...typography.bodyStrong,
  },
  actionSubtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xxs,
  },
  actionDivider: {
    position: 'absolute',
    left: 58,
    right: 0,
    bottom: -4,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
});

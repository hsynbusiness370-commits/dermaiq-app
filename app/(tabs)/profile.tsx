import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { usePreferences } from '@/lib/preferences-context';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';

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
] as const;

const noop = () => undefined;

export default function ProfileScreen() {
  const { name, skinGoal, skinType, subscriptionStatus } = usePreferences();

  return (
    <Screen contentContainerStyle={styles.content}>
      <LinearGradient colors={gradients.hero} style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <Pressable onPress={noop} style={({ pressed }) => [styles.avatarPressable, pressed && styles.avatarPressed]}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              </View>
              <View style={styles.avatarEditPill}>
                <Ionicons name="create-outline" size={12} color={colors.primaryDeep} />
              </View>
            </View>
          </Pressable>
          <Badge label="Skin profile" tone="premium" />
        </View>

        <View style={styles.identityCopy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.handle}>Your profile shapes every DermaIQ analysis and keeps recommendations personal.</Text>
        </View>
      </LinearGradient>

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
        <Text style={styles.subscriptionTitle}>Unlock deeper ingredient intelligence and richer skincare guidance.</Text>
        <Text style={styles.subscriptionBody}>
          Stay on the free plan for now, or evolve this area into a premium experience with more nuanced reporting.
        </Text>
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
            <Pressable key={item.id} onPress={noop} style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}>
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

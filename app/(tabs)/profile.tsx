import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { usePreferences } from '@/lib/preferences-context';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';

export default function ProfileScreen() {
  const { name, skinGoal, skinType, subscriptionStatus } = usePreferences();

  return (
    <Screen contentContainerStyle={styles.content}>
      <LinearGradient colors={gradients.hero} style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <Badge label="Skin profile" tone="premium" />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.handle}>Personal skincare intelligence, tuned to your preferences.</Text>
      </LinearGradient>

      <PremiumCard variant="tinted" style={styles.summaryCard}>
        <SectionHeader title="Skin profile summary" subtitle="A quick view of how DermaIQ currently sees your needs." />
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{skinType}</Text>
            <Text style={styles.summaryLabel}>Skin type</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{skinGoal}</Text>
            <Text style={styles.summaryLabel}>Primary goal</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>Calm</Text>
            <Text style={styles.summaryLabel}>Current state</Text>
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
        <Text style={styles.subscriptionTitle}>Upgrade to unlock deeper ingredient intelligence and richer reports.</Text>
        <Text style={styles.subscriptionBody}>
          Keep the current free preview, or evolve this area later into a premium subscription experience.
        </Text>
      </LinearGradient>

      <PremiumCard variant="elevated" style={styles.listCard}>
        <SectionHeader title="Account details" subtitle="Core information and profile-level settings." />
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
    gap: spacing.sm,
    ...shadows.soft,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  name: {
    ...typography.title,
    fontSize: 32,
    lineHeight: 38,
  },
  handle: {
    ...typography.body,
    maxWidth: 320,
  },
  summaryCard: {
    gap: spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    minWidth: 96,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  summaryLabel: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  subscriptionCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E8DEC8',
    gap: spacing.sm,
    ...shadows.soft,
  },
  subscriptionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subscriptionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
  subscriptionTitle: {
    ...typography.sectionTitle,
    maxWidth: 310,
  },
  subscriptionBody: {
    ...typography.body,
  },
  listCard: {
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
  },
  rowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.bodyStrong,
  },
});

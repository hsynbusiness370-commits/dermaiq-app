import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PremiumCard } from '@/components/PremiumCard';
import { Screen } from '@/components/Screen';
import { usePreferences } from '@/lib/preferences-context';
import { colors, radius, spacing, typography } from '@/lib/theme';

export default function ProfileScreen() {
  const { name, skinGoal, skinType, subscriptionStatus } = usePreferences();

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.handle}>Premium skincare profile</Text>
      </View>

      <PremiumCard style={styles.infoCard}>
        <Text style={styles.cardTitle}>User info</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Skin type</Text>
          <Text style={styles.rowValue}>{skinType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Skin goal</Text>
          <Text style={styles.rowValue}>{skinGoal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subscription</Text>
          <View style={styles.subscriptionPill}>
            <Ionicons name="sparkles-outline" size={14} color={colors.primaryDeep} />
            <Text style={styles.subscriptionText}>{subscriptionStatus}</Text>
          </View>
        </View>
      </PremiumCard>

      <PremiumCard style={styles.infoCard}>
        <Text style={styles.cardTitle}>Preferences</Text>
        <Text style={styles.preferenceText}>
          Your current profile is tuned toward low-friction daily scans, concise scoring, and ingredient
          explanations that read clearly at a glance.
        </Text>
      </PremiumCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  name: {
    ...typography.title,
    fontSize: 28,
    lineHeight: 32,
  },
  handle: {
    ...typography.body,
    color: colors.textMuted,
  },
  infoCard: {
    gap: spacing.lg,
  },
  cardTitle: {
    ...typography.sectionTitle,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.bodyStrong,
  },
  subscriptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
  },
  subscriptionText: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  preferenceText: {
    ...typography.body,
  },
});

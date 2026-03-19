import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { recentScans } from '@/lib/mock-data';
import { usePreferences } from '@/lib/preferences-context';
import { colors, radius, spacing, typography } from '@/lib/theme';

export default function HomeScreen() {
  const { name, skinGoal, skinType } = usePreferences();

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>DermaIQ</Text>
          <Text style={styles.greeting}>Hi, {name}</Text>
          <Text style={styles.subtitle}>
            Tailored for {skinType.toLowerCase()} skin and your {skinGoal.toLowerCase()} goals.
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{name.charAt(0)}</Text>
        </View>
      </View>

      <PremiumCard style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons name="sparkles" size={22} color={colors.primaryDeep} />
        </View>
        <Text style={styles.heroTitle}>A faster way to evaluate what touches your skin.</Text>
        <Text style={styles.heroBody}>
          Scan a product label to see premium AI-guided safety, match, and effectiveness insights.
        </Text>
        <PrimaryButton
          label="Quick Scan"
          icon={<Ionicons name="scan" size={18} color={colors.surface} />}
          onPress={() => router.push('/(tabs)/scan')}
        />
      </PremiumCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent scans</Text>
        <Text style={styles.sectionAction}>View all</Text>
      </View>

      <View style={styles.scanList}>
        {recentScans.map((scan) => (
          <PremiumCard key={scan.id} style={styles.scanCard}>
            <View style={styles.scanCardHeader}>
              <View>
                <Text style={styles.scanProduct}>{scan.productName}</Text>
                <Text style={styles.scanMeta}>
                  {scan.category} · {scan.scannedAt}
                </Text>
              </View>
              <View style={styles.scoreBubble}>
                <Text style={styles.scoreBubbleText}>{scan.safetyScore}</Text>
              </View>
            </View>
            <Text style={styles.scanSummary}>{scan.summary}</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Match {scan.skinMatchScore}</Text>
              <Text style={styles.metricLabel}>Effectiveness {scan.effectivenessScore}</Text>
            </View>
          </PremiumCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: {
    ...typography.eyebrow,
    marginBottom: spacing.xs,
  },
  greeting: {
    ...typography.hero,
  },
  subtitle: {
    ...typography.body,
    maxWidth: 280,
    marginTop: spacing.xs,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  avatarLabel: {
    color: colors.primaryDeep,
    fontSize: 18,
    fontWeight: '700',
  },
  heroCard: {
    gap: spacing.lg,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.title,
    fontSize: 28,
    lineHeight: 34,
  },
  heroBody: {
    ...typography.body,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  sectionAction: {
    color: colors.primaryDeep,
    fontWeight: '600',
  },
  scanList: {
    gap: spacing.md,
  },
  scanCard: {
    gap: spacing.md,
  },
  scanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  scanProduct: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  scanMeta: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: 14,
  },
  scoreBubble: {
    minWidth: 58,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
  },
  scoreBubbleText: {
    color: colors.primaryDeep,
    fontSize: 18,
    fontWeight: '700',
  },
  scanSummary: {
    ...typography.body,
    color: colors.textSecondary,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricLabel: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
});

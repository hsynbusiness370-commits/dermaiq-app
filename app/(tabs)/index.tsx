import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { dailyTip, recentScans } from '@/lib/mock-data';
import { usePreferences } from '@/lib/preferences-context';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';

export default function HomeScreen() {
  const { name, skinGoal, skinType } = usePreferences();

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Your ritual, elevated</Text>
          <Text style={styles.greeting}>Hi, {name}</Text>
          <Text style={styles.subtitle}>
            A calmer way to evaluate products for {skinType.toLowerCase()} skin and your {skinGoal.toLowerCase()} goals.
          </Text>
        </View>
        <LinearGradient colors={gradients.accent} style={styles.avatar}>
          <Text style={styles.avatarLabel}>{name.charAt(0)}</Text>
        </LinearGradient>
      </View>

      <PremiumCard variant="tinted" style={styles.snapshotCard}>
        <View style={styles.snapshotHeader}>
          <View>
            <Text style={styles.snapshotEyebrow}>Skin Snapshot</Text>
            <Text style={styles.snapshotTitle}>Today your profile looks balanced and ready for gentle actives.</Text>
          </View>
          <Badge label="Updated today" tone="premium" />
        </View>

        <View style={styles.snapshotMetrics}>
          <View style={styles.snapshotMetric}>
            <Text style={styles.metricValue}>{skinType}</Text>
            <Text style={styles.metricCaption}>Skin type</Text>
          </View>
          <View style={styles.snapshotMetric}>
            <Text style={styles.metricValue}>{skinGoal}</Text>
            <Text style={styles.metricCaption}>Primary goal</Text>
          </View>
          <View style={styles.snapshotMetric}>
            <Text style={styles.metricValue}>Low</Text>
            <Text style={styles.metricCaption}>Irritation risk</Text>
          </View>
        </View>
      </PremiumCard>

      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.quickScanCard}>
        <View style={styles.quickScanIcon}>
          <Ionicons name="scan" size={24} color={colors.primaryDeep} />
        </View>
        <Text style={styles.quickScanTitle}>Scan a product and get a premium AI skincare read in seconds.</Text>
        <Text style={styles.quickScanBody}>
          Safety, skin match, and overall usefulness are surfaced in one elegant report.
        </Text>
        <PrimaryButton
          label="Quick Scan"
          leftIcon={<Ionicons name="sparkles" size={18} color={colors.surfaceElevated} />}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
          onPress={() => router.push('/(tabs)/scan')}
        />
      </LinearGradient>

      <SectionHeader
        title="Recent scans"
        subtitle="A clean view of what you reviewed most recently."
        actionLabel="History"
        onActionPress={() => router.push('/(tabs)/history')}
      />

      <View style={styles.scanList}>
        {recentScans.slice(0, 3).map((scan) => (
          <PremiumCard key={scan.id} variant="elevated" style={styles.scanCard}>
            <View style={styles.scanTopRow}>
              <View style={styles.scanProductBlock}>
                <Text style={styles.scanBrand}>{scan.brand}</Text>
                <Text style={styles.scanProduct}>{scan.productName}</Text>
                <Text style={styles.scanMeta}>
                  {scan.category} · {scan.scannedAt}
                </Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillValue}>{scan.safetyScore}</Text>
                <Text style={styles.scorePillLabel}>Safety</Text>
              </View>
            </View>

            <Text style={styles.scanSummary}>{scan.summary}</Text>

            <View style={styles.badgeRow}>
              <Badge label={scan.verdict} tone={scan.verdict === 'Great Match' ? 'success' : 'warning'} />
              <Badge label={scan.status} tone="default" />
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricChip}>
                <Text style={styles.metricChipLabel}>Match</Text>
                <Text style={styles.metricChipValue}>{scan.skinMatchScore}</Text>
              </View>
              <View style={styles.metricChip}>
                <Text style={styles.metricChipLabel}>Effectiveness</Text>
                <Text style={styles.metricChipValue}>{scan.effectivenessScore}</Text>
              </View>
            </View>
          </PremiumCard>
        ))}
      </View>

      <PremiumCard style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Ionicons name="leaf-outline" size={18} color={colors.primaryDeep} />
        </View>
        <View style={styles.tipCopy}>
          <Text style={styles.tipEyebrow}>Daily skincare tip</Text>
          <Text style={styles.tipText}>{dailyTip}</Text>
        </View>
      </PremiumCard>
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
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
  },
  kicker: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
    marginBottom: spacing.xs,
  },
  greeting: {
    ...typography.hero,
    fontSize: 44,
    lineHeight: 50,
  },
  subtitle: {
    ...typography.body,
    maxWidth: 320,
    marginTop: spacing.xs,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    ...shadows.soft,
  },
  avatarLabel: {
    color: colors.primaryDeep,
    fontSize: 20,
    fontWeight: '700',
  },
  snapshotCard: {
    gap: spacing.lg,
  },
  snapshotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  snapshotEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
    marginBottom: spacing.xs,
  },
  snapshotTitle: {
    ...typography.sectionTitle,
    maxWidth: 290,
  },
  snapshotMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  snapshotMetric: {
    flex: 1,
    minWidth: 96,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  metricValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  metricCaption: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  quickScanCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E8E0D2',
    gap: spacing.lg,
    ...shadows.medium,
  },
  quickScanIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
  quickScanTitle: {
    ...typography.title,
    fontSize: 31,
    lineHeight: 37,
    maxWidth: 320,
  },
  quickScanBody: {
    ...typography.body,
    maxWidth: 340,
  },
  scanList: {
    gap: spacing.md,
  },
  scanCard: {
    gap: spacing.md,
  },
  scanTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  scanProductBlock: {
    flex: 1,
  },
  scanBrand: {
    ...typography.eyebrow,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  scanProduct: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.4,
  },
  scanMeta: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  scorePill: {
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
  },
  scorePillValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  scorePillLabel: {
    ...typography.caption,
    color: colors.primaryDeep,
  },
  scanSummary: {
    ...typography.body,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricChip: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  metricChipLabel: {
    ...typography.caption,
  },
  metricChipValue: {
    marginTop: spacing.xxs,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  tipIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCopy: {
    flex: 1,
  },
  tipEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
    marginBottom: spacing.xs,
  },
  tipText: {
    ...typography.body,
    color: colors.text,
  },
});

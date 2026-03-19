import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing, typography } from '@/lib/theme';

export default function ScanScreen() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.kicker}>Scan</Text>
        <Text style={styles.title}>Frame the product label for an instant premium analysis preview.</Text>
        <Text style={styles.subtitle}>
          Camera integration is intentionally mocked for now. This screen focuses on the visual shell.
        </Text>
      </View>

      <PremiumCard style={styles.cameraShell}>
        <View style={styles.cameraFrame}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />

          <View style={styles.placeholderCenter}>
            <View style={styles.placeholderIcon}>
              <Ionicons name="camera-outline" size={34} color={colors.primaryDeep} />
            </View>
            <Text style={styles.placeholderTitle}>Camera preview placeholder</Text>
            <Text style={styles.placeholderBody}>
              Center ingredients or front label inside the guide to preview a future scan flow.
            </Text>
          </View>
        </View>

        <View style={styles.scanTips}>
          <View style={styles.tipPill}>
            <Ionicons name="sunny-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Use soft natural light</Text>
          </View>
          <View style={styles.tipPill}>
            <Ionicons name="document-text-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Keep the label flat</Text>
          </View>
        </View>
      </PremiumCard>

      <PrimaryButton
        label="Scan Product"
        icon={<Ionicons name="scan" size={18} color={colors.surface} />}
        onPress={() => router.push('/result')}
      />
    </Screen>
  );
}

const cornerBase = {
  position: 'absolute' as const,
  width: 34,
  height: 34,
  borderColor: colors.primary,
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  kicker: {
    ...typography.eyebrow,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.sm,
  },
  cameraShell: {
    gap: spacing.lg,
  },
  cameraFrame: {
    minHeight: 420,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#E9F1EB',
    borderWidth: 1,
    borderColor: '#D5E2D9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cornerTopLeft: {
    ...cornerBase,
    top: spacing.lg,
    left: spacing.lg,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: radius.md,
  },
  cornerTopRight: {
    ...cornerBase,
    top: spacing.lg,
    right: spacing.lg,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: radius.md,
  },
  cornerBottomLeft: {
    ...cornerBase,
    bottom: spacing.lg,
    left: spacing.lg,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: radius.md,
  },
  cornerBottomRight: {
    ...cornerBase,
    bottom: spacing.lg,
    right: spacing.lg,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: radius.md,
  },
  placeholderCenter: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  placeholderIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  placeholderBody: {
    ...typography.body,
    textAlign: 'center',
  },
  scanTips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tipText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
});

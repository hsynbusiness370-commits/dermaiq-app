import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, gradients, radius, spacing, typography } from '@/lib/theme';

type ScanMode = 'Photo' | 'Barcode';

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('Photo');

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Capture</Text>
        <Text style={styles.title}>Compose a clean scan for a more elegant analysis report.</Text>
        <Text style={styles.subtitle}>
          Choose the input style below, then frame the product as though you were about to scan it for real.
        </Text>
      </View>

      <PremiumCard variant="elevated" style={styles.scanShell}>
        <View style={styles.segmentedControl}>
          {(['Photo', 'Barcode'] as const).map((item) => (
            <View key={item} style={styles.segmentOuter}>
              <Text
                onPress={() => setMode(item)}
                style={[styles.segmentLabel, mode === item && styles.segmentLabelActive]}
              >
                {item}
              </Text>
              {mode === item ? <View style={styles.segmentActiveBackground} /> : null}
            </View>
          ))}
        </View>

        <LinearGradient colors={gradients.accent} style={styles.cameraFrame}>
          <Badge label={mode === 'Photo' ? 'Photo capture' : 'Barcode focus'} tone="premium" />
          <View style={styles.cameraGuide}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.placeholderCenter}>
              <View style={styles.placeholderIcon}>
                <Ionicons
                  name={mode === 'Photo' ? 'camera-outline' : 'barcode-outline'}
                  size={34}
                  color={colors.primaryDeep}
                />
              </View>
              <Text style={styles.placeholderTitle}>
                {mode === 'Photo' ? 'Camera preview placeholder' : 'Barcode scanner placeholder'}
              </Text>
              <Text style={styles.placeholderBody}>
                {mode === 'Photo'
                  ? 'Center the front label or ingredient list inside the guide for the cleanest capture.'
                  : 'Aim the code inside the guide to preview a future fast product lookup experience.'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.helperText}>
          Helper tip: soft natural light, a steady hand, and a flat label will give DermaIQ the cleanest scan input.
        </Text>

        <View style={styles.scanTips}>
          <View style={styles.tipPill}>
            <Ionicons name="sunny-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Soft daylight</Text>
          </View>
          <View style={styles.tipPill}>
            <Ionicons name="scan-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Frame edge to edge</Text>
          </View>
          <View style={styles.tipPill}>
            <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Minimize glare</Text>
          </View>
        </View>
      </PremiumCard>

      <PrimaryButton
        label="Scan Product"
        leftIcon={<Ionicons name="scan" size={18} color={colors.surfaceElevated} />}
        rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
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
  header: {
    gap: spacing.xs,
  },
  kicker: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  title: {
    ...typography.title,
    marginTop: spacing.xxs,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  scanShell: {
    gap: spacing.lg,
  },
  segmentedControl: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.xs,
  },
  segmentOuter: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    minHeight: 44,
  },
  segmentActiveBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 0,
  },
  segmentLabel: {
    textAlign: 'center',
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 14,
    zIndex: 1,
  },
  segmentLabelActive: {
    color: colors.text,
  },
  cameraFrame: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E4DCCC',
    gap: spacing.lg,
  },
  cameraGuide: {
    minHeight: 420,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.36)',
    borderWidth: 1,
    borderColor: 'rgba(85, 113, 94, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cornerTopLeft: {
    ...cornerBase,
    top: spacing.xl,
    left: spacing.xl,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: radius.md,
  },
  cornerTopRight: {
    ...cornerBase,
    top: spacing.xl,
    right: spacing.xl,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: radius.md,
  },
  cornerBottomLeft: {
    ...cornerBase,
    bottom: spacing.xl,
    left: spacing.xl,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: radius.md,
  },
  cornerBottomRight: {
    ...cornerBase,
    bottom: spacing.xl,
    right: spacing.xl,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: radius.md,
  },
  placeholderCenter: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  placeholderIcon: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  placeholderTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.4,
  },
  placeholderBody: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
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

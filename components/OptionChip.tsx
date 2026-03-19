import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/lib/theme';

type OptionChipProps = {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  onPress?: () => void;
};

export function OptionChip({ label, description, icon, selected = false, onPress }: OptionChipProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={[styles.pill, selected && styles.selectedPill]}>
        <View style={styles.content}>
          <View style={[styles.iconShell, selected && styles.selectedIconShell]}>{icon}</View>
          <View style={styles.copy}>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
            {description ? <Text style={[styles.description, selected && styles.selectedDescription]}>{description}</Text> : null}
          </View>
          <View style={[styles.checkmark, selected && styles.selectedCheckmark]}>
            <View style={[styles.checkmarkDot, selected && styles.selectedCheckmarkDot]} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  pill: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  selectedPill: {
    backgroundColor: colors.primarySoft,
    borderColor: '#C9D9CB',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconShell: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  selectedIconShell: {
    backgroundColor: '#F7FBF7',
  },
  copy: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  selectedLabel: {
    color: colors.primaryDeep,
  },
  description: {
    ...typography.bodySmall,
    marginTop: spacing.xxs,
    color: colors.textMuted,
  },
  selectedDescription: {
    color: colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  selectedCheckmark: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryDeep,
  },
  checkmarkDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  selectedCheckmarkDot: {
    backgroundColor: colors.surfaceElevated,
  },
  pressed: {
    opacity: 0.96,
  },
});

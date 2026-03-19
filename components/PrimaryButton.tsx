import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/lib/theme';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
}: PrimaryButtonProps) {
  const gradientColors: [string, string] =
    variant === 'primary' ? [colors.primary, colors.primaryDeep] : [colors.surface, colors.surface];

  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          variant === 'secondary' && styles.secondaryButton,
          disabled && styles.disabled,
        ]}
      >
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    ...shadows.soft,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  label: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLabel: {
    color: colors.text,
  },
  icon: {
    marginRight: spacing.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.9,
  },
});

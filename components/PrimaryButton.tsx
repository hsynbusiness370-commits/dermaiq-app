import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, gradients, radius, shadows, spacing } from '@/lib/theme';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  size?: 'md' | 'lg';
};

export function PrimaryButton({
  label,
  onPress,
  leftIcon,
  rightIcon,
  variant = 'primary',
  disabled = false,
  size = 'lg',
}: PrimaryButtonProps) {
  const gradientColors =
    variant === 'primary' ? gradients.primary : gradients.muted;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          size === 'md' && styles.buttonMedium,
          variant === 'secondary' && styles.secondaryButton,
          disabled && styles.disabled,
        ]}
      >
        <View style={[styles.content, size === 'md' && styles.contentMedium]}>
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
          <Text
            style={[
              styles.label,
              size === 'md' && styles.labelMedium,
              variant === 'secondary' && styles.secondaryLabel,
            ]}
          >
            {label}
          </Text>
          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  button: {
    minHeight: 62,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    ...shadows.glow,
  },
  buttonMedium: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  content: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentMedium: {
    minHeight: 50,
  },
  secondaryButton: {
    borderColor: colors.borderStrong,
    shadowOpacity: 0.04,
    elevation: 2,
  },
  label: {
    color: colors.surfaceElevated,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  labelMedium: {
    fontSize: 15,
  },
  secondaryLabel: {
    color: colors.text,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.96,
  },
});

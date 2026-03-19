import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/lib/theme';

type OptionChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function OptionChip({ label, selected = false, onPress }: OptionChipProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={[styles.pill, selected && styles.selectedPill]}>
        <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
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
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedPill: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.accent,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  selectedLabel: {
    color: colors.primaryDeep,
  },
  pressed: {
    opacity: 0.9,
  },
});

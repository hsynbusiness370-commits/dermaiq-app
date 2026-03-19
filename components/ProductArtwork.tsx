import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';

type ProductArtworkProps = {
  imageUrl?: string;
  imagePlaceholder?: string;
  category?: string;
  productName?: string;
  size?: 'hero' | 'card' | 'compact';
  style?: StyleProp<ViewStyle>;
};

function getCategoryIcon(category?: string) {
  const normalizedCategory = (category ?? '').toLowerCase();

  if (normalizedCategory.includes('serum')) {
    return 'water-outline';
  }

  if (normalizedCategory.includes('cleanser')) {
    return 'sparkles-outline';
  }

  if (normalizedCategory.includes('moisturizer') || normalizedCategory.includes('cream')) {
    return 'leaf-outline';
  }

  if (normalizedCategory.includes('sunscreen')) {
    return 'sunny-outline';
  }

  return 'cube-outline';
}

export function ProductArtwork({
  imageUrl,
  imagePlaceholder,
  category,
  productName,
  size = 'card',
  style,
}: ProductArtworkProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const frameStyle = useMemo(() => {
    switch (size) {
      case 'hero':
        return styles.heroFrame;
      case 'compact':
        return styles.compactFrame;
      default:
        return styles.cardFrame;
    }
  }, [size]);

  const iconSize = size === 'hero' ? 24 : size === 'compact' ? 18 : 20;
  const productInitials = (productName ?? 'D')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const showImage = Boolean(imageUrl) && !hasImageError;

  return (
    <View style={[styles.frameBase, frameStyle, style]}>
      {showImage ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <LinearGradient colors={gradients.hero} style={styles.placeholder}>
          <View style={styles.placeholderIconShell}>
            <Ionicons name={getCategoryIcon(category)} size={iconSize} color={colors.primaryDeep} />
          </View>
          {size === 'hero' ? <Text style={styles.placeholderInitials}>{productInitials}</Text> : null}
          <Text style={styles.placeholderLabel}>
            {imagePlaceholder ? imagePlaceholder.replace(/-/g, ' ') : category ? category : 'product'}
          </Text>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frameBase: {
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    ...shadows.soft,
  },
  heroFrame: {
    width: 108,
    height: 128,
  },
  cardFrame: {
    width: 72,
    height: 88,
  },
  compactFrame: {
    width: 56,
    height: 68,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  placeholderIconShell: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderInitials: {
    ...typography.bodyStrong,
    color: colors.primaryDeep,
  },
  placeholderLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

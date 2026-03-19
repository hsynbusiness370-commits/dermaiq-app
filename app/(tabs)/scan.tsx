import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { parseIngredientList, sampleIngredientInput } from '@/lib/ingredient-parser';
import { buildManualProduct } from '@/lib/product-builder';
import { analyzeProduct } from '@/lib/scoring';
import { colors, gradients, radius, spacing, typography } from '@/lib/theme';
import { ManualAnalysisPayload } from '@/lib/types';
import { usePreferences } from '@/lib/preferences-context';

type ScanMode = 'Photo' | 'Barcode' | 'Ingredients';

function encodePayload(payload: ManualAnalysisPayload) {
  return encodeURIComponent(JSON.stringify(payload));
}

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('Ingredients');
  const [ingredientInput, setIngredientInput] = useState('');
  const { userProfile } = usePreferences();

  const trimmedInput = ingredientInput.trim();
  const parsedPreview = useMemo(() => parseIngredientList(ingredientInput), [ingredientInput]);
  const hasInput = trimmedInput.length > 0;
  const canAnalyze = mode === 'Ingredients' && hasInput;

  const handleAnalyzeProduct = () => {
    if (!canAnalyze) {
      return;
    }

    const parsed = parseIngredientList(ingredientInput);
    const product = buildManualProduct(parsed.matchedIngredients);
    const analysis = analyzeProduct(product, userProfile);

    router.push({
      pathname: '/result',
      params: {
        payload: encodePayload({
          analysis,
          matchedIngredients: parsed.matchedIngredients,
          unknownIngredients: parsed.unknownIngredients,
          rawInput: trimmedInput,
        }),
      },
    });
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Analyze</Text>
        <Text style={styles.title}>Start with ingredients and turn a raw label into a real DermaIQ report.</Text>
        <Text style={styles.subtitle}>
          Ingredients mode is live for the MVP. Photo and barcode flows stay visible as premium placeholders for what comes next.
        </Text>
      </View>

      <PremiumCard variant="elevated" style={styles.scanShell}>
        <View style={styles.segmentedControl}>
          {(['Photo', 'Barcode', 'Ingredients'] as const).map((item) => (
            <Pressable key={item} onPress={() => setMode(item)} style={styles.segmentOuter}>
              {mode === item ? <View style={styles.segmentActiveBackground} /> : null}
              <Text style={[styles.segmentLabel, mode === item && styles.segmentLabelActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {mode === 'Ingredients' ? (
          <LinearGradient colors={gradients.accent} style={styles.inputShell}>
            <View style={styles.inputHeader}>
              <Badge label="Ingredients mode" tone="premium" />
              <Text style={styles.inputHint}>Paste a comma-separated list from the product label.</Text>
            </View>

            <TextInput
              multiline
              placeholder="Niacinamide, Hyaluronic Acid, Fragrance..."
              placeholderTextColor={colors.textMuted}
              style={styles.textInput}
              value={ingredientInput}
              onChangeText={setIngredientInput}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.inputActions}>
              <PrimaryButton
                label="Use Sample Ingredients"
                size="md"
                variant="secondary"
                leftIcon={<Ionicons name="flask-outline" size={16} color={colors.text} />}
                onPress={() => setIngredientInput(sampleIngredientInput)}
              />
            </View>

            <View style={styles.previewRow}>
              <View style={styles.previewCard}>
                <Text style={styles.previewValue}>{parsedPreview.matchedIngredients.length}</Text>
                <Text style={styles.previewLabel}>Known ingredients</Text>
              </View>
              <View style={styles.previewCard}>
                <Text style={styles.previewValue}>{parsedPreview.unknownIngredients.length}</Text>
                <Text style={styles.previewLabel}>Unknown ingredients</Text>
              </View>
            </View>

            <Text style={styles.helperText}>
              We match ingredients case-insensitively against the local DermaIQ ingredient database and flag anything we cannot identify yet.
            </Text>
          </LinearGradient>
        ) : (
          <LinearGradient colors={gradients.accent} style={styles.cameraFrame}>
            <Badge label={mode === 'Photo' ? 'Coming soon' : 'Coming soon'} tone="premium" />
            <View style={styles.placeholderCenter}>
              <View style={styles.placeholderIcon}>
                <Ionicons
                  name={mode === 'Photo' ? 'camera-outline' : 'barcode-outline'}
                  size={34}
                  color={colors.primaryDeep}
                />
              </View>
              <Text style={styles.placeholderTitle}>
                {mode === 'Photo' ? 'Camera capture placeholder' : 'Barcode lookup placeholder'}
              </Text>
              <Text style={styles.placeholderBody}>
                {mode === 'Photo'
                  ? 'Photo capture will connect later. For now, switch to Ingredients to run a real analysis.'
                  : 'Barcode lookup is reserved for a future step. For now, switch to Ingredients to analyze manually.'}
              </Text>
            </View>
          </LinearGradient>
        )}

        <View style={styles.scanTips}>
          <View style={styles.tipPill}>
            <Ionicons name="document-text-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Comma-separated works best</Text>
          </View>
          <View style={styles.tipPill}>
            <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Unknowns are shown clearly</Text>
          </View>
        </View>
      </PremiumCard>

      <View style={styles.footer}>
        {!hasInput && mode === 'Ingredients' ? (
          <Text style={styles.validationText}>Paste an ingredient list to unlock analysis.</Text>
        ) : null}
        {mode !== 'Ingredients' ? (
          <Text style={styles.validationText}>Ingredients mode is the first working MVP input flow.</Text>
        ) : null}

        <PrimaryButton
          label="Analyze Product"
          leftIcon={<Ionicons name="sparkles" size={18} color={colors.surfaceElevated} />}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
          onPress={handleAnalyzeProduct}
          disabled={!canAnalyze}
        />
      </View>
    </Screen>
  );
}

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
    alignItems: 'center',
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
  inputShell: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E4DCCC',
    gap: spacing.lg,
  },
  inputHeader: {
    gap: spacing.xs,
  },
  inputHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  textInput: {
    minHeight: 170,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(85, 113, 94, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  inputActions: {
    width: '100%',
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  previewCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  previewValue: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
  },
  previewLabel: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  cameraFrame: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E4DCCC',
    gap: spacing.lg,
    minHeight: 320,
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  placeholderBody: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 280,
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
  footer: {
    gap: spacing.sm,
  },
  validationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

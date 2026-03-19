import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { parseIngredientList, sampleIngredientInput } from '@/lib/ingredient-parser';
import { buildManualProduct } from '@/lib/product-builder';
import { analyzeProduct } from '@/lib/scoring';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';
import { ManualAnalysisPayload } from '@/lib/types';
import { usePreferences } from '@/lib/preferences-context';

type ScanMode = 'Photo' | 'Barcode' | 'Ingredients';

function encodePayload(payload: ManualAnalysisPayload) {
  return encodeURIComponent(JSON.stringify(payload));
}

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('Ingredients');
  const [ingredientInput, setIngredientInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
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
        <Text style={styles.kicker}>DermaIQ Scan</Text>
        <Text style={styles.title}>Analyze ingredients</Text>
        <Text style={styles.subtitle}>Paste a formula and get a DermaIQ verdict tailored to your skin profile.</Text>
      </View>

      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
          <Text style={styles.heroBadgeText}>AI-assisted analysis</Text>
        </View>
        <Text style={styles.heroTitle} lineBreakStrategyIOS="standard">
          Feed the formula into DermaIQ.
        </Text>
        <Text style={styles.heroBody} lineBreakStrategyIOS="standard">
          Ingredients mode is live now. Photo and barcode remain visible as the next step in the product
          experience.
        </Text>
      </LinearGradient>

      <PremiumCard variant="elevated" style={styles.scanShell}>
        <View style={styles.segmentedControl}>
          {(['Photo', 'Barcode', 'Ingredients'] as const).map((item) => (
            <Pressable key={item} onPress={() => setMode(item)} style={styles.segmentOuter}>
              {mode === item ? <View style={styles.segmentActiveBackground} /> : null}
              <View style={styles.segmentContent}>
                <Text style={[styles.segmentLabel, mode === item && styles.segmentLabelActive]}>{item}</Text>
                <Text style={[styles.segmentMeta, mode === item && styles.segmentMetaActive]}>
                  {item === 'Ingredients' ? 'Live' : 'Soon'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {mode === 'Ingredients' ? (
          <LinearGradient colors={gradients.accent} style={styles.inputShell}>
            <View style={styles.inputHeader}>
              <View style={styles.inputHeaderCopy}>
                <Text style={styles.inputEyebrow}>Ingredients mode</Text>
                <Text style={styles.inputTitle} lineBreakStrategyIOS="standard">
                  Paste your ingredient list here...
                </Text>
              </View>
              <Text style={styles.inputHint} lineBreakStrategyIOS="standard">
                Comma-separated ingredients work best for the current DermaIQ parser.
              </Text>
            </View>

            <View style={[styles.textInputShell, isInputFocused && styles.textInputShellFocused]}>
              <TextInput
                multiline
                placeholder="Paste your ingredient list here..."
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
                value={ingredientInput}
                onChangeText={setIngredientInput}
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              <View style={styles.textInputFooter}>
                <Text style={styles.textInputFooterText}>
                  Example: Niacinamide, Hyaluronic Acid, Fragrance, Alcohol Denat
                </Text>
              </View>
            </View>

            <View style={styles.inputActionsRow}>
              <Pressable onPress={() => setIngredientInput(sampleIngredientInput)} style={({ pressed }) => [styles.sampleAction, pressed && styles.sampleActionPressed]}>
                <Ionicons name="flask-outline" size={16} color={colors.text} />
                <Text style={styles.sampleActionText} lineBreakStrategyIOS="standard">
                  Try demo ingredients
                </Text>
              </Pressable>

              <View style={styles.previewRow}>
                <View style={styles.previewChip}>
                  <Text style={styles.previewValue}>{parsedPreview.matchedIngredients.length}</Text>
                  <Text style={styles.previewLabel}>recognized</Text>
                </View>
                <View style={styles.previewChip}>
                  <Text style={styles.previewValue}>{parsedPreview.unknownIngredients.length}</Text>
                  <Text style={styles.previewLabel}>unknown</Text>
                </View>
              </View>
            </View>

            <Text style={styles.helperText} lineBreakStrategyIOS="standard">
              DermaIQ quietly checks your list against the current ingredient database and flags anything it
              cannot confidently identify yet.
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.comingSoonModule}>
            <View style={styles.comingSoonTopRow}>
              <View style={styles.comingSoonIcon}>
                <Ionicons
                  name={mode === 'Photo' ? 'camera-outline' : 'barcode-outline'}
                  size={20}
                  color={colors.primaryDeep}
                />
              </View>
              <View style={styles.comingSoonCopy}>
                <Text style={styles.comingSoonTitle} lineBreakStrategyIOS="standard">
                  {mode === 'Photo' ? 'Photo analysis arrives soon' : 'Barcode lookup arrives soon'}
                </Text>
                <Text style={styles.comingSoonBody} lineBreakStrategyIOS="standard">
                  {mode === 'Photo'
                    ? 'For now, switch to Ingredients to run a real product analysis.'
                    : 'For now, switch to Ingredients to analyze a formula manually.'}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => setMode('Ingredients')} style={({ pressed }) => [styles.switchPill, pressed && styles.switchPillPressed]}>
              <Text style={styles.switchPillText}>Use Ingredients</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.scanTips}>
          <View style={styles.tipPill}>
            <Ionicons name="document-text-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Clean ingredient list</Text>
          </View>
          <View style={styles.tipPill}>
            <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Fast AI-ready parsing</Text>
          </View>
        </View>
      </PremiumCard>

      <View style={styles.footer}>
        {!hasInput && mode === 'Ingredients' ? (
          <Text style={styles.validationText}>Paste an ingredient list to unlock your analysis.</Text>
        ) : null}
        {mode !== 'Ingredients' ? (
          <Text style={styles.validationText}>Ingredients is the live input path for the current MVP.</Text>
        ) : null}

        <View style={styles.ctaWrap}>
          <PrimaryButton
            label="Analyze ingredients"
            leftIcon={<Ionicons name="sparkles" size={18} color={colors.surfaceElevated} />}
            rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
            onPress={handleAnalyzeProduct}
            disabled={!canAnalyze}
          />
        </View>
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
    maxWidth: 340,
  },
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E8E0D2',
    gap: spacing.md,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.68)',
  },
  heroBadgeText: {
    ...typography.bodySmall,
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  heroTitle: {
    ...typography.sectionTitle,
    fontSize: 28,
    lineHeight: 34,
    maxWidth: 360,
  },
  heroBody: {
    ...typography.body,
    maxWidth: 380,
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
    minHeight: 54,
    alignItems: 'center',
  },
  segmentContent: {
    alignItems: 'center',
    gap: 2,
    zIndex: 1,
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
  },
  segmentLabelActive: {
    color: colors.text,
  },
  segmentMeta: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  segmentMetaActive: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  inputShell: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: '#E4DCCC',
    gap: spacing.lg,
  },
  inputHeader: {
    gap: spacing.xs,
  },
  inputHeaderCopy: {
    gap: spacing.xxs,
  },
  inputEyebrow: {
    ...typography.eyebrow,
    color: colors.primaryDeep,
  },
  inputTitle: {
    ...typography.sectionTitle,
    fontSize: 24,
    lineHeight: 30,
  },
  inputHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    maxWidth: 380,
  },
  textInputShell: {
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(85, 113, 94, 0.1)',
    overflow: 'hidden',
    ...shadows.soft,
  },
  textInputShellFocused: {
    borderColor: '#C8D8CB',
    shadowOpacity: 0.09,
  },
  textInput: {
    minHeight: 180,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  textInputFooter: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  textInputFooterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  inputActionsRow: {
    gap: spacing.md,
  },
  sampleAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  sampleActionPressed: {
    opacity: 0.96,
  },
  sampleActionText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '700',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  previewChip: {
    minWidth: 88,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
  },
  previewValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
  },
  previewLabel: {
    ...typography.caption,
    marginTop: spacing.xxs,
    textTransform: 'lowercase',
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    maxWidth: 400,
  },
  comingSoonModule: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comingSoonTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  comingSoonIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonCopy: {
    flex: 1,
  },
  comingSoonTitle: {
    ...typography.bodyStrong,
  },
  comingSoonBody: {
    ...typography.bodySmall,
    marginTop: spacing.xxs,
    maxWidth: 360,
  },
  switchPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: '#D1DECF',
    alignSelf: 'flex-start',
  },
  switchPillPressed: {
    opacity: 0.96,
  },
  switchPillText: {
    ...typography.bodySmall,
    color: colors.primaryDeep,
    fontWeight: '700',
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
  ctaWrap: {
    paddingTop: spacing.xs,
  },
});

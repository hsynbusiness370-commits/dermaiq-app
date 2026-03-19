import { Ionicons } from '@expo/vector-icons';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { PremiumCard } from '@/components/PremiumCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { parseIngredientList, sampleIngredientInput } from '@/lib/ingredient-parser';
import { usePlan } from '@/lib/plan-context';
import { buildCatalogProduct, buildManualProduct } from '@/lib/product-builder';
import { lookupProductByBarcode, searchProducts } from '@/lib/product-search';
import { analyzeProduct } from '@/lib/scoring';
import { colors, gradients, radius, shadows, spacing, typography } from '@/lib/theme';
import {
  BarcodeLookupResponse,
  ManualAnalysisPayload,
  ProductCatalogEntry,
  ProductSearchResponse,
} from '@/lib/types';
import { usePreferences } from '@/lib/preferences-context';

type ScanMode = 'Photo' | 'Barcode' | 'Ingredients';
type IngredientsEntryMode = 'search' | 'manual';

type BarcodeUiState =
  | { status: 'idle' }
  | { status: 'processing'; message: string }
  | { status: 'success'; message: string }
  | { status: 'missing_ingredients'; message: string }
  | { status: 'not_found'; message: string }
  | { status: 'invalid_barcode'; message: string }
  | { status: 'error'; message: string };

function encodePayload(payload: ManualAnalysisPayload) {
  return encodeURIComponent(JSON.stringify(payload));
}

export default function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('Ingredients');
  const [entryMode, setEntryMode] = useState<IngredientsEntryMode>('search');
  const [ingredientInput, setIngredientInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState<ProductSearchResponse | null>(null);
  const [barcodeState, setBarcodeState] = useState<BarcodeUiState>({ status: 'idle' });
  const [isBarcodeLocked, setIsBarcodeLocked] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const { userProfile } = usePreferences();
  const { consumeAnalysis, isHydrated: isPlanHydrated, isPremium, remainingAnalyses } = usePlan();

  const trimmedInput = ingredientInput.trim();
  const trimmedSearchQuery = searchQuery.trim();
  const parsedPreview = useMemo(() => parseIngredientList(ingredientInput), [ingredientInput]);
  const canAnalyzeManual = mode === 'Ingredients' && entryMode === 'manual' && trimmedInput.length > 0;
  const canSearchProducts = mode === 'Ingredients' && entryMode === 'search' && trimmedSearchQuery.length > 0;

  const navigateToAnalysis = (payload: ManualAnalysisPayload) => {
    router.push({
      pathname: '/result',
      params: {
        payload: encodePayload(payload),
      },
    });
  };

  const resetBarcodeScanner = () => {
    setBarcodeState({ status: 'idle' });
    setIsBarcodeLocked(false);
  };

  useEffect(() => {
    if (!isFocused || mode !== 'Barcode') {
      return;
    }

    if (barcodeState.status === 'success') {
      resetBarcodeScanner();
    }
  }, [barcodeState.status, isFocused, mode]);

  const handleAnalyzeIngredients = () => {
    if (!canAnalyzeManual) {
      return;
    }

    void (async () => {
      const access = await consumeAnalysis();

      if (!access.allowed) {
        router.push('/premium');
        return;
      }

      const parsed = parseIngredientList(ingredientInput);
      const product = buildManualProduct(parsed.matchedIngredients);
      const analysis = analyzeProduct(product, userProfile, {
        unknownIngredients: parsed.unknownIngredients,
      });

      navigateToAnalysis({
        analysis,
        matchedIngredients: parsed.matchedIngredients,
        unknownIngredients: parsed.unknownIngredients,
        rawInput: trimmedInput,
      });
    })();
  };

  const handleSearchProducts = async () => {
    if (!canSearchProducts) {
      return;
    }

    const result = await searchProducts(trimmedSearchQuery);
    setSearchResponse(result);
  };

  const handleSelectProduct = (product: ProductCatalogEntry) => {
    void (async () => {
      const access = await consumeAnalysis();

      if (!access.allowed) {
        router.push('/premium');
        return;
      }

      const parsed = parseIngredientList(product.ingredientList);
      const builtProduct = buildCatalogProduct(product, parsed.matchedIngredients);
      const analysis = analyzeProduct(builtProduct, userProfile, {
        unknownIngredients: parsed.unknownIngredients,
      });

      navigateToAnalysis({
        analysis,
        matchedIngredients: parsed.matchedIngredients,
        unknownIngredients: parsed.unknownIngredients,
        rawInput: product.ingredientList,
      });
    })();
  };

  const handleBarcodeLookupResult = async (lookupResult: BarcodeLookupResponse) => {
    if (lookupResult.status === 'found' && lookupResult.results[0]) {
      const access = await consumeAnalysis();

      if (!access.allowed) {
        resetBarcodeScanner();
        router.push('/premium');
        return;
      }

      const product = lookupResult.results[0];
      const parsed = parseIngredientList(product.ingredientList);
      const builtProduct = buildCatalogProduct(product, parsed.matchedIngredients);
      const analysis = analyzeProduct(builtProduct, userProfile, {
        unknownIngredients: parsed.unknownIngredients,
      });

      setBarcodeState({ status: 'success', message: 'Product found. Opening analysis...' });

      navigateToAnalysis({
        analysis,
        matchedIngredients: parsed.matchedIngredients,
        unknownIngredients: parsed.unknownIngredients,
        rawInput: product.ingredientList,
      });
      return;
    }

    if (lookupResult.status === 'missing_ingredients') {
      setBarcodeState({
        status: 'missing_ingredients',
        message:
          lookupResult.message ?? 'We found the product, but couldn’t extract ingredients yet.',
      });
      return;
    }

    if (lookupResult.status === 'invalid_barcode') {
      setBarcodeState({
        status: 'invalid_barcode',
        message:
          lookupResult.message ?? 'That barcode could not be read clearly. Try aligning it inside the frame.',
      });
      return;
    }

    if (lookupResult.status === 'error') {
      setBarcodeState({
        status: 'error',
        message:
          lookupResult.message ?? 'We couldn’t reach barcode lookup right now. Try again in a moment.',
      });
      return;
    }

    setBarcodeState({
      status: 'not_found',
      message: lookupResult.message ?? 'We couldn’t find that barcode yet.',
    });
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!isFocused || mode !== 'Barcode' || isBarcodeLocked) {
      return;
    }

    setIsBarcodeLocked(true);
    setBarcodeState({
      status: 'processing',
      message: 'Processing barcode...',
    });

    void (async () => {
      const lookupResult = await lookupProductByBarcode(data);
      await handleBarcodeLookupResult(lookupResult);
    })();
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.kicker}>DermaIQ Scan</Text>
        <Text style={styles.title}>Analyze ingredients</Text>
        <Text style={styles.subtitle}>
          Search a product, scan a barcode, or paste a formula to get a DermaIQ verdict tailored to your skin profile.
        </Text>
      </View>

      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
          <Text style={styles.heroBadgeText}>AI-assisted analysis</Text>
        </View>
        <Text style={styles.heroTitle} lineBreakStrategyIOS="standard">
          Search, scan, or feed the formula into DermaIQ.
        </Text>
        <Text style={styles.heroBody} lineBreakStrategyIOS="standard">
          Product search checks a local catalog first, barcode lookup follows the same layered path, and manual ingredient analysis stays available anytime.
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
                  {item === 'Photo' ? 'Soon' : 'Live'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {mode === 'Ingredients' ? (
          <>
            <View style={styles.entryModeRow}>
              <Pressable
                onPress={() => setEntryMode('search')}
                style={[styles.entryModeChip, entryMode === 'search' && styles.entryModeChipActive]}
              >
                <Text style={[styles.entryModeText, entryMode === 'search' && styles.entryModeTextActive]}>
                  Search product
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setEntryMode('manual')}
                style={[styles.entryModeChip, entryMode === 'manual' && styles.entryModeChipActive]}
              >
                <Text style={[styles.entryModeText, entryMode === 'manual' && styles.entryModeTextActive]}>
                  Paste ingredients
                </Text>
              </Pressable>
            </View>

            {entryMode === 'search' ? (
              <LinearGradient colors={gradients.accent} style={styles.inputShell}>
                <View style={styles.inputHeader}>
                  <View style={styles.inputHeaderCopy}>
                    <Text style={styles.inputEyebrow}>Product search</Text>
                    <Text style={styles.inputTitle} lineBreakStrategyIOS="standard">
                      Search by product name
                    </Text>
                  </View>
                  <Text style={styles.inputHint} lineBreakStrategyIOS="standard">
                    Try a serum, cleanser, moisturizer, or barrier cream already in the DermaIQ catalog.
                  </Text>
                </View>

                <View style={[styles.textInputShell, isSearchFocused && styles.textInputShellFocused]}>
                  <TextInput
                    placeholder="Search for a product name..."
                    placeholderTextColor={colors.textMuted}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={(value) => {
                      setSearchQuery(value);
                      if (searchResponse) {
                        setSearchResponse(null);
                      }
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </View>

                {searchResponse?.status === 'found' ? (
                  <View style={styles.resultsSection}>
                    <View style={styles.resultsHeader}>
                      <Text style={styles.resultsTitle}>
                        {searchResponse.results.length === 1 ? 'Best match' : 'Select a product'}
                      </Text>
                      {searchResponse.source === 'external' ? (
                        <Badge label="Fetched externally" tone="premium" />
                      ) : null}
                    </View>
                    <View style={styles.resultsList}>
                      {searchResponse.results.map((product) => (
                        <Pressable
                          key={product.id}
                          onPress={() => handleSelectProduct(product)}
                          style={({ pressed }) => [styles.resultPressable, pressed && styles.resultPressed]}
                        >
                          <PremiumCard style={styles.resultCard}>
                            <View style={styles.resultTopRow}>
                              <View style={styles.resultCopy}>
                                <Text style={styles.resultBrand}>{product.brand}</Text>
                                <Text style={styles.resultName}>{product.name}</Text>
                                <Text style={styles.resultMeta}>
                                  {product.category} · {product.ingredientList.split(',').length} listed ingredients
                                </Text>
                              </View>
                              <Ionicons
                                name="arrow-forward-circle-outline"
                                size={22}
                                color={colors.primaryDeep}
                              />
                            </View>
                            <Text style={styles.resultHint}>
                              Tap to analyze this product with your current skin profile.
                            </Text>
                          </PremiumCard>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : null}

                {searchResponse?.status === 'not_found' ? (
                  <PremiumCard variant="tinted" style={styles.notFoundCard}>
                    <View style={styles.notFoundIcon}>
                      <Ionicons name="search-outline" size={20} color={colors.warning} />
                    </View>
                    <Text style={styles.notFoundTitle}>We couldn&apos;t find that product yet.</Text>
                    <Text style={styles.notFoundText}>
                      {searchResponse.message ??
                        'Try another product name or paste ingredients manually to keep the analysis moving.'}
                    </Text>
                  </PremiumCard>
                ) : null}

                {searchResponse?.status === 'missing_ingredients' ? (
                  <PremiumCard variant="tinted" style={styles.notFoundCard}>
                    <View style={styles.notFoundIcon}>
                      <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
                    </View>
                    <Text style={styles.notFoundTitle}>
                      We found this product, but couldn&apos;t extract ingredients yet.
                    </Text>
                    <Text style={styles.notFoundText}>
                      {searchResponse.message ??
                        'Try another product name or paste ingredients manually so DermaIQ can analyze it.'}
                    </Text>
                  </PremiumCard>
                ) : null}

                <Text style={styles.helperText} lineBreakStrategyIOS="standard">
                  Search checks the local catalog first, then stored products, then external product sources.
                </Text>
              </LinearGradient>
            ) : (
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
                  <Pressable
                    onPress={() => setIngredientInput(sampleIngredientInput)}
                    style={({ pressed }) => [styles.sampleAction, pressed && styles.sampleActionPressed]}
                  >
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
            )}
          </>
        ) : mode === 'Barcode' ? (
          <View style={styles.barcodeShell}>
            {!cameraPermission ? (
              <PremiumCard variant="tinted" style={styles.permissionCard}>
                <Text style={styles.permissionTitle}>Preparing camera access…</Text>
                <Text style={styles.permissionText}>
                  DermaIQ is checking whether barcode scanning is available on this device.
                </Text>
              </PremiumCard>
            ) : !cameraPermission.granted ? (
              <PremiumCard variant="tinted" style={styles.permissionCard}>
                <View style={styles.permissionIcon}>
                  <Ionicons name="camera-outline" size={20} color={colors.primaryDeep} />
                </View>
                <Text style={styles.permissionTitle}>Allow camera access to scan barcodes</Text>
                <Text style={styles.permissionText}>
                  DermaIQ needs camera access to read product barcodes and look up ingredients automatically.
                </Text>
                <PrimaryButton
                  label="Enable camera"
                  size="md"
                  onPress={() => {
                    void requestCameraPermission();
                  }}
                />
                <View style={styles.barcodeFallbackRow}>
                  <Pressable
                    onPress={() => {
                      setMode('Ingredients');
                      setEntryMode('search');
                    }}
                    style={({ pressed }) => [
                      styles.barcodeFallbackChip,
                      pressed && styles.barcodeFallbackChipPressed,
                    ]}
                  >
                    <Text style={styles.barcodeFallbackChipText}>Search product</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setMode('Ingredients');
                      setEntryMode('manual');
                    }}
                    style={({ pressed }) => [
                      styles.barcodeFallbackChip,
                      pressed && styles.barcodeFallbackChipPressed,
                    ]}
                  >
                    <Text style={styles.barcodeFallbackChipText}>Paste ingredients</Text>
                  </Pressable>
                </View>
              </PremiumCard>
            ) : (
              <>
                <View style={styles.cameraFrame}>
                  <CameraView
                    style={styles.cameraView}
                    facing="back"
                    active={isFocused && mode === 'Barcode'}
                    onBarcodeScanned={isBarcodeLocked ? undefined : handleBarcodeScanned}
                    barcodeScannerSettings={{
                      barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'itf14'],
                    }}
                  />
                  <View pointerEvents="none" style={styles.cameraOverlay}>
                    <View style={styles.scannerFrame} />
                    <Text style={styles.cameraHint}>Align the barcode inside the frame</Text>
                  </View>
                </View>

                {barcodeState.status !== 'idle' ? (
                  <PremiumCard variant="tinted" style={styles.barcodeStatusCard}>
                    <Text style={styles.barcodeStatusTitle}>
                      {barcodeState.status === 'processing'
                        ? 'Processing barcode…'
                        : barcodeState.status === 'success'
                          ? 'Opening analysis…'
                          : barcodeState.status === 'missing_ingredients'
                            ? 'Ingredients missing'
                            : barcodeState.status === 'invalid_barcode'
                              ? 'Barcode not read clearly'
                              : barcodeState.status === 'error'
                                ? 'Lookup unavailable'
                                : 'Barcode not found'}
                    </Text>
                    <Text style={styles.barcodeStatusText}>{barcodeState.message}</Text>
                    {barcodeState.status !== 'processing' && barcodeState.status !== 'success' ? (
                      <View style={styles.barcodeStatusActions}>
                        <PrimaryButton label="Scan again" size="md" onPress={resetBarcodeScanner} />
                        <Pressable
                          onPress={() => {
                            setMode('Ingredients');
                            setEntryMode('search');
                            resetBarcodeScanner();
                          }}
                          style={({ pressed }) => [styles.switchPill, pressed && styles.switchPillPressed]}
                        >
                          <Text style={styles.switchPillText}>Search product</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setMode('Ingredients');
                            setEntryMode('manual');
                            resetBarcodeScanner();
                          }}
                          style={({ pressed }) => [styles.switchPill, pressed && styles.switchPillPressed]}
                        >
                          <Text style={styles.switchPillText}>Paste ingredients</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </PremiumCard>
                ) : (
                  <Text style={styles.barcodeHelperText}>
                    Barcode lookup checks the static catalog first, then saved products, then Open Beauty Facts.
                  </Text>
                )}
              </>
            )}
          </View>
        ) : (
          <View style={styles.comingSoonModule}>
            <View style={styles.comingSoonTopRow}>
              <View style={styles.comingSoonIcon}>
                <Ionicons name="camera-outline" size={20} color={colors.primaryDeep} />
              </View>
              <View style={styles.comingSoonCopy}>
                <Text style={styles.comingSoonTitle} lineBreakStrategyIOS="standard">
                  Photo analysis arrives soon
                </Text>
                <Text style={styles.comingSoonBody} lineBreakStrategyIOS="standard">
                  For now, search the local catalog, scan a barcode, or paste ingredients to run a real analysis.
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setMode('Ingredients')}
              style={({ pressed }) => [styles.switchPill, pressed && styles.switchPillPressed]}
            >
              <Text style={styles.switchPillText}>Use Ingredients</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.scanTips}>
          <View style={styles.tipPill}>
            <Ionicons name="search-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Search local products</Text>
          </View>
          <View style={styles.tipPill}>
            <Ionicons name="barcode-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Live barcode lookup</Text>
          </View>
          <View style={styles.tipPill}>
            <Ionicons name="sparkles-outline" size={16} color={colors.primaryDeep} />
            <Text style={styles.tipText}>Fast AI-ready analysis</Text>
          </View>
        </View>
      </PremiumCard>

      <View style={styles.footer}>
        {!isPremium ? (
          <Text style={styles.planText}>
            {isPlanHydrated
              ? `${remainingAnalyses} of 3 free analyses remaining today`
              : 'Syncing your free plan access...'}
          </Text>
        ) : null}
        {mode === 'Ingredients' && entryMode === 'manual' && !trimmedInput ? (
          <Text style={styles.validationText}>Paste an ingredient list to unlock your analysis.</Text>
        ) : null}
        {mode === 'Ingredients' && entryMode === 'search' && !trimmedSearchQuery ? (
          <Text style={styles.validationText}>Type a product name to search the DermaIQ product layers.</Text>
        ) : null}
        {mode === 'Barcode' && barcodeState.status === 'idle' && cameraPermission?.granted ? (
          <Text style={styles.validationText}>Point the camera at a product barcode to start lookup automatically.</Text>
        ) : null}
        {mode === 'Photo' ? (
          <Text style={styles.validationText}>Photo mode is still staged. Barcode and ingredients are live first.</Text>
        ) : null}

        <View style={styles.ctaWrap}>
          {mode === 'Barcode' ? (
            <PrimaryButton
              label="Use product search"
              leftIcon={<Ionicons name="search" size={18} color={colors.surfaceElevated} />}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
              onPress={() => {
                setMode('Ingredients');
                setEntryMode('search');
                resetBarcodeScanner();
              }}
              disabled={barcodeState.status === 'processing'}
            />
          ) : mode === 'Ingredients' && entryMode === 'search' ? (
            <PrimaryButton
              label="Search products"
              leftIcon={<Ionicons name="search" size={18} color={colors.surfaceElevated} />}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
              onPress={() => {
                void handleSearchProducts();
              }}
              disabled={!canSearchProducts}
            />
          ) : (
            <PrimaryButton
              label="Analyze ingredients"
              leftIcon={<Ionicons name="sparkles" size={18} color={colors.surfaceElevated} />}
              rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.surfaceElevated} />}
              onPress={handleAnalyzeIngredients}
              disabled={!canAnalyzeManual || !isPlanHydrated}
            />
          )}
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
    maxWidth: 360,
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
    maxWidth: 380,
  },
  heroBody: {
    ...typography.body,
    maxWidth: 400,
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
  entryModeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  entryModeChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  entryModeChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: '#D1DECF',
  },
  entryModeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  entryModeTextActive: {
    color: colors.primaryDeep,
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
  searchInput: {
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
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
  resultsSection: {
    gap: spacing.sm,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultsTitle: {
    ...typography.sectionTitle,
    fontSize: 19,
    lineHeight: 24,
  },
  resultsList: {
    gap: spacing.sm,
  },
  resultPressable: {
    borderRadius: radius.md,
  },
  resultPressed: {
    opacity: 0.97,
  },
  resultCard: {
    gap: spacing.sm,
  },
  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  resultCopy: {
    flex: 1,
  },
  resultBrand: {
    ...typography.eyebrow,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  resultName: {
    ...typography.bodyStrong,
    fontSize: 17,
    lineHeight: 22,
  },
  resultMeta: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  resultHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  notFoundCard: {
    gap: spacing.sm,
  },
  notFoundIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: '#F7EEE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    ...typography.bodyStrong,
  },
  notFoundText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  barcodeShell: {
    gap: spacing.md,
  },
  cameraFrame: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    minHeight: 380,
  },
  cameraView: {
    minHeight: 380,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 33, 23, 0.18)',
    paddingHorizontal: spacing.xl,
  },
  scannerFrame: {
    width: '78%',
    aspectRatio: 1.7,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.92)',
    backgroundColor: 'transparent',
  },
  cameraHint: {
    ...typography.bodySmall,
    color: colors.surfaceElevated,
    marginTop: spacing.lg,
    textAlign: 'center',
    maxWidth: 260,
  },
  barcodeHelperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  barcodeStatusCard: {
    gap: spacing.sm,
  },
  barcodeStatusTitle: {
    ...typography.bodyStrong,
  },
  barcodeStatusText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  barcodeStatusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  permissionCard: {
    gap: spacing.md,
  },
  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    ...typography.sectionTitle,
    fontSize: 22,
    lineHeight: 28,
  },
  permissionText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  barcodeFallbackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  barcodeFallbackChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  barcodeFallbackChipPressed: {
    opacity: 0.96,
  },
  barcodeFallbackChipText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '700',
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
  planText: {
    ...typography.bodySmall,
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  validationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  ctaWrap: {
    paddingTop: spacing.xs,
  },
});

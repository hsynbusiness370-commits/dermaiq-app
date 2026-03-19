import AsyncStorage from '@react-native-async-storage/async-storage';

import { ManualAnalysisPayload, SavedAnalysis, SavedAnalysisStatus } from './types';

const SAVED_ANALYSES_KEY = '@dermaiq/saved-analyses';

function computeOverallScore(payload: ManualAnalysisPayload) {
  return Math.round(
    payload.analysis.safetyScore * 0.4 +
      payload.analysis.skinMatchScore * 0.35 +
      payload.analysis.effectivenessScore * 0.25
  );
}

function deriveStatus(verdict: SavedAnalysis['verdict']): SavedAnalysisStatus {
  return verdict === 'Great Match' ? 'Saved' : 'Needs review';
}

function normalizeValues(values: string[]) {
  return values.map((value) => value.trim().toLowerCase()).sort();
}

function createFingerprint(payload: ManualAnalysisPayload) {
  return JSON.stringify({
    productName: payload.analysis.product.name.trim().toLowerCase(),
    category: payload.analysis.product.category.trim().toLowerCase(),
    matchedIngredients: normalizeValues(payload.matchedIngredients.map((ingredient) => ingredient.name)),
    unknownIngredients: normalizeValues(payload.unknownIngredients),
    safetyScore: payload.analysis.safetyScore,
    skinMatchScore: payload.analysis.skinMatchScore,
    effectivenessScore: payload.analysis.effectivenessScore,
    rawInput: payload.rawInput.trim().toLowerCase(),
  });
}

function hashValue(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return `analysis-${hash.toString(16)}`;
}

export function createSavedAnalysis(payload: ManualAnalysisPayload, createdAt = new Date().toISOString()): SavedAnalysis {
  const fingerprint = createFingerprint(payload);

  return {
    id: hashValue(fingerprint),
    fingerprint,
    createdAt,
    productName: payload.analysis.product.name,
    brand: payload.analysis.product.brand,
    category: payload.analysis.product.category,
    verdict: payload.analysis.verdict,
    status: deriveStatus(payload.analysis.verdict),
    overallScore: computeOverallScore(payload),
    safetyScore: payload.analysis.safetyScore,
    skinMatchScore: payload.analysis.skinMatchScore,
    effectivenessScore: payload.analysis.effectivenessScore,
    confidenceLevel: payload.analysis.confidenceLevel,
    confidenceScore: payload.analysis.confidenceScore,
    personalizedSummary: payload.analysis.personalizedSummary,
    summary: payload.analysis.verdictSummary,
    explanation: payload.analysis.explanation,
    whyItMatches: payload.analysis.whyItMatches,
    possibleConcerns: payload.analysis.possibleConcerns,
    recommendedFor: payload.analysis.recommendedFor,
    matchedIngredients: payload.matchedIngredients,
    unknownIngredients: payload.unknownIngredients,
    rawInput: payload.rawInput,
  };
}

export function savedAnalysisToPayload(savedAnalysis: SavedAnalysis): ManualAnalysisPayload {
  return {
    analysis: {
      product: {
        id: savedAnalysis.id,
        name: savedAnalysis.productName,
        brand: savedAnalysis.brand,
        category: savedAnalysis.category,
        ingredients: savedAnalysis.matchedIngredients,
      },
      safetyScore: savedAnalysis.safetyScore,
      skinMatchScore: savedAnalysis.skinMatchScore,
      effectivenessScore: savedAnalysis.effectivenessScore,
      verdict: savedAnalysis.verdict,
      confidenceLevel: savedAnalysis.confidenceLevel ?? 'Moderate',
      confidenceScore: savedAnalysis.confidenceScore ?? 60,
      personalizedSummary: savedAnalysis.personalizedSummary ?? savedAnalysis.summary,
      verdictSummary: savedAnalysis.summary,
      explanation: savedAnalysis.explanation,
      whyItMatches: savedAnalysis.whyItMatches,
      possibleConcerns: savedAnalysis.possibleConcerns,
      recommendedFor: savedAnalysis.recommendedFor,
    },
    matchedIngredients: savedAnalysis.matchedIngredients,
    unknownIngredients: savedAnalysis.unknownIngredients,
    rawInput: savedAnalysis.rawInput,
  };
}

export function formatSavedAnalysisDate(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

export async function loadSavedAnalyses() {
  const rawValue = await AsyncStorage.getItem(SAVED_ANALYSES_KEY);

  if (!rawValue) {
    return [] as SavedAnalysis[];
  }

  try {
    const parsed = JSON.parse(rawValue) as SavedAnalysis[];
    return parsed.sort((left, right) => (left.createdAt < right.createdAt ? 1 : -1));
  } catch {
    return [] as SavedAnalysis[];
  }
}

export async function persistSavedAnalyses(savedAnalyses: SavedAnalysis[]) {
  await AsyncStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(savedAnalyses));
}

export async function saveAnalysisToStorage(
  payload: ManualAnalysisPayload,
  existingSavedAnalyses: SavedAnalysis[]
) {
  const nextSavedAnalysis = createSavedAnalysis(payload);
  const duplicate = existingSavedAnalyses.find(
    (savedAnalysis) => savedAnalysis.fingerprint === nextSavedAnalysis.fingerprint
  );

  const mergedSavedAnalyses = duplicate
    ? existingSavedAnalyses.map((savedAnalysis) =>
        savedAnalysis.id === duplicate.id
          ? createSavedAnalysis(payload, duplicate.createdAt)
          : savedAnalysis
      )
    : [nextSavedAnalysis, ...existingSavedAnalyses];

  await persistSavedAnalyses(mergedSavedAnalyses);
  return {
    savedAnalyses: mergedSavedAnalyses,
    savedAnalysis: duplicate
      ? createSavedAnalysis(payload, duplicate.createdAt)
      : nextSavedAnalysis,
    wasDuplicate: Boolean(duplicate),
  };
}

export async function removeSavedAnalysisFromStorage(
  savedAnalysisId: string,
  existingSavedAnalyses: SavedAnalysis[]
) {
  const filteredAnalyses = existingSavedAnalyses.filter((savedAnalysis) => savedAnalysis.id !== savedAnalysisId);
  await persistSavedAnalyses(filteredAnalyses);
  return filteredAnalyses;
}

export async function clearSavedAnalysesFromStorage() {
  await AsyncStorage.removeItem(SAVED_ANALYSES_KEY);
}

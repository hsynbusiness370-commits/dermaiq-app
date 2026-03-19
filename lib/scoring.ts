import {
  ConfidenceLevel,
  Ingredient,
  IngredientBenefit,
  Product,
  ProductAnalysis,
  ProductVerdict,
  SkinGoal,
  SkinType,
  UserProfile,
  UserSensitivity,
} from './types';

const goalBenefitMap: Record<SkinGoal, IngredientBenefit[]> = {
  Acne: ['anti-acne', 'oil-control', 'exfoliation', 'soothing'],
  'Anti-aging': ['anti-aging', 'antioxidant', 'hydration', 'barrier-support'],
  Hydration: ['hydration', 'barrier-support', 'soothing'],
  Glow: ['brightening', 'antioxidant', 'hydration', 'texture-refining'],
};

const benefitLabelMap: Record<IngredientBenefit, string> = {
  hydration: 'hydration',
  'anti-acne': 'blemish control',
  brightening: 'radiance',
  'anti-aging': 'anti-aging support',
  'barrier-support': 'barrier support',
  soothing: 'skin-calming support',
  'oil-control': 'oil balance',
  exfoliation: 'surface renewal',
  'texture-refining': 'smoother texture',
  antioxidant: 'antioxidant support',
};

const highImpactIngredients = new Set(['Retinol', 'Salicylic Acid', 'Benzoyl Peroxide', 'Vitamin C', 'Niacinamide']);
const irritantIngredients = new Set(['Fragrance', 'Alcohol Denat', 'Tea Tree Oil']);
const barrierSupportIngredients = new Set(['Ceramide NP', 'Panthenol', 'Glycerin', 'Hyaluronic Acid', 'Squalane']);

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function joinIngredientNames(ingredients: Ingredient[], limit = 2) {
  const names = ingredients.map((ingredient) => ingredient.name).slice(0, limit);

  if (names.length <= 1) {
    return names[0] ?? '';
  }

  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }

  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

function getPrimaryGoal(profile: UserProfile) {
  return profile.goals[0] ?? 'Hydration';
}

function getRoutineLabel(goal: SkinGoal) {
  switch (goal) {
    case 'Acne':
      return 'acne-focused routine';
    case 'Anti-aging':
      return 'renewal-focused routine';
    case 'Hydration':
      return 'hydration-focused routine';
    case 'Glow':
      return 'glow-focused routine';
    default:
      return 'current routine';
  }
}

function getProfileDescriptor(profile: UserProfile) {
  switch (profile.skinType) {
    case 'Sensitive':
      return 'sensitive skin profile';
    case 'Dry':
      return 'dry skin profile';
    case 'Oily':
      return 'oily skin profile';
    case 'Combination':
      return 'combination skin profile';
    default:
      return 'skin profile';
  }
}

function getIngredientImpactWeight(ingredient: Ingredient) {
  let weight = 1;

  if (highImpactIngredients.has(ingredient.name)) {
    weight += 3;
  }

  if (irritantIngredients.has(ingredient.name)) {
    weight += 2;
  }

  if (barrierSupportIngredients.has(ingredient.name)) {
    weight += 1;
  }

  return weight;
}

function irritationPenalty(ingredient: Ingredient) {
  switch (ingredient.irritationRisk) {
    case 'high':
      return 10;
    case 'medium':
      return 4;
    default:
      return 0;
  }
}

function comedogenicPenalty(ingredient: Ingredient) {
  if (ingredient.comedogenicRating >= 4) {
    return 6;
  }

  if (ingredient.comedogenicRating >= 3) {
    return 3;
  }

  return 0;
}

function skinTypeSupport(ingredient: Ingredient, skinType: SkinType) {
  const benefits = ingredient.benefits;

  switch (skinType) {
    case 'Dry':
      return benefits.includes('hydration') || benefits.includes('barrier-support') ? 4 : 0;
    case 'Oily':
      return benefits.includes('oil-control') || benefits.includes('anti-acne') ? 4 : 0;
    case 'Combination':
      return benefits.includes('hydration') || benefits.includes('oil-control') ? 3 : 0;
    case 'Sensitive':
      return benefits.includes('soothing') || benefits.includes('barrier-support') ? 5 : 0;
    default:
      return 0;
  }
}

function skinTypePenalty(ingredient: Ingredient, profile: UserProfile) {
  let penalty = 0;

  if (profile.skinType === 'Sensitive') {
    if (ingredient.irritationRisk === 'high') {
      penalty += 14;
    } else if (ingredient.irritationRisk === 'medium') {
      penalty += 7;
    }
  }

  if (profile.skinType === 'Dry' && ingredient.concerns.includes('dryness')) {
    penalty += 8;
  }

  if ((profile.skinType === 'Oily' || profile.goals.includes('Acne')) && ingredient.comedogenicRating >= 3) {
    penalty += ingredient.comedogenicRating >= 4 ? 12 : 7;
  }

  if (profile.skinType === 'Combination' && ingredient.comedogenicRating >= 4) {
    penalty += 8;
  }

  return penalty;
}

function sensitivityPenalty(ingredient: Ingredient, sensitivities: UserSensitivity[]) {
  let penalty = 0;

  if (sensitivities.includes('fragrance') && ingredient.name === 'Fragrance') {
    penalty += 16;
  }

  if (sensitivities.includes('drying alcohols') && ingredient.name === 'Alcohol Denat') {
    penalty += 14;
  }

  if (sensitivities.includes('irritation') && ingredient.concerns.includes('irritation')) {
    penalty += 8;
  }

  if (sensitivities.includes('pore clogging') && ingredient.comedogenicRating >= 3) {
    penalty += 10;
  }

  if (sensitivities.includes('dryness') && ingredient.concerns.includes('dryness')) {
    penalty += 8;
  }

  return penalty;
}

function goalBenefitScore(ingredient: Ingredient, goal: SkinGoal, directWeight: number, supportWeight: number) {
  const targetBenefits = goalBenefitMap[goal];
  const directMatches = ingredient.benefits.filter((benefit) => targetBenefits.includes(benefit)).length;

  if (directMatches > 0) {
    return Math.min(12, directMatches * directWeight);
  }

  if (goal === 'Hydration' && ingredient.benefits.includes('soothing')) {
    return supportWeight;
  }

  if (goal === 'Glow' && ingredient.benefits.includes('hydration')) {
    return supportWeight;
  }

  if (goal === 'Anti-aging' && ingredient.benefits.includes('brightening')) {
    return supportWeight;
  }

  return 0;
}

function getDominantPositiveSignals(product: Product, profile: UserProfile) {
  const groups = {
    hydration: { ingredients: [] as Ingredient[], priority: 0 },
    glow: { ingredients: [] as Ingredient[], priority: 0 },
    acne: { ingredients: [] as Ingredient[], priority: 0 },
    renewal: { ingredients: [] as Ingredient[], priority: 0 },
    calm: { ingredients: [] as Ingredient[], priority: 0 },
  };

  product.ingredients.forEach((ingredient) => {
    const weight = getIngredientImpactWeight(ingredient);
    const benefits = ingredient.benefits;

    if (benefits.includes('hydration') || benefits.includes('barrier-support')) {
      groups.hydration.ingredients.push(ingredient);
      groups.hydration.priority += weight + (profile.goals.includes('Hydration') ? 4 : 0);
    }

    if (benefits.includes('brightening') || benefits.includes('antioxidant')) {
      groups.glow.ingredients.push(ingredient);
      groups.glow.priority += weight + (profile.goals.includes('Glow') ? 4 : 0);
    }

    if (benefits.includes('anti-acne') || benefits.includes('oil-control') || benefits.includes('exfoliation')) {
      groups.acne.ingredients.push(ingredient);
      groups.acne.priority += weight + (profile.goals.includes('Acne') ? 4 : 0);
    }

    if (benefits.includes('anti-aging') || benefits.includes('texture-refining')) {
      groups.renewal.ingredients.push(ingredient);
      groups.renewal.priority += weight + (profile.goals.includes('Anti-aging') ? 4 : 0);
    }

    if (benefits.includes('soothing')) {
      groups.calm.ingredients.push(ingredient);
      groups.calm.priority += weight + (profile.skinType === 'Sensitive' ? 4 : 0);
    }
  });

  const messages = [
    {
      key: 'hydration',
      message: `${joinIngredientNames(unique(groups.hydration.ingredients), 2)} support hydration and barrier comfort.`,
      priority: groups.hydration.priority,
      valid: groups.hydration.ingredients.length > 0,
    },
    {
      key: 'glow',
      message: `${joinIngredientNames(unique(groups.glow.ingredients), 2)} support radiance and tone clarity.`,
      priority: groups.glow.priority,
      valid: groups.glow.ingredients.length > 0,
    },
    {
      key: 'acne',
      message: `${joinIngredientNames(unique(groups.acne.ingredients), 2)} help with blemish control and oil balance.`,
      priority: groups.acne.priority,
      valid: groups.acne.ingredients.length > 0,
    },
    {
      key: 'renewal',
      message: `${joinIngredientNames(unique(groups.renewal.ingredients), 2)} contribute to smoother texture and long-term renewal.`,
      priority: groups.renewal.priority,
      valid: groups.renewal.ingredients.length > 0,
    },
    {
      key: 'calm',
      message: `${joinIngredientNames(unique(groups.calm.ingredients), 2)} help keep the formula calmer on skin.`,
      priority: groups.calm.priority,
      valid: groups.calm.ingredients.length > 0,
    },
  ];

  return messages
    .filter((entry) => entry.valid)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, 3);
}

function getDominantConcernSignals(product: Product, profile: UserProfile) {
  const groups: Record<
    'irritation' | 'dryness' | 'poreClogging' | 'photosensitivity',
    { ingredients: Ingredient[]; priority: number }
  > = {
    irritation: { ingredients: [], priority: 0 },
    dryness: { ingredients: [], priority: 0 },
    poreClogging: { ingredients: [], priority: 0 },
    photosensitivity: { ingredients: [], priority: 0 },
  };

  product.ingredients.forEach((ingredient) => {
    const weight = getIngredientImpactWeight(ingredient);

    if (ingredient.irritationRisk === 'high' || ingredient.concerns.includes('irritation') || irritantIngredients.has(ingredient.name)) {
      groups.irritation.ingredients.push(ingredient);
      groups.irritation.priority += weight + (profile.skinType === 'Sensitive' ? 4 : 0);
    }

    if (ingredient.concerns.includes('dryness') || ingredient.concerns.includes('barrier stress')) {
      groups.dryness.ingredients.push(ingredient);
      groups.dryness.priority += weight + (profile.skinType === 'Dry' ? 4 : 0);
    }

    if (ingredient.comedogenicRating >= 3 || ingredient.concerns.includes('pore clogging')) {
      groups.poreClogging.ingredients.push(ingredient);
      groups.poreClogging.priority += weight + (profile.goals.includes('Acne') ? 4 : 0);
    }

    if (ingredient.concerns.includes('photosensitivity')) {
      groups.photosensitivity.ingredients.push(ingredient);
      groups.photosensitivity.priority += weight + 2;
    }
  });

  const messages = [
    {
      key: 'irritation',
      message: `${joinIngredientNames(unique(groups.irritation.ingredients), 2)} may irritate reactive or sensitive skin.`,
      priority: groups.irritation.priority,
      valid: groups.irritation.ingredients.length > 0,
    },
    {
      key: 'dryness',
      message: `${joinIngredientNames(unique(groups.dryness.ingredients), 2)} may leave skin feeling drier if your barrier is already stressed.`,
      priority: groups.dryness.priority,
      valid: groups.dryness.ingredients.length > 0,
    },
    {
      key: 'poreClogging',
      message: `${joinIngredientNames(unique(groups.poreClogging.ingredients), 2)} may feel heavier in breakout-prone routines.`,
      priority: groups.poreClogging.priority,
      valid: groups.poreClogging.ingredients.length > 0,
    },
    {
      key: 'photosensitivity',
      message: `${joinIngredientNames(unique(groups.photosensitivity.ingredients), 2)} make thoughtful night-time use more important.`,
      priority: groups.photosensitivity.priority,
      valid: groups.photosensitivity.ingredients.length > 0,
    },
  ];

  return messages
    .filter((entry) => entry.valid)
    .sort((left, right) => right.priority - left.priority)
    .slice(0, 3);
}

function buildConfidence(
  product: Product,
  unknownIngredients: string[],
  matchedBenefits: IngredientBenefit[],
  concernIngredients: Ingredient[]
) {
  const matchedCount = product.ingredients.length;
  const unknownCount = unknownIngredients.length;
  const highImpactCount = product.ingredients.filter((ingredient) => highImpactIngredients.has(ingredient.name)).length;

  let confidenceScore = 0;

  if (matchedCount >= 5) {
    confidenceScore += 42;
  } else if (matchedCount >= 3) {
    confidenceScore += 32;
  } else if (matchedCount >= 1) {
    confidenceScore += 18;
  }

  if (unknownCount === 0) {
    confidenceScore += 28;
  } else if (unknownCount <= 2) {
    confidenceScore += 14;
  } else {
    confidenceScore -= 8;
  }

  confidenceScore += Math.min(15, matchedBenefits.length * 4);
  confidenceScore += Math.min(10, highImpactCount * 3);

  if (concernIngredients.length > 0 || matchedBenefits.length > 0) {
    confidenceScore += 8;
  }

  if (matchedCount === 0) {
    confidenceScore = 18;
  }

  const normalizedScore = clampScore(confidenceScore);
  const confidenceLevel: ConfidenceLevel =
    normalizedScore >= 75 ? 'High' : normalizedScore >= 50 ? 'Moderate' : 'Low';

  return {
    confidenceLevel,
    confidenceScore: normalizedScore,
  };
}

function summarizeMatchedBenefits(product: Product, profile: UserProfile) {
  const matchedBenefits: IngredientBenefit[] = [];

  product.ingredients.forEach((ingredient) => {
    profile.goals.forEach((goal) => {
      ingredient.benefits.forEach((benefit) => {
        if (goalBenefitMap[goal].includes(benefit)) {
          matchedBenefits.push(benefit);
        }
      });
    });
  });

  return unique(matchedBenefits);
}

function findConcernIngredients(product: Product, profile: UserProfile) {
  return product.ingredients.filter(
    (ingredient) =>
      ingredient.irritationRisk === 'high' ||
      ingredient.comedogenicRating >= 3 ||
      sensitivityPenalty(ingredient, profile.sensitivities) > 0
  );
}

function buildVerdict(safetyScore: number, skinMatchScore: number, effectivenessScore: number): ProductVerdict {
  const weightedAverage = safetyScore * 0.4 + skinMatchScore * 0.35 + effectivenessScore * 0.25;

  if (safetyScore < 60 || skinMatchScore < 55 || weightedAverage < 60) {
    return 'Not Ideal';
  }

  if (safetyScore < 78 || skinMatchScore < 70 || weightedAverage < 74) {
    return 'Use with Caution';
  }

  return 'Great Match';
}

function buildPersonalizedSummary(
  verdict: ProductVerdict,
  profile: UserProfile,
  positiveSignals: ReturnType<typeof getDominantPositiveSignals>,
  concernSignals: ReturnType<typeof getDominantConcernSignals>
) {
  const routineLabel = getRoutineLabel(getPrimaryGoal(profile));
  const profileDescriptor = getProfileDescriptor(profile);
  const firstConcern = concernSignals[0]?.message;

  if (verdict === 'Great Match') {
    return `Well aligned with your ${routineLabel}. ${positiveSignals[0]?.message ?? 'Supportive ingredients stand out'}${
      firstConcern ? ` ${firstConcern}` : ' with very few obvious friction points.'
    }`;
  }

  if (verdict === 'Use with Caution') {
    return `Promising for your ${routineLabel}, but may need a more careful fit against your ${profileDescriptor}. ${
      firstConcern ?? 'A few caution signals are worth watching.'
    }`;
  }

  return `May not suit your ${profileDescriptor}. ${firstConcern ?? 'The main risk signals outweigh the likely upside.'}`;
}

function buildExplanation(
  profile: UserProfile,
  positiveSignals: ReturnType<typeof getDominantPositiveSignals>,
  concernSignals: ReturnType<typeof getDominantConcernSignals>
) {
  const positiveSentence = positiveSignals[0]?.message
    ? positiveSignals[0].message
    : 'This formula has a few supportive signals, but they are not especially strong.';

  const concernSentence = concernSignals[0]?.message
    ? concernSignals[0].message
    : profile.skinType === 'Sensitive'
      ? 'It does not show obvious high-friction ingredients for a sensitive routine.'
      : 'It does not show any unusually strong risk signals in this ingredient set.';

  return `${positiveSentence} ${concernSentence}`;
}

function buildWhyItMatches(product: Product, profile: UserProfile) {
  return getDominantPositiveSignals(product, profile).map((entry) => entry.message);
}

function buildPossibleConcerns(product: Product, profile: UserProfile) {
  return getDominantConcernSignals(product, profile).map((entry) => entry.message);
}

function buildRecommendations(
  product: Product,
  profile: UserProfile,
  matchedBenefits: IngredientBenefit[],
  concernSignals: ReturnType<typeof getDominantConcernSignals>
) {
  const recommendations: string[] = [];
  const primaryGoal = getPrimaryGoal(profile);
  const hasRetinol = product.ingredients.some((ingredient) => ingredient.name === 'Retinol');
  const hasAcneActive = product.ingredients.some((ingredient) =>
    ['Salicylic Acid', 'Benzoyl Peroxide', 'Tea Tree Oil', 'Zinc PCA'].includes(ingredient.name)
  );
  const hasHydrationStack = matchedBenefits.includes('hydration') || matchedBenefits.includes('barrier-support');

  if (hasRetinol) {
    recommendations.push('Best used in a night routine for renewal support.');
  }

  if (hasAcneActive || primaryGoal === 'Acne') {
    recommendations.push('Best used in a routine focused on acne control and oil balance.');
  }

  if (hasHydrationStack || primaryGoal === 'Hydration') {
    recommendations.push('Works well in a hydration-focused routine that prioritizes barrier comfort.');
  }

  if (primaryGoal === 'Glow' && !hasAcneActive) {
    recommendations.push('A strong fit for a glow-focused routine that still wants everyday comfort.');
  }

  if (primaryGoal === 'Anti-aging' && !hasRetinol) {
    recommendations.push('Best suited to routines centered on long-term resilience and texture support.');
  }

  if (product.ingredients.filter((ingredient) => highImpactIngredients.has(ingredient.name)).length >= 2) {
    recommendations.push('Avoid layering with other strong actives in the same routine.');
  }

  if (concernSignals.some((signal) => signal.key === 'irritation')) {
    recommendations.push('Patch testing first is a smart move if your skin reacts easily.');
  }

  return unique(recommendations).slice(0, 3);
}

export function calculateSafetyScore(product: Product) {
  const penalty = product.ingredients.reduce((total, ingredient) => {
    let ingredientPenalty = irritationPenalty(ingredient) + comedogenicPenalty(ingredient);

    if (ingredient.name === 'Fragrance' || ingredient.name === 'Alcohol Denat') {
      ingredientPenalty += 4;
    }

    return total + ingredientPenalty;
  }, 0);

  return clampScore(100 - penalty);
}

export function calculateSkinMatchScore(product: Product, userProfile: UserProfile) {
  let score = 58;

  product.ingredients.forEach((ingredient) => {
    userProfile.goals.forEach((goal) => {
      score += goalBenefitScore(ingredient, goal, 6, 3);
    });

    score += skinTypeSupport(ingredient, userProfile.skinType);
    score -= skinTypePenalty(ingredient, userProfile);
    score -= sensitivityPenalty(ingredient, userProfile.sensitivities);
  });

  return clampScore(score);
}

export function calculateEffectivenessScore(product: Product, userProfile: UserProfile) {
  let score = 42;

  product.ingredients.forEach((ingredient) => {
    userProfile.goals.forEach((goal) => {
      score += goalBenefitScore(ingredient, goal, 9, 4);
    });

    if (ingredient.irritationRisk === 'high') {
      score -= 3;
    }
  });

  return clampScore(score);
}

export function analyzeProduct(
  product: Product,
  userProfile: UserProfile,
  options: { unknownIngredients?: string[] } = {}
): ProductAnalysis {
  const safetyScore = calculateSafetyScore(product);
  const skinMatchScore = calculateSkinMatchScore(product, userProfile);
  const effectivenessScore = calculateEffectivenessScore(product, userProfile);
  const matchedBenefits = summarizeMatchedBenefits(product, userProfile);
  const concernIngredients = findConcernIngredients(product, userProfile);
  const verdict = buildVerdict(safetyScore, skinMatchScore, effectivenessScore);
  const positiveSignals = getDominantPositiveSignals(product, userProfile);
  const concernSignals = getDominantConcernSignals(product, userProfile);
  const confidence = buildConfidence(
    product,
    options.unknownIngredients ?? [],
    matchedBenefits,
    concernIngredients
  );
  const personalizedSummary = buildPersonalizedSummary(verdict, userProfile, positiveSignals, concernSignals);
  const refinedExplanation = buildExplanation(userProfile, positiveSignals, concernSignals);

  return {
    product,
    safetyScore,
    skinMatchScore,
    effectivenessScore,
    verdict,
    confidenceLevel: confidence.confidenceLevel,
    confidenceScore: confidence.confidenceScore,
    personalizedSummary,
    verdictSummary: personalizedSummary,
    explanation: refinedExplanation,
    whyItMatches: buildWhyItMatches(product, userProfile),
    possibleConcerns: buildPossibleConcerns(product, userProfile),
    recommendedFor: buildRecommendations(product, userProfile, matchedBenefits, concernSignals),
  };
}

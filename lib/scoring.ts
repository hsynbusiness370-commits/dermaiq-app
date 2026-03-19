import {
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

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
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

function buildVerdictSummary(verdict: ProductVerdict, matchedBenefits: IngredientBenefit[], concernIngredients: Ingredient[]) {
  const leadBenefit = matchedBenefits[0] ? benefitLabelMap[matchedBenefits[0]] : 'general skincare support';

  if (verdict === 'Great Match') {
    return `This formula looks like a strong fit overall, especially for ${leadBenefit}, with only limited risk flags in the current MVP model.`;
  }

  if (verdict === 'Use with Caution') {
    return `The formula offers real upside for ${leadBenefit}, but a few ingredients such as ${concernIngredients
      .slice(0, 2)
      .map((ingredient) => ingredient.name)
      .join(' and ')} make it worth approaching more carefully.`;
  }

  return `The current ingredient balance does not look especially compatible because the likely downsides outweigh the expected benefit signals.`;
}

function buildExplanation(product: Product, profile: UserProfile, matchedBenefits: IngredientBenefit[], concernIngredients: Ingredient[]) {
  const leadBenefits = matchedBenefits.slice(0, 2).map((benefit) => benefitLabelMap[benefit]);
  const benefitText = leadBenefits.length > 0 ? leadBenefits.join(' and ') : 'general skin support';

  const fragranceConcern = concernIngredients.find((ingredient) => ingredient.name === 'Fragrance');
  const alcoholConcern = concernIngredients.find((ingredient) => ingredient.name === 'Alcohol Denat');

  if (fragranceConcern && profile.skinType === 'Sensitive') {
    return `Good for ${benefitText} but may irritate sensitive skin due to fragrance.`;
  }

  if (fragranceConcern) {
    return `Strong for ${benefitText}, but fragrance may be irritating for reactive skin.`;
  }

  if (alcoholConcern) {
    return `Promising for ${benefitText}, though Alcohol Denat could feel drying depending on your skin barrier.`;
  }

  return `A balanced formula for ${benefitText} with no major concern ingredients standing out in this small MVP model.`;
}

function buildWhyItMatches(product: Product, profile: UserProfile) {
  const matches = product.ingredients.flatMap((ingredient) =>
    profile.goals.flatMap((goal) =>
      ingredient.benefits
        .filter((benefit) => goalBenefitMap[goal].includes(benefit))
        .map((benefit) => `${ingredient.name} supports ${benefitLabelMap[benefit]}.`)
    )
  );

  return unique(matches).slice(0, 3);
}

function buildPossibleConcerns(product: Product, profile: UserProfile) {
  const concerns = product.ingredients.flatMap((ingredient) => {
    const items: string[] = [];

    if (ingredient.name === 'Fragrance') {
      items.push('Fragrance may be irritating for reactive or sensitized skin.');
    }

    if (ingredient.name === 'Alcohol Denat') {
      items.push('Alcohol Denat may feel drying if your barrier is already stressed.');
    }

    if (ingredient.comedogenicRating >= 3 && (profile.goals.includes('Acne') || profile.sensitivities.includes('pore clogging'))) {
      items.push(`${ingredient.name} may feel heavier for breakout-prone routines.`);
    }

    if (ingredient.irritationRisk === 'high' && ingredient.name !== 'Fragrance' && ingredient.name !== 'Alcohol Denat') {
      items.push(`${ingredient.name} has a higher irritation profile in this simplified model.`);
    }

    return items;
  });

  return unique(concerns).slice(0, 3);
}

function buildRecommendations(profile: UserProfile, matchedBenefits: IngredientBenefit[]) {
  const recommendations: string[] = profile.goals.map((goal) => {
    switch (goal) {
      case 'Acne':
        return 'Best suited to routines focused on blemish control and oil balance.';
      case 'Anti-aging':
        return 'A reasonable match for routines prioritizing firmness, resilience, and long-term support.';
      case 'Hydration':
        return 'Most useful in routines centered on moisture retention and barrier comfort.';
      case 'Glow':
        return 'Well-positioned for radiance-focused routines that still want some hydration support.';
      default:
        return 'Useful as a flexible support step in a goal-led routine.';
    }
  });

  if (profile.skinType === 'Sensitive' && matchedBenefits.includes('soothing')) {
    recommendations.push('May fit calmer, lower-friction routines when your skin feels reactive.');
  }

  if (profile.skinType === 'Dry' && matchedBenefits.includes('hydration')) {
    recommendations.push('A good fit when dryness and barrier comfort are your main priority.');
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

export function analyzeProduct(product: Product, userProfile: UserProfile): ProductAnalysis {
  const safetyScore = calculateSafetyScore(product);
  const skinMatchScore = calculateSkinMatchScore(product, userProfile);
  const effectivenessScore = calculateEffectivenessScore(product, userProfile);
  const matchedBenefits = summarizeMatchedBenefits(product, userProfile);
  const concernIngredients = findConcernIngredients(product, userProfile);
  const verdict = buildVerdict(safetyScore, skinMatchScore, effectivenessScore);

  return {
    product,
    safetyScore,
    skinMatchScore,
    effectivenessScore,
    verdict,
    verdictSummary: buildVerdictSummary(verdict, matchedBenefits, concernIngredients),
    explanation: buildExplanation(product, userProfile, matchedBenefits, concernIngredients),
    whyItMatches: buildWhyItMatches(product, userProfile),
    possibleConcerns: buildPossibleConcerns(product, userProfile),
    recommendedFor: buildRecommendations(userProfile, matchedBenefits),
  };
}

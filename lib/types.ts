export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Sensitive';
export type SkinGoal = 'Acne' | 'Anti-aging' | 'Hydration' | 'Glow';

export type IrritationRisk = 'low' | 'medium' | 'high';

export type IngredientBenefit =
  | 'hydration'
  | 'anti-acne'
  | 'brightening'
  | 'anti-aging'
  | 'barrier-support'
  | 'soothing'
  | 'oil-control'
  | 'exfoliation'
  | 'texture-refining'
  | 'antioxidant';

export type IngredientConcern =
  | 'irritation'
  | 'pore clogging'
  | 'dryness'
  | 'photosensitivity'
  | 'sensitization'
  | 'barrier stress';

export type UserSensitivity = IngredientConcern | 'fragrance' | 'drying alcohols';

export type Ingredient = {
  name: string;
  comedogenicRating: 0 | 1 | 2 | 3 | 4 | 5;
  irritationRisk: IrritationRisk;
  benefits: IngredientBenefit[];
  concerns: IngredientConcern[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  ingredients: Ingredient[];
  category: string;
};

export type UserProfile = {
  skinType: SkinType;
  goals: SkinGoal[];
  sensitivities: UserSensitivity[];
};

export type ProductVerdict = 'Great Match' | 'Use with Caution' | 'Not Ideal';

export type ProductAnalysis = {
  product: Product;
  safetyScore: number;
  skinMatchScore: number;
  effectivenessScore: number;
  verdict: ProductVerdict;
  verdictSummary: string;
  explanation: string;
  whyItMatches: string[];
  possibleConcerns: string[];
  recommendedFor: string[];
};

export type ParsedIngredientResult = {
  matchedIngredients: Ingredient[];
  unknownIngredients: string[];
};

export type ManualAnalysisPayload = {
  analysis: ProductAnalysis;
  matchedIngredients: Ingredient[];
  unknownIngredients: string[];
  rawInput: string;
};

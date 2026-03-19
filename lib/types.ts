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
  imageUrl?: string;
  imagePlaceholder?: string;
};

export type UserProfile = {
  skinType: SkinType;
  goals: SkinGoal[];
  sensitivities: UserSensitivity[];
};

export type ProductVerdict = 'Great Match' | 'Use with Caution' | 'Not Ideal';
export type ConfidenceLevel = 'High' | 'Moderate' | 'Low';

export type ProductAnalysis = {
  product: Product;
  safetyScore: number;
  skinMatchScore: number;
  effectivenessScore: number;
  verdict: ProductVerdict;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  personalizedSummary: string;
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
  sourceLabel?: string;
};

export type SavedAnalysisStatus = 'Saved' | 'Needs review';

export type SavedAnalysis = {
  id: string;
  fingerprint: string;
  createdAt: string;
  productName: string;
  brand: string;
  category: string;
  imageUrl?: string;
  imagePlaceholder?: string;
  sourceLabel?: string;
  verdict: ProductVerdict;
  status: SavedAnalysisStatus;
  overallScore: number;
  safetyScore: number;
  skinMatchScore: number;
  effectivenessScore: number;
  confidenceLevel?: ConfidenceLevel;
  confidenceScore?: number;
  personalizedSummary?: string;
  summary: string;
  explanation: string;
  whyItMatches: string[];
  possibleConcerns: string[];
  recommendedFor: string[];
  matchedIngredients: Ingredient[];
  unknownIngredients: string[];
  rawInput: string;
};

export type ProductCatalogEntry = {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredientList: string;
  barcode?: string;
  imageUrl?: string;
  imagePlaceholder?: string;
};

export type ProductSearchResponse = {
  query: string;
  status: 'empty' | 'found' | 'not_found' | 'missing_ingredients';
  source: 'local' | 'stored' | 'external';
  results: ProductCatalogEntry[];
  message?: string;
};

export type BarcodeLookupResponse = {
  barcode: string;
  status: 'found' | 'missing_ingredients' | 'not_found' | 'invalid_barcode' | 'error';
  source: 'local' | 'stored' | 'external';
  results: ProductCatalogEntry[];
  message?: string;
};

export type UserPlan = 'free' | 'premium';

export type PlanState = {
  plan: UserPlan;
  analysesUsed: number;
  usageDate: string;
};

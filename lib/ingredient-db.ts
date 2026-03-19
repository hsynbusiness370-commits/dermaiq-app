import { Ingredient } from './types';

const ingredientCatalog: Record<string, Ingredient> = {
  Niacinamide: {
    name: 'Niacinamide',
    comedogenicRating: 0,
    irritationRisk: 'low',
    benefits: ['brightening', 'oil-control', 'barrier-support', 'anti-aging'],
    concerns: [],
  },
  'Hyaluronic Acid': {
    name: 'Hyaluronic Acid',
    comedogenicRating: 0,
    irritationRisk: 'low',
    benefits: ['hydration', 'soothing', 'barrier-support'],
    concerns: [],
  },
  'Salicylic Acid': {
    name: 'Salicylic Acid',
    comedogenicRating: 0,
    irritationRisk: 'medium',
    benefits: ['anti-acne', 'oil-control', 'exfoliation', 'texture-refining'],
    concerns: ['dryness', 'irritation'],
  },
  Retinol: {
    name: 'Retinol',
    comedogenicRating: 0,
    irritationRisk: 'high',
    benefits: ['anti-aging', 'texture-refining', 'brightening'],
    concerns: ['irritation', 'dryness', 'photosensitivity'],
  },
  Fragrance: {
    name: 'Fragrance',
    comedogenicRating: 1,
    irritationRisk: 'high',
    benefits: [],
    concerns: ['irritation', 'sensitization'],
  },
  'Alcohol Denat': {
    name: 'Alcohol Denat',
    comedogenicRating: 0,
    irritationRisk: 'high',
    benefits: ['texture-refining'],
    concerns: ['dryness', 'barrier stress', 'irritation'],
  },
  'Ceramide NP': {
    name: 'Ceramide NP',
    comedogenicRating: 0,
    irritationRisk: 'low',
    benefits: ['barrier-support', 'hydration', 'soothing'],
    concerns: [],
  },
  Glycerin: {
    name: 'Glycerin',
    comedogenicRating: 0,
    irritationRisk: 'low',
    benefits: ['hydration', 'barrier-support'],
    concerns: [],
  },
  'Vitamin C': {
    name: 'Vitamin C',
    comedogenicRating: 0,
    irritationRisk: 'medium',
    benefits: ['brightening', 'antioxidant', 'anti-aging'],
    concerns: ['irritation'],
  },
  'Benzoyl Peroxide': {
    name: 'Benzoyl Peroxide',
    comedogenicRating: 0,
    irritationRisk: 'high',
    benefits: ['anti-acne'],
    concerns: ['dryness', 'irritation'],
  },
  Squalane: {
    name: 'Squalane',
    comedogenicRating: 1,
    irritationRisk: 'low',
    benefits: ['hydration', 'barrier-support', 'soothing'],
    concerns: [],
  },
  'Shea Butter': {
    name: 'Shea Butter',
    comedogenicRating: 3,
    irritationRisk: 'low',
    benefits: ['hydration', 'soothing', 'barrier-support'],
    concerns: ['pore clogging'],
  },
  'Tea Tree Oil': {
    name: 'Tea Tree Oil',
    comedogenicRating: 1,
    irritationRisk: 'medium',
    benefits: ['anti-acne', 'oil-control'],
    concerns: ['irritation', 'sensitization'],
  },
  'Zinc PCA': {
    name: 'Zinc PCA',
    comedogenicRating: 0,
    irritationRisk: 'low',
    benefits: ['oil-control', 'anti-acne', 'soothing'],
    concerns: [],
  },
  Panthenol: {
    name: 'Panthenol',
    comedogenicRating: 0,
    irritationRisk: 'low',
    benefits: ['soothing', 'hydration', 'barrier-support'],
    concerns: [],
  },
};

export const ingredientDb = Object.values(ingredientCatalog);
const ingredientAliases: Record<string, string> = {
  'vitamin b3': 'Niacinamide',
  'nicotinamide': 'Niacinamide',
  'sodium hyaluronate': 'Hyaluronic Acid',
  hyaluronate: 'Hyaluronic Acid',
  parfum: 'Fragrance',
  perfume: 'Fragrance',
  glycerine: 'Glycerin',
};

export function normalizeIngredientName(value: string) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[./]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const ingredientLookup = new Map<string, Ingredient>(
  ingredientDb.map((ingredient) => [normalizeIngredientName(ingredient.name), ingredient])
);

for (const [alias, ingredientName] of Object.entries(ingredientAliases)) {
  const ingredient = ingredientCatalog[ingredientName];

  if (ingredient) {
    ingredientLookup.set(normalizeIngredientName(alias), ingredient);
  }
}

export function findIngredient(name: string) {
  return ingredientLookup.get(normalizeIngredientName(name));
}

export function getIngredient(name: string): Ingredient {
  const ingredient = findIngredient(name);

  if (!ingredient) {
    throw new Error(`Unknown ingredient: ${name}`);
  }

  return ingredient;
}

export function resolveIngredients(names: string[]): Ingredient[] {
  return names.map(getIngredient);
}

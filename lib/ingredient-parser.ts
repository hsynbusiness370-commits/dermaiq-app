import { findIngredient, normalizeIngredientName } from './ingredient-db';
import { Ingredient, ParsedIngredientResult } from './types';

export function parseIngredientList(rawIngredientText: string): ParsedIngredientResult {
  const tokens = rawIngredientText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const matchedMap = new Map<string, Ingredient>();
  const unknownMap = new Map<string, string>();

  tokens.forEach((token) => {
    const normalized = normalizeIngredientName(token);
    const ingredient = findIngredient(token);

    if (ingredient) {
      matchedMap.set(ingredient.name, ingredient);
      return;
    }

    unknownMap.set(normalized, token);
  });

  return {
    matchedIngredients: [...matchedMap.values()],
    unknownIngredients: [...unknownMap.values()],
  };
}

export const sampleIngredientInput =
  'Niacinamide, Hyaluronic Acid, Fragrance, Alcohol Denat, Panthenol';

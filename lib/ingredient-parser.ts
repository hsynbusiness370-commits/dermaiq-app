import { ingredientDb } from './ingredient-db';
import { ParsedIngredientResult } from './types';

function normalizeIngredientName(value: string) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[.]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const ingredientLookup = new Map(
  ingredientDb.map((ingredient) => [normalizeIngredientName(ingredient.name), ingredient])
);

export function parseIngredientList(rawIngredientText: string): ParsedIngredientResult {
  const tokens = rawIngredientText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const matchedMap = new Map<string, (typeof ingredientDb)[number]>();
  const unknownMap = new Map<string, string>();

  tokens.forEach((token) => {
    const normalized = normalizeIngredientName(token);
    const ingredient = ingredientLookup.get(normalized);

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

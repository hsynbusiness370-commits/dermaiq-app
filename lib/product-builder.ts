import { Product } from './types';

function inferCategory(ingredientCount: number) {
  return ingredientCount > 0 ? 'serum' : 'unknown';
}

export function buildManualProduct(ingredientNames: Product['ingredients']): Product {
  return {
    id: `manual-${Date.now()}`,
    name: 'Custom Product',
    brand: 'Manual Analysis',
    category: inferCategory(ingredientNames.length),
    ingredients: ingredientNames,
  };
}

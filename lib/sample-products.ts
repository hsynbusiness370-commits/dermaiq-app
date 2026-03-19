import { resolveIngredients } from './ingredient-db';
import { Product } from './types';

export const sampleAnalysisProduct: Product = {
  id: 'product-radiance-reset-serum',
  name: 'Radiance Reset Serum',
  brand: 'Luma Skin Lab',
  category: 'Brightening serum',
  ingredients: resolveIngredients([
    'Niacinamide',
    'Hyaluronic Acid',
    'Vitamin C',
    'Glycerin',
    'Panthenol',
    'Fragrance',
  ]),
};

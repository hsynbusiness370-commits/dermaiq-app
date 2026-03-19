import { ProductCatalogEntry } from './types';

type ExternalRawProduct = {
  externalId: string;
  productTitle?: string;
  brandName?: string;
  categoryName?: string;
  ingredientsText?: string | null;
  barcode?: string;
  imageUrl?: string;
};

const mockExternalProducts: ExternalRawProduct[] = [
  {
    externalId: 'ext-1',
    productTitle: 'Peptide Recovery Serum',
    brandName: 'Nova Derm',
    categoryName: 'Serum',
    ingredientsText: 'Niacinamide, Panthenol, Glycerin, Hyaluronic Acid, Squalane',
    barcode: '900000111001',
    imageUrl: 'external-peptide-serum',
  },
  {
    externalId: 'ext-2',
    productTitle: 'Retinol Renewal Night Serum',
    brandName: 'Atelier Skin',
    categoryName: 'Serum',
    ingredientsText: 'Retinol, Panthenol, Glycerin, Fragrance',
    barcode: '900000111002',
    imageUrl: 'external-retinol-serum',
  },
  {
    externalId: 'ext-3',
    productTitle: 'Cloud Milk Essence',
    brandName: 'Velour Beauty',
    categoryName: 'Essence',
    ingredientsText: null,
    barcode: '900000111003',
    imageUrl: 'external-cloud-essence',
  },
];

function normalizeValue(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

function scoreExternalProduct(product: ExternalRawProduct, query: string) {
  const normalizedQuery = normalizeValue(query);
  const title = normalizeValue(product.productTitle ?? '');
  const brand = normalizeValue(product.brandName ?? '');
  const combined = `${brand} ${title}`.trim();

  if (title === normalizedQuery) {
    return 100;
  }

  if (combined === normalizedQuery) {
    return 96;
  }

  if (title.startsWith(normalizedQuery)) {
    return 88;
  }

  if (combined.startsWith(normalizedQuery)) {
    return 82;
  }

  if (title.includes(normalizedQuery)) {
    return 74;
  }

  if (combined.includes(normalizedQuery)) {
    return 68;
  }

  const terms = normalizedQuery.split(' ');
  const matchedTerms = terms.filter((term) => title.includes(term) || brand.includes(term)).length;

  if (matchedTerms === terms.length && matchedTerms > 0) {
    return 60 + matchedTerms;
  }

  return 0;
}

export async function fetchExternalProducts(query: string): Promise<ExternalRawProduct[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return mockExternalProducts
    .map((product) => ({
      product,
      score: scoreExternalProduct(product, trimmedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.product)
    .slice(0, 5);
}

export function normalizeExternalProduct(rawData: ExternalRawProduct): ProductCatalogEntry | null {
  const productName = rawData.productTitle?.trim();
  const brand = rawData.brandName?.trim();
  const ingredientList = rawData.ingredientsText?.trim();

  if (!productName || !brand || !ingredientList) {
    return null;
  }

  return {
    id: `external-${rawData.externalId}`,
    name: productName,
    brand,
    category: rawData.categoryName?.trim() || 'Unknown',
    ingredientList,
    barcode: rawData.barcode,
    imagePlaceholder: rawData.imageUrl,
  };
}

export function getExternalProductDisplayName(rawData: ExternalRawProduct) {
  return rawData.productTitle?.trim() || 'this product';
}

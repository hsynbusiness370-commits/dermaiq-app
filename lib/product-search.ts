import { productCatalog } from './product-catalog';
import { ProductCatalogEntry, ProductSearchResponse } from './types';

function normalizeValue(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

function getSearchScore(product: ProductCatalogEntry, query: string) {
  const normalizedQuery = normalizeValue(query);
  const normalizedName = normalizeValue(product.name);
  const normalizedBrand = normalizeValue(product.brand);
  const combined = `${normalizedBrand} ${normalizedName}`;

  if (normalizedName === normalizedQuery) {
    return 100;
  }

  if (combined === normalizedQuery) {
    return 96;
  }

  if (normalizedName.startsWith(normalizedQuery)) {
    return 88;
  }

  if (combined.startsWith(normalizedQuery)) {
    return 82;
  }

  if (normalizedName.includes(normalizedQuery)) {
    return 74;
  }

  if (combined.includes(normalizedQuery)) {
    return 68;
  }

  const queryTerms = normalizedQuery.split(' ');
  const matchedTerms = queryTerms.filter(
    (term) => normalizedName.includes(term) || normalizedBrand.includes(term)
  ).length;

  if (matchedTerms === queryTerms.length && matchedTerms > 0) {
    return 60 + matchedTerms;
  }

  return 0;
}

function searchLocalCatalog(query: string) {
  return productCatalog
    .map((product) => ({
      product,
      score: getSearchScore(product, query),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.product)
    .slice(0, 5);
}

export async function searchProducts(query: string): Promise<ProductSearchResponse> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      query,
      status: 'empty',
      source: 'local',
      results: [],
    };
  }

  const localResults = searchLocalCatalog(trimmedQuery);

  if (localResults.length > 0) {
    return {
      query: trimmedQuery,
      status: 'found',
      source: 'local',
      results: localResults,
    };
  }

  return {
    query: trimmedQuery,
    status: 'not_found',
    source: 'local',
    results: [],
  };
}

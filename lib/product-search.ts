import { fetchExternalProducts, getExternalProductDisplayName, normalizeExternalProduct } from './external-product-fetch';
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

  let externalRawResults = [] as Awaited<ReturnType<typeof fetchExternalProducts>>;

  try {
    externalRawResults = await fetchExternalProducts(trimmedQuery);
  } catch {
    return {
      query: trimmedQuery,
      status: 'not_found',
      source: 'external',
      results: [],
      message: 'We couldn’t reach external product data right now. Try another search or paste ingredients manually.',
    };
  }

  const externalResults = externalRawResults
    .map(normalizeExternalProduct)
    .filter((result): result is ProductCatalogEntry => Boolean(result));

  if (externalResults.length > 0) {
    return {
      query: trimmedQuery,
      status: 'found',
      source: 'external',
      results: externalResults,
    };
  }

  if (externalRawResults.length > 0) {
    return {
      query: trimmedQuery,
      status: 'missing_ingredients',
      source: 'external',
      results: [],
      message: `We found ${getExternalProductDisplayName(
        externalRawResults[0]
      )}, but couldn’t extract ingredients yet.`,
    };
  }

  return {
    query: trimmedQuery,
    status: 'not_found',
    source: 'external',
    results: [],
    message: 'We couldn’t find that product yet. Try another product name or paste ingredients manually.',
  };
}

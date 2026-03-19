import { ProductCatalogEntry } from './types';

type ExternalRawProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  ingredients_text?: string | null;
  ingredients_text_en?: string | null;
  image_url?: string;
};

type OpenBeautyFactsResponse = {
  products?: ExternalRawProduct[];
};

type OpenBeautyFactsBarcodeResponse = {
  status?: number;
  product?: ExternalRawProduct;
};

const EXTERNAL_SEARCH_ENDPOINT = 'https://world.openbeautyfacts.org/cgi/search.pl';
const EXTERNAL_BARCODE_ENDPOINT = 'https://world.openbeautyfacts.org/api/v2/product';
const externalProductCache = new Map<string, ExternalRawProduct[]>();
const externalBarcodeCache = new Map<string, ExternalRawProduct | null>();

function normalizeValue(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

function scoreExternalProduct(product: ExternalRawProduct, query: string) {
  const normalizedQuery = normalizeValue(query);
  const title = normalizeValue(product.product_name ?? '');
  const brand = normalizeValue(product.brands ?? '');
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

  const cacheKey = normalizeValue(trimmedQuery);
  const cachedResults = externalProductCache.get(cacheKey);

  if (cachedResults) {
    return cachedResults;
  }

  const url = new URL(EXTERNAL_SEARCH_ENDPOINT);
  url.search = new URLSearchParams({
    search_terms: trimmedQuery,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '8',
    fields: 'product_name,brands,categories,ingredients_text,ingredients_text_en,code,image_url',
  }).toString();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Open Beauty Facts request failed with status ${response.status}`);
    }

    const data = (await response.json()) as OpenBeautyFactsResponse;
    const fetchedResults = (data.products ?? [])
      .map((product) => ({
        product,
        score: scoreExternalProduct(product, trimmedQuery),
      }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.product)
      .slice(0, 5);

    externalProductCache.set(cacheKey, fetchedResults);
    return fetchedResults;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchExternalProductByBarcode(barcode: string): Promise<ExternalRawProduct | null> {
  const trimmedBarcode = barcode.trim();

  if (!trimmedBarcode) {
    return null;
  }

  const cachedResult = externalBarcodeCache.get(trimmedBarcode);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const url = new URL(`${EXTERNAL_BARCODE_ENDPOINT}/${trimmedBarcode}.json`);
  url.search = new URLSearchParams({
    fields: 'product_name,brands,categories,ingredients_text,ingredients_text_en,code,image_url',
  }).toString();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Open Beauty Facts barcode request failed with status ${response.status}`);
    }

    const data = (await response.json()) as OpenBeautyFactsBarcodeResponse;
    const result = data.status === 1 && data.product ? data.product : null;
    externalBarcodeCache.set(trimmedBarcode, result);
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

export function normalizeExternalProduct(rawData: ExternalRawProduct): ProductCatalogEntry | null {
  const productName = rawData.product_name?.trim();
  const brand = rawData.brands
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)[0];
  const category = rawData.categories
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)[0];
  const ingredientList = (rawData.ingredients_text_en || rawData.ingredients_text || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!productName || !brand || !ingredientList || ingredientList.length < 5) {
    return null;
  }

  return {
    id: rawData.code ? `external-${rawData.code}` : `external-${normalizeValue(`${brand}-${productName}`)}`,
    name: productName,
    brand,
    category: category || 'Unknown',
    ingredientList,
    barcode: rawData.code,
    imagePlaceholder: rawData.image_url,
  };
}

export function getExternalProductDisplayName(rawData: ExternalRawProduct) {
  return rawData.product_name?.trim() || 'this product';
}

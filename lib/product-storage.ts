import AsyncStorage from '@react-native-async-storage/async-storage';

import { ProductCatalogEntry } from './types';

const STORED_PRODUCTS_KEY = '@dermaiq/stored-products';
const MAX_STORED_PRODUCTS = 150;

let productCache: ProductCatalogEntry[] | null = null;

function normalizeValue(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

function createProductKey(product: ProductCatalogEntry) {
  return `${normalizeValue(product.brand)}::${normalizeValue(product.name)}`;
}

function rankProducts(products: ProductCatalogEntry[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    const key = createProductKey(product);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function persistProducts(products: ProductCatalogEntry[]) {
  const boundedProducts = rankProducts(products).slice(0, MAX_STORED_PRODUCTS);
  productCache = boundedProducts;
  await AsyncStorage.setItem(STORED_PRODUCTS_KEY, JSON.stringify(boundedProducts));
  return boundedProducts;
}

export async function getStoredProducts() {
  if (productCache) {
    return productCache;
  }

  const rawValue = await AsyncStorage.getItem(STORED_PRODUCTS_KEY);

  if (!rawValue) {
    productCache = [];
    return productCache;
  }

  try {
    const parsed = JSON.parse(rawValue) as ProductCatalogEntry[];
    productCache = rankProducts(parsed).slice(0, MAX_STORED_PRODUCTS);
    return productCache;
  } catch {
    productCache = [];
    return productCache;
  }
}

export async function saveProduct(product: ProductCatalogEntry) {
  const existingProducts = await getStoredProducts();
  const productKey = createProductKey(product);
  const withoutDuplicate = existingProducts.filter((storedProduct) => createProductKey(storedProduct) !== productKey);
  return persistProducts([product, ...withoutDuplicate]);
}

export async function saveProducts(products: ProductCatalogEntry[]) {
  const existingProducts = await getStoredProducts();
  const mergedProducts = [...products, ...existingProducts];
  return persistProducts(mergedProducts);
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

export async function searchStoredProducts(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [] as ProductCatalogEntry[];
  }

  const storedProducts = await getStoredProducts();

  return storedProducts
    .map((product) => ({
      product,
      score: getSearchScore(product, trimmedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.product)
    .slice(0, 5);
}

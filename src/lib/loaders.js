import { publicFetch } from '../utils/helpers';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = (key) => {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
};

// Helper function to get cached data or fetch new data
const getCachedData = async (key, fetchFn) => {
  if (isCacheValid(key)) {
    return cache.get(key).data;
  }
  
  try {
    const data = await fetchFn();
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  } catch (error) {
    console.error(`Error fetching data for key ${key}:`, error);
    throw error;
  }
};

// Categories loader
export const getCategories = async () => {
  return getCachedData('categories', async () => {
    const response = await publicFetch.get('/category/all-categories');
    return response.data.data || [];
  });
};

// Products loader
export const getProducts = async (limit = 20) => {
  return getCachedData(`products_${limit}`, async () => {
    const response = await publicFetch.get('/product/all-products');
    const products = response.data.data || [];
    return products.slice(0, limit);
  });
};

// Single product loader
export const getProduct = async (productId) => {
  return getCachedData(`product_${productId}`, async () => {
    const response = await publicFetch.get(`/product/${productId}`);
    return response.data.data;
  });
};

// Homepage data loader (combines categories and products)
export const getHomepageData = async () => {
  return getCachedData('homepage', async () => {
    try {
      const [categories, products] = await Promise.all([
        getCategories(),
        getProducts(20)
      ]);
      
      return {
        categories,
        products
      };
    } catch (error) {
      console.error('Error loading homepage data:', error);
      return {
        categories: [],
        products: []
      };
    }
  });
};

// Product page data loader
export const getProductPageData = async (productId, variantId = null) => {
  return getCachedData(`product_page_${productId}_${variantId}`, async () => {
    try {
      const product = await getProduct(productId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Find the selected variant
      let selectedVariant = null;
      if (variantId && product.variants?.length > 0) {
        selectedVariant = product.variants.find(v => v.variantId === variantId);
      }
      
      if (!selectedVariant && product.variants?.length > 0) {
        selectedVariant = product.variants[0];
      }

      return {
        product,
        selectedVariant,
        variantId: selectedVariant?.variantId || null
      };
    } catch (error) {
      console.error('Error loading product page data:', error);
      throw error;
    }
  });
};

// Clear cache function (useful for development)
export const clearCache = () => {
  cache.clear();
};

// Clear specific cache entry
export const clearCacheEntry = (key) => {
  cache.delete(key);
};

// Get cache stats
export const getCacheStats = () => {
  const entries = Array.from(cache.entries());
  return {
    totalEntries: entries.length,
    entries: entries.map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      isValid: isCacheValid(key)
    }))
  };
};

import { ApiService } from '../../app/lib/api-service';

// Cache for API responses
const apiCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Debounce function for API calls
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<unknown> {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>): Promise<unknown> => {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          resolve(error);
        }
      }, wait);
    });
  };
}

// Optimized API service with caching
export class OptimizedApiService {
  private static instance: OptimizedApiService;
  private pendingRequests = new Map<string, Promise<unknown>>();

  static getInstance(): OptimizedApiService {
    if (!OptimizedApiService.instance) {
      OptimizedApiService.instance = new OptimizedApiService();
    }
    return OptimizedApiService.instance;
  }

  // Get cached data if available and not expired
  private getCachedData(key: string): unknown | null {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    if (cached) {
      apiCache.delete(key);
    }
    return null;
  }

  // Set cache data
  private setCachedData(key: string, data: unknown, ttl: number = CACHE_TTL): void {
    apiCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Clear expired cache entries
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of apiCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        apiCache.delete(key);
      }
    }
  }

  // Optimized POST method with caching and deduplication
  async post<T>(endpoint: string, data: unknown, options?: { 
    cache?: boolean; 
    ttl?: number; 
    skipCache?: boolean;
  }): Promise<T> {
    const cacheKey = `${endpoint}-${JSON.stringify(data)}`;
    
    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)! as T;
    }

    // Check cache if enabled
    if (options?.cache !== false && !options?.skipCache) {
      const cachedData = this.getCachedData(cacheKey);
      if (cachedData) {
        return cachedData as T;
      }
    }

    // Cleanup expired cache entries
    this.cleanupCache();

    // Create new request
    const requestPromise = ApiService.post(endpoint, data)
      .then((response: unknown) => {
        // Cache successful responses
        if (options?.cache !== false) {
          this.setCachedData(cacheKey, response, options?.ttl);
        }
        this.pendingRequests.delete(cacheKey);
        return response as T;
      })
      .catch((error: Error) => {
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // Clear all cache
  clearCache(): void {
    apiCache.clear();
  }

  // Clear specific cache entry
  clearCacheEntry(pattern: string): void {
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: apiCache.size,
      keys: Array.from(apiCache.keys())
    };
  }
}

// Debounced version for rapid successive calls
export const debouncedApiCall = debounce(
  (...args: unknown[]) => {
    const [endpoint, data] = args as [string, unknown];
    return OptimizedApiService.getInstance().post(endpoint, data);
  },
  300
);

export default OptimizedApiService.getInstance();


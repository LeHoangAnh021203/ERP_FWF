import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ApiService } from '../lib/api-service';

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache store
const cache = new Map<string, CacheItem<unknown>>();

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEBOUNCE_DELAY = 300; // 300ms
const RETRY_DELAYS = [1000, 2000, 5000]; // Exponential backoff
const MAX_RETRIES = 3;

interface UseOptimizedApiDataOptions {
  url: string;
  fromDate: string;
  toDate: string;
  delay?: number;
  extraBody?: Record<string, unknown>;
  forceMethod?: "GET" | "POST";
  cacheKey?: string;
  cacheDuration?: number;
  debounceDelay?: number;
  retryCount?: number;

  staleWhileRevalidate?: boolean;
}

interface UseOptimizedApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isStale: boolean;
}

export function useOptimizedApiData<T>({
  url,
  fromDate,
  toDate,
  delay = 0,
  extraBody,
  forceMethod,
  cacheKey,
  cacheDuration = CACHE_DURATION,
  debounceDelay = DEBOUNCE_DELAY,
  retryCount = MAX_RETRIES,
  staleWhileRevalidate = true,
}: UseOptimizedApiDataOptions): UseOptimizedApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRetryCount = useRef(0);
  const lastRequestTimeRef = useRef(0);

  // Generate cache key
  const finalCacheKey = useMemo(() => {
    if (cacheKey) return cacheKey;
    const params = JSON.stringify({ url, fromDate, toDate, extraBody, forceMethod });
    return `api_${btoa(params).slice(0, 50)}`;
  }, [cacheKey, url, fromDate, toDate, extraBody, forceMethod]);

  // Check cache
  const getCachedData = useCallback((): T | null => {
    const cached = cache.get(finalCacheKey);
    if (!cached) return null;
    
    const now = Date.now();
    if (now > cached.expiresAt) {
      cache.delete(finalCacheKey);
      return null;
    }
    
    return cached.data as T;
  }, [finalCacheKey]);

  // Set cache
  const setCachedData = useCallback((newData: T) => {
    const now = Date.now();
    cache.set(finalCacheKey, {
      data: newData,
      timestamp: now,
      expiresAt: now + cacheDuration,
    });
  }, [finalCacheKey, cacheDuration]);

  // Fetch data function
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Add delay for rate limiting
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Extract endpoint
      const endpoint = url
        .replace("/api/proxy", "")
        .replace("/api", "")
        .replace(/^\/+/, "");

      const hasQuery = url.includes("?");
      const finalEndpoint = hasQuery
        ? `${endpoint}&fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}`
        : endpoint;

      const method: "GET" | "POST" = forceMethod ?? (hasQuery ? "GET" : "POST");
      
      const result = await (method === "GET"
        ? ApiService.get(finalEndpoint)
        : ApiService.post(endpoint, {
            fromDate,
            toDate,
            ...(extraBody || {}),
          }));

      setData(result as T);
      setCachedData(result as T);
      setLoading(false);
      setError(null);
      setIsStale(false);
      currentRetryCount.current = 0;

    } catch (err: unknown) {
      const error = err as Error;

      // Don't process aborted requests
      if (error.name === "AbortError") {
        return;
      }

      // Handle rate limiting
      if (error.message.includes("429") || error.message.includes("Too Many Requests")) {
        setError("API đang quá tải, vui lòng thử lại sau");
        setLoading(false);
        return;
      }

      // Retry logic with exponential backoff
      if (currentRetryCount.current < retryCount) {
        const retryDelay = RETRY_DELAYS[currentRetryCount.current] || 5000;
        currentRetryCount.current++;
        
        retryTimeoutRef.current = setTimeout(() => {
          fetchData();
        }, retryDelay);
        return;
      }

      setError(error.message);
      setLoading(false);
    }
  }, [url, fromDate, toDate, delay, extraBody, forceMethod, retryCount, setCachedData]);

  // Debounced fetch
  const debouncedFetch = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchData();
    }, debounceDelay);
  }, [fetchData, debounceDelay]);

  // Main effect
  useEffect(() => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      setIsStale(true);
      
      // If stale-while-revalidate is enabled, fetch fresh data in background
      if (staleWhileRevalidate) {
        setLoading(true);
        fetchData();
      }
      return;
    }

    // Prevent rapid successive requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    const minInterval = 1000; // 1 second minimum between requests

    if (timeSinceLastRequest < minInterval) {
      const remainingDelay = minInterval - timeSinceLastRequest;
      setTimeout(() => {
        debouncedFetch();
      }, remainingDelay);
      return;
    }

    lastRequestTimeRef.current = now;
    setLoading(true);
    setError(null);
    debouncedFetch();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [url, fromDate, toDate, extraBody, forceMethod, getCachedData, debouncedFetch, staleWhileRevalidate, fetchData]);

  // Manual refetch function
  const refetch = useCallback(() => {
    currentRetryCount.current = 0;
    setLoading(true);
    setError(null);
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}

// Utility function to clear cache
export const clearApiCache = (pattern?: string) => {
  if (pattern) {
    for (const cacheKey of cache.keys()) {
      if (cacheKey.includes(pattern)) {
        cache.delete(cacheKey);
      }
    }
  } else {
    cache.clear();
  }
};

// Utility function to get cache stats
export const getCacheStats = () => {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  let totalSize = 0;

  for (const [, item] of cache.entries()) {
    totalSize += JSON.stringify(item.data).length;
    if (now > item.expiresAt) {
      expiredEntries++;
    } else {
      validEntries++;
    }
  }

  return {                                         
    totalEntries: cache.size,
    validEntries,
    expiredEntries,
    totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
  };
};

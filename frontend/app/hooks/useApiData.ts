import { useState, useEffect } from "react";
import { ApiService } from "@/app/lib/api-service";

// Debounce function để tránh gọi API quá nhiều
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const API_BASE_URL = "/api/proxy";

export function useApiData<T>(
  endpoint: string, 
  fromDate: string, 
  toDate: string, 
  priority: number = 0
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce dates để tránh gọi API quá nhiều khi user thay đổi date
  const debouncedFromDate = useDebounce(fromDate, 300);
  const debouncedToDate = useDebounce(toDate, 300);

  useEffect(() => {
    // Thêm delay dựa trên priority để tránh rate limiting
    const delay = priority * 100; // 0ms, 100ms, 200ms, etc.
    
    const timeoutId = setTimeout(() => {
      setLoading(true);
      setError(null);

      // Build full URL like in orders page
      const fullUrl = `${API_BASE_URL}/api/${endpoint}`;
      
      // Extract endpoint from full URL - remove /api/proxy prefix
      const extractedEndpoint = fullUrl
        .replace(API_BASE_URL, "")
        .replace("/api", "")
        .replace(/^\/+/, "");
      
      console.log("🔍 Debug - Original URL:", fullUrl);
      console.log("🔍 Debug - Extracted Endpoint:", extractedEndpoint);
      console.log("🔍 Debug - Date range:", { fromDate: debouncedFromDate, toDate: debouncedToDate });

      // Use POST method like orders page
      ApiService.post(extractedEndpoint, { 
        fromDate: debouncedFromDate, 
        toDate: debouncedToDate 
      })
        .then((response: unknown) => {
          console.log("✅ API Response for", endpoint, ":", response);
          setData(response as T);
          setLoading(false);
        })
        .catch((err: Error) => {
          console.error("❌ API Error for", endpoint, ":", err);
          setError(err.message);
          setLoading(false);
        });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [endpoint, debouncedFromDate, debouncedToDate, priority]);

  return { data, loading, error };
}
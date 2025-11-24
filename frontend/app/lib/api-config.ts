/**
 * API Configuration Utility
 * Tự động detect environment và port để tạo API URLs
 */

export function getApiBaseUrl(): string {
  // Server-side rendering (SSR)
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://fb-network-demo.vercel.app";
  }

  // Client-side
  return window.location.origin;
}

export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
}

// Common API endpoints
export const API_ENDPOINTS = {
  QUICK_ACTIONS: '/api/dashboard/quick-actions',
  PROXY: '/api/proxy',
  AI_GENERATE: '/api/ai/generate',
  HEALTH: '/api/health',
} as const;

// Helper function to get full API URLs
export function getQuickActionsUrl(): string {
  return getApiUrl(API_ENDPOINTS.QUICK_ACTIONS);
}

export function getProxyUrl(endpoint: string): string {
  return getApiUrl(`${API_ENDPOINTS.PROXY}/${endpoint}`);
}

// Authentication configuration
function normalizeApiPrefix(input?: string): string {
  if (!input) return ''
  // Remove surrounding quotes and whitespace
  const stripped = input.replace(/^['"]+|['"]+$/g, '').trim()
  if (!stripped) return ''
  // Remove leading/trailing slashes then prepend one
  const noSlashes = stripped.replace(/^\/+|\/+$/g, '')
  return noSlashes ? `/${noSlashes}` : ''
}

export const AUTH_CONFIG = {
  // Set to true to force mock mode, false to use API when available
  FORCE_MOCK_MODE: false,
  
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.facewashfox.com',
  // Optional API prefix (e.g. "/api"). Defaults to "/api" if not set, empty string if explicitly set to empty.
  // If env var is not set at all, use default "/api". If set to empty string or empty quotes, use "".
  API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX === undefined 
    ? '/api'  // Default to /api if not set (like local)
    : normalizeApiPrefix(process.env.NEXT_PUBLIC_API_PREFIX),
  
  // Mock users for development/testing
  MOCK_USERS: {
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
    manager: { username: 'manager', password: 'manager123', role: 'manager' },
    staff: { username: 'staff', password: 'staff123', role: 'staff' },
    demo: { username: 'demo', password: 'demo123', role: 'manager' }
  }
}

// Helper function to check if we should use mock mode
export function shouldUseMockMode(): boolean {
  // Never use mock in production (Vercel) to avoid silent 401
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  // Force mock mode if explicitly set
  if (AUTH_CONFIG.FORCE_MOCK_MODE) {
    return true;
  }
  
  // In non-production, use mock if no API URL is configured
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    return true;
  }
  
  // In development, allow toggling via USE_MOCK_AUTH
  if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_AUTH === 'true') {
    return true;
  }
  
  return false;
}

// Helper function to get API endpoint
export function getApiEndpoint(path: string): string {
  const base = (AUTH_CONFIG.API_BASE_URL || '').replace(/\/+$/, '')
  const prefix = AUTH_CONFIG.API_PREFIX || ''
  const sanitizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${prefix}/${sanitizedPath}`
}

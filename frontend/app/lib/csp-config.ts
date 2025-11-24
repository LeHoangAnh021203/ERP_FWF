/**
 * Content Security Policy Configuration
 * Cấu hình CSP cho ứng dụng Face Wash Fox CRM
 */

export const CSP_CONFIG = {
  // Development environment - more permissive
  development: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com",
    'style-src': "'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com",
    'img-src': "'self' data: https: blob:",
    'media-src': "'self' data: blob:",
    'font-src': "'self' data: https:",
    'connect-src': "'self' https: wss:",
    'frame-ancestors': "'none'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
  },

  // Production environment - more restrictive
  production: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-eval' https://cdnjs.cloudflare.com https://api.mapbox.com",
    'style-src': "'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com",
    'img-src': "'self' data: https: blob:",
    'media-src': "'self' data: blob:",
    'font-src': "'self' data: https:",
    'connect-src': "'self' https: wss:",
    'frame-ancestors': "'none'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
  }
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(environment: 'development' | 'production' = 'development'): string {
  const config = CSP_CONFIG[environment];
  
  return Object.entries(config)
    .map(([directive, sources]) => {
      if (Array.isArray(sources)) {
        return `${directive} ${sources.join(' ')}`;
      }
      return `${directive} ${sources}`;
    })
    .join('; ');
}

/**
 * Get CSP configuration for current environment
 */
export function getCSPConfig(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return generateCSPHeader(isDevelopment ? 'development' : 'production');
}

/**
 * Map-specific CSP configuration
 * Cấu hình CSP riêng cho map components
 */
export const MAP_CSP_CONFIG = {
  // Leaflet + OpenStreetMap
  leaflet: {
    'script-src': "'self' 'unsafe-eval' https://cdnjs.cloudflare.com",
    'style-src': "'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    'img-src': "'self' data: https: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
    'connect-src': "'self' https: https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
  },

  // Mapbox GL JS
  mapbox: {
    'script-src': "'self' 'unsafe-eval' https://api.mapbox.com",
    'style-src': "'self' 'unsafe-inline' https://api.mapbox.com",
    'img-src': "'self' data: https: https://api.mapbox.com https://*.mapbox.com",
    'connect-src': "'self' https: https://api.mapbox.com https://*.mapbox.com",
  }
};

/**
 * Generate map-specific CSP
 */
export function generateMapCSP(mapType: 'leaflet' | 'mapbox'): string {
  // const baseConfig = getCSPConfig();
  // const mapConfig = MAP_CSP_CONFIG[mapType];
  
  // Merge base config with map-specific config
  // const mergedConfig = {
  //   ...CSP_CONFIG[process.env.NODE_ENV === 'development' ? 'development' : 'production'],
  //   ...mapConfig
  // };
  
  return generateCSPHeader(process.env.NODE_ENV === 'development' ? 'development' : 'production');
}

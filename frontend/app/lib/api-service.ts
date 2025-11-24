const API_BASE_URL = "/api/proxy"
import { TokenService } from './token-service'
import { AUTH_CONFIG } from './auth-config'

export class ApiService {
  static async get(endpoint: string, token?: string): Promise<unknown> {
    const validToken = token || await TokenService.getValidAccessToken()
    
    if (!validToken) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-expired'))
      }
      throw new Error('No valid token available')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`
    }

    // Retry on 429 with exponential backoff
    let attempt = 0
    const maxRetries = 3
    while (true) {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          console.log('Token expired; refresh disabled -> logout')
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth-expired'))
          }
          throw new Error('Authentication failed - please login again')
        }
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfter = response.headers.get('Retry-After')
          const delayMs = retryAfter ? Number(retryAfter) * 1000 : (2 ** attempt) * 500
          await new Promise(r => setTimeout(r, delayMs))
          attempt += 1
          continue
        }
        
        // Get error details from response
        let errorDetails = ''
        try {
          const errorText = await response.text()
          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText)
              errorDetails = errorJson.error || errorJson.message || errorText
            } catch {
              errorDetails = errorText
            }
          }
        } catch {
          // Ignore errors when reading response
        }
        
        const errorMessage = errorDetails 
          ? `GET request failed: ${response.status} - ${errorDetails}`
          : `GET request failed: ${response.status}`
        
        throw new Error(errorMessage)
      }

      return response.json()
    }
  }

  static async post(endpoint: string, data: unknown, token?: string): Promise<unknown> {
    const validToken = token || await TokenService.getValidAccessToken()
    
    if (!validToken) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-expired'))
      }
      throw new Error('No valid token available')
    }

    console.log('🔍 API Service Debug:')
    console.log('  - Endpoint:', endpoint)
    console.log('  - Token present:', !!validToken)
    console.log('  - Token length:', validToken.length)
    console.log('  - Token preview:', validToken.substring(0, 20) + '...')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`
    }
    
    console.log('🔍 Request Headers:', headers)

    // Retry on 429 with exponential backoff
    let attempt = 0
    const maxRetries = 3
    while (true) {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Get response body for debugging
          const errorText = await response.text()
          console.log('🔍 401 Error Response:', errorText)
          console.log('Token expired; refresh disabled -> logout')
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth-expired'))
          }
          throw new Error('Authentication failed - please login again')
        }
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfter = response.headers.get('Retry-After')
          const delayMs = retryAfter ? Number(retryAfter) * 1000 : (2 ** attempt) * 500
          await new Promise(r => setTimeout(r, delayMs))
          attempt += 1
          continue
        }
        throw new Error(`POST request failed: ${response.status}`)
      }

      return response.json()
    }
  }

  // Customer Sale APIs
  static async getCustomerSourceTrend(token?: string) {
    return this.post('customer-sale/customer-source-trend', {}, token)
  }

  static async getAppDownloadStatus(token?: string) {
    return this.post('customer-sale/app-download-status', {}, token)
  }

  static async getGenderRevenue(token?: string) {
    return this.post('customer-sale/gender-revenue', {}, token)
  }

  static async getFacilityHourService(token?: string) {
    return this.post('customer-sale/facility-hour-service', {}, token)
  }

  static async getAppDownloadPieChart(token?: string) {
    return this.post('customer-sale/app-download-pieChart', {}, token)
  }

  // Dashboard APIs
  static async getDashboardStats(token?: string) {
    return this.get('dashboard/stats', token)
  }

  static async getDashboardRevenue(token?: string) {
    return this.get('dashboard/revenue', token)
  }

  static async getDashboardActivity(token?: string) {
    return this.get('dashboard/activity', token)
  }

  static async getDashboardInsights(token?: string) {
    return this.get('dashboard/insights', token)
  }

  // Client-side direct fetch (bypasses Vercel proxy timeout)
  // Use this for long-running API calls from client components
  // Falls back to proxy if direct fetch fails (CORS issues)
  static async getDirect(endpoint: string, token?: string): Promise<unknown> {
    // Only works on client-side
    if (typeof window === 'undefined') {
      throw new Error('getDirect can only be used on client-side')
    }

    const validToken = token || await TokenService.getValidAccessToken()
    
    if (!validToken) {
      window.dispatchEvent(new CustomEvent('auth-expired'))
      throw new Error('No valid token available')
    }

    // Build direct backend URL (bypass proxy)
    const base = (AUTH_CONFIG.API_BASE_URL || '').replace(/\/+$/, '')
    const prefix = AUTH_CONFIG.API_PREFIX || ''
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const directUrl = `${base}${prefix}/${cleanEndpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`
    }

    // Try direct fetch first (bypasses Vercel timeout)
    try {
      console.log('[ApiService] Attempting direct fetch to:', directUrl)
      
      const response = await fetch(directUrl, {
        method: 'GET',
        headers,
        // Client-side fetch has no timeout limit on Vercel
        // Add timeout for better error handling (60s for long-running requests)
        signal: AbortSignal.timeout(60000),
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired; refresh disabled -> logout')
          window.dispatchEvent(new CustomEvent('auth-expired'))
          throw new Error('Authentication failed - please login again')
        }
        
        // Get error details from response
        let errorDetails = ''
        try {
          const errorText = await response.text()
          if (errorText) {
            try {
              const errorJson = JSON.parse(errorText)
              errorDetails = errorJson.error || errorJson.message || errorText
            } catch {
              errorDetails = errorText
            }
          }
        } catch {
          // Ignore errors when reading response
        }
        
        const errorMessage = errorDetails 
          ? `GET request failed: ${response.status} - ${errorDetails}`
          : `GET request failed: ${response.status}`
        
        throw new Error(errorMessage)
      }

      console.log('[ApiService] Direct fetch successful')
      return response.json()
    } catch (directError) {
      // If direct fetch fails (CORS, network error, etc.), fallback to proxy
      const isNetworkError = directError instanceof TypeError && 
                            (directError.message.includes('Failed to fetch') || 
                             directError.message.includes('NetworkError') ||
                             directError.message.includes('CORS'))
      
      if (isNetworkError) {
        console.warn('[ApiService] Direct fetch failed (likely CORS), falling back to proxy:', directError.message)
        console.log('[ApiService] Falling back to proxy endpoint:', `${API_BASE_URL}/${endpoint}`)
        
        // Fallback to proxy (may timeout on Vercel, but better than nothing)
        try {
          const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(20000), // 20s timeout for proxy
          })

          if (!response.ok) {
            if (response.status === 401) {
              window.dispatchEvent(new CustomEvent('auth-expired'))
              throw new Error('Authentication failed - please login again')
            }
            
            const errorText = await response.text().catch(() => '')
            throw new Error(`Proxy fallback failed: ${response.status} - ${errorText}`)
          }

          console.log('[ApiService] Proxy fallback successful')
          return response.json()
        } catch (proxyError) {
          // If both fail, throw the original direct error with context
          throw new Error(`Direct fetch failed (CORS/network): ${directError instanceof Error ? directError.message : String(directError)}. Proxy fallback also failed: ${proxyError instanceof Error ? proxyError.message : String(proxyError)}`)
        }
      } else {
        // Re-throw non-network errors (auth, parsing, etc.)
        throw directError
      }
    }
  }

  // Get user info by username from get-all-users API
  static async getUserByUsername(username: string, token?: string): Promise<unknown | null> {
    try {
      // Call get-all-users API with username filter
      const response = await this.get(`user/get-all-users?pageNumber=0&pageSize=100&sortBy=username&sortDir=asc`, token) as {
        content?: Array<{
          id: number
          firstname: string
          lastname: string
          username: string
          email: string
          phoneNumber: string
          role: string
          active: boolean
        }>
        totalElements?: number
      }
      
      if (response && response.content && Array.isArray(response.content)) {
        // Find user by username
        const user = response.content.find(u => u.username === username)
        if (user) {
          console.log('[ApiService] Found user by username:', user)
          return user
        }
      }
      
      console.warn('[ApiService] User not found by username:', username)
      return null
    } catch (error) {
      console.error('[ApiService] Error fetching user by username:', error)
      return null
    }
  }

  static async patch(endpoint: string, data: unknown, token?: string): Promise<unknown> {
    const validToken = token || await TokenService.getValidAccessToken()
    
    if (!validToken) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-expired'))
      }
      throw new Error('No valid token available')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`
    }

    // Retry on 429 with exponential backoff
    let attempt = 0
    const maxRetries = 3
    while (true) {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      })

      // Read response body once (can only be read once)
      const responseText = await response.text()
      let responseData: unknown = null
      
      try {
        responseData = responseText ? JSON.parse(responseText) : null
      } catch {
        responseData = responseText
      }

      if (!response.ok) {
        if (response.status === 401) {
          console.log('🔍 401 Error Response:', responseData)
          console.log('Token expired; refresh disabled -> logout')
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth-expired'))
          }
          throw new Error('Authentication failed - please login again')
        }
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfter = response.headers.get('Retry-After')
          const delayMs = retryAfter ? Number(retryAfter) * 1000 : (2 ** attempt) * 500
          await new Promise(r => setTimeout(r, delayMs))
          attempt += 1
          continue
        }
        
        let errorDetails = ''
        if (responseData) {
          if (typeof responseData === 'object') {
            const errorObj = responseData as Record<string, unknown>
            errorDetails = (errorObj.error || errorObj.message || JSON.stringify(responseData)) as string
          } else {
            errorDetails = String(responseData)
          }
        }
        
        const errorMessage = errorDetails 
          ? `PATCH request failed: ${response.status} - ${errorDetails}`
          : `PATCH request failed: ${response.status}`
        
        throw new Error(errorMessage)
      }

      return responseData
    }
  }
}

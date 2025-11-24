import { fetchCustomerDashboardData } from '../api/customer-dashboard'

interface CustomerDashboardService {
  fetchDashboard: (fromDate: string, toDate: string, authToken?: string) => Promise<unknown>
  clearCache: () => void
}

class CustomerDashboardServiceImpl implements CustomerDashboardService {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  async fetchDashboard(fromDate: string, toDate: string, authToken?: string) {
    const cacheKey = `${fromDate}-${toDate}`
    const cached = this.cache.get(cacheKey)

    // Check if cached data is still valid
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log('📦 Using cached dashboard data')
      return cached.data
    }

    try {
      console.log('🔄 Fetching fresh dashboard data...')
      const result = await fetchCustomerDashboardData(fromDate, toDate, authToken)
      
      if (result.success) {
        // Cache the successful result
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl: this.DEFAULT_TTL
        })
        
        console.log('✅ Dashboard data cached successfully')
        return result
      } else {
        throw new Error(result.errors?.join(', ') || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('❌ Dashboard service error:', error)
      throw error
    }
  }

  clearCache() {
    this.cache.clear()
    console.log('🗑️ Dashboard cache cleared')
  }

  // Method to get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        ttl: value.ttl
      }))
    }
  }
}

export const customerDashboardService = new CustomerDashboardServiceImpl()

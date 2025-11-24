import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchCustomerDashboardData } from '../api/customer-dashboard'

interface CustomerDashboardData {
  newCustomer: unknown
  genderRatio: unknown
  customerType: unknown
  customerOldType: unknown
  customerSource: unknown
  appDownloadStatus: unknown
  appDownload: unknown
  customerSummary: unknown
  genderRevenue: unknown
  uniqueCustomers: unknown
  facilityBooking: unknown
  facilityHourService: unknown
}

interface UseCustomerDashboardReturn {
  data: CustomerDashboardData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
  retryCount: number
}

export function useCustomerDashboard(fromDate: string, toDate: string): UseCustomerDashboardReturn {
  const [data, setData] = useState<CustomerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const cacheKey = `${fromDate}-${toDate}`

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching customer dashboard data...', { fromDate, toDate, isRetry })

      // Lấy token từ localStorage hoặc context
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
      
      if (!token) {
        console.warn('⚠️ No auth token found')
        throw new Error('Authentication required - no token found')
      }
      
      console.log('🔍 Customer Dashboard Auth Debug:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
      })

      const result = await fetchCustomerDashboardData(fromDate, toDate, token)
      
      if (result.success) {
        setData(result.data as unknown as CustomerDashboardData)
        setLastUpdated(new Date())
        setRetryCount(0) // Reset retry count on success
        
        console.log('✅ Dashboard data loaded successfully:', result.summary)
        
        // Log errors nếu có
        if (result.errors && result.errors.length > 0) {
          console.warn('⚠️ Some API calls failed:', result.errors)
        }
      } else {
        throw new Error(result.errors?.join(', ') || 'Failed to fetch data')
      }

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('❌ Dashboard fetch error:', errorMessage)
      
      // Retry logic với exponential backoff
      if (!isRetry && retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10s
        console.log(`🔄 Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`)
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchData(true)
        }, delay)
        return
      }
      
      // Nếu không có token, không retry
      const currentToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
      if (!currentToken) {
        console.error('❌ No auth token, cannot retry')
        return
      }

    } finally {
      setLoading(false)
    }
  }, [fromDate, toDate, retryCount])

  useEffect(() => {
    fetchData()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [cacheKey, fetchData])

  const refetch = useCallback(async () => {
    setRetryCount(0)
    await fetchData()
  }, [fetchData])

  return { data, loading, error, refetch, lastUpdated, retryCount }
}

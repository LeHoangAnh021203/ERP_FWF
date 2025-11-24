"use client"

import { useEffect, useRef } from 'react'
import { TokenService } from '../lib/token-service'
import { useAuth } from '../contexts/AuthContext'

export function useTokenRefresh() {
  const { logout } = useAuth()
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return

        // Kiểm tra token có sắp hết hạn không
        if (TokenService.isTokenExpired(token)) {
          // Refresh bị vô hiệu hóa: logout ngay
          logout()
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        logout()
      }
    }

    // Kiểm tra token mỗi 5 phút
    refreshIntervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000)

    // Kiểm tra ngay khi component mount
    checkAndRefreshToken()

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [logout])

  return null
}

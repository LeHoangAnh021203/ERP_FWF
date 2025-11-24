import { AuthAPI } from './auth-api'

export class TokenService {
  // Debug function để kiểm tra token expiration
  static debugTokenExpiration(token: string): void {
    try {
      const payload = AuthAPI.decodeToken(token)
      if (!payload) {
        console.log('❌ Token invalid or cannot be decoded')
        return
      }
      
      const expirationTime = payload.exp * 1000
      const currentTime = Date.now()
      const timeUntilExpiry = expirationTime - currentTime
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60))
      
      console.log('🔍 Token Debug Info:')
      console.log('  - Issued at:', new Date(payload.iat * 1000).toLocaleString())
      console.log('  - Expires at:', new Date(expirationTime).toLocaleString())
      console.log('  - Current time:', new Date(currentTime).toLocaleString())
      console.log('  - Time until expiry:', minutesUntilExpiry, 'minutes')
      console.log('  - Is expired:', timeUntilExpiry <= 0)
      console.log('  - Should refresh:', this.isTokenExpired(token))
    } catch (error) {
      console.error('Error debugging token:', error)
    }
  }

  // Kiểm tra token có hết hạn không
  static isTokenExpired(token: string): boolean {
    try {
      const payload = AuthAPI.decodeToken(token)
      if (!payload) return true
      
      // JWT exp là timestamp (seconds), convert to milliseconds
      const expirationTime = payload.exp * 1000
      const currentTime = Date.now()
      
      // Refresh token 5 phút trước khi hết hạn
      const refreshThreshold = 5 * 60 * 1000 // 5 minutes
      
      return currentTime >= (expirationTime - refreshThreshold)
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  }

  // Lấy access token, tự động refresh nếu cần
  static async getValidAccessToken(): Promise<string | null> {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      return null
    }

    // Debug token expiration
    this.debugTokenExpiration(accessToken)

    // Kiểm tra xem token có hết hạn không; KHÔNG refresh nữa
    if (this.isTokenExpired(accessToken)) {
      this.clearTokens()
      return null
    }

    return accessToken
  }

  // Refresh access token (đã vô hiệu hóa)
  static async refreshAccessToken(): Promise<string> {
    throw new Error('Refresh token flow disabled')
  }

  // Xóa tất cả tokens
  static clearTokens(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }

  // Kiểm tra user có đăng nhập không
  static isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    return !!(accessToken && refreshToken)
  }
}

// Mock authentication data
export interface MockUser {
  id: string
  username: string
  email: string
  password: string
  name: string
  role: 'admin' | 'manager' | 'staff'
  avatar?: string
  permissions: string[]
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@facewashfox.com',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    avatar: '🦊',
    permissions: ['*'] // All permissions
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@facewashfox.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    avatar: '👨‍💼',
    permissions: ['dashboard', 'customers', 'orders', 'services', 'reports']
  },
  {
    id: '3',
    username: 'staff',
    email: 'staff@facewashfox.com',
    password: 'staff123',
    name: 'Staff User',
    role: 'staff',
    avatar: '👩‍💼',
    permissions: ['dashboard', 'customers', 'orders']
  },
  {
    id: '4',
    username: 'demo',
    email: 'demo@facewashfox.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'manager',
    avatar: '🎭',
    permissions: ['dashboard', 'customers', 'orders', 'services']
  }
]

export const MOCK_TOKENS = new Map<string, { token: string; expiresAt: number }>()

// Generate mock JWT token
export function generateMockToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }))
  const signature = btoa('mock-signature')
  
  return `${header}.${payload}.${signature}`
}

// Validate mock token
export function validateMockToken(token: string): { valid: boolean; userId?: string } {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return { valid: false }
    
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    
    if (payload.exp < now) {
      return { valid: false }
    }
    
    return { valid: true, userId: payload.sub }
  } catch {
    return { valid: false }
  }
}

// Mock login function
export function mockLogin(username: string, password: string): { success: boolean; user?: MockUser; token?: string; message?: string } {
  const user = MOCK_USERS.find(u => 
    (u.username === username || u.email === username) && u.password === password
  )
  
  if (!user) {
    return { 
      success: false, 
      message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
    }
  }
  
  const token = generateMockToken(user.id)
  MOCK_TOKENS.set(user.id, { 
    token, 
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) 
  })
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user
  
  return {
    success: true,
    user: userWithoutPassword as MockUser,
    token
  }
}

// Mock token validation
export function mockValidateToken(token: string): { valid: boolean; user?: MockUser } {
  const validation = validateMockToken(token)
  
  if (!validation.valid || !validation.userId) {
    return { valid: false }
  }
  
  const user = MOCK_USERS.find(u => u.id === validation.userId)
  if (!user) {
    return { valid: false }
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user
  
  return {
    valid: true,
    user: userWithoutPassword as MockUser
  }
}

// Check if mock mode is enabled
export function isMockModeEnabled(): boolean {
  // Enable mock mode if:
  // 1. In development and USE_MOCK_AUTH is true, OR
  // 2. No backend API URL is configured (production fallback)
  return (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_AUTH === 'true') ||
         !process.env.NEXT_PUBLIC_API_BASE_URL
}

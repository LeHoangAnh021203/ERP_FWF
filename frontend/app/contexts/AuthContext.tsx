"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { AuthAPI, LoginRequest, JWTPayload, LoginResponse } from "../lib/auth-api"
import { TokenService } from "../lib/token-service"


interface User {
  id: number
  firstname: string
  lastname: string
  username: string
  email: string
  phoneNumber: string
  dob: string
  gender: boolean
  bio: string
  avatar: string | null
  role: string
  active: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: string[]
  isAdmin: boolean
  login: (username: string, password: string) => Promise<boolean>
  signup: (_email: string, _password: string, _name: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  getValidToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [permissions, setPermissions] = useState<string[]>([])

  // Check if user is already logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await TokenService.getValidAccessToken()
        const userData = localStorage.getItem("user_data")
        
        console.log('[AuthContext] Initializing auth...')
        console.log('[AuthContext] Token exists:', !!token)
        console.log('[AuthContext] User data exists:', !!userData)
        console.log('[AuthContext] Current pathname:', window.location.pathname)
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData)
            console.log('[AuthContext] Setting user from localStorage:', user)
            
            // If user data is incomplete (empty firstname, lastname, email), try to fetch from API
            const isIncomplete = (!user.firstname && !user.lastname) || !user.email
            console.log('[AuthContext] User data check:', {
              hasFirstname: !!user.firstname,
              hasLastname: !!user.lastname,
              hasEmail: !!user.email,
              isIncomplete
            })
            
            if (isIncomplete) {
              console.log('[AuthContext] User data incomplete, fetching from API...')
              try {
                // Try to get user from get-all-users API by username first
                let fetchedUser: User | null = null
                if (user.username) {
                  console.log('[AuthContext] Trying to fetch user by username from get-all-users API...')
                  fetchedUser = await AuthAPI.getUserByUsernameFromList(user.username, token)
                }
                
                // If not found, try other endpoints
                if (!fetchedUser || (!fetchedUser.firstname && !fetchedUser.lastname && !fetchedUser.email)) {
                  console.log('[AuthContext] Trying other user endpoints...')
                  fetchedUser = await AuthAPI.getCurrentUser(token)
                }
                
                console.log('[AuthContext] Fetched user from API:', fetchedUser)
                
                if (fetchedUser && (fetchedUser.firstname || fetchedUser.lastname || fetchedUser.email)) {
                  // Merge fetched data with existing data (prefer fetched data for missing fields)
                  const updatedUser = {
                    ...user,
                    ...fetchedUser,
                    // Preserve existing fields if they exist and are not empty
                    id: user.id || fetchedUser.id,
                    username: user.username || fetchedUser.username,
                    role: user.role || fetchedUser.role,
                    firstname: user.firstname || fetchedUser.firstname || '',
                    lastname: user.lastname || fetchedUser.lastname || '',
                    email: user.email || fetchedUser.email || '',
                  }
                  localStorage.setItem("user_data", JSON.stringify(updatedUser))
                  setUser(updatedUser)
                  console.log('[AuthContext] User data updated from API:', updatedUser)
                } else {
                  console.warn('[AuthContext] Fetched user is null or also incomplete')
                  // Try to decode JWT token for additional info
                  try {
                    const payload = AuthAPI.decodeToken(token) as JWTPayload | null
                    if (payload) {
                      const jwtUser = payload as any
                      const mergedUser = {
                        ...user,
                        firstname: user.firstname || jwtUser?.firstname || jwtUser?.firstName || '',
                        lastname: user.lastname || jwtUser?.lastname || jwtUser?.lastName || '',
                        email: user.email || jwtUser?.email || '',
                      }
                      localStorage.setItem("user_data", JSON.stringify(mergedUser))
                      setUser(mergedUser)
                      console.log('[AuthContext] User data merged from JWT:', mergedUser)
                    } else {
                      setUser(user)
                    }
                  } catch (jwtError) {
                    console.warn('[AuthContext] Could not decode JWT:', jwtError)
                    setUser(user)
                  }
                }
              } catch (fetchError) {
                console.warn('[AuthContext] Failed to fetch user from API, using cached data:', fetchError)
                setUser(user)
              }
            } else {
              setUser(user)
            }
            
            // Also ensure token is in cookie for middleware
            if (typeof document !== 'undefined') {
              document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
              console.log('[AuthContext] Token saved to cookie for middleware access')
            }
            
            // Get permissions from token with error handling
            try {
              const userPermissions = AuthAPI.getUserPermissions(token)
              setPermissions(userPermissions)
              console.log('[AuthContext] Permissions loaded from token:', userPermissions)
            } catch (permissionError) {
              console.warn('[AuthContext] Error getting permissions from token, using empty array:', permissionError)
              setPermissions([])
            }
          } catch (error) {
            console.error("Error parsing user data:", error)
            TokenService.clearTokens()
          }
        } else if (token) {
          // Token exists but no user data, try to fetch from API
          console.log('[AuthContext] Token exists but no user data, fetching from API...')
          try {
            const fetchedUser = await AuthAPI.getCurrentUser(token)
            if (fetchedUser) {
              localStorage.setItem("user_data", JSON.stringify(fetchedUser))
              setUser(fetchedUser)
              console.log('[AuthContext] User fetched and set from API:', fetchedUser)
            }
          } catch (fetchError) {
            console.warn('[AuthContext] Failed to fetch user from API:', fetchError)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        TokenService.clearTokens()
      } finally {
        // Giảm delay để đảm bảo state được cập nhật nhanh hơn
        setTimeout(() => {
          setIsLoading(false)
        }, 50)
      }
    }

    initializeAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('[AuthContext] Starting login process...');
      

      
      // Use real API if mock is not enabled
      const credentials: LoginRequest = { username, password }
      console.log('[AuthContext] Calling AuthAPI.login...');
      const response: LoginResponse = await AuthAPI.login(credentials)
      
      console.log('[AuthContext] AuthAPI.login completed successfully');
      console.log('[AuthContext] Response received:', JSON.stringify(response, null, 2));
      console.log('[AuthContext] Response.user:', response.user);
      console.log('[AuthContext] Login successful, storing tokens...')
      
      // Store tokens and user data
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("refresh_token", response.refresh_token)
      
      // Derive user data if backend doesn't return it
      const maybeUser = (response as { user?: User }).user
      let userFromResponse = maybeUser || null
      
      console.log('[AuthContext] User from response:', userFromResponse);
      console.log('[AuthContext] User has firstname:', !!userFromResponse?.firstname);
      console.log('[AuthContext] User has lastname:', !!userFromResponse?.lastname);
      console.log('[AuthContext] User has email:', !!userFromResponse?.email);
      
      // Check if user data is incomplete (missing firstname, lastname, or email)
      const isUserIncomplete = userFromResponse && 
        (!userFromResponse.firstname && !userFromResponse.lastname && !userFromResponse.email)
      
      // If no user in response OR user data is incomplete, try to fetch from API
      if (!userFromResponse || isUserIncomplete) {
        try {
          console.log('[AuthContext] User data missing or incomplete, fetching from API...')
          
          // Try to get user from get-all-users API by username first
          let fetchedUser: User | null = null
          const usernameToSearch = userFromResponse?.username || username
          if (usernameToSearch) {
            console.log('[AuthContext] Trying to fetch user by username from get-all-users API...')
            fetchedUser = await AuthAPI.getUserByUsernameFromList(usernameToSearch, response.access_token)
          }
          
          // If not found, try other endpoints
          if (!fetchedUser || (!fetchedUser.firstname && !fetchedUser.lastname && !fetchedUser.email)) {
            console.log('[AuthContext] Trying other user endpoints...')
            fetchedUser = await AuthAPI.getCurrentUser(response.access_token)
          }
          
          if (fetchedUser) {
            // Merge fetched data with existing data (prefer fetched data)
            if (userFromResponse) {
              userFromResponse = {
                ...userFromResponse,
                ...fetchedUser,
                // Preserve id and username from original if they exist
                id: userFromResponse.id || fetchedUser.id,
                username: userFromResponse.username || fetchedUser.username,
              }
            } else {
              userFromResponse = fetchedUser
            }
            console.log('[AuthContext] User fetched/updated from API:', userFromResponse)
          } else {
            console.warn('[AuthContext] Failed to fetch user from API, fetchedUser is null')
          }
        } catch (fetchError) {
          console.warn('[AuthContext] Failed to fetch user from API:', fetchError)
        }
      }
      
      // If still no user or user is incomplete, try to decode JWT token for additional info
      if (!userFromResponse || (!userFromResponse.firstname && !userFromResponse.lastname && !userFromResponse.email)) {
        try {
          console.log('[AuthContext] Attempting to decode JWT token for user info...')
          const payload = AuthAPI.decodeToken(response.access_token) as JWTPayload | null
          console.log('[AuthContext] JWT Payload:', payload)
          
          if (payload) {
            // Try to extract user info from JWT payload if available
            const jwtUser = payload as any
            const derivedUser: User = {
              id: userFromResponse?.id || payload?.userId || 0,
              firstname: userFromResponse?.firstname || jwtUser?.firstname || jwtUser?.firstName || '',
              lastname: userFromResponse?.lastname || jwtUser?.lastname || jwtUser?.lastName || '',
              username: userFromResponse?.username || payload?.sub || username,
              email: userFromResponse?.email || jwtUser?.email || '',
              phoneNumber: userFromResponse?.phoneNumber || jwtUser?.phoneNumber || '',
              dob: userFromResponse?.dob || jwtUser?.dob || '',
              gender: userFromResponse?.gender ?? (jwtUser?.gender ?? true),
              bio: userFromResponse?.bio || jwtUser?.bio || '',
              avatar: userFromResponse?.avatar || jwtUser?.avatar || null,
              role: userFromResponse?.role || response.role || payload?.authorities?.[0] || 'USER',
              active: userFromResponse?.active ?? true,
            }
            userFromResponse = derivedUser
            console.log('[AuthContext] Using derived/merged user from token:', userFromResponse)
          } else {
            console.warn('[AuthContext] Could not decode JWT token')
          }
        } catch (e) {
          console.warn('[AuthContext] Could not derive user from token:', e)
        }
      }
      
      if (userFromResponse) {
        localStorage.setItem("user_data", JSON.stringify(userFromResponse))
      }
      
      // Also store token in cookie for middleware access
      document.cookie = `token=${response.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
      
      console.log('[AuthContext] Tokens stored, setting user state...')
      console.log('[AuthContext] User data:', response.user)
      
      // Set user state immediately
      if (userFromResponse) {
        setUser(userFromResponse)
      }
      
      // Get permissions from token with error handling
      try {
        console.log('[AuthContext] Getting user permissions...');
        const userPermissions = AuthAPI.getUserPermissions(response.access_token)
        setPermissions(userPermissions)
        console.log('[AuthContext] Permissions set:', userPermissions)
      } catch (permissionError) {
        console.warn('[AuthContext] Error getting permissions, using empty array:', permissionError)
        setPermissions([])
      }
      
      console.log('[AuthContext] Setting user state...');
      if (userFromResponse) {
        setUser(userFromResponse)
      }
      
      // Ensure token is in cookie before returning
      if (typeof document !== 'undefined') {
        document.cookie = `token=${response.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
        console.log('[AuthContext] Token saved to cookie for middleware access')
      }
      
      console.log('[AuthContext] User state set, isAuthenticated should be true now')
      console.log('[AuthContext] Current user:', response.user)
      console.log('[AuthContext] isAuthenticated will be:', !!response.user)
      console.log('[AuthContext] Login function returning true');
      
      // Giảm delay để đảm bảo state được cập nhật nhanh hơn
      await new Promise(resolve => setTimeout(resolve, 50));
      
      return true
    } catch (error) {
      console.error("[AuthContext] Login error caught:", error)
      console.error("[AuthContext] Error details:", error instanceof Error ? error.message : error)
      console.error("[AuthContext] Error type:", error instanceof Error ? error.constructor.name : typeof error)
      
      // Check for email verification error
      if (error instanceof Error) {
        const errorAny = error as any
        
        // Check if error has isEmailNotVerified property
        const isEmailNotVerified = errorAny?.isEmailNotVerified === true || 
                                   errorAny?.isEmailNotVerified === 'true' ||
                                   Object.prototype.hasOwnProperty.call(errorAny, 'isEmailNotVerified') && errorAny.isEmailNotVerified
        
        console.log("[AuthContext] Checking error properties:", {
          isEmailNotVerified: errorAny?.isEmailNotVerified,
          isEmailNotVerifiedType: typeof errorAny?.isEmailNotVerified,
          email: errorAny?.email,
          details: errorAny?.details,
          message: error.message,
          hasOwnProperty: Object.prototype.hasOwnProperty.call(errorAny, 'isEmailNotVerified'),
          keys: errorAny ? Object.keys(errorAny) : [],
          isEmailNotVerifiedCheck: isEmailNotVerified
        })
        
        // Re-throw error if it's an email verification error so login form can handle it
        if (isEmailNotVerified) {
          console.log("[AuthContext] Email not verified detected, re-throwing error")
          console.log("[AuthContext] Error properties:", {
            isEmailNotVerified: errorAny.isEmailNotVerified,
            email: errorAny.email,
            details: errorAny.details,
            message: error.message
          })
          // Ensure properties are preserved when re-throwing
          throw error
        }
      }
      
      console.log("[AuthContext] Not a verification error, returning false")
      return false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = async (_email: string, _password: string, _name: string): Promise<boolean> => {
    // For now, redirect to login since signup endpoint might not exist
    console.log("Signup not implemented yet")
    return false
  }

  const logout = async () => {
    console.log('[AuthContext] Starting logout process...')
    try {
      // Call logout API
      await AuthAPI.logout()
      console.log('[AuthContext] Logout API completed')
    } catch (error) {
      console.warn('Logout API failed, continuing with local logout:', error)
    } finally {
      // Always clear local tokens and state
      console.log('[AuthContext] Clearing local authentication data...')
      TokenService.clearTokens()
      
      // Clear all cookies that might contain authentication data
      const cookiesToClear = ['token', 'auth_token', 'auth_user', 'access_token', 'refresh_token', 'user_data']
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = `${cookieName}=; path=/; domain=.localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        document.cookie = `${cookieName}=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      })
      console.log('[AuthContext] All cookies cleared')
      
      // Clear state
      setUser(null)
      setPermissions([])
      
      // Add small delay to ensure everything is cleared
      await new Promise(resolve => setTimeout(resolve, 100))
      
      console.log('[AuthContext] State cleared, logout completed')
      
      // Force page reload to ensure clean state
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  const hasPermission = (permission: string): boolean => {
    const token = localStorage.getItem("access_token")
    if (!token) return false
    return AuthAPI.hasPermission(token, permission)
  }

  const getValidToken = async (): Promise<string | null> => {
    return await TokenService.getValidAccessToken()
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    permissions,
    isAdmin: permissions.includes('ROLE_ADMIN'),
    login,
    signup,
    logout,
    hasPermission,
    getValidToken
  }

  return (
    <AuthContext.Provider value={{ ...value }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

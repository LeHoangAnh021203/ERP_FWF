"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('[AuthGuard] Auth state changed:')
    console.log('[AuthGuard] isLoading:', isLoading)
    console.log('[AuthGuard] isAuthenticated:', isAuthenticated)
    console.log('[AuthGuard] user:', user)
    
    if (!isLoading && !isAuthenticated) {
      console.log('[AuthGuard] Not authenticated, redirecting to login...')
      // Giảm delay xuống 100ms để tránh xung đột với login redirect
      setTimeout(() => {
        router.push("/login")
      }, 100)
    } else if (!isLoading && isAuthenticated) {
      console.log('[AuthGuard] Authenticated, allowing access to dashboard')
    }
  }, [isAuthenticated, isLoading, router, user])

  // Show loading while checking authentication
  if (isLoading) {
    console.log('[AuthGuard] Loading state, showing spinner...')
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    console.log('[AuthGuard] Not authenticated, not rendering children')
    return null
  }

  console.log('[AuthGuard] Authenticated, rendering dashboard children')
  return <>{children}</>
}



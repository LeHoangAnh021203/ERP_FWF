"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { PermissionDenied } from "./permission-denied"

// Define route permissions mapping
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/": [], // Dashboard home - accessible to all authenticated users
  "/dashboard/customers": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/orders": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/services": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/accounting": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/calendar": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/generateAI": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/userManagement": ["ROLE_ADMIN", "ROLE_CEO"],
  // Add more routes as needed
}

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  route?: string
}

export function PermissionGuard({ 
  children, 
  requiredPermissions,
  route 
}: PermissionGuardProps) {
  const { user, permissions, isLoading, hasPermission } = useAuth()
  const pathname = usePathname()

  // Determine which permissions to check
  const currentRoute = route || pathname
  const permissionsToCheck = requiredPermissions || 
    ROUTE_PERMISSIONS[currentRoute] || 
    []

  // If no permissions required, allow access
  if (permissionsToCheck.length === 0) {
    return <>{children}</>
  }

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Check if user is admin or CEO (they have access to everything)
  const isAdminOrCEO = permissions.includes("ROLE_ADMIN") || 
                       permissions.includes("ROLE_CEO") ||
                       user?.role === "ADMIN" ||
                       user?.role === "CEO"

  if (isAdminOrCEO) {
    return <>{children}</>
  }

  // Check if user has at least one of the required permissions
  const hasAccess = permissionsToCheck.some(permission => 
    hasPermission(permission) || permissions.includes(permission)
  )

  if (!hasAccess) {
    return <PermissionDenied />
  }

  return <>{children}</>
}


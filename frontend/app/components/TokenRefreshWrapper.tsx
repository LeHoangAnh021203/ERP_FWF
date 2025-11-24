"use client"

import { useTokenRefresh } from "../hooks/useTokenRefresh"

export function TokenRefreshWrapper({ children }: { children: React.ReactNode }) {
  useTokenRefresh()
  return <>{children}</>
}

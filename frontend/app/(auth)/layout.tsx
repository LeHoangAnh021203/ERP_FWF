import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FB Network - Authentication",
  description: "Login, Signup, and Password Reset",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}


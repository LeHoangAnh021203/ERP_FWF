"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { AlertCircle, Home, LogIn } from "lucide-react"

export function PermissionDenied() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleGoHome = () => {
    router.push("/")
  }

  const handleLoginAdmin = async () => {
    // Logout current user first
    await logout()
    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Không có quyền truy cập
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Bạn không có quyền để thao tác điều này
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGoHome}
              className="w-full"
              variant="default"
            >
              <Home className="w-4 h-4 mr-2" />
              Quay lại trang chủ
            </Button>
            <Button
              onClick={handleLoginAdmin}
              className="w-full"
              variant="outline"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Đăng nhập vào account admin/ceo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


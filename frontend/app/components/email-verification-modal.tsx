"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface EmailVerificationModalProps {
  open: boolean
  onClose: () => void
  username?: string
  email?: string
}

export function EmailVerificationModal({
  open,
  onClose,
  username,
  email: initialEmail,
}: EmailVerificationModalProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  // Determine if we should show email input
  // Show input if: no email provided AND username is not an email (doesn't contain @)
  const isUsernameEmail = username && username.includes("@")
  const hasEmail = initialEmail || isUsernameEmail
  const [email, setEmail] = useState(initialEmail || (isUsernameEmail ? username : "") || "")
  const [showEmailInput, setShowEmailInput] = useState(!hasEmail)

  // Update email when initialEmail changes
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail)
      setShowEmailInput(false)
    } else if (isUsernameEmail) {
      setEmail(username)
      setShowEmailInput(false)
    } else {
      setShowEmailInput(true)
    }
  }, [open, initialEmail, username, isUsernameEmail])

  const handleResendVerification = async () => {
    // Validate email if input is shown
    if (showEmailInput && !email) {
      setErrorMessage("Vui lòng nhập email cần xác thực")
      setResendStatus("error")
      return
    }

    if (showEmailInput && email && !email.includes("@")) {
      setErrorMessage("Email không hợp lệ")
      setResendStatus("error")
      return
    }

    setIsResending(true)
    setResendStatus("idle")
    setErrorMessage("")

    try {
      // Nếu có email: dùng POST với query param theo chuẩn API proxy
      // Nếu không: fallback POST với username
      const hasEmail = Boolean(email)
      const url = hasEmail
        ? `/api/proxy/auth/resend-verification?email=${encodeURIComponent(email)}`
        : `/api/proxy/auth/resend-verification`
      const response = await fetch(
        url,
        hasEmail
          ? { method: "POST" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username }),
            }
      )

      const data = await response.json()

      if (response.ok) {
        setResendStatus("success")
        // Reset success status after 3 seconds
        setTimeout(() => {
          setResendStatus("idle")
        }, 3000)
      } else {
        setResendStatus("error")
        setErrorMessage(data.error || data.message || "Failed to send verification email")
      }
    } catch (error) {
      console.error("Resend verification error:", error)
      setResendStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while sending verification email"
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center text-gray-900">
            Email chưa được xác thực
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Mail đã tồn tại nhưng cần được xác thực
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-orange-800 mb-3">
                  Tài khoản của bạn đã được tạo nhưng email chưa được xác thực.
                  Vui lòng kiểm tra email và click vào link xác thực để hoàn tất đăng ký.
                </p>
                <div className="bg-white border border-orange-300 rounded-lg p-3 mt-3">
                  <p className="text-xs font-semibold text-orange-700 mb-2">
                    Email cần được xác thực:
                  </p>
                  {showEmailInput ? (
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Nhập email cần xác thực"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                      <p className="text-xs text-orange-600">
                        Vui lòng nhập email đã đăng ký tài khoản {username ? `(${username})` : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-orange-900 break-all">
                      {email || username || "Email của tài khoản"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {resendStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Email xác thực đã được gửi thành công! Vui lòng kiểm tra hộp thư của bạn.
                </p>
              </div>
            </div>
          )}

          {resendStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">
                    {errorMessage || "Không thể gửi email xác thực. Vui lòng thử lại sau."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Đóng
          </Button>
          <Button
            type="button"
            onClick={handleResendVerification}
            disabled={isResending || resendStatus === "success"}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : resendStatus === "success" ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Đã gửi
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Xác thực email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


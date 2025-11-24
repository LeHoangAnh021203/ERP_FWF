"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "expired" | "error">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const statusParam = searchParams.get("status");
    const emailParam = searchParams.get("email");
    const userParam = searchParams.get("username");

    if (emailParam) setEmail(emailParam);
    if (userParam) setUsername(userParam);

    // If status is directly provided (from redirect), use it
    if (statusParam === "success") {
      setStatus("success");
      setMessage("Your account has been successfully verified!");
      return;
    }

    if (statusParam === "expired") {
      setStatus("expired");
      setMessage("Verification link has expired. Please request a new one.");
      return;
    }

    // Otherwise, verify the token
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`/api/proxy/auth/verify?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Your account has been successfully verified!");
        // Redirect to success after 2 seconds
        setTimeout(() => {
          router.push("/verified?status=success");
        }, 2000);
      } else {
        // Check if token expired
        if (response.status === 410 || data.error?.toLowerCase().includes("expired")) {
          setStatus("expired");
          setMessage(data.message || "Verification link has expired. Please request a new one.");
          setTimeout(() => {
            router.push("/verified?status=expired");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || data.error || "Verification failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage("An error occurred during verification. Please try again.");
    }
  };

  const handleResend = async () => {
    // Basic validation
    if (!email && !username) {
      setResendStatus("error");
      setResendMessage("Please enter the email you used to register (or username if required).");
      return;
    }

    if (email && !email.includes("@")) {
      setResendStatus("error");
      setResendMessage("Please enter a valid email address.");
      return;
    }

    try {
      setIsResending(true);
      setResendStatus("idle");
      setResendMessage("");

      // Nếu có email -> dùng GET với query param theo chuẩn proxy
      // Nếu không -> fallback POST với username
      const hasEmail = Boolean(email);
      const url = hasEmail
        ? `/api/proxy/auth/resend-verification?email=${encodeURIComponent(email)}`
        : `/api/proxy/auth/resend-verification`;
      const res = await fetch(
        url,
        hasEmail
          ? { method: "POST" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username }),
            }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResendStatus("success");
        setResendMessage("A verification email has been sent. Please check your inbox.");
      } else {
        setResendStatus("error");
        setResendMessage(
          data?.message || data?.error || "Failed to resend verification email. Please try again."
        );
      }
    } catch (e) {
      setResendStatus("error");
      setResendMessage("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          {status === "loading" && (
            <>
              <div className="mb-6">
                <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Verifying your account...</h1>
              <p className="text-gray-300">Please wait while we verify your email address.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Account Verified!</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === "expired" && (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-12 h-12 text-orange-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Link Expired</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="space-y-4 text-left">
                <div className="bg-orange-50/10 border border-orange-400/30 rounded-xl p-4">
                  <p className="text-sm text-orange-200 mb-3">
                    Enter the email you used to register. We will resend a fresh verification link.
                  </p>
              <div className="space-y-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your-email@example.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleResend}
                        disabled={isResending}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Resend verification email"
                        )}
                      </Button>
                <Link
                  href="/login"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
                >
                  Back to Login
                </Link>
                    </div>
                    {resendStatus === "success" && (
                      <p className="text-sm text-green-300">{resendMessage}</p>
                    )}
                    {resendStatus === "error" && (
                      <p className="text-sm text-red-300">{resendMessage}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-12 h-12 text-red-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Verification Failed</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/signup"
                  className="block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Try Again
                </Link>
                <Link
                  href="/login"
                  className="block px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}


"use client";

import type React from "react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Label } from "@/app/components/ui/label";
import { EmailVerificationModal } from "@/app/components/email-verification-modal";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  // Load video after component mounts to avoid blocking initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 2000); // Wait 2 seconds before loading video

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowVerificationModal(false);
    setUnverifiedEmail(null);

    try {
      console.log("[LoginForm] Attempting login...");
      const success = await login(formData.username, formData.password);
      console.log("[LoginForm] Login result:", success);

      if (success) {
        console.log(
          "[LoginForm] Login successful, redirecting to dashboard..."
        );
        // Chuyển hướng ngay lập tức sau khi đăng nhập thành công
        router.push("/dashboard");
      } else {
        console.log("[LoginForm] Login failed, showing error");
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("[LoginForm] Login error:", error);
      console.error("[LoginForm] Error type:", error instanceof Error ? error.constructor.name : typeof error);
      
      // Extract meaningful error message from error object
      let errorMessage = "An error occurred during login";
      if (error instanceof Error) {
        errorMessage = error.message.replace(/^Login failed: \d+ - /, '') // Remove status prefix
      }
      
      // Check error object properties
      const errorAny = error as any;
      
      // Get error details if available (from error object or error message)
      const errorDetails = errorAny?.details || '';
      const fullErrorText = `${errorMessage} ${errorDetails}`.toLowerCase();
      
      // Check if error has isEmailNotVerified property (multiple ways to check)
      const hasVerificationFlag = errorAny?.isEmailNotVerified === true ||
                                  errorAny?.isEmailNotVerified === 'true' ||
                                  (typeof errorAny === 'object' && errorAny !== null && 
                                   Object.prototype.hasOwnProperty.call(errorAny, 'isEmailNotVerified') && 
                                   (errorAny.isEmailNotVerified === true || errorAny.isEmailNotVerified === 'true'));
      
      // Check for verification keywords in error message/details
      // IMPORTANT: This is the fallback method that should work even if flag is lost
      const hasVerificationKeywords = fullErrorText.includes("verify") || 
                                      fullErrorText.includes("verification") ||
                                      fullErrorText.includes("unverified") ||
                                      fullErrorText.includes("not verified") ||
                                      fullErrorText.includes("account is not verified") ||
                                      fullErrorText.includes("your account is not verified") ||
                                      fullErrorText.includes("verification token expired") ||
                                      fullErrorText.includes("token expired") ||
                                      fullErrorText.includes("link has expired") ||
                                      fullErrorText.includes("chưa xác thực") ||
                                      fullErrorText.includes("cần được xác thực") ||
                                      fullErrorText.includes("mail đã tồn tại nhưng cần được xác thực");
      
      // Check if error is about verification (either flagged or contains keywords)
      const isEmailNotVerified = hasVerificationFlag || hasVerificationKeywords;
      
      console.log("[LoginForm] Error analysis:", {
        errorMessage,
        errorDetails,
        fullErrorText,
        hasVerificationFlag,
        hasVerificationKeywords,
        isEmailNotVerified,
        errorObjectKeys: errorAny ? Object.keys(errorAny) : [],
        errorAnyIsEmailNotVerified: errorAny?.isEmailNotVerified
      });
      
      if (isEmailNotVerified) {
        console.log("[LoginForm] Email not verified detected, showing modal");
        // Show verification modal instead of error message
        setShowVerificationModal(true);
        // Try to extract email from error object if available
        const emailFromError = errorAny?.email;
        // Use email from error, or check if username is an email, or use username as fallback
        const emailToShow = emailFromError ||
                           (formData.username.includes("@") ? formData.username : "");
        console.log("[LoginForm] Email to show in modal:", emailToShow);
        setUnverifiedEmail(emailToShow || "");
        // Don't set error message, modal will be shown instead
      } else {
        console.log("[LoginForm] Regular error, showing error message:", errorMessage);
        setError(errorMessage || "Invalid username or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden min-h-screen">
        <div className="relative w-full h-full">
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/fox.png"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "brightness(0.9) contrast(1.1) saturate(1.1)",
                transform: "translateZ(0) scale(1.05)",
              }}
              // Optimize for faster loading
              crossOrigin="anonymous"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement;
              // Bắt đầu từ 1/4 video để tránh phần đầu có thể không mượt
              video.currentTime = video.duration / 4;
              // Force play
              video.play().catch((err) => {
                // Ignore AbortError - it's expected when video is interrupted
                if (err.name !== 'AbortError') {
                  console.error('Video play error:', err);
                }
              });
            }}
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement;
              // Khi video gần đến cuối (90%), quay lại 1/4 để tránh phần cuối bị mất
              if (video.currentTime >= video.duration * 0.9) {
                video.currentTime = video.duration / 4;
              }
            }}
            onCanPlayThrough={(e) => {
              const video = e.target as HTMLVideoElement;
              // Đảm bảo video chạy mượt mà
              video.playbackRate = 1.0;
              // Smooth transition khi video ready
              video.style.opacity = "1";
              setVideoLoaded(true);
              
              // Try to play if not already playing
              if (video.paused) {
                video.play().catch((err) => {
                  if (err.name !== 'AbortError') {
                    console.error('Video play error on canPlayThrough:', err);
                  }
                });
              }
            }}
            onLoadStart={(e) => {
              const video = e.target as HTMLVideoElement;
              // Hide video while loading
              video.style.opacity = "0";
              video.style.transition = "opacity 0.5s ease-in-out";
              setVideoLoaded(false);
            }}
            >
              <source src="/1014.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Video Loading Indicator */}
          {(!videoLoaded || !shouldLoadVideo) && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                <p className="text-white/80 text-sm font-medium">
                  {!shouldLoadVideo ? "Đang chuẩn bị..." : "Đang tải video..."}
                </p>
              </div>
            </div>
          )}

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-purple-500/20"></div>

          {/* Modern geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-ping"></div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300/50 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-300/40 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 right-20 w-1 h-1 bg-cyan-300/50 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Enhanced branding overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10"></div>
      </div>

      {/* Login Form Section - Modern Design */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative min-h-screen">
        {/* Background with modern gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Modern header */}
          <div className="text-center space-y-6 ">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-glow">
                <Image src="/logo.png" alt="Logo" width={96} height={96} />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <h1
                className="text-5xl font-black text-white drop-shadow-2xl animate-float"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                FB Network
              </h1>
              <p className="text-white/90 font-medium drop-shadow-lg text-xl">
                Welcome to the Face Wash Fox
              </p>
            </div>
          </div>

          {/* Modern login form */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-gray-300"
                >
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="pl-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-300"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-12 pr-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <Link
                  href="/forgotPassword"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Modern login button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Modern sign up link */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        open={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          setUnverifiedEmail(null);
        }}
        username={formData.username}
        email={unverifiedEmail || undefined}
      />
    </div>
  );
}

"use client";

import type React from "react";
import { useState } from "react";

import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [, setOtpCode] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    emailOrPhoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    setOtpCode("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // Validate username
    if (!formData.username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    // Validate email or phone
    if (!formData.emailOrPhoneNumber.trim()) {
      setError("Email or phone number is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/proxy/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          emailOrPhoneNumber: formData.emailOrPhoneNumber,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Extract OTP code from response message
      // Format: "We have send to your email a verification, please have a check and complete your registration!{OTP}"
      const message = data.message || data.otp || "";
      let extractedOtp = "";

      // Try to extract OTP after the exclamation mark
      const otpMatch = message.match(/!([A-Za-z0-9]+)$/);
      if (otpMatch) {
        extractedOtp = otpMatch[1];
      } else {
        // If no match, try to find OTP in the entire message (alphanumeric string)
        const altMatch = message.match(/([A-Za-z0-9]{10,})/);
        if (altMatch) {
          extractedOtp = altMatch[1];
        } else if (data.otp) {
          extractedOtp = data.otp;
        }
      }

      setSuccess(true);
      setOtpCode(extractedOtp);

      // Reset form
      setFormData({
        username: "",
        emailOrPhoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (success) {
      setSuccess(false);
      setOtpCode("");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Video Section - 1/2 màn hình desktop */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden min-h-screen">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-orange-900"></div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-glow">
                <Image src="/logo.png" alt="Logo" width={96} height={96} />
              </div>
              <div className="space-y-2">
                <h1
                  className="text-5xl font-black text-white drop-shadow-2xl animate-float"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  FB Network
                </h1>
                <p className="text-white/90 font-medium drop-shadow-lg text-xl">
                  Create Your Account
                </p>
              </div>
              <div className="mt-8">
                <Image
                  src="/foxWCard.png"
                  alt="Fox Card"
                  width={400}
                  height={300}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

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

      {/* Signup Form Section - Modern Design */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative min-h-screen">
        {/* Background with modern gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Modern signup form */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-green-300 text-sm font-medium mb-2">
                        We have send to your email a verification, please have a
                        check and complete your registration!
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="pl-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-green-400 focus:ring-green-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400"
                    required
                    disabled={success}
                  />
                </div>
              </div>

              {/* Email or Phone Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="emailOrPhoneNumber"
                  className="text-sm font-semibold text-gray-300"
                >
                  Email or Phone Number
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                  <Input
                    id="emailOrPhoneNumber"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={formData.emailOrPhoneNumber}
                    onChange={(e) =>
                      handleInputChange("emailOrPhoneNumber", e.target.value)
                    }
                    className="pl-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-green-400 focus:ring-green-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400"
                    required
                    disabled={success}
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
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-12 pr-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-green-400 focus:ring-green-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400"
                    required
                    disabled={success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={success}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-gray-300"
                >
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-400 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-12 pr-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-green-400 focus:ring-green-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400"
                    required
                    disabled={success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={success}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Modern signup button */}
              <Button
                type="submit"
                disabled={isLoading || success}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : success ? (
                  "Account Created Successfully!"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Modern sign in link */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

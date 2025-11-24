"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

const OTP_LENGTH = 6;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusOtpInput = (index: number) => {
    const input = otpRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  const setOtpValues = (values: string[]) => {
    const normalized = values.slice(0, OTP_LENGTH).map((digit) => digit ?? "");
    setOtpDigits(normalized);
    setOtp(normalized.join(""));
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = cleaned;
    setOtpValues(nextDigits);

    if (cleaned && index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (otpDigits[index]) {
        const nextDigits = [...otpDigits];
        nextDigits[index] = "";
        setOtpValues(nextDigits);
      } else if (index > 0) {
        focusOtpInput(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusOtpInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusOtpInput(index + 1);
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const nextDigits = Array(OTP_LENGTH)
      .fill("")
      .map((_, idx) => pasted[idx] || "");

    setOtpValues(nextDigits);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    focusOtpInput(nextIndex);
  };

  const resetOtp = () => {
    setOtpValues(Array(OTP_LENGTH).fill(""));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/proxy/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      resetOtp();
      setIsEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate OTP length
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit OTP`);
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/proxy/auth/change-forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsPasswordReset(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPasswordReset) {
    return (
      <div className='min-h-screen flex items-center justify-center p-8 relative'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'></div>
        <div className='relative z-10 w-full max-w-md'>
          <div className='space-y-6'>
            {/* Success State */}
            <div className='text-center space-y-2'>
              <div className='w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-2xl'>
                <CheckCircle className='w-8 h-8 text-green-400' />
              </div>
              <h1
                className='text-3xl font-black text-white drop-shadow-lg'
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Password Reset Successful
              </h1>
              <p className='text-white/90 font-medium drop-shadow-md'>
                Your password has been reset successfully
              </p>
            </div>

            <Card className='border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20'>
              <CardContent className='p-8 text-center space-y-6'>
                <div className='space-y-4'>
                  <p className='text-white/80 text-sm leading-relaxed'>
                    You can now login with your new password.
                  </p>

                  <Link href='/login'>
                    <Button
                      className='w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200'
                    >
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isEmailSent) {
    return (
      <div className='min-h-screen flex'>
        {/* Left Section - OTP Form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center p-8 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'></div>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl'></div>
            <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl'></div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl'></div>
          </div>

          <div className='relative z-10 w-full max-w-md'>
            {/* Header */}
            <div className='text-center space-y-4 mb-8'>
              <div className='flex items-center justify-center mb-4'>
                <div className='w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-glow'>
                  <Image src='/logo.png' alt='Logo' width={80} height={80} />
                </div>
              </div>
              <h2 className='text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                Enter OTP
              </h2>
              <p className='text-gray-400 font-medium text-lg'>
                We&apos;ve sent an OTP to {email}
              </p>
            </div>

            {/* Form */}
            <div className='bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl'>
              {error && (
                <div className='mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm'>
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordReset} className='space-y-6'>
                {/* Email Field (read-only) */}
                <div className='space-y-3'>
                  <Label
                    htmlFor='otp-email'
                    className='text-sm font-semibold text-gray-300'
                  >
                    Email Address
                  </Label>
                  <div className='relative group'>
                    <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <Input
                      id='otp-email'
                      type='email'
                      value={email}
                      readOnly
                      className='pl-12 h-14 bg-white/10 backdrop-blur-sm border-white/15 text-white rounded-2xl'
                    />
                  </div>
                </div>

                {/* OTP Field */}
                <div className='space-y-3'>
                  <Label className='text-sm font-semibold text-gray-300'>
                    OTP Code
                  </Label>
                  <div className='flex items-center justify-between gap-2 md:gap-3'>
                    {otpDigits.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        id={index === 0 ? "otp" : undefined}
                        type='text'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        maxLength={1}
                        autoComplete='one-time-code'
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className='w-12 md:w-14 h-16 md:h-20 text-center text-2xl font-bold tracking-widest bg-transparent border-2 border-orange-400/70 focus:border-orange-400 focus:ring-orange-400/40 text-white rounded-2xl transition-all duration-200 shadow-sm focus:shadow-orange-500/20'
                      />
                    ))}
                  </div>
                  <p className='text-xs text-gray-400 text-center'>Enter the 6-digit code from your email</p>
                </div>

                {/* New Password Field */}
                <div className='space-y-3'>
                  <Label
                    htmlFor='newPassword'
                    className='text-sm font-semibold text-gray-300'
                  >
                    New Password
                  </Label>
                  <div className='relative group'>
                    <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-400 transition-colors' />
                    <Input
                      id='newPassword'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter new password'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className='pl-12 pr-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className='space-y-3'>
                  <Label
                    htmlFor='confirmPassword'
                    className='text-sm font-semibold text-gray-300'
                  >
                    Confirm Password
                  </Label>
                  <div className='relative group'>
                    <Lock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-400 transition-colors' />
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm new password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='pl-12 pr-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors'
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin mr-2' />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              {/* Back to Email */}
              <div className='mt-8 pt-6 border-t border-white/10 text-center'>
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    resetOtp();
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className='inline-flex items-center text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors'
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Back to Email
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Vouchers */}
        <div className='hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-orange-900'></div>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse'></div>
            <div className='absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-bounce'></div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-ping'></div>
          </div>

          <div className='relative z-10 text-center space-y-8'>
            <div className='space-y-4'>
              <h3 className='text-3xl font-black text-white drop-shadow-2xl'>
                Special Offers
              </h3>
              <p className='text-white/80 font-medium text-lg'>
                Get exclusive vouchers for our services
              </p>
            </div>

            <div className='flex space-y-6 items-center'>
              <Image
                src='/voucher1.png'
                alt='Voucher 1'
                width={250}
                height={120}
                className=' animate-float hover:scale-105 transition-transform duration-300'
              />
              <Image
                src='/voucher2.png'
                alt='Voucher 2'
                width={300}
                height={120}
                className=' animate-float hover:scale-105 transition-transform duration-300'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left Section - Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 relative'>
        {/* Background with modern gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'></div>

        {/* Animated background elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10 w-full max-w-md'>
          {/* Header */}
          <div className='text-center space-y-4 mb-8'>
            <div className='flex items-center justify-center mb-4'>
              <div className='w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-glow'>
                <Image src='/logo.png' alt='Logo' width={80} height={80} />
              </div>
              <h2 className='text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                Reset Password
              </h2>
            </div>
            <p className='text-gray-400 font-medium text-lg'>
              Enter your email to receive a reset link
            </p>
          </div>

          {/* Form */}
          <div className='bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl'>
            {error && (
              <div className='mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className='space-y-6'>
              {/* Email Field */}
              <div className='space-y-3'>
                <Label
                  htmlFor='email'
                  className='text-sm font-semibold text-gray-300'
                >
                  Email Address
                </Label>
                <div className='relative group'>
                  <Mail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-400 transition-colors' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 rounded-2xl text-white placeholder:text-gray-400'
                    required
                  />
                </div>
                <p className='text-xs text-gray-400 mt-2'>
                  We&apos;ll send you an OTP code to reset your password
                </p>
              </div>

              {/* Reset Button */}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin mr-2' />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className='mt-8 pt-6 border-t border-white/10 text-center'>
              <Link
                href='/login'
                className='inline-flex items-center text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Vouchers */}
      <div className='hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative'>
        {/* Background with modern gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-orange-900'></div>

        {/* Animated background elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-bounce'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-ping'></div>
        </div>

        <div className='relative z-10 text-center space-y-8'>
          <div className='space-y-4'>
            <h3 className='text-3xl font-black text-white drop-shadow-2xl'>
              Special Offers
            </h3>
            <p className='text-white/80 font-medium text-lg'>
              Get exclusive vouchers for our services
            </p>
          </div>

          <div className='flex space-y-6 items-center'>
            <Image
              src='/voucher1.png'
              alt='Voucher 1'
              width={250}
              height={120}
              className=' animate-float hover:scale-105 transition-transform duration-300'
            />
            <Image
              src='/voucher2.png'
              alt='Voucher 2'
              width={300}
              height={120}
              className=' animate-float hover:scale-105 transition-transform duration-300'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

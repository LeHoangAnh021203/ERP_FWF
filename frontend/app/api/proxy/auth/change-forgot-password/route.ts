import { NextRequest, NextResponse } from "next/server";
import { getApiEndpoint, AUTH_CONFIG } from '@/app/lib/auth-config'

// API endpoint configuration
const CHANGE_FORGOT_PASSWORD_ENDPOINT = getApiEndpoint('auth/change-forgot-password');

// In development, disable SSL certificate verification for testing
// WARNING: This is only for development. Never use in production!
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Temporary fix for SSL certificate mismatch in production
// TODO: Fix backend certificate to include backend.facewashfox.com or use correct domain
// WARNING: This bypasses SSL verification - only use temporarily!
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_SSL === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('⚠️ SSL verification disabled in production - this is insecure!')
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: "Invalid request body", details: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    const { email, otp, newPassword, confirmPassword } = body;

    console.log("🔍 Change forgot password attempt:", {
      email,
      otp: otp ? "***" : "empty",
      newPassword: newPassword ? "***" : "empty",
      confirmPassword: confirmPassword ? "***" : "empty",
      CHANGE_FORGOT_PASSWORD_ENDPOINT,
    });

    // Runtime diagnostics to verify env configuration
    console.log('🧪 Auth Change Forgot Password Diagnostics:', {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
      AUTH_CONFIG_API_BASE_URL: AUTH_CONFIG.API_BASE_URL,
      AUTH_CONFIG_API_PREFIX: AUTH_CONFIG.API_PREFIX,
      CHANGE_FORGOT_PASSWORD_ENDPOINT,
      NODE_ENV: process.env.NODE_ENV,
    })

    // Validate required fields
    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Missing required fields: email, otp, newPassword, confirmPassword" },
        { status: 400 }
      );
    }

    console.log('🌐 Calling real API:', CHANGE_FORGOT_PASSWORD_ENDPOINT)

    try {
      // Call the real API with timeout
      const apiResponse = await fetch(CHANGE_FORGOT_PASSWORD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
          confirmPassword,
        }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });

      console.log('📡 API Response Status:', apiResponse.status, apiResponse.statusText);

      // Get response text first to handle both JSON and text responses
      const responseText = await apiResponse.text();
      console.log('📡 API Response Body:', responseText);

      if (!apiResponse.ok) {
        // Try to parse as JSON, fallback to text
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || `HTTP ${apiResponse.status}: ${apiResponse.statusText}` };
        }

        console.error('❌ Change Forgot Password API Error:', {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
          error: errorData,
        });

        return NextResponse.json(
          { 
            error: errorData.message || errorData.error || `HTTP ${apiResponse.status}: ${apiResponse.statusText}`,
            details: errorData 
          },
          { status: apiResponse.status }
        );
      }

      // Parse successful response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.warn('⚠️ Failed to parse response as JSON, treating as text:', e);
        data = { message: responseText };
      }

      console.log('✅ Change forgot password success:', data);
      return NextResponse.json(data);
    } catch (apiError) {
      console.error("❌ API Connection failed:", apiError);
      
      // Handle timeout errors
      if (apiError instanceof Error && apiError.name === 'AbortError') {
        return NextResponse.json(
          {
            error: "Request timeout",
            details: "The request took too long. Please try again.",
          },
          { status: 504 }
        );
      }

      // Handle connection errors
      if (apiError instanceof TypeError && apiError.message.includes("fetch")) {
        return NextResponse.json(
          {
            error: "Connection failed",
            details: "Unable to connect to authentication server. Please check if the API is running.",
          },
          { status: 503 }
        );
      }

      throw apiError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('❌ Change Forgot Password Error:', error);
    
    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Connection failed",
          details: "Unable to connect to authentication server. Please check if the API is running.",
        },
        { status: 503 }
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    const isConnError = /ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed/i.test(message);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "An unexpected error occurred"
      },
      { status: isConnError ? 502 : 500 }
    );
  }
}


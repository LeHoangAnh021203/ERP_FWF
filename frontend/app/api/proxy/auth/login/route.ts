import { NextRequest, NextResponse } from "next/server";
import { getApiEndpoint, AUTH_CONFIG } from '@/app/lib/auth-config'
// API endpoint configuration
const LOGIN_ENDPOINT = getApiEndpoint('auth/login');

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
    const body = await request.json();
    const { username, password } = body;

    console.log("🔍 Login attempt:", {
      username,
      password: password ? "***" : "empty",
      LOGIN_ENDPOINT,
      mode: 'api'
    });

    // Runtime diagnostics to verify env configuration
    console.log('🧪 Auth Login Diagnostics:', {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
      AUTH_CONFIG_API_BASE_URL: AUTH_CONFIG.API_BASE_URL,
      AUTH_CONFIG_API_PREFIX: AUTH_CONFIG.API_PREFIX,
      LOGIN_ENDPOINT,
      NODE_ENV: process.env.NODE_ENV,
      FORCE_MOCK_MODE: false,
      resolvedMode: 'api'
    })


    console.log('🌐 Calling real API:', LOGIN_ENDPOINT)

    try {
      // Call the real API (primary endpoint)
      const apiResponse = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });

      console.log("📡 API Response Status:", apiResponse.status);
      console.log(
        "📡 API Response Headers:",
        Object.fromEntries(apiResponse.headers.entries())
      );

      // If primary failed with route-ish errors, try fallback endpoint toggling prefix
      if (!apiResponse.ok) {
        const status = apiResponse.status
        let errorBody: unknown = null
        try { errorBody = await apiResponse.json() } catch {}
        console.warn('⚠️ Primary login endpoint failed:', { status, errorBody })
        
        // Check if error indicates email is not verified before trying fallback
        const primaryError = (typeof errorBody === 'object' && errorBody !== null) ? errorBody as Record<string, unknown> : {}
        // Backend may use 'message', 'error', or 'details' fields, also check 'statusCode'
        const primaryErrorMsg = (primaryError['error'] ?? primaryError['message'] ?? primaryError['statusCode'] ?? '') as string
        const primaryErrorDetails = (primaryError['details'] ?? primaryError['detail'] ?? '') as string
        const combinedErrorText = `${primaryErrorMsg} ${primaryErrorDetails}`.toLowerCase()
        
        console.log('🔍 Checking for verification error:', {
          status,
          primaryErrorMsg,
          primaryErrorDetails,
          combinedErrorText,
          primaryError: Object.keys(primaryError)
        })
        
        // Check for verification errors in status code, fields, message, or details
        const isEmailNotVerifiedPrimary = status === 403 || 
                                          status === 423 ||
                                          primaryError['emailVerified'] === false ||
                                          primaryError['email_verified'] === false ||
                                          primaryError['verified'] === false ||
                                          combinedErrorText.includes("verify") ||
                                          combinedErrorText.includes("verification") ||
                                          combinedErrorText.includes("unverified") ||
                                          combinedErrorText.includes("not verified") ||
                                          combinedErrorText.includes("account is not verified") ||
                                          combinedErrorText.includes("verification token expired") ||
                                          combinedErrorText.includes("token expired") ||
                                          combinedErrorText.includes("link has expired") ||
                                          combinedErrorText.includes("chưa xác thực") ||
                                          combinedErrorText.includes("cần được xác thực") ||
                                          combinedErrorText.includes("mail đã tồn tại nhưng cần được xác thực")
        
        console.log('🔍 Verification check result:', {
          isEmailNotVerifiedPrimary,
          hasVerifyKeyword: combinedErrorText.includes("verify"),
          hasNotVerified: combinedErrorText.includes("not verified"),
          hasAccountNotVerified: combinedErrorText.includes("account is not verified")
        })
        
        // If email not verified, return immediately without trying fallback
        if (isEmailNotVerifiedPrimary) {
          console.log('✅ Email not verified detected, returning verification error response')
          const email = (primaryError['email'] ?? (username.includes("@") ? username : null)) as string | null
          // Use details if available (it usually has the specific message), otherwise use message
          const errorMessage = primaryErrorDetails || primaryErrorMsg || 'Email chưa được xác thực'
          const response = {
            error: String(primaryError['error'] ?? primaryError['message'] ?? 'Email chưa được xác thực'),
            details: String(errorMessage),
            message: String(errorMessage),
            emailVerified: false,
            ...(email && { email })
          }
          console.log('📤 Returning verification error response:', response)
          return NextResponse.json(response, { status })
        }

        // Build a fallback endpoint by toggling the prefix presence
        const hasPrefix = (AUTH_CONFIG.API_PREFIX || '').trim() !== ''
        const base = (AUTH_CONFIG.API_BASE_URL || '').replace(/\/+$/, '')
        const altPrefix = hasPrefix ? '' : '/api'
        const altEndpoint = `${base}${altPrefix}/auth/login`

        console.log('🔁 Retrying login with fallback endpoint:', altEndpoint)
        const fallbackResp = await fetch(altEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ username, password }),
          signal: AbortSignal.timeout(10000)
        })

        if (!fallbackResp.ok) {
          let fbError: unknown = null
          try { fbError = await fallbackResp.json() } catch {}
          console.error('❌ Fallback login endpoint also failed:', { status: fallbackResp.status, fbError })

          const fb = (typeof fbError === 'object' && fbError !== null) ? fbError as Record<string, unknown> : {}
          const primary = (typeof errorBody === 'object' && errorBody !== null) ? errorBody as Record<string, unknown> : {}
          const errorMsg = (fb['error'] ?? primary['error'] ?? 'Login failed') as string
          const detailsMsg = (fb['details'] ?? fb['message'] ?? primary['details'] ?? primary['message'] ?? 'Please check your credentials and try again') as string
          const combinedMsg = `${errorMsg} ${detailsMsg}`.toLowerCase()
          
          // Check if error indicates email is not verified
          const isEmailNotVerified = status === 403 || 
                                     status === 423 ||
                                     fallbackResp.status === 403 ||
                                     fallbackResp.status === 423 ||
                                     (fb['emailVerified'] === false) ||
                                     (primary['emailVerified'] === false) ||
                                     (fb['email_verified'] === false) ||
                                     (primary['email_verified'] === false) ||
                                     (fb['verified'] === false) ||
                                     (primary['verified'] === false) ||
                                     combinedMsg.includes("verify") ||
                                     combinedMsg.includes("verification") ||
                                     combinedMsg.includes("unverified") ||
                                     combinedMsg.includes("not verified") ||
                                     combinedMsg.includes("account is not verified") ||
                                     combinedMsg.includes("verification token expired") ||
                                     combinedMsg.includes("token expired") ||
                                     combinedMsg.includes("link has expired") ||
                                     combinedMsg.includes("chưa xác thực") ||
                                     combinedMsg.includes("cần được xác thực") ||
                                     combinedMsg.includes("mail đã tồn tại nhưng cần được xác thực")

          // Extract email from error response if available
          const email = (fb['email'] ?? primary['email'] ?? (username.includes("@") ? username : null)) as string | null

          return NextResponse.json(
            { 
              error: String(errorMsg), 
              details: String(detailsMsg),
              message: String(detailsMsg || errorMsg),
              ...(isEmailNotVerified && { emailVerified: false, email })
            },
            { status: fallbackResp.status }
          )
        }

        // Use fallback successful response
        const data = await fallbackResp.json()
        console.log('✅ API Login successful (fallback):', {
          role: data.role,
          user: data.user?.username,
          hasAccessToken: !!data.access_token,
          hasRefreshToken: !!data.refresh_token,
        })
        return NextResponse.json(data)
      }

      // Parse successful response
      const data = await apiResponse.json();
      console.log("✅ API Login successful:", {
        role: data.role,
        user: data.user?.username,
        hasAccessToken: !!data.access_token,
        hasRefreshToken: !!data.refresh_token,
      });

      return NextResponse.json(data);
    } catch (apiError) {
      console.error("❌ API Connection failed:", apiError);
      
      // Check if error response contains email verification info
      if (apiError instanceof Response && !apiError.ok) {
        try {
          const errorData = await apiError.json();
          const status = apiError.status;
          const errorMsg = (errorData?.error || errorData?.message || "Connection failed") as string;
          
          // Check if error indicates email is not verified
          const isEmailNotVerified = status === 403 || 
                                     status === 423 ||
                                     errorData?.emailVerified === false ||
                                     errorData?.email_verified === false ||
                                     (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes("email") && 
                                      (errorMsg.toLowerCase().includes("verify") || 
                                       errorMsg.toLowerCase().includes("verification") ||
                                       errorMsg.toLowerCase().includes("unverified") ||
                                       errorMsg.toLowerCase().includes("not verified") ||
                                       errorMsg.toLowerCase().includes("chưa xác thực") ||
                                       errorMsg.toLowerCase().includes("cần được xác thực") ||
                                       errorMsg.toLowerCase().includes("mail đã tồn tại nhưng cần được xác thực")))

          const email = (errorData?.email ?? (username.includes("@") ? username : null)) as string | null

          if (isEmailNotVerified) {
            return NextResponse.json(
              {
                error: String(errorMsg),
                details: errorData?.details || errorData?.message || "Email chưa được xác thực",
                emailVerified: false,
                ...(email && { email })
              },
              { status }
            );
          }
        } catch {
          // If parsing fails, continue with default error handling
        }
      }
      
      return NextResponse.json(
        {
          error: "Connection failed",
          details: "Unable to connect to authentication server. Please check if the API is running.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("❌ Login error:", error);

    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Connection failed",
          details:
            "Unable to connect to authentication server. Please check if the API is running.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

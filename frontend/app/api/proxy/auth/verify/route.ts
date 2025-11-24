import { NextRequest, NextResponse } from "next/server";
import { getApiEndpoint, AUTH_CONFIG } from '@/app/lib/auth-config'

// API endpoint configuration
// Backend uses: /api/auth/register/verify
const VERIFY_ENDPOINT = getApiEndpoint('auth/register/verify');

// In development, disable SSL certificate verification for testing
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Temporary fix for SSL certificate mismatch in production
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_SSL === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('⚠️ SSL verification disabled in production - this is insecure!')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Verify attempt:", {
      token: token.substring(0, 10) + "...",
      VERIFY_ENDPOINT,
    });

    // Build verification URL with token
    const verifyUrl = `${VERIFY_ENDPOINT}?token=${encodeURIComponent(token)}`;

    console.log('🌐 Calling real API:', verifyUrl);

    // Call the real API
    const apiResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

      console.error('❌ Verify API Error:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        error: errorData,
      });

      // 410 Gone is typically used for expired tokens
      if (apiResponse.status === 410) {
        return NextResponse.json(
          { 
            error: errorData.message || errorData.error || "Verification link has expired",
            expired: true
          },
          { status: 410 }
        );
      }

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
      data = { message: responseText || "Account verified successfully" };
    }

    console.log('✅ Verify success:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Verify Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const isConnError = /ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed/i.test(message);
    
    return NextResponse.json(
      { 
        error: `Verification failed: ${message}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: isConnError ? 502 : 500 }
    );
  }
}


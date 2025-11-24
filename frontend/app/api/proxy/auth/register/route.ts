import { NextRequest, NextResponse } from "next/server";
import { getApiEndpoint, AUTH_CONFIG } from '@/app/lib/auth-config'

// API endpoint configuration
const REGISTER_ENDPOINT = getApiEndpoint('auth/register');

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
    const { username, emailOrPhoneNumber, password } = body;

    console.log("🔍 Register attempt:", {
      username,
      emailOrPhoneNumber,
      password: password ? "***" : "empty",
      REGISTER_ENDPOINT,
    });

    // Runtime diagnostics to verify env configuration
    console.log('🧪 Auth Register Diagnostics:', {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
      AUTH_CONFIG_API_BASE_URL: AUTH_CONFIG.API_BASE_URL,
      AUTH_CONFIG_API_PREFIX: AUTH_CONFIG.API_PREFIX,
      REGISTER_ENDPOINT,
      NODE_ENV: process.env.NODE_ENV,
    })

    // Validate required fields
    if (!username || !emailOrPhoneNumber || !password) {
      return NextResponse.json(
        { error: "Missing required fields: username, emailOrPhoneNumber, password" },
        { status: 400 }
      );
    }

    console.log('🌐 Calling real API:', REGISTER_ENDPOINT)

    // Call the real API
    const apiResponse = await fetch(REGISTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        emailOrPhoneNumber,
        password,
      }),
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

      console.error('❌ Register API Error:', {
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

    console.log('✅ Register success:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Register Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const isConnError = /ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed/i.test(message);
    
    return NextResponse.json(
      { 
        error: `Register failed: ${message}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: isConnError ? 502 : 500 }
    );
  }
}
















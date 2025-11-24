import { NextRequest, NextResponse } from "next/server";

/**
 * Redirect route for email verification links
 * Backend sends links like: /api/auth/register/verify?token=...
 * or sometimes: http:///api/auth/register/verify?token=... (malformed, missing domain)
 * This route redirects to the frontend verified page: /verified?token=...
 * 
 * Frontend domain: http://localhost:3000 (development) or production domain
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Get frontend base URL from environment or use request origin
    let frontendBaseUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!frontendBaseUrl && process.env.NEXT_PUBLIC_VERCEL_URL) {
      frontendBaseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
    
    if (!frontendBaseUrl) {
      frontendBaseUrl = request.headers.get('origin') || request.nextUrl.origin;
    }

    console.log('🔗 Email verification redirect:', {
      token: token ? token.substring(0, 10) + '...' : 'missing',
      url: request.url,
      frontendBaseUrl,
      origin: request.headers.get('origin'),
    });

    if (!token) {
      // If no token, redirect to verified page with error status
      const errorUrl = new URL('/verified', frontendBaseUrl);
      errorUrl.searchParams.set('status', 'error');
      console.log('❌ No token, redirecting to:', errorUrl.toString());
      return NextResponse.redirect(errorUrl);
    }

    // Build verify URL with frontend domain
    const verifyUrl = new URL('/verified', frontendBaseUrl);
    verifyUrl.searchParams.set('token', token);

    console.log('✅ Redirecting to:', verifyUrl.toString());
    return NextResponse.redirect(verifyUrl);
  } catch (error) {
    console.error('❌ Redirect error:', error);
    
    // Fallback: try to build URL from request
    try {
      let fallbackBaseUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!fallbackBaseUrl && process.env.NEXT_PUBLIC_VERCEL_URL) {
        fallbackBaseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
      }
      if (!fallbackBaseUrl) {
        fallbackBaseUrl = request.headers.get('origin') || request.nextUrl.origin;
      }
      const errorUrl = new URL('/verified?status=error', fallbackBaseUrl);
      return NextResponse.redirect(errorUrl);
    } catch {
      // Last resort: relative redirect
      return NextResponse.redirect(new URL('/verified?status=error', request.url));
    }
  }
}


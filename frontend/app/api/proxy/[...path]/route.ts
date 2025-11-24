import { NextRequest, NextResponse } from 'next/server'
import { AUTH_CONFIG } from '@/app/lib/auth-config'

// Temporary fix for SSL certificate mismatch in production
// TODO: Fix backend certificate to include backend.facewashfox.com or use correct domain
// WARNING: This bypasses SSL verification - only use temporarily!
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_SSL === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  console.warn('⚠️ SSL verification disabled in production - this is insecure!')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    // Get Authorization header and cookies
    const authHeader = request.headers.get('Authorization')
    const cookies = request.headers.get('cookie')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    if (cookies) {
      headers['Cookie'] = cookies
    }

    // Build backend URL using centralized config and normalization
    const base = (AUTH_CONFIG.API_BASE_URL || '').replace(/\/+$/, '')
    const prefix = AUTH_CONFIG.API_PREFIX || ''
    const backendUrl = queryString 
      ? `${base}${prefix}/${path}?${queryString}`
      : `${base}${prefix}/${path}`
    
    console.log('🔍 Proxy GET Debug:', {
      path,
      backendUrl,
      queryString,
      hasAuth: !!authHeader,
      API_BASE_URL: AUTH_CONFIG.API_BASE_URL,
      API_PREFIX: AUTH_CONFIG.API_PREFIX,
      fullUrl: backendUrl
    })

    // Forward GET request to backend
    console.log('🚀 Forwarding GET request to:', backendUrl)
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
      // Add timeout for better error handling - reduced to 20s for Vercel compatibility
      signal: AbortSignal.timeout(20000), // 20 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details')
      console.error('❌ Backend GET Error:', {
        status: response.status,
        statusText: response.statusText,
        url: backendUrl,
        errorText
      })
      
      return NextResponse.json(
        { error: `Backend Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Backend GET Success:', { url: backendUrl, dataLength: Array.isArray(data) ? data.length : 'object' })
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Proxy GET Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isConnError = /ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|timeout|aborted/i.test(message)
    const isTimeout = /timeout|aborted/i.test(message)
    
    return NextResponse.json(
      { 
        error: `Proxy Error: ${message}`,
        details: isConnError 
          ? 'Cannot connect to backend server. Please check if backend is running at ' + AUTH_CONFIG.API_BASE_URL
          : isTimeout
          ? 'Request timeout. Backend server may be slow or unresponsive.'
          : 'Unknown proxy error'
      },
      { status: isConnError ? 502 : isTimeout ? 504 : 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  
  try {
    const body = await request.json()
    
    // Get Authorization header and cookies from original request
    const authHeader = request.headers.get('Authorization')
    const cookies = request.headers.get('cookie')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    if (cookies) {
      headers['Cookie'] = cookies
    }

    // Build backend URL using centralized config and normalization
    const base = (AUTH_CONFIG.API_BASE_URL || '').replace(/\/+$/, '')
    const prefix = AUTH_CONFIG.API_PREFIX || ''
    const backendUrl = `${base}${prefix}/${path}`
    
    console.log('🚀 Forwarding PATCH request to:', backendUrl)
    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(20000), // 20 second timeout
    })
    
    const responseText = await response.text()
    let responseData: unknown = null
    
    try {
      responseData = responseText ? JSON.parse(responseText) : null
    } catch {
      responseData = responseText
    }

    if (!response.ok) {
      console.error('❌ Backend PATCH Error:', {
        status: response.status,
        statusText: response.statusText,
        url: backendUrl,
        errorBody: responseData
      })
      
      return NextResponse.json(
        { error: `Backend Error: ${response.status} - ${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)}` },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
    
  } catch (error) {
    console.error('❌ Proxy PATCH Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isConnError = /ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|timeout|aborted/i.test(message)
    const isTimeout = /timeout|aborted/i.test(message)
    
    return NextResponse.json(
      { 
        error: `Proxy Error: ${message}`,
        details: isConnError 
          ? 'Cannot connect to backend server. Please check if backend is running at ' + AUTH_CONFIG.API_BASE_URL
          : isTimeout
          ? 'Request timeout. Backend server may be slow or unresponsive.'
          : 'Unknown proxy error'
      },
      { status: isConnError ? 502 : isTimeout ? 504 : 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  
  try {
    const body = await request.json()
    
    // Get Authorization header and cookies from original request
    const authHeader = request.headers.get('Authorization')
    const cookies = request.headers.get('cookie')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    if (cookies) {
      headers['Cookie'] = cookies
    }

    // Build backend URL using centralized config and normalization
    const base = (AUTH_CONFIG.API_BASE_URL || '').replace(/\/+$/, '')
    const prefix = AUTH_CONFIG.API_PREFIX || ''
    const backendUrl = `${base}${prefix}/${path}`
    
    console.log('🔍 Proxy Debug:', {
      path,
      backendUrl,
      hasAuth: !!authHeader,
      hasCookies: !!cookies,
      API_BASE_URL: AUTH_CONFIG.API_BASE_URL,
      API_PREFIX: AUTH_CONFIG.API_PREFIX
    })

    // Forward request to backend
    console.log('🚀 Forwarding POST request to:', backendUrl)
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(20000), // 20 second timeout
    })

    if (!response.ok) {
      console.error('❌ Backend Error:', {
        status: response.status,
        statusText: response.statusText,
        url: backendUrl
      })
      
      const errorText = await response.text()
      console.error('❌ Error Response:', errorText)
      
      return NextResponse.json(
        { error: `Backend Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Proxy POST Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isConnError = /ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|timeout|aborted/i.test(message)
    const isTimeout = /timeout|aborted/i.test(message)
    
    return NextResponse.json(
      { 
        error: `Proxy Error: ${message}`,
        details: isConnError 
          ? 'Cannot connect to backend server. Please check if backend is running at ' + AUTH_CONFIG.API_BASE_URL
          : isTimeout
          ? 'Request timeout. Backend server may be slow or unresponsive.'
          : 'Unknown proxy error'
      },
      { status: isConnError ? 502 : isTimeout ? 504 : 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { AUTH_CONFIG, getApiEndpoint } from '@/app/lib/auth-config'

export async function GET() {
  const base = AUTH_CONFIG.API_BASE_URL
  const prefix = AUTH_CONFIG.API_PREFIX
  const loginEndpoint = getApiEndpoint('auth/login')
  return NextResponse.json({
    ok: true,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX,
    AUTH_CONFIG_API_BASE_URL: base,
    AUTH_CONFIG_API_PREFIX: prefix,
    computed: {
      loginEndpoint
    },
    timestamp: new Date().toISOString()
  })
}



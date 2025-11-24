import { NextResponse } from 'next/server';
import { shouldUseMockMode, AUTH_CONFIG } from '@/app/lib/auth-config';

export async function GET() {
  const isMockMode = shouldUseMockMode();
  
  return NextResponse.json({
    mode: isMockMode ? 'mock' : 'api',
    apiUrl: isMockMode ? undefined : AUTH_CONFIG.API_BASE_URL,
    message: isMockMode 
      ? 'Mock Mode - Using local authentication' 
      : `API Mode - Connected to ${AUTH_CONFIG.API_BASE_URL}`,
    config: {
      forceMockMode: AUTH_CONFIG.FORCE_MOCK_MODE,
      hasApiUrl: !!process.env.NEXT_PUBLIC_API_BASE_URL,
      nodeEnv: process.env.NODE_ENV
    }
  });
}

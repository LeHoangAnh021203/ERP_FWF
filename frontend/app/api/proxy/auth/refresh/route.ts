import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Invalid or missing authorization header' },
        { status: 401 }
      )
    }

    // Mock refresh token response
    const mockAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImlhdCI6MTc1NTI0MzM5OCwiZXhwIjoxNzU1ODQ4MTk4fQ.Bszlu65gKFoLVHFydAKW3ls-8OSMbg5UIDGY3HFOkMo'
    
    return NextResponse.json({
      access_token: mockAccessToken,
      token_type: 'Bearer',
      expires_in: 3600
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Invalid or missing authorization header' },
        { status: 401 }
      )
    }

    // Mock refresh token response
    const mockAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImlhdCI6MTc1NTI0MzM5OCwiZXhwIjoxNzU1ODQ4MTk4fQ.Bszlu65gKFoLVHFydAKW3ls-8OSMbg5UIDGY3HFOkMo'
    
    return NextResponse.json({
      access_token: mockAccessToken,
      token_type: 'Bearer',
      expires_in: 3600
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { AUTH_CONFIG } from '@/app/lib/auth-config'

// DELETE /api/proxy/user/delete-user/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params
  const userId = resolved.id

  if (!userId) {
    return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    const cookies = request.headers.get('cookie')

    const headers: Record<string, string> = {}
    if (authHeader) headers['Authorization'] = authHeader
    if (cookies) headers['Cookie'] = cookies

    const base = (AUTH_CONFIG.API_BASE_URL || '').replace(/\/+$/, '')
    const prefix = AUTH_CONFIG.API_PREFIX || ''
    const backendUrl = `${base}${prefix}/user/delete-user/${encodeURIComponent(userId)}`

    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers,
    })

    const responseText = await response.text()
    let responseData: unknown = null
    try {
      responseData = responseText ? JSON.parse(responseText) : null
    } catch {
      responseData = responseText
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            typeof responseData === 'string'
              ? responseData
              : JSON.stringify(responseData),
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      responseData ?? { message: 'User deleted successfully' }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Proxy Error: ${message}` },
      { status: 500 }
    )
  }
}



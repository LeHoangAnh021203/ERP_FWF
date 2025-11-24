import { NextRequest, NextResponse } from 'next/server'

// Optional proxy to third-party account verification service (vietqr.io or aggregator)
// Requires environment variables to be set; otherwise returns 204 No Content.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bin = searchParams.get('bin')
    const account = searchParams.get('account')
    if (!bin || !account) {
      return NextResponse.json({ error: 'Missing bin or account' }, { status: 400 })
    }

    const API_URL = process.env.VIETQR_API_URL
    const API_KEY = process.env.VIETQR_API_KEY
    const CLIENT_ID = process.env.VIETQR_CLIENT_ID

    if (!API_URL || !API_KEY || !CLIENT_ID) {
      return new NextResponse(null, { status: 204 })
    }

    const url = `${API_URL}?bin=${encodeURIComponent(bin)}&account=${encodeURIComponent(account)}`
    const res = await fetch(url, {
      headers: {
        'x-client-id': CLIENT_ID,
        'x-api-key': API_KEY,
        'accept': 'application/json',
      },
    })
    const text = await res.text()
    let data: unknown = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error', details: data }, { status: res.status })
    }
    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}



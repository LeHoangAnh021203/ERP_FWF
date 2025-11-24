import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Quick Actions API called')

    // Mock quick actions data
    const quickActions = [
      {
        id: 'orders',
        icon: 'ShoppingCart',
        label: 'Order Report',
        color: 'hover:bg-blue-500 hover:border-blue-500',
        border: 'border-blue-500',
        
        href: '/dashboard/orders'
      },
      {
        id: 'customers',
        icon: 'Users',
        label: 'Customer Report',
        color: 'hover:bg-green-500 hover:border-green-500',
        border: 'border-green-500',
        href: '/dashboard/customers'
      },
      {
        id: 'services',
        icon: 'Radical',
        label: 'Services Report',
        color: 'hover:bg-purple-500 hover:border-purple-500',
        border: 'border-purple-500',
        href: '/dashboard/services'
      },
            {
        id: 'accounting',
        icon: 'BarChart3',
        label: 'Accounting Report',
        color: 'hover:bg-orange-500 hover:border-orange-500',
        border: 'border-orange-500',
        href: '/dashboard/accounting'
      },
      {
        id: 'generate-ai',
        icon: 'Sparkles',
        label: 'Generate AI',
        color: 'hover:bg-pink-500 hover:border-pink-500',
        border: 'border-pink-500',
        href: '/dashboard/generateAI'
      },
      {
        id: 'settings',
        icon: 'Settings',
        label: 'System Settings',
        color: 'hover:bg-gray-500 hover:border-gray-500',
        border: 'border-gray-500',
        href: '/dashboard/settings'
      }
    ]

    console.log('✅ Quick Actions data generated:', quickActions.length, 'actions')

    return NextResponse.json(quickActions, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('❌ Quick Actions API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch quick actions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Quick Actions POST called with:', body)

    // Handle any POST requests if needed
    return NextResponse.json({
      message: 'Quick actions updated successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Quick Actions POST error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update quick actions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

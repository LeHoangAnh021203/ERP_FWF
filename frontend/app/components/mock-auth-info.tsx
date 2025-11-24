"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Copy, Eye, EyeOff } from 'lucide-react'

interface MockUser {
  username: string
  email: string
  password: string
  name: string
  role: string
  avatar: string
}

const MOCK_ACCOUNTS: MockUser[] = [
  {
    username: 'admin',
    email: 'admin@facewashfox.com',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
    avatar: '🦊'
  },
  {
    username: 'manager',
    email: 'manager@facewashfox.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    avatar: '👨‍💼'
  },
  {
    username: 'staff',
    email: 'staff@facewashfox.com',
    password: 'staff123',
    name: 'Staff User',
    role: 'staff',
    avatar: '👩‍💼'
  },
  {
    username: 'demo',
    email: 'demo@facewashfox.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'manager',
    avatar: '🎭'
  }
]

export default function MockAuthInfo() {
  const [showPasswords, setShowPasswords] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  const copyToClipboard = (text: string, account: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(account)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'staff': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🎭 Mock Authentication Accounts
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-2"
          >
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPasswords ? 'Hide' : 'Show'} Passwords
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Use these accounts to test the application when mock mode is enabled
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_ACCOUNTS.map((account) => (
            <div
              key={account.username}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{account.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600">@{account.username}</p>
                  </div>
                </div>
                <Badge className={getRoleColor(account.role)}>
                  {account.role}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {account.email}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(account.email, `${account.username}-email`)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Password:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {showPasswords ? account.password : '••••••••'}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(account.password, `${account.username}-password`)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {copiedAccount === `${account.username}-email` && (
                <p className="text-xs text-green-600 mt-2">Email copied!</p>
              )}
              {copiedAccount === `${account.username}-password` && (
                <p className="text-xs text-green-600 mt-2">Password copied!</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Make sure <code className="bg-blue-100 px-1 rounded">USE_MOCK_AUTH=true</code> in your .env.local</li>
            <li>2. Restart your development server</li>
            <li>3. Use any of the accounts above to log in</li>
            <li>4. Set <code className="bg-blue-100 px-1 rounded">USE_MOCK_AUTH=false</code> to use real API</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

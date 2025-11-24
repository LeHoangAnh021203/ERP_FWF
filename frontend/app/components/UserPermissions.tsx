"use client"

import { useAuth } from "../contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export function UserPermissions() {
  const { user, permissions, isAdmin } = useAuth()

  if (!user) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          User Permissions
          {isAdmin && (
            <Badge variant="default" className="bg-red-500">
              ADMIN
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">User Info:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Permissions ({permissions.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {permissions.map((permission, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

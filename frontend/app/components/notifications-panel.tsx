"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Bell, CheckCircle, AlertTriangle, Info, X } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Order Completed",
    message: "Order #1234 has been successfully completed",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Low Stock Alert",
    message: "Product 'Wireless Headphones' is running low on stock",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "New Customer",
    message: "A new customer has registered on your platform",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "error",
    title: "Payment Failed",
    message: "Payment for order #5678 has failed",
    time: "3 hours ago",
    read: false,
  },
]

export function NotificationsPanel() {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </CardTitle>
        <Badge variant="secondary">{notifications.filter((n) => !n.read).length} new</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                notification.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  )
}

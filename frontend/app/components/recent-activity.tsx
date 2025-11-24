"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";

export const RecentActivity = React.memo(function RecentActivity() {
  const { recentActivity, loading, error } = useDashboardData();

  if (loading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !recentActivity || recentActivity.length === 0) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <p className="text-sm text-gray-600">Latest customer activities and transactions</p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p>No recent activity available</p>
            {error && <p className="text-sm mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "default";
      case "pending":
      case "processing":
        return "secondary";
      case "cancelled":
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getInitials = (description: string) => {
    const words = description.split(" ");
    return words.map(word => word[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <p className="text-sm text-gray-600">Latest customer activities and transactions</p>
      </CardHeader>
      <CardContent>
        <div className="block sm:hidden">
          {/* Mobile: Hiển thị dạng danh sách dọc */}
          <ul>
            {recentActivity.slice(0, 5).map((activity) => (
              <li key={activity.id} className="border-b border-gray-100 py-3 px-1">
                <div className="flex items-center space-x-3 mb-1">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {getInitials(activity.description)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{activity.type}</span>
                  <Badge
                    className="ml-auto"
                    variant={getStatusVariant(activity.status)}
                  >
                    {activity.status}
                  </Badge>
                </div>
                <div className="text-gray-600 text-sm">{activity.description}</div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{activity.amount ? `Số tiền: ${(activity.amount / 1000000).toFixed(1)} M` : ""}</span>
                  <span>{formatTime(activity.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.slice(0, 5).map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {getInitials(activity.description)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{activity.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{activity.description}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 w-[150px]">
                    {activity.amount ? `${(activity.amount / 1000000).toFixed(1)} M` : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusVariant(activity.status)}>
                      {activity.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatTime(activity.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
});

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { TrendingUp, Users, Star, MapPin } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";

export function CustomerInsights() {
  const { customerInsights, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-36"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !customerInsights || customerInsights.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              <p>No customer insights available</p>
              {error && <p className="text-sm mt-2">{error}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "satisfaction":
        return Star;
      case "retention":
        return Users;
      case "reach":
        return MapPin;
      case "growth":
        return TrendingUp;
      default:
        return TrendingUp;
    }
  };

  const getColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "satisfaction":
        return "text-yellow-500";
      case "retention":
        return "text-green-500";
      case "reach":
        return "text-blue-500";
      case "growth":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Customer Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customerInsights.map((insight) => {
            const IconComponent = getIcon(insight.type);
            const colorClass = getColor(insight.type);
            
            return (
              <div key={insight.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${colorClass}`} />
                    <span className="text-sm font-medium text-gray-700">{insight.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{insight.value}%</span>
                </div>
                <Progress value={insight.value} className="h-2" />
                <p className="text-xs text-gray-500">
                  {insight.change > 0 ? '+' : ''}{insight.change.toFixed(1)}% vs last month
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

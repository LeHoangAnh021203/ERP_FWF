"use client";

import {
  Landmark,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { Card, CardContent } from "./ui/card";

export const StatsCards = React.memo(function StatsCards() {
  const { stats, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                  <div className='h-8 bg-gray-200 rounded animate-pulse w-20'></div>
                  <div className='flex items-center space-x-2'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                  </div>
                </div>
                <div className='h-12 w-12 bg-gray-200 rounded-full animate-pulse'></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='bg-white'>
          <CardContent className='p-6'>
            <div className='text-center text-gray-500'>
              <p>Failed to load dashboard data</p>
              <p className='text-sm'>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Revenue",
      value: `${(stats.totalRevenue / 1000000).toFixed(1)} M`,
      change: `${
        stats.revenueChange > 0 ? "+" : ""
      }${stats.revenueChange.toFixed(1)}%`,
      trend: stats.revenueChange >= 0 ? "up" : "down",
      icon: Landmark,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.ordersChange > 0 ? "+" : ""}${stats.ordersChange.toFixed(
        1,
      )}%`,
      trend: stats.ordersChange >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: `${
        stats.customersChange > 0 ? "+" : ""
      }${stats.customersChange.toFixed(1)}%`,
      trend: stats.customersChange >= 0 ? "up" : "down",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: `${
        stats.productsChange > 0 ? "+" : ""
      }${stats.productsChange.toFixed(1)}%`,
      trend: stats.productsChange >= 0 ? "up" : "down",
      icon: Package,
      color: "text-orange-600",
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {statsData.map((stat) => (
        <Card key={stat.title} className='bg-white'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  {stat.title}
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {stat.value}
                </p>
                <div className='flex items-center mt-2'>
                  {stat.trend === "up" ? (
                    <TrendingUp className='h-4 w-4 text-green-500 mr-1' />
                  ) : (
                    <TrendingDown className='h-4 w-4 text-red-500 mr-1' />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className='text-sm text-gray-500 ml-1'>
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className='h-6 w-6' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

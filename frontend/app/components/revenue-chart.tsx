"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDashboardData } from "../hooks/useDashboardData";

export function RevenueChart() {
  const { revenueData, loading, error } = useDashboardData();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  
  const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== "string") return dateString;

    
    if (dateString.includes("T")) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
      }
    }

    // Handle other date formats
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
    }

    return dateString; // fallback
  };

  // Check if a date is weekend
  const isWeekend = (dateString: string) => {
    try {
      let date: Date;
      
      if (dateString.includes("T")) {
        date = new Date(dateString);
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) return false;
      
      const dayOfWeek = date.getDay();
      // 0 = Sunday, 6 = Saturday
      return dayOfWeek === 0 || dayOfWeek === 6;
    } catch {
      return false;
    }
  };



  // Format revenue for display
  const formatRevenue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} T`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} K`;
    }
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !revenueData || revenueData.length === 0) {
    return (
      <Card className="bg-white">
              <CardHeader>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Tổng Quan Doanh Thu</CardTitle>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>Doanh thu theo ngày trong tháng</p>
      </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'h-48' : 'h-64'} flex items-center justify-center text-gray-500`}>
            <div className="text-center">
              <p className={`${isMobile ? 'text-sm' : 'text-base'}`}>Không có dữ liệu doanh thu</p>
              {error && <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500 mt-2`}>{error}</p>}
              <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 mt-2`}>Kiểm tra console để xem debug logs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  // Filter data for mobile to show fewer bars when there are many days
  const displayData = isMobile && revenueData.length > 20 
    ? revenueData.filter((_, index) => index % 3 === 0) // Show every 3rd day on mobile for better readability
    : revenueData;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tổng Quan Doanh Thu</CardTitle>
        <p className="text-sm text-gray-600">Tổng hợp doanh thu tất cả regions theo ngày</p>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-2">
          <span className="inline-flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded mr-1"></span>
            Ngày thường
          </span>
          <span className="inline-flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded mr-1"></span>
            Cuối tuần
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`${isMobile ? 'h-48' : 'h-64'} overflow-x-auto`}>
          <div className="flex items-end justify-between space-x-0.5 sm:space-x-1 min-w-max">
            {displayData.map((item) => {
              const weekend = isWeekend(item.date);
              return (
                <div key={item.id} className="flex flex-col items-center flex-1 min-w-[16px] sm:min-w-[20px]">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-pointer ${
                      weekend ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{
                      height: `${(item.revenue / maxRevenue) * (isMobile ? 150 : 200)}px`,
                      minHeight: isMobile ? "12px" : "16px",
                    }}
                    title={`${formatDate(item.date)}: ${formatRevenue(item.revenue)} VND`}
                  />
                  <span 
                    className={`${isMobile ? 'text-[7px]' : 'text-[9px]'} mt-1 sm:mt-2 whitespace-nowrap font-medium ${
                      weekend ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {formatDate(item.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>0</span>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{formatRevenue(maxRevenue)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

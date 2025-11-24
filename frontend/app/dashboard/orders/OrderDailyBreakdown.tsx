"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DailyOrderBreakdownData {
  date: string;
  totalOrders: number;
  shopCount: number;
  avgOrdersPerShop: number;
}

interface OrderDailyBreakdownProps {
  data: DailyOrderBreakdownData[];
  loading: boolean;
  error: string | null;
  isMobile: boolean;
}

export default function OrderDailyBreakdown({
  data,
  loading,
  error,
  isMobile,
}: OrderDailyBreakdownProps) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-xl font-medium text-gray-700 text-center mb-4">
          Thống kê đơn hàng theo ngày
        </div>
        <div className="text-blue-600 text-sm text-center">
          🔄 Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-xl font-medium text-gray-700 text-center mb-4">
          Thống kê đơn hàng theo ngày
        </div>
        <div className="text-red-600 text-sm text-center">
          ❌ Lỗi: {error}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-xl font-medium text-gray-700 text-center mb-4">
          Thống kê đơn hàng theo ngày
        </div>
        <div className="text-gray-500 text-sm text-center">
          Không có dữ liệu
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-4">
      <div className="text-xl font-medium text-gray-700 text-center mb-4">
        Thống kê đơn hàng theo ngày
      </div>
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
          />
          <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "totalOrders") return [value, "Tổng đơn hàng"];
              if (name === "shopCount") return [value, "Số cửa hàng"];
              if (name === "avgOrdersPerShop") return [value.toFixed(1), "TB đơn/cửa hàng"];
              return [value, name];
            }}
          />
          <Legend />
          <Bar 
            dataKey="totalOrders" 
            name="Tổng đơn hàng" 
            fill="#8884d8" 
          />
          <Bar 
            dataKey="shopCount" 
            name="Số cửa hàng" 
            fill="#82ca9d" 
          />
          <Bar 
            dataKey="avgOrdersPerShop" 
            name="TB đơn/cửa hàng" 
            fill="#ffc658" 
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Tổng đơn hàng</div>
          <div className="text-2xl font-bold text-blue-800">
            {data.reduce((sum, item) => sum + item.totalOrders, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Tổng cửa hàng</div>
          <div className="text-2xl font-bold text-green-800">
            {Math.max(...data.map(item => item.shopCount))}
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-600 font-medium">TB đơn/cửa hàng</div>
          <div className="text-2xl font-bold text-yellow-800">
            {(data.reduce((sum, item) => sum + item.avgOrdersPerShop, 0) / data.length).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}



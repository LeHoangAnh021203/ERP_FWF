"use client";

import React from "react";
import { Clock, ShoppingCart } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface SalesByHourTableProps {
  salesByHourLoading: boolean;
  salesByHourError: string | null;
  salesByHourData: Array<{
    date: string;
    totalSales: number;
    timeRange: string;
  }> | null;
}

export default function SalesByHourTable({
  salesByHourLoading,
  salesByHourError,
  salesByHourData,
}: SalesByHourTableProps) {
  const totalOrders = React.useMemo(() => {
    if (!salesByHourData || salesByHourData.length === 0) return 0;
    return salesByHourData.reduce((sum, item) => sum + item.totalSales, 0);
  }, [salesByHourData]);

  const chartData = React.useMemo(() => {
    if (!salesByHourData || salesByHourData.length === 0) return [];
    return salesByHourData.map((item, index) => ({
      ...item,
      index: index + 1,
      displayTime: item.timeRange.split(' - ')[0], // Show only start time
    }));
  }, [salesByHourData]);

  const colorPalette = [
    "#f16a3f",
    "#0693e3", 
    "#00d084",
    "#fcb900",
    "#9b51e0",
    "#41d1d9",
    "#ff6b6b",
    "#7bdcb5",
    "#ff6900",
    "#4ecdc4",
  ];

  return (
    <Card className="border-[#f16a3f]/20 shadow-lg bg-gradient-to-br from-white to-[#f16a3f]/10">
      <CardHeader className="bg-[#f16a3f] text-white rounded-t-lg p-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-white" />
          <CardTitle className="text-white font-bold text-lg">
            Số Lượng Đơn Hàng Theo Giờ
          </CardTitle>
        </div>
        <CardDescription className="text-white/90 font-medium">
          Phân tích số lượng đơn hàng theo từng khung giờ trong ngày
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f16a3f] rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#334862]">Tổng Đơn Hàng</h3>
                  <p className="text-sm text-gray-600">Trong ngày đã chọn</p>
                </div>
              </div>
              <div className="mt-2">
                {salesByHourLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : salesByHourError ? (
                  <span className="text-red-500 text-2xl font-bold">—</span>
                ) : (
                  <div className="text-2xl font-bold text-[#f16a3f]">
                    {totalOrders.toLocaleString("vi-VN")}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0693e3] rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#334862]">Giờ Cao Điểm</h3>
                  <p className="text-sm text-gray-600">Nhiều đơn nhất</p>
                </div>
              </div>
              <div className="mt-2">
                {salesByHourLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                ) : salesByHourError ? (
                  <span className="text-red-500 text-lg font-semibold">—</span>
                ) : salesByHourData && salesByHourData.length > 0 ? (
                  <div className="text-lg font-bold text-[#0693e3]">
                    {salesByHourData.reduce((max, item) => 
                      item.totalSales > max.totalSales ? item : max
                    ).timeRange}
                  </div>
                ) : (
                  <span className="text-gray-400 text-lg font-semibold">—</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00d084] rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#334862]">Trung Bình/Giờ</h3>
                  <p className="text-sm text-gray-600">Số đơn trung bình</p>
                </div>
              </div>
              <div className="mt-2">
                {salesByHourLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : salesByHourError ? (
                  <span className="text-red-500 text-2xl font-bold">—</span>
                ) : salesByHourData && salesByHourData.length > 0 ? (
                  <div className="text-2xl font-bold text-[#00d084]">
                    {Math.round(totalOrders / salesByHourData.length).toLocaleString("vi-VN")}
                  </div>
                ) : (
                  <span className="text-gray-400 text-2xl font-bold">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#334862] mb-4">Biểu Đồ Đơn Hàng Theo Giờ</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="displayTime" 
                  tick={{ fontSize: 12, fill: "#334862" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "#334862" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  formatter={(value: number, _name: string, props: { payload?: { timeRange: string } }) => [
                    `${value} đơn hàng`,
                    "Số lượng",
                  ]}
                  labelFormatter={(label: string, payload: readonly { payload?: { timeRange: string } }[]) => {
                    if (payload && payload[0]?.payload) {
                      return `Khung giờ: ${payload[0].payload.timeRange}`;
                    }
                    return `Giờ: ${label}`;
                  }}
                />
                <Bar
                  dataKey="totalSales"
                  radius={[4, 4, 0, 0]}
                  stroke="#f16a3f"
                  strokeWidth={1}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colorPalette[index % colorPalette.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Error and Loading States */}
          {salesByHourError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Lỗi tải dữ liệu: {salesByHourError}
              </p>
            </div>
          )}

          {salesByHourLoading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-sm">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Data Table */}
          {salesByHourData && !salesByHourLoading && !salesByHourError && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Chi Tiết Theo Khung Giờ</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {salesByHourData.map((item, index) => (
                  <div key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                      ></div>
                      <span className="font-medium text-gray-900">{item.timeRange}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#f16a3f]">
                        {item.totalSales.toLocaleString("vi-VN")} đơn
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";
import React from "react";
import { useTopSaleData } from "../hooks/useTopSaleData";
import { useDateRange } from "@/app/contexts/DateContext";

export default function TopSaleChart() {
  // Use global date context
  const { startDate, endDate, fromDate, toDate } = useDateRange();

  // Fetch data
  const { data, loading, error } = useTopSaleData(fromDate, toDate);

  // Lọc bỏ "Đặt lịch Online" khỏi bảng xếp hạng nhân viên
  const filteredData = data.filter(
    (item) =>
      item.employeeName !== "Đặt lịch Online" &&
      item.employeeName !== "letanlandmark81" &&
      item.employeeName !== "letanvinthaodien" &&
      item.employeeName !== "letancrescentmall"
  );

  // Tìm "Đặt lịch Online" để hiển thị riêng
  const onlineBooking = data.find(
    (item) => item.employeeName === "Đặt lịch Online"
  );

  // Tính tổng số booking (chỉ nhân viên, không bao gồm online booking)
  const totalBookings = filteredData.reduce(
    (sum, item) => sum + item.bookingCount,
    0
  );
  const topEmployee = filteredData[0];
  const avgBookings =
    filteredData.length > 0
      ? Math.round(totalBookings / filteredData.length)
      : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-red-600 text-center py-8">
          ❌ Lỗi tải dữ liệu: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="text-lg font-medium text-gray-700">
          Top Sale - Nhân viên có nhiều booking nhất
        </div>

        {/* Date range is controlled by parent dashboard */}
        <div className="text-sm text-gray-500 mt-1">
          {startDate && endDate ? (
            `${startDate.day}/${startDate.month}/${startDate.year} - ${endDate.day}/${endDate.month}/${endDate.year}`
          ) : (
            "Đang tải dữ liệu..."
          )}
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalBookings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Tổng booking</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {avgBookings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Trung bình/NV</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {topEmployee ? topEmployee.bookingCount.toLocaleString() : 0}
          </div>
          <div className="text-sm text-gray-600">
            Top NV: {topEmployee ? topEmployee.employeeName : "Chưa có dữ liệu"}
          </div>
        </div>
      </div>

      {/* Thông tin Đặt lịch Online */}
      {onlineBooking && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🌐</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  Đặt lịch Online
                </div>
                <div className="text-xs text-gray-600">
                  Kênh đặt lịch trực tuyến (không tính vào xếp hạng NV)
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {onlineBooking.bookingCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">booking</div>
            </div>
          </div>
        </div>
      )}

      {/* Bảng xếp hạng nhân viên */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Bảng xếp hạng nhân viên:
        </h3>
        <div className="space-y-2">
          {filteredData.slice(0, 10).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-orange-600"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {item.employeeName}
                </span>
              </div>
              <div className="text-sm font-semibold text-blue-600">
                {item.bookingCount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

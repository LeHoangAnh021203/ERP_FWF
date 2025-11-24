"use client";
import React from "react";

interface BookingStatusItem {
  status: string;
  count: number;
}

interface ServiceBookingStatusDataProps {
  bookingStatusData: BookingStatusItem[] | null;
  loading: boolean;
  error: string | null;
}

export default function ServiceBookingStatusData({
  bookingStatusData,
  loading,
  error,
}: ServiceBookingStatusDataProps) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Tỉ lệ trạng thái đặt lịch
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Tỉ lệ trạng thái đặt lịch
        </div>
        <div className="text-center text-red-500 py-8">
          Lỗi tải dữ liệu: {error}
        </div>
      </div>
    );
  }

  if (!bookingStatusData || bookingStatusData.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Tỉ lệ trạng thái đặt lịch
        </div>
        <div className="text-center text-gray-500 py-8">Không có dữ liệu</div>
      </div>
    );
  }

  const total = bookingStatusData.reduce((sum, item) => sum + item.count, 0);

  // Color mapping for different statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Khách đến":
        return "bg-green-500";
      case "Đã xác nhận":
        return "bg-blue-500";
      case "Chưa xác nhận":
        return "bg-yellow-500";
      case "Khách không đến":
        return "bg-red-500";
      case "Từ chối đặt lịch":
        return "bg-gray-500";
      default:
        return "bg-purple-500";
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
        Tỉ lệ trạng thái đặt lịch
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        
      </div>
      {/* Modern Chart */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <div className="relative">
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* Background circle */}
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  {/* Data circles */}
                  {(() => {
                    let currentAngle = 0;
                    return bookingStatusData.map((item, index) => {
                      const percentage = total > 0 ? item.count / total : 0;
                      const angle = percentage * 360;
                      const strokeDasharray = `${angle} ${360 - angle}`;

                      const circle = (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={currentAngle}
                          className={`${getStatusColor(
                            item.status
                          )} transition-all duration-1000 ease-out`}
                          style={{
                            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                          }}
                        />
                      );
                      currentAngle -= angle;
                      return circle;
                    });
                  })()}
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {total.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Tổng đặt lịch</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Bar Chart */}
          <div className="space-y-4">
            {bookingStatusData.map((item, index) => {
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              const barWidth = percentage;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {item.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-800">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(
                        item.status
                      )} rounded-full transition-all duration-1000 ease-out relative`}
                      style={{
                        width: `${barWidth}%`,
                        background: `linear-gradient(90deg, ${getStatusColor(
                          item.status
                        )} 0%, ${getStatusColor(item.status)}80 100%)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

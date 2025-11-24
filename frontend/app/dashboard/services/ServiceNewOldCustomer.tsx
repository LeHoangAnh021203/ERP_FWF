"use client";
import React from "react";

interface CustomerStatusData {
  newCustomers: number;
  returningCustomers: number;
}

interface ServiceNewOldCustomerProps {
  customerStatusData: CustomerStatusData | null;
  loading: boolean;
  error: string | null;
}

export default function ServiceNewOldCustomer({
  customerStatusData,
  loading,
  error,
}: ServiceNewOldCustomerProps) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Tỉ lệ khách hàng mới và cũ sử dụng dịch vụ
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
          Tỉ lệ khách hàng mới và cũ sử dụng dịch vụ
        </div>
        <div className="text-center text-red-500 py-8">
          Lỗi tải dữ liệu: {error}
        </div>
      </div>
    );
  }

  if (!customerStatusData) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Tỉ lệ khách hàng mới và cũ sử dụng dịch vụ
        </div>
        <div className="text-center text-gray-500 py-8">Không có dữ liệu</div>
      </div>
    );
  }

  const { newCustomers, returningCustomers } = customerStatusData;
  const total = newCustomers + returningCustomers;
  const newPercentage = total > 0 ? (newCustomers / total) * 100 : 0;
  const returningPercentage =
    total > 0 ? (returningCustomers / total) * 100 : 0;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4" data-search-ref="services_new_old">
        Tỉ lệ khách hàng mới và cũ sử dụng dịch vụ
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {newCustomers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Khách hàng mới</div>
          <div className="text-xs text-blue-500 mt-1">
            {newPercentage.toFixed(1)}% tổng số
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {returningCustomers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Khách hàng cũ</div>
          <div className="text-xs text-green-500 mt-1">
            {returningPercentage.toFixed(1)}% tổng số
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Tổng khách hàng</div>
          <div className="text-xs text-purple-500 mt-1">100% tổng số</div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="flex gap-2 items-center">
        <div className="w-[60%] rbg-gray-50 rounded-l">
          <div className="relative h-64 bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-center  space-x-8">
              {/* New Customers Bar */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-blue-500 rounded-t-lg transition-all duration-500 ease-out"
                  style={{
                    height: `${
                      (newCustomers /
                        Math.max(newCustomers, returningCustomers)) *
                      200
                    }px`,
                    minHeight: "20px",
                  }}
                ></div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-semibold text-blue-600">
                    {newCustomers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Mới</div>
                </div>
              </div>

              {/* Returning Customers Bar */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-green-500 rounded-t-lg transition-all duration-500 ease-out"
                  style={{
                    height: `${
                      (returningCustomers /
                        Math.max(newCustomers, returningCustomers)) *
                      200
                    }px`,
                    minHeight: "20px",
                  }}
                ></div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-semibold text-green-600">
                    {returningCustomers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Cũ</div>
                </div>
              </div>
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
              <span>
                {Math.max(newCustomers, returningCustomers).toLocaleString()}
              </span>
              <span>
                {(
                  Math.max(newCustomers, returningCustomers) * 0.75
                ).toLocaleString()}
              </span>
              <span>
                {(
                  Math.max(newCustomers, returningCustomers) * 0.5
                ).toLocaleString()}
              </span>
              <span>
                {(
                  Math.max(newCustomers, returningCustomers) * 0.25
                ).toLocaleString()}
              </span>
              <span>0</span>
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-gray-200"
                  style={{ top: `${(i / 4) * 100}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Khách hàng mới</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Khách hàng cũ</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="w-[40%] p-4 h-full">
          <h4 className="font-semibold text-gray-700 ">Phân tích:</h4>
          <div className="flex justify-center items-center">
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                • Khách hàng cũ chiếm{" "}
                <span className="font-semibold text-green-600">
                  {returningPercentage.toFixed(1)}%
                </span>{" "}
                tổng số khách hàng
              </p>
              <p>
                • Khách hàng mới chiếm{" "}
                <span className="font-semibold text-blue-600">
                  {newPercentage.toFixed(1)}%
                </span>{" "}
                tổng số khách hàng
              </p>
              <p>
                • Tỉ lệ khách hàng cũ/mới:{" "}
                <span className="font-semibold text-purple-600">
                  {(returningCustomers / newCustomers).toFixed(2)}:1
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

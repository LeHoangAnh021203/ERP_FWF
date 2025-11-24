"use client";
import React, { useState, useMemo } from "react";

interface TopCustomerData {
  phoneNumber: string;
  customerName: string;
  bookingCount: number;
}

interface ServiceTopCustomerProps {
  topCustomerData: TopCustomerData[] | null;
  loading: boolean;
  error: string | null;
}

type SortField = "customerName" | "bookingCount";
type SortDirection = "asc" | "desc";

export default function ServiceTopCustomer({
  topCustomerData,
  loading,
  error,
}: ServiceTopCustomerProps) {
  const [sortField, setSortField] = useState<SortField>("bookingCount");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Sort function
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!topCustomerData) return [];

    return [...topCustomerData].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "customerName":
          aValue = a.customerName || "";
          bValue = b.customerName || "";
          break;
        case "bookingCount":
          aValue = a.bookingCount || 0;
          bValue = b.bookingCount || 0;
          break;
        default:
          aValue = a.bookingCount || 0;
          bValue = b.bookingCount || 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [topCustomerData, sortField, sortDirection]);

  // Sort indicator component
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortDirection === "asc" ? (
      <span className="text-blue-600">↑</span>
    ) : (
      <span className="text-blue-600">↓</span>
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Top khách hàng sử dụng dịch vụ
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[520px] overflow-y-auto">
          <table className="min-w-[600px] w-full text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-yellow-200">
              <tr className="bg-yellow-200 font-bold text-gray-900">
                <th className="px-3 py-3 text-left rounded-tl-xl">STT</th>
                <th className="px-3 py-3 text-left">Tên khách hàng</th>
                <th className="px-3 py-3 text-left">Số điện thoại</th>
                <th className="px-3 py-3 text-right rounded-tr-xl">
                  Số lần đặt lịch
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-left">{i}</td>
                  <td className="px-3 py-2 text-left">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-3 py-2 text-left">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Top khách hàng sử dụng dịch vụ
        </div>
        <div className="text-center text-red-500 py-8">
          Lỗi tải dữ liệu: {error}
        </div>
      </div>
    );
  }

  if (!topCustomerData || topCustomerData.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
          Top khách hàng sử dụng dịch vụ
        </div>
        <div className="text-center text-gray-500 py-8">
          Không có dữ liệu khách hàng
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4">
        Top 10 khách hàng sử dụng dịch vụ
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[520px] overflow-y-auto">
        <table className="min-w-[600px] w-full text-xs sm:text-sm">
          <thead className="sticky top-0 z-10 bg-yellow-200">
            <tr className="bg-yellow-200 font-bold text-gray-900">
              <th className="px-3 py-3 text-left rounded-tl-xl">STT</th>
              <th
                className="px-3 py-3 text-left cursor-pointer hover:bg-yellow-300 transition-colors"
                onClick={() => handleSort("customerName")}
              >
                <div className="flex items-center gap-1">
                  Tên khách hàng
                  <SortIndicator field="customerName" />
                </div>
              </th>
              <th className="px-3 py-3 text-left">Số điện thoại</th>
              <th
                className="px-3 py-3 text-right cursor-pointer hover:bg-yellow-300 transition-colors rounded-tr-xl"
                onClick={() => handleSort("bookingCount")}
              >
                <div className="flex items-center justify-end gap-1">
                  Số lần đặt lịch
                  <SortIndicator field="bookingCount" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((customer, idx) => (
              <tr
                key={`${customer.customerName || "unknown"}-${
                  customer.phoneNumber || "unknown"
                }-${idx}`}
                className="hover:bg-gray-50"
              >
                <td className="px-3 py-2 text-left font-medium">{idx + 1}</td>
                <td className="px-3 py-2 text-left font-semibold text-orange-600">
                  {customer.customerName || "N/A"}
                </td>
                <td className="px-3 py-2 text-left text-gray-600">
                  {customer.phoneNumber || "N/A"}
                </td>
                <td className="px-3 py-2 text-center font-bold text-green-600">
                  {(customer.bookingCount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

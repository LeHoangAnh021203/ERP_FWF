"use client";
import React from "react";

interface ServiceTableData {
  serviceName: string;
  type: string;
  usageCount: number;
  usageDeltaCount: number;
  usagePercent: number;
  totalRevenue: number;
  revenueDeltaPercent: number;
  revenuePercent: number;
}

interface ServiceDataItem {
  tenDichVu: string;
  loaiDichVu: string;
  soLuong: number;
  tongGia: number;
  percentSoLuong: string;
  percentTongGia: string;
}

interface ServicesTableProps {
  serviceTableData: ServiceTableData[] | null;
  serviceTableLoading: boolean;
  serviceTableError: string | null;
  serviceData: ServiceDataItem[];
}

export default function ServicesTable({
  serviceTableData,
  serviceTableLoading,
  serviceTableError,
  serviceData,
}: ServicesTableProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-4">
      <div className="text-lg lg:text-xl font-medium text-gray-700 text-center mb-4 " data-search-ref="services_table">
        Bảng dịch vụ
      </div>
      {serviceTableLoading && (
        <div className="text-blue-600 text-sm text-center mb-4">
          🔄 Đang tải dữ liệu bảng dịch vụ...
        </div>
      )}
      {serviceTableError && (
        <div className="text-red-600 text-sm text-center mb-4">
          ❌ Lỗi API bảng dịch vụ: {serviceTableError}
        </div>
      )}
      <div className="overflow-x-auto">
        <div
          style={{
            maxHeight: 400,
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            width: "100%",
          }}
        >
          <table
            className="min-w-[700px] lg:min-w-full text-xs sm:text-sm border table-fixed"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead className="sticky top-0 z-10">
              <tr className="bg-yellow-200 text-gray-900">
                <th className="w-12 px-2 py-2 border text-center font-bold">
                  STT
                </th>
                <th className="w-64 px-2 py-2 border text-left font-bold">
                  Dịch vụ
                </th>
                <th className="w-24 px-2 py-2 border text-center font-bold">
                  Loại
                </th>
                <th className="w-20 px-2 py-2 border text-right font-bold bg-orange-100">
                  Số lượng
                </th>
                <th className="w-20 px-2 py-2 border text-right font-bold">
                  Δ
                </th>
                <th className="w-24 px-2 py-2 border text-right font-bold">
                  % Số lượng
                </th>
                <th className="w-32 px-2 py-2 border text-right font-bold bg-blue-100">
                  Tổng giá
                </th>
                <th className="w-20 px-2 py-2 border text-right font-bold">
                  % Δ
                </th>
                <th className="w-24 px-2 py-2 border text-right font-bold">
                  % Tổng giá
                </th>
              </tr>
            </thead>
            <tbody>
              {serviceTableData
                ? serviceTableData.map((s: ServiceTableData, idx: number) => (
                    <tr
                      key={`${s.serviceName}-${idx}`}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="w-12 px-2 py-1 border text-center">
                        {idx + 1}
                      </td>
                      <td
                        className="w-64 px-2 py-1 border text-left font-medium"
                        title={s.serviceName}
                      >
                        <div className="truncate">
                          <span className="hidden lg:inline">{s.serviceName}</span>
                          <span className="lg:hidden text-xs">{s.serviceName.length > 15 ? s.serviceName.substring(0, 15) + '...' : s.serviceName}</span>
                        </div>
                      </td>
                      <td className="w-24 px-2 py-1 border text-center">
                        {s.type}
                      </td>
                      <td className="w-20 px-2 py-1 border text-right font-bold bg-orange-100 text-orange-700">
                        {s.usageCount?.toLocaleString?.() ?? s.usageCount}
                      </td>
                      <td
                        className={`w-20 px-2 py-1 border text-right font-semibold ${
                          s.usageDeltaCount > 0
                            ? "text-green-600"
                            : s.usageDeltaCount < 0
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {s.usageDeltaCount?.toLocaleString?.() ??
                          s.usageDeltaCount}{" "}
                        {s.usageDeltaCount > 0
                          ? "↑"
                          : s.usageDeltaCount < 0
                          ? "↓"
                          : ""}
                      </td>
                      <td className="w-24 px-2 py-1 border text-right">
                        {s.usagePercent?.toFixed(1)}%
                      </td>
                      <td className="w-32 px-2 py-1 border text-right font-bold bg-blue-100 text-blue-700">
                        {s.totalRevenue?.toLocaleString?.() ??
                          s.totalRevenue}
                      </td>
                      <td
                        className={`w-20 px-2 py-1 border text-right font-semibold ${
                          s.revenueDeltaPercent > 100
                            ? "text-green-600"
                            : s.revenueDeltaPercent < 100
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {s.revenueDeltaPercent?.toFixed(1)}%{" "}
                        {s.revenueDeltaPercent > 100
                          ? "↑"
                          : s.revenueDeltaPercent < 100
                          ? "↓"
                          : ""}
                      </td>
                      <td className="w-24 px-2 py-1 border text-right">
                        {s.revenuePercent?.toFixed(1)}%
                      </td>
                    </tr>
                  ))
                : serviceData.map((s: ServiceDataItem, idx: number) => {
                    const delta =
                      Math.floor(Math.random() * 1000) *
                      (Math.random() > 0.2 ? 1 : -1);
                    const percentDelta =
                      delta > 0
                        ? (Math.random() * 10 + 100).toFixed(1)
                        : (Math.random() * 10 + 90).toFixed(1);
                    return (
                      <tr
                        key={`${s.tenDichVu}-${idx}`}
                        className={
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="w-12 px-2 py-1 border text-center">
                          {idx + 1}
                        </td>
                        <td
                          className="w-64 px-2 py-1 border text-left font-medium"
                          title={s.tenDichVu}
                        >
                          <div className="truncate">
                            <span className="hidden lg:inline">{s.tenDichVu}</span>
                            <span className="lg:hidden text-xs">{s.tenDichVu.length > 15 ? s.tenDichVu.substring(0, 15) + '...' : s.tenDichVu}</span>
                          </div>
                        </td>
                        <td className="w-24 px-2 py-1 border text-center">
                          {s.loaiDichVu}
                        </td>
                        <td className="w-20 px-2 py-1 border text-right font-bold bg-orange-100 text-orange-700">
                          {s.soLuong?.toLocaleString?.() ?? s.soLuong}
                        </td>
                        <td
                          className={`w-20 px-2 py-1 border text-right font-semibold ${
                            delta > 0
                              ? "text-green-600"
                              : delta < 0
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {delta?.toLocaleString?.() ?? delta}{" "}
                          {delta > 0 ? "↑" : delta < 0 ? "↓" : ""}
                        </td>
                        <td className="w-24 px-2 py-1 border text-right">
                          {s.percentSoLuong}%
                        </td>
                        <td className="w-32 px-2 py-1 border text-right font-bold bg-blue-100 text-blue-700">
                          {s.tongGia?.toLocaleString?.() ?? s.tongGia}
                        </td>
                        <td
                          className={`w-20 px-2 py-1 border text-right font-semibold ${
                            delta > 0
                              ? "text-green-600"
                              : delta < 0
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {percentDelta}%{" "}
                          {delta > 0 ? "↑" : delta < 0 ? "↓" : ""}
                        </td>
                        <td className="w-24 px-2 py-1 border text-right">
                          {s.percentTongGia}%
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-400 sticky bottom-0 z-10">
                <td className="w-12 px-2 py-1 border text-center"></td>
                <td className="w-64 px-2 py-1 border text-left">
                  <span className="hidden lg:inline">Tổng cộng</span>
                  <span className="lg:hidden text-xs">Tổng</span>
                </td>
                <td className="w-24 px-2 py-1 border text-center"></td>
                <td className="w-20 px-2 py-1 border text-right bg-orange-100 text-orange-700">
                  {serviceTableData
                    ? serviceTableData
                        .reduce((sum: number, s: ServiceTableData) => sum + (s.usageCount || 0), 0)
                        .toLocaleString()
                    : serviceData
                        .reduce((sum: number, s: ServiceDataItem) => sum + (s.soLuong || 0), 0)
                        .toLocaleString()}
                </td>
                <td className="w-20 px-2 py-1 border text-right">
                  {serviceTableData
                    ? (
                        serviceTableData.reduce(
                          (sum: number, s: ServiceTableData) => sum + (s.usageDeltaCount || 0),
                          0
                        ) / serviceTableData.length
                      ).toFixed(0)
                    : "—"}
                </td>
                <td className="w-24 px-2 py-1 border text-right">100%</td>
                <td className="w-32 px-2 py-1 border text-right bg-blue-100 text-blue-700">
                  {serviceTableData
                    ? serviceTableData
                        .reduce((sum: number, s: ServiceTableData) => sum + (s.totalRevenue || 0), 0)
                        .toLocaleString()
                    : serviceData
                        .reduce((sum: number, s: ServiceDataItem) => sum + (s.tongGia || 0), 0)
                        .toLocaleString()}
                </td>
                <td className="w-20 px-2 py-1 border text-right">
                  {serviceTableData
                    ? (
                        serviceTableData.reduce(
                          (sum: number, s: ServiceTableData) => sum + (s.revenueDeltaPercent || 0),
                          0
                        ) / serviceTableData.length
                      ).toFixed(1)
                    : "—"}
                </td>
                <td className="w-24 px-2 py-1 border text-right">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
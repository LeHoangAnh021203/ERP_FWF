"use client";
import React from "react";

type Props = {
  data: Record<string, unknown> | null;
  loading?: boolean;
  error?: string | null;
};

function getNumber(input: unknown): number {
  if (typeof input === "number" && Number.isFinite(input)) return input;
  if (typeof input === "string") {
    const parsed = Number(input);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export default function CustomerNewOldSummaryTable({
  data,
  loading,
  error,
}: Props) {
  const totalNewCustomers = getNumber(data?.["totalNewCustomers"]);
  const actualNewCustomers = getNumber(data?.["actualNewCustomers"]);
  const previousNewCustomers = getNumber(data?.["previousNewCustomers"]);
  const previousActualNewCustomers = getNumber(
    data?.["previousActualNewCustomers"]
  );
  const growthTotalNew = getNumber(data?.["growthTotalNew"]);
  const growthActualNew = getNumber(data?.["growthActualNew"]);

  const totalOldCustomers = getNumber(data?.["totalOldCustomers"]);
  const actualOldCustomers = getNumber(data?.["actualOldCustomers"]);
  const previousOldCustomers = getNumber(data?.["previousOldCustomers"]);
  const previousActualOldCustomers = getNumber(
    data?.["previousActualOldCustomers"]
  );
  const growthTotalOld = getNumber(data?.["growthTotalOld"]);
  const growthActualOld = getNumber(data?.["growthActualOld"]);

  const GrowthBadge = ({ value }: { value: number }) => {
    const isPositive = value > 0;
    const isZero = value === 0;
    const color = isZero
      ? "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
      : isPositive
      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
      : "bg-red-50 text-red-700 ring-1 ring-red-200";
    const arrow = isZero ? "→" : isPositive ? "↑" : "↓";
    const sign = isZero ? "" : isPositive ? "+" : "";
    return (
      <span
        className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        {arrow}
        {sign}
        {value.toFixed(2)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-red-600">Lỗi tải dữ liệu: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2" data-search-ref="customers_summary">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Tổng hợp khách hàng mới/cũ
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tổng số và số khách thực đi trong khoảng ngày đã chọn
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Khách mới */}
        <div className="rounded-xl border border-green-500 bg-gradient-to-br from-green-50/60 to-green-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <h4 className="text-sm font-semibold text-blue-900">Khách mới</h4>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-100 p-3">
              <span className="flex justify-between">
                <div className="text-xs text-gray-500">Tổng số</div>
                <GrowthBadge value={growthTotalNew} />
              </span>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {totalNewCustomers.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                Kỳ trước: {previousNewCustomers.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-100 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Thực đi</div>
                <GrowthBadge value={growthActualNew} />
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {actualNewCustomers.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                Thực đi kỳ trước: {previousActualNewCustomers.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Card Khách cũ */}
        <div className="rounded-xl border border-red-600 bg-gradient-to-br from-red-50/60 to-red-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <h4 className="text-sm font-semibold text-amber-950">Khách cũ</h4>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-100 p-3">
              <span className="flex justify-between">
                <div className="text-xs text-gray-500">Tổng số</div>
                <GrowthBadge value={growthTotalOld} />
              </span>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {totalOldCustomers.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                Kỳ trước: {previousOldCustomers.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-100 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Thực đi</div>
                <GrowthBadge value={growthActualOld} />
              </div>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {actualOldCustomers.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                Thực đi kỳ trước: {previousActualOldCustomers.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

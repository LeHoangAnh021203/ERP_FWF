import React from "react";

interface CustomerSummaryCardProps {
  value: number | string;
  label: string;
  percentChange?: number;
  loading?: boolean;
  error?: string | null;
}

const CustomerSummaryCard: React.FC<CustomerSummaryCardProps> = ({
  value,
  label,
  percentChange,
  loading,
  error,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 lg:p-6 flex flex-col items-center col-span-1 lg:col-span-4">
      <div className="text-sm lg:text-xl text-gray-700 mb-2 text-center font-semibold">
        {label}
      </div>
      <div className="text-3xl lg:text-5xl font-bold text-[#f66035] mb-2">
        {loading ? (
          <span>Đang tải dữ liệu...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <>
            {value} <span className="text-lg lg:text-2xl">khách</span>
          </>
        )}
      </div>
      {percentChange !== undefined && !loading && !error && (
        <div
          className={`text-base lg:text-xl font-semibold ${
            percentChange > 0
              ? "text-green-600"
              : percentChange < 0
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {percentChange > 0 ? "↑" : percentChange < 0 ? "↓" : ""} {Math.abs(percentChange).toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default CustomerSummaryCard;
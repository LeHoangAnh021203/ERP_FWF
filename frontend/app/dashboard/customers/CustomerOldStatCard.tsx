import React from "react";

interface CustomerOldStatCardProps {
  data: {
    currentRange?: Array<{ count: number; [key: string]: unknown }>;
    previousRange?: Array<{ count: number; [key: string]: unknown }>;
  } | null;
  loading: boolean;
  error: string | null;
}

const CustomerOldStatCard: React.FC<CustomerOldStatCardProps> = ({
  data,
  loading,
  error,
}) => {
  // Tính tổng số khách cũ từ dữ liệu
  const totalOldCustomers = React.useMemo(() => {
    if (!data || !data.currentRange) return 0;

    const currentRange = Array.isArray(data.currentRange)
      ? data.currentRange
      : [];
    return currentRange.reduce((total: number, item: { count: number; [key: string]: unknown }) => {
      return total + (item.count || 0);
    }, 0);
  }, [data]);

  // Tính tổng số khách cũ của kỳ trước
  const previousTotalOldCustomers = React.useMemo(() => {
    if (!data || !data.previousRange) return 0;

    const previousRange = Array.isArray(data.previousRange)
      ? data.previousRange
      : [];
    return previousRange.reduce((total: number, item: { count: number; [key: string]: unknown }) => {
      return total + (item.count || 0);
    }, 0);
  }, [data]);

  // Tính phần trăm thay đổi
  const changePercent = React.useMemo(() => {
    if (previousTotalOldCustomers === 0) return 0;
    return (
      ((totalOldCustomers - previousTotalOldCustomers) /
        previousTotalOldCustomers) *
      100
    );
  }, [totalOldCustomers, previousTotalOldCustomers]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500"  data-search-ref="customers_old_stat">
              Tổng số khách cũ
            </h3>
            <p className="text-2xl font-bold text-gray-400">--</p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-1 ">
            Tổng số khách cũ
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {totalOldCustomers.toLocaleString("vi-VN")}
          </p>
          {changePercent !== 0 && (
            <p
              className={`text-sm font-medium mt-1 ${
                changePercent > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {changePercent > 0 ? "+" : ""}
              {changePercent.toFixed(1)}% so với kỳ trước
            </p>
          )}
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Kỳ hiện tại</p>
            <p className="font-semibold text-gray-900">
              {totalOldCustomers.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Kỳ trước</p>
            <p className="font-semibold text-gray-900">
              {previousTotalOldCustomers.toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOldStatCard;

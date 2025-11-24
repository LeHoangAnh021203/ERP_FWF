import React, { useState } from "react";

interface OrderTotalSalesProps {
  totalWeekSales: number;
  weekSalesChange: number | null;
  totalRevenueThisWeek: number;
  weekRevenueChange: number | null;
  foxieDebtLastMonth?: number;
  foxieDebtChange?: number | null;
  fullStoreRevenueData?: Array<{
    storeName: string;
    currentOrders: number;
    deltaOrders: number;
    cashTransfer: number;
    prepaidCard: number;
    revenueGrowth: number;
    cashPercent: number;
    prepaidPercent: number;
    orderPercent: number;
  }>;
}

function formatBillion(val: number) {
  if (!val) return "0T";
  return (
    (val / 1_000_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }) + "T"
  );
}

function formatMoney(val: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

const OrderTotalSales: React.FC<OrderTotalSalesProps> = ({
  totalWeekSales,
  weekSalesChange,
  totalRevenueThisWeek,
  weekRevenueChange,
  foxieDebtChange,
  fullStoreRevenueData,
}) => {
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const [expandedServiceDetails, setExpandedServiceDetails] = useState(false);

  // Tính tổng foxie revenue từ API data
  const totalFoxieRevenue = React.useMemo(() => {
    if (!fullStoreRevenueData || !Array.isArray(fullStoreRevenueData)) {
      return totalWeekSales; // Fallback to totalWeekSales if no API data
    }
    return fullStoreRevenueData.reduce((sum, store) => sum + (store.prepaidCard || 0), 0);
  }, [fullStoreRevenueData, totalWeekSales]);

  // Tính phần trăm thay đổi foxie revenue
  const foxieRevenueChange = React.useMemo(() => {
    if (!fullStoreRevenueData || !Array.isArray(fullStoreRevenueData)) {
      return weekSalesChange; // Fallback to weekSalesChange if no API data
    }
    
    // Tính tổng foxie revenue hiện tại và trước đó (giả lập từ delta)
    const currentFoxieTotal = fullStoreRevenueData.reduce((sum, store) => sum + (store.prepaidCard || 0), 0);
    const previousFoxieTotal = fullStoreRevenueData.reduce((sum, store) => {
      // Ước tính foxie revenue trước đó dựa trên prepaidPercent
      const estimatedPreviousFoxie = store.prepaidCard / (1 + (store.prepaidPercent / 100));
      return sum + estimatedPreviousFoxie;
    }, 0);
    
    if (previousFoxieTotal === 0) return 0;
    return ((currentFoxieTotal - previousFoxieTotal) / previousFoxieTotal) * 100;
  }, [fullStoreRevenueData, weekSalesChange]);

  // Giả lập dữ liệu chi tiết thực thu
  const revenueDetails = [
    {
      category: "Dịch vụ lẻ",
      amount: Math.round(totalRevenueThisWeek * 0.45),
      percentage: 0,
      description: "DV trải nghiệm + DV niêm yết",
      hasSubDetails: true,
    },
    {
      category: "Sản phẩm",
      amount: Math.round(totalRevenueThisWeek * 0.35),
      percentage: 0,
      description: "Mỹ phẩm và Merchandise",
      hasSubDetails: false,
    },
    {
      category: "Thẻ tiền",
      amount: Math.round(totalRevenueThisWeek * 0.2),
      percentage: 0,
      description: "Doanh thu từ thanh toán bằng thẻ ",
      hasSubDetails: false,
    },
  ];

  // Chi tiết con cho dịch vụ lẻ
  const serviceSubDetails = [
    {
      category: "Trải nghiệm",
      amount: Math.round(totalRevenueThisWeek * 0.45 * 0.65),
      percentage: 0,
      description: "Doanh thu từ dịch vụ trải nghiệm khách hàng",
    },
    {
      category: "Giá niêm yết",
      amount: Math.round(totalRevenueThisWeek * 0.45 * 0.35),
      percentage: 0,
      description: "Doanh thu từ dịch vụ theo giá niêm yết",
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Tổng trả thẻ foxie */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center min-w-[180px]">
          <div className="text-base sm:text-xl font-medium text-gray-700 mb-2 text-center">
            Tổng trả thẻ Foxie
          </div>
          <div className="text-3xl sm:text-5xl font-bold text-black mb-2">
            {formatBillion(totalFoxieRevenue)}
          </div>
          <div
            className={`flex items-center gap-1 text-lg sm:text-2xl font-semibold ${
              foxieRevenueChange === null
                ? "text-gray-500"
                : foxieRevenueChange > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {foxieRevenueChange === null ? "N/A" : `${Math.abs(foxieRevenueChange).toFixed(1)}%`}
          </div>
        </div>

        {/* Tổng thực thu trong tuần */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center min-w-[180px] relative">
          {/* Icon chấm than */}
          <button
            onClick={() => setShowRevenueDetails(true)}
            className="absolute top-2 right-2 w-6 h-6 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-colors"
            title="Xem chi tiết thực thu"
          >
            <svg
              className="w-4 h-4 text-orange-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="text-base sm:text-xl font-medium text-gray-700 mb-2 text-center">
            Tổng thực thu
          </div>
          <div className="text-3xl sm:text-5xl font-bold text-black mb-2">
            {formatBillion(totalRevenueThisWeek)}
          </div>
          <div
            className={`flex items-center gap-1 text-lg sm:text-2xl font-semibold ${
              weekRevenueChange === null
                ? "text-gray-500"
                : weekRevenueChange > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {weekRevenueChange === null
              ? "N/A"
              : `${Math.abs(weekRevenueChange)}%`}
          </div>
        </div>
      </div>

      {/* Modal chi tiết thực thu */}
      {showRevenueDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết thực thu
                </h2>
                <button
                  onClick={() => setShowRevenueDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900 mb-2 flex align-center h-5">
                    Tổng thực thu: {formatMoney(totalRevenueThisWeek)}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700 w-60">
                          Danh mục
                        </th>
                        <th className="text-right p-3 border-b border-gray-200 font-semibold text-gray-700 w-60">
                          Số tiền
                        </th>
                        <th className="text-right p-3 border-b border-gray-200 font-semibold text-gray-700">
                          Tỷ lệ
                        </th>
                        <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700"></th>
                        <th className="text-center p-3 border-b border-gray-200 font-semibold text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueDetails.map((item, index) => (
                        <React.Fragment key={index}>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 border-b border-gray-200 font-medium text-gray-900">
                              {item.category}
                            </td>
                            <td className="p-3 border-b border-gray-200 text-right font-semibold text-gray-900">
                              {formatMoney(item.amount)}
                            </td>
                            <td className="p-3 border-b border-gray-200 text-right">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                {item.percentage}%
                              </span>
                            </td>

                            <td className="p-3 border-b border-gray-200 text-center">
                              {item.hasSubDetails && (
                                <button
                                  onClick={() =>
                                    setExpandedServiceDetails(
                                      !expandedServiceDetails
                                    )
                                  }
                                  className="w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                                  title="Xem chi tiết dịch vụ"
                                >
                                  <svg
                                    className={`w-4 h-4 text-blue-600 transition-transform ${
                                      expandedServiceDetails ? "rotate-90" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              )}
                            </td>
                          </tr>

                          {/* Chi tiết con cho dịch vụ lẻ */}
                          {item.hasSubDetails && expandedServiceDetails && (
                            <>
                              {serviceSubDetails.map((subItem, subIndex) => (
                                <tr
                                  key={`sub-${subIndex}`}
                                  className="hover:bg-gray-50 bg-gray-50"
                                >
                                  <td className="p-3 border-b border-gray-200 font-medium text-gray-900 pl-8 w-60">
                                    <span className="text-sm">
                                      └ {subItem.category}
                                    </span>
                                  </td>
                                  <td className="p-3 border-b border-gray-200 text-right font-semibold text-gray-900">
                                    {formatMoney(subItem.amount)}
                                  </td>
                                  <td className="p-3 border-b border-gray-200 text-right">
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                      {subItem.percentage}%
                                    </span>
                                  </td>
                                  <td className="p-3 border-b border-gray-200"></td>
                                </tr>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="space-y-2 text-blue-700 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-orange-100 rounded-lg">
                        <svg
                          className="w-4 h-4 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">Công nợ thẻ Foxie:</span>
                        <span className="font-semibold">
                          {formatMoney(Math.round(totalRevenueThisWeek * 0.2))}
                        </span>

                        {foxieDebtChange !== null &&
                          foxieDebtChange !== undefined && (
                            <div className="flex items-center gap-1">
                              <svg
                                className={`w-4 h-4 ${
                                  foxieDebtChange > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d={
                                    foxieDebtChange > 0
                                      ? "M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                                      : "M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                                  }
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span
                                className={`text-sm font-semibold ${
                                  foxieDebtChange > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {Math.abs(foxieDebtChange)}%
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderTotalSales;

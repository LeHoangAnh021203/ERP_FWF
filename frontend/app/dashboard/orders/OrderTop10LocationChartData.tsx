import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LabelList,
} from "recharts";

interface Top10LocationData {
  name: string;
  revenue: number;
  foxie: number;
  rank?: number | null;
}

interface StoreRevenueData {
  storeName: string;
  currentOrders: number;
  deltaOrders: number;
  cashTransfer: number;
  prepaidCard: number;
  revenueGrowth: number;
  cashPercent: number;
  prepaidPercent: number;
  orderPercent: number;
}

interface OverallOrderSummary {
  totalRevenue: number;
  serviceRevenue: number;
  foxieCardRevenue: number;
  productRevenue: number;
  cardPurchaseRevenue: number;
  avgActualRevenueDaily: number;
  deltaTotalRevenue: number;
  deltaServiceRevenue: number;
  deltaFoxieCardRevenue: number;
  deltaProductRevenue: number;
  deltaCardPurchaseRevenue: number;
  deltaAvgActualRevenue: number;
  percentTotalRevenue: number;
  percentServiceRevenue: number;
  percentFoxieCardRevenue: number;
  percentProductRevenue: number;
  percentCardPurchaseRevenue: number;
  percentAvgActualRevenue: number;
}

interface Props {
  isMobile: boolean;
  top10LocationChartData: Top10LocationData[];
  fullStoreRevenueData?: StoreRevenueData[]; // Thêm dữ liệu API cho bottom 5
  formatMoneyShort: (val: number) => string;
  overallOrderSummary: OverallOrderSummary | null;
  overallOrderSummaryLoading: boolean;
  overallOrderSummaryError: string | null;
}

const StatCard = ({
  title,
  value,
  delta,
  valueColor,
}: {
  title: string;
  value: number;
  delta: number | null;
  valueColor?: string;
}) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;

  // Use consistent number formatting to prevent hydration mismatch
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Show loading state during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div
        className={`bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 ${
          valueColor ?? "border-gray-200"
        }`}
      >
        <div className="text-xs font-semibold text-gray-700 mb-2 text-center leading-tight">
          {title}
        </div>
        <div
          className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-center break-words ${
            valueColor ?? "text-black"
          }`}
        >
          -
        </div>
        <div
          className={`text-xs font-semibold flex items-center gap-1 text-gray-500`}
        >
          -
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 ${
        valueColor ?? "border-gray-200"
      }`}
    >
      <div className="text-xs font-semibold text-gray-700 mb-2 text-center leading-tight">
        {title}
      </div>
      <div
        className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-center break-words ${
          valueColor ?? "text-black"
        }`}
      >
        {formatNumber(value)}
      </div>
      <div
        className={`text-xs font-semibold flex items-center gap-1 ${
          isUp ? "text-green-600" : isDown ? "text-red-500" : "text-gray-500"
        }`}
      >
        {isUp && <span>↑</span>}
        {isDown && <span>↓</span>}
        {delta === null ? "N/A" : formatNumber(Math.abs(delta))}
      </div>
    </div>
  );
};

const OrderTop10LocationChartData: React.FC<Props> = ({
  isMobile,
  top10LocationChartData,
  fullStoreRevenueData,
  formatMoneyShort,
  overallOrderSummary,
  overallOrderSummaryLoading,
  overallOrderSummaryError,
}) => {
  const [showTop10, setShowTop10] = React.useState(true);

  // Tạo dữ liệu bottom 10 trực tiếp từ API fullStoreRevenue
  // Lấy 10 stores có doanh thu thấp nhất từ tất cả stores
  const bottom10LocationChartData = React.useMemo(() => {
    if (!fullStoreRevenueData || fullStoreRevenueData.length === 0) {
      // Fallback data khi API chưa load
      return [
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 1 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 2 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 3 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 4 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 5 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 6 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 7 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 8 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 9 },
        { name: "Đang tải...", revenue: 0, foxie: 0, rank: 10 },
      ];
    }

    // Sắp xếp tất cả stores theo thực thu tăng dần (thấp nhất lên đầu)
    const sortedStores = [...fullStoreRevenueData].sort(
      (a, b) => a.cashTransfer - b.cashTransfer
    );

    // Lấy 10 stores có thực thu thấp nhất và giữ nguyên thứ tự tăng dần
    const bottom10 = sortedStores.slice(0, 10).map((store, index) => ({
      name: store.storeName,
      revenue: store.cashTransfer, // Thực thu = cashTransfer
      foxie: store.prepaidCard, // prepaidCard tương đương với foxie
      rank: index + 1,
    }));

    // Debug log để kiểm tra dữ liệu
    console.log("Full Store Revenue API Data:", fullStoreRevenueData);
    console.log("Bottom 10 Location Data (from API):", bottom10);

    return bottom10;
  }, [fullStoreRevenueData]);

  // Dữ liệu hiện tại dựa trên state
  const currentChartData = showTop10
    ? top10LocationChartData
    : bottom10LocationChartData;
  const currentTitle = showTop10
    ? "Top 10 cửa hàng theo thực thu"
    : "Bottom 10 cửa hàng theo thực thu";

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="flex flex-col items-center mb-4">
        <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-3"  data-search-ref="orders_top10_location">
          {currentTitle}
        </div>

        {/* Nút chuyển đổi */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setShowTop10(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              showTop10
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Top 10
          </button>
          <button
            onClick={() => setShowTop10(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              !showTop10
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Bottom 10
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="flex-1 bg-white rounded-xl shadow-lg p-2 sm:p-4">
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer
              width="100%"
              height={isMobile ? 500 : 700}
              minWidth={500}
            >
              <BarChart
                layout="vertical"
                data={currentChartData}
                margin={{
                  top: 20,
                  right: isMobile ? 80 : 120,
                  left: isMobile ? 40 : 60,
                  bottom: 20,
                }}
                barCategoryGap={isMobile ? 30 : 50}
                barGap={isMobile ? 8 : 50}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={formatMoneyShort}
                  domain={[0, "auto"]}
                  tick={{ fontSize: isMobile ? 10 : 14 }}
                  allowDataOverflow={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isMobile ? 120 : 220}
                  tick={{ fontWeight: 400, fontSize: isMobile ? 10 : 14 }}
                />
                <Tooltip formatter={formatMoneyShort} />
                <Legend
                  verticalAlign="top"
                  align="left"
                  iconType="rect"
                  className={isMobile ? "pb-5" : "pb-10"}
                  wrapperStyle={{ fontSize: isMobile ? 10 : 14 }}
                  formatter={(value: string) => <span>{value}</span>}
                />
                {showTop10 ? (
                  // Top 10: Thực thu ở dưới, Foxie ở trên
                  <>
                    <Bar
                      dataKey="revenue"
                      name="Thực thu"
                      fill="#8d6e63"
                      radius={[0, 8, 8, 0]}
                      maxBarSize={50}
                    >
                      <LabelList
                        dataKey="revenue"
                        position="right"
                        fontSize={isMobile ? 10 : 12}
                        fill="#8d6e63"
                        formatter={(value: React.ReactNode) => {
                          if (typeof value === "number" && value > 0) {
                            return (value / 1_000_000).toFixed(1) + "M";
                          }
                          return "";
                        }}
                      />
                    </Bar>
                    <Bar
                      dataKey="foxie"
                      name="Trả bằng thẻ Foxie"
                      fill="#b6d47a"
                      radius={[0, 8, 8, 0]}
                      maxBarSize={50}
                    >
                      <LabelList
                        dataKey="foxie"
                        position="right"
                        fontSize={isMobile ? 10 : 12}
                        fill="#b6d47a"
                        formatter={(value: React.ReactNode) => {
                          if (typeof value === "number" && value > 0) {
                            return (value / 1_000_000).toFixed(1) + "M";
                          }
                          return "";
                        }}
                      />
                    </Bar>
                  </>
                ) : (
                  // Bottom 10: Foxie ở trên, Thực thu ở dưới - bars to hơn
                  <>
                    <Bar
                      dataKey="foxie"
                      name="Trả bằng thẻ Foxie"
                      fill="#b6d47a"
                      radius={[0, 8, 8, 0]}
                      maxBarSize={80}
                    >
                      <LabelList
                        dataKey="foxie"
                        position="right"
                        fontSize={isMobile ? 10 : 12}
                        fill="#b6d47a"
                        formatter={(value: React.ReactNode) => {
                          if (typeof value === "number" && value > 0) {
                            return (value / 1_000_000).toFixed(1) + "M";
                          }
                          return "";
                        }}
                      />
                    </Bar>
                    <Bar
                      dataKey="revenue"
                      name="Thực thu"
                      fill="#8d6e63"
                      radius={[0, 8, 8, 0]}
                      maxBarSize={50}
                    >
                      <LabelList
                        dataKey="revenue"
                        position="right"
                        fontSize={isMobile ? 10 : 12}
                        fill="#8d6e63"
                        formatter={(value: React.ReactNode) => {
                          if (typeof value === "number" && value > 0) {
                            return (value / 1_000_000).toFixed(1) + "M";
                          }
                          return "";
                        }}
                      />
                    </Bar>
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className=" w-full lg:w-80 bg-white rounded-xl shadow-lg p-2 sm:p-4">
          {/* Mobile: Vertical scrollable layout */}
          <div
            className="lg:hidden max-h-56 overflow-y-auto flex items-center justify-center"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#fbbf24 #f3f4f6",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: #f3f4f6;
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb {
                background: #fbbf24;
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: #f59e0b;
              }
            `}</style>
            <div className="flex items-center justify-center flex-col gap-3">
              {overallOrderSummaryLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 border-gray-200 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                ))
              ) : overallOrderSummaryError ? (
                // Error state
                <div className="text-red-500 text-center p-4">
                  Lỗi tải dữ liệu: {overallOrderSummaryError}
                </div>
              ) : overallOrderSummary ? (
                // Data state
                <>
                  <StatCard
                    title="Thực thu dịch vụ"
                    value={overallOrderSummary.serviceRevenue}
                    delta={overallOrderSummary.percentServiceRevenue}
                    valueColor="text-[#b6d47a]"
                  />
                  <StatCard
                    title="Thực thu thẻ Foxie"
                    value={overallOrderSummary.foxieCardRevenue}
                    delta={overallOrderSummary.percentFoxieCardRevenue}
                    valueColor="text-[#8ed1fc]"
                  />
                  {/* <StatCard
                    title="Thực thu sản phẩm"
                    value={overallOrderSummary.productRevenue}
                    delta={overallOrderSummary.percentProductRevenue}
                    valueColor="text-[#a9b8c3]"
                  /> */}
                  <StatCard
                    title="Thực thu trung bình mỗi ngày"
                    value={overallOrderSummary.avgActualRevenueDaily}
                    delta={overallOrderSummary.percentAvgActualRevenue}
                    valueColor="text-[#b39ddb]"
                  />
                </>
              ) : (
                // Empty state
                <div className="text-gray-500 text-center p-4">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:flex items-center justify-center lg:grid lg:grid-cols-1 h-[400px]">
            {overallOrderSummaryLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 border-gray-200 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ))
            ) : overallOrderSummaryError ? (
              // Error state
              <div className="text-red-500 text-center p-4">
                Lỗi tải dữ liệu: {overallOrderSummaryError}
              </div>
            ) : overallOrderSummary ? (
              // Data state
              <>
                <StatCard
                  title="Thực thu dịch vụ"
                  value={overallOrderSummary.serviceRevenue}
                  delta={overallOrderSummary.percentServiceRevenue}
                  valueColor="text-[#b6d47a]"
                />
                <StatCard
                  title="Thực thu thẻ Foxie"
                  value={overallOrderSummary.foxieCardRevenue}
                  delta={overallOrderSummary.percentFoxieCardRevenue}
                  valueColor="text-[#8ed1fc]"
                />
                {/* <StatCard
                  title="Thực thu sản phẩm"
                  value={overallOrderSummary.productRevenue}
                  delta={overallOrderSummary.percentProductRevenue}
                  valueColor="text-[#a9b8c3]"
                /> */}
                <StatCard
                  title="Thực thu mỗi ngày"
                  value={overallOrderSummary.avgActualRevenueDaily}
                  delta={overallOrderSummary.percentAvgActualRevenue}
                  valueColor="text-[#b39ddb]"
                />
              </>
            ) : (
              // Empty state
              <div className="text-gray-500 text-center p-4">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTop10LocationChartData;

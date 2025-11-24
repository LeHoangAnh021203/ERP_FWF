"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface DailyKpiPoint {
  day: string;
  date: string;
  revenue: number;
  target: number;
  percentage: number;
  isToday: boolean;
}

type ViewMode = "monthly" | "daily";

interface KPIChartProps {
  // Left card props
  kpiDailySeriesLoading: boolean;
  kpiDailySeriesError: string | null;
  dailyKpiGrowthData: DailyKpiPoint[];

  // Right card props
  kpiViewMode: ViewMode;
  setKpiViewMode: (v: ViewMode) => void;
  currentDayForDaily: number;
  currentPercentage: number;
  dailyPercentageForCurrentDay: number;
  kpiMonthlyRevenueLoading: boolean;
  dailyRevenueLoading: boolean;
  targetStatus: "ahead" | "ontrack" | "behind";
  monthlyTarget: number;
  dailyTargetForCurrentDay: number;
  dailyTargetForToday: number;
  remainingTarget: number;
  remainingDailyTarget: number;
  dailyTargetPercentageForCurrentDay: number;
  currentRevenue: number;
  // New props for editable target
  onMonthlyTargetChange?: (target: number) => void;
  // Special holidays (day numbers in current month)
  specialHolidays?: number[];
  onSpecialHolidaysChange?: (days: number[]) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const statusColors = {
  ahead: { bg: "#00d084", text: "Vượt tiến độ" },
  ontrack: { bg: "#fcb900", text: "Đúng tiến độ" },
  behind: { bg: "#ff6b6b", text: "Chậm tiến độ" },
};

export default function KPIChart(props: KPIChartProps) {
  const {
    kpiDailySeriesLoading,
    kpiDailySeriesError,
    dailyKpiGrowthData,
    kpiViewMode,
    setKpiViewMode,
    currentDayForDaily,
    currentPercentage,
    dailyPercentageForCurrentDay,
    kpiMonthlyRevenueLoading,
    dailyRevenueLoading,
    targetStatus,
    monthlyTarget,
    dailyTargetForCurrentDay,
    dailyTargetForToday,
    remainingTarget,
    remainingDailyTarget,
    dailyTargetPercentageForCurrentDay,
    currentRevenue,
    onMonthlyTargetChange,
    specialHolidays = [],
    onSpecialHolidaysChange,
  } = props;
  
  const [isEditingTarget, setIsEditingTarget] = React.useState(false);
  const [tempTarget, setTempTarget] = React.useState(monthlyTarget.toString());
  
  React.useEffect(() => {
    setTempTarget(monthlyTarget.toString());
  }, [monthlyTarget]);
  
  const handleTargetSave = () => {
    const numValue = Number(tempTarget.replace(/[^\d]/g, ''));
    if (numValue > 0 && onMonthlyTargetChange) {
      onMonthlyTargetChange(numValue);
      setIsEditingTarget(false);
    }
  };
  
  const handleTargetCancel = () => {
    setTempTarget(monthlyTarget.toString());
    setIsEditingTarget(false);
  };
  
  const formatTargetInput = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    return num ? Number(num).toLocaleString('vi-VN') : '';
  };

  // Holidays input (comma-separated day numbers)
  const [holidaysInput, setHolidaysInput] = React.useState<string>((specialHolidays || []).join(", "));
  React.useEffect(() => {
    setHolidaysInput((specialHolidays || []).join(", "));
  }, [specialHolidays]);
  const saveHolidays = () => {
    if (!onSpecialHolidaysChange) return;
    const parsed = holidaysInput
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n) && n > 0);
    // unique and sorted
    const unique = Array.from(new Set(parsed)).sort((a, b) => a - b);
    onSpecialHolidaysChange(unique);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card className="border-[#fcb900]/20 shadow-lg bg-gradient-to-br from-white to-[#fcb900]/10">
        <CardHeader className="bg-[#d97706] text-white rounded-t-lg p-3 sm:p-4">
          <CardTitle className="text-white font-bold text-base sm:text-lg">
            Tăng Trưởng KPI Theo Ngày
          </CardTitle>
          <CardDescription className="text-white/90 font-medium text-sm">
            Biểu đồ doanh thu từ đầu tháng đến hiện tại
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          {kpiDailySeriesLoading ? (
            <div className="h-[200px] sm:h-[280px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#d97706]"></div>
            </div>
          ) : kpiDailySeriesError ? (
            <div className="h-[200px] sm:h-[280px] flex items-center justify-center text-red-600 text-xs sm:text-sm px-2">
              Lỗi tải dữ liệu: {kpiDailySeriesError}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={dailyKpiGrowthData}
                margin={{ top: 10, right: 15, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="kpiAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#fcb900" stopOpacity={0.4} />
                    <stop
                      offset="100%"
                      stopColor="#fcb900"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient
                    id="targetAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#d97706" stopOpacity={0.2} />
                    <stop
                      offset="100%"
                      stopColor="#d97706"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="1 3"
                  stroke="#fcb900"
                  strokeOpacity={0.2}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#d97706", fontWeight: "500" }}
                  interval="preserveStartEnd"
                  tickCount={Math.min(dailyKpiGrowthData.length, 6)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8, fill: "#d97706" }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  domain={["dataMin - 50000000", "dataMax + 50000000"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    border: "1px solid #fcb900",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                    padding: "8px 12px",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "white",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "revenue")
                      return [formatCurrency(value), "Doanh thu"];
                    if (name === "target")
                      return [formatCurrency(value), "Mục tiêu"];
                    return [value, name];
                  }}
                  labelFormatter={(
                    label: string,
                    payload: readonly {
                      payload?: {
                        day: string;
                        percentage: number;
                        isToday: boolean;
                      };
                    }[]
                  ) => {
                    if (payload && payload[0]?.payload) {
                      const data = payload[0].payload as DailyKpiPoint;
                      return `${data.day} ${label} ${
                        data.isToday ? "(Hôm nay)" : ""
                      } - ${data.percentage.toFixed(1)}%`;
                    }
                    return label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#d97706"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  activeDot={{
                    r: 4,
                    stroke: "#d97706",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#fcb900"
                  strokeWidth={3}
                  dot={(p: {
                    cx: number;
                    cy: number;
                    payload: Partial<DailyKpiPoint>;
                  }) => {
                    const { cx, cy, payload } = p;
                    const key = payload.date || `${cx}-${cy}`;
                    const isToday = Boolean(payload.isToday);
                    return (
                      <circle
                        key={`dot-${key}`}
                        cx={cx}
                        cy={cy}
                        r={isToday ? 6 : 4}
                        fill={isToday ? "#ff6b6b" : "#fcb900"}
                        stroke={isToday ? "white" : "#fcb900"}
                        strokeWidth={isToday ? 3 : 2}
                      />
                    );
                  }}
                  activeDot={{
                    r: 8,
                    stroke: "#fcb900",
                    strokeWidth: 3,
                    fill: "white",
                  }}
                  animationBegin={0}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-[#fcb900]/20">
            <div className="text-center p-2 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-600">Tổng tháng</p>
              <p className="text-xs sm:text-sm font-bold text-[#d97706] break-all">
                {formatCurrency(
                  dailyKpiGrowthData.reduce(
                    (sum, item) => sum + item.revenue,
                    0
                  )
                )}
              </p>
            </div>
            <div className="text-center p-2 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-600">Trung bình</p>
              <p className="text-xs sm:text-sm font-bold text-[#d97706] break-all">
                {formatCurrency(
                  dailyKpiGrowthData.reduce(
                    (sum, item) => sum + item.revenue,
                    0
                  ) / dailyKpiGrowthData.length
                )}
              </p>
            </div>
            <div className="text-center p-2 bg-white/50 rounded-lg">
              <p className="text-xs text-gray-600">Cao nhất</p>
              <p className="text-xs sm:text-sm font-bold text-[#d97706] break-all">
                {formatCurrency(
                  Math.max(...dailyKpiGrowthData.map((i) => i.revenue))
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#7bdcb5]/20 shadow-lg bg-gradient-to-br from-[#7bdcb5]/20 via-[#41d1d9]/20 to-[#0693e3]/20 relative overflow-hidden">
        <CardHeader className="bg-[#00b894] text-white rounded-t-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white font-bold text-base sm:text-lg">
                Target KPI
              </CardTitle>
              <CardDescription className="text-white font-medium text-sm">
                {kpiViewMode === "monthly"
                  ? "Tiến độ hoàn thành mục tiêu doanh thu tháng"
                  : `Tiến độ doanh thu ngày ${currentDayForDaily}`}
              </CardDescription>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-3">
              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  kpiViewMode === "monthly" ? "text-white" : "text-white/70"
                }`}
              >
                Tháng
              </span>
              <button
                onClick={() =>
                  setKpiViewMode(
                    kpiViewMode === "monthly" ? "daily" : "monthly"
                  )
                }
                className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#00b894] ${
                  kpiViewMode === "daily" ? "bg-white" : "bg-white/30"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-[#00b894] transition-transform ${
                    kpiViewMode === "daily"
                      ? "translate-x-5 sm:translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  kpiViewMode === "daily" ? "text-white" : "text-white/70"
                }`}
              >
                Ngày
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 bg-gradient-to-br from-[#7bdcb5]/10 via-[#41d1d9]/10 to-[#0693e3]/10">
          <div className="space-y-4 sm:space-y-6">
            <div className="relative">
              <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                {kpiViewMode === "monthly" ? (() => {
                  // Calculate scale labels dynamically based on monthlyTarget
                  const targetInB = monthlyTarget / 1000000000;
                  const scalePoints = [
                    0,
                    targetInB * 0.2,
                    targetInB * 0.4,
                    targetInB * 0.6,
                    targetInB * 0.8,
                    targetInB
                  ];
                  const formatB = (value: number) => {
                    if (value >= 1) {
                      return value % 1 === 0 ? `${value}B` : `${value.toFixed(2)}B`;
                    }
                    return `${(value * 1000).toFixed(0)}M`;
                  };
                  return (
                    <>
                      <span>{formatB(scalePoints[0])}</span>
                      <span className="hidden sm:inline">{formatB(scalePoints[1])}</span>
                      <span>{formatB(scalePoints[2])}</span>
                      <span className="hidden sm:inline">{formatB(scalePoints[3])}</span>
                      <span>{formatB(scalePoints[4])}</span>
                      <span>{formatB(scalePoints[5])}</span>
                    </>
                  );
                })() : (
                  <>
                    <span>0M</span>
                    <span className="hidden sm:inline">50M</span>
                    <span>100M</span>
                    <span className="hidden sm:inline">150M</span>
                    <span>200M</span>
                    <span>
                      {Math.round(dailyTargetForCurrentDay / 1000000)}M
                    </span>
                  </>
                )}
              </div>

              <div className="relative h-8 sm:h-12 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6b6b] via-[#ff9500] to-[#fcb900] rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{
                    width: `${
                      kpiViewMode === "monthly"
                        ? currentPercentage
                        : dailyPercentageForCurrentDay
                    }%`,
                  }}
                />

                {kpiViewMode === "daily" && (
                  <div
                    className="absolute top-0 h-full w-1 bg-gray-800 shadow-lg z-10"
                    style={{ left: `${dailyTargetPercentageForCurrentDay}%` }}
                  />
                )}

                <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
                  <div className="w-0.5 h-6 sm:h-8 bg-gray-400"></div>
                  <div className="w-0.5 h-6 sm:h-8 bg-gray-400"></div>
                  <div className="w-0.5 h-6 sm:h-8 bg-gray-400"></div>
                  <div className="w-0.5 h-6 sm:h-8 bg-gray-400"></div>
                  <div className="w-0.5 h-6 sm:h-8 bg-gray-400"></div>
                  <div className="w-0.5 h-4 sm:h-6 bg-gray-600 font-bold"></div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 text-center">
                {(kpiViewMode === "monthly" && kpiMonthlyRevenueLoading) ||
                (kpiViewMode === "daily" && dailyRevenueLoading) ? (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="animate-pulse bg-gray-200 h-6 sm:h-8 w-32 sm:w-48 mx-auto rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-3 sm:h-4 w-24 sm:w-32 mx-auto rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-4 sm:h-6 w-16 sm:w-24 mx-auto rounded"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800 break-all">
                      {formatCurrency(currentRevenue)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 px-2">
                      {kpiViewMode === "monthly"
                        ? `${currentPercentage.toFixed(
                            1
                          )}% hoàn thành mục tiêu tháng`
                        : `${dailyPercentageForCurrentDay.toFixed(
                            1
                          )}% hoàn thành mục tiêu ngày ${currentDayForDaily}`}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div
                        className="px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold"
                        style={{
                          backgroundColor: statusColors[targetStatus].bg,
                        }}
                      >
                        {statusColors[targetStatus].text}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="text-center p-2 bg-white/50 rounded-lg relative">
                <p className="text-xs sm:text-sm text-gray-600">
                  {kpiViewMode === "monthly"
                    ? "Mục tiêu tháng này"
                    : "Mục tiêu 1 ngày"}
                </p>
                {(kpiViewMode === "monthly" && kpiMonthlyRevenueLoading) ||
                (kpiViewMode === "daily" && dailyRevenueLoading) ? (
                  <div className="animate-pulse bg-gray-200 h-4 sm:h-6 w-16 sm:w-24 mx-auto rounded"></div>
                ) : kpiViewMode === "monthly" && isEditingTarget ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formatTargetInput(tempTarget)}
                      onChange={(e) => setTempTarget(e.target.value.replace(/[^\d]/g, ''))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleTargetSave();
                        if (e.key === 'Escape') handleTargetCancel();
                      }}
                      className="w-full px-2 py-1 text-sm sm:text-base font-bold text-[#0693e3] border-2 border-[#0693e3] rounded focus:outline-none focus:ring-2 focus:ring-[#0693e3] text-center"
                      autoFocus
                    />
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={handleTargetSave}
                        className="px-2 py-1 text-xs bg-[#0693e3] text-white rounded hover:bg-[#0582c4]"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleTargetCancel}
                        className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative">
                    <p 
                      className="text-sm sm:text-lg font-bold text-[#0693e3] break-all cursor-pointer hover:underline"
                      onClick={() => kpiViewMode === "monthly" && onMonthlyTargetChange && setIsEditingTarget(true)}
                      title={kpiViewMode === "monthly" && onMonthlyTargetChange ? "Click để chỉnh sửa" : ""}
                    >
                      {formatCurrency(
                        kpiViewMode === "monthly"
                          ? monthlyTarget
                          : dailyTargetForCurrentDay
                      )}
                    </p>
                    {kpiViewMode === "monthly" && onMonthlyTargetChange && (
                      <button
                        onClick={() => setIsEditingTarget(true)}
                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#0693e3] text-xs hover:text-[#0582c4]"
                        title="Chỉnh sửa mục tiêu"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">
                  {kpiViewMode === "monthly"
                    ? "Đến nay cần đạt"
                    : `Mục tiêu ngày ${currentDayForDaily}`}
                </p>
                {(kpiViewMode === "monthly" && kpiMonthlyRevenueLoading) ||
                (kpiViewMode === "daily" && dailyRevenueLoading) ? (
                  <div className="animate-pulse bg-gray-200 h-4 sm:h-6 w-16 sm:w-24 mx-auto rounded"></div>
                ) : (
                  <p className="text-sm sm:text-lg font-bold text-gray-800 break-all">
                    {formatCurrency(
                      kpiViewMode === "monthly"
                        ? dailyTargetForToday
                        : dailyTargetForCurrentDay
                    )}
                  </p>
                )}
              </div>
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">
                  {kpiViewMode === "monthly" ? "Còn lại tháng" : "Còn lại ngày"}
                </p>
                {(kpiViewMode === "monthly" && kpiMonthlyRevenueLoading) ||
                (kpiViewMode === "daily" && dailyRevenueLoading) ? (
                  <div className="animate-pulse bg-gray-200 h-4 sm:h-6 w-16 sm:w-24 mx-auto rounded"></div>
                ) : (
                  <p className="text-sm sm:text-lg font-bold text-[#ff6b6b] break-all">
                    {formatCurrency(
                      kpiViewMode === "monthly"
                        ? remainingTarget
                        : remainingDailyTarget
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Special holidays editor */}
            <div className="mt-3 sm:mt-4 border-t border-gray-200 pt-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Ngày lễ đặc biệt (dd trong tháng, cách nhau bởi dấu phẩy)
                </label>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    className="flex-1 sm:w-72 px-2 py-1 text-sm border rounded"
                    value={holidaysInput}
                    onChange={(e) => setHolidaysInput(e.target.value)}
                    placeholder="1, 2, 20"
                  />
                  <button
                    onClick={saveHolidays}
                    className="px-3 py-1 text-sm rounded bg-[#00b894] text-white hover:bg-[#00a082]"
                    disabled={!onSpecialHolidaysChange}
                  >
                    Lưu
                  </button>
                </div>
              </div>
              {specialHolidays && specialHolidays.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  Đã đặt: {specialHolidays.join(", ")}
                </div>
              )}
            </div>

            <div className="pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-800 rounded"></div>
                {(kpiViewMode === "monthly" && kpiMonthlyRevenueLoading) ||
                (kpiViewMode === "daily" && dailyRevenueLoading) ? (
                  <div className="animate-pulse bg-gray-200 h-3 sm:h-4 w-32 sm:w-48 rounded"></div>
                ) : (
                  <span className="text-gray-700 font-medium text-center break-all">
                    {kpiViewMode === "monthly"
                      ? `Mục tiêu hôm nay: ${formatCurrency(
                          dailyTargetForToday
                        )}`
                      : `Mục tiêu ngày ${currentDayForDaily}: ${formatCurrency(
                          dailyTargetForCurrentDay
                        )} (${Math.round(
                          dailyTargetForCurrentDay / 1000000
                        )}M)`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

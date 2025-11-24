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

interface StoreTypeSalesByDayData {
  date: string;
  Mall: number;
  Shophouse: number;
  NhaPho: number;
  DaDongCua: number;
  Khac: number;
}

interface StoreTypeSalesByDayProps {
  storeTypeSalesByDay: StoreTypeSalesByDayData[];
  formatAxisDate: (date: string) => string;
}

const StoreTypeSalesByDay: React.FC<StoreTypeSalesByDayProps> = ({
  storeTypeSalesByDay,
  formatAxisDate,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  // Create a map of max values for each date
  const maxValuesByDate = React.useMemo(() => {
    const maxMap = new Map<string, number>();
    storeTypeSalesByDay.forEach((item) => {
      const values = [
        item.Mall || 0,
        item.Shophouse || 0,
        item.NhaPho || 0,
        item.DaDongCua || 0,
        item.Khac || 0,
      ];
      maxMap.set(item.date, Math.max(...values));
    });
    return maxMap;
  }, [storeTypeSalesByDay]);

  // Find the peak day for each store type (for mobile display)
  const peakDays = React.useMemo(() => {
    const peaks: Record<string, { date: string; value: number }> = {
      Mall: { date: "", value: 0 },
      Shophouse: { date: "", value: 0 },
      NhaPho: { date: "", value: 0 },
      DaDongCua: { date: "", value: 0 },
      Khac: { date: "", value: 0 },
    };

    storeTypeSalesByDay.forEach((item) => {
      // Check each store type
      if ((item.Mall || 0) > peaks.Mall.value) {
        peaks.Mall = { date: item.date, value: item.Mall || 0 };
      }
      if ((item.Shophouse || 0) > peaks.Shophouse.value) {
        peaks.Shophouse = { date: item.date, value: item.Shophouse || 0 };
      }
      if ((item.NhaPho || 0) > peaks.NhaPho.value) {
        peaks.NhaPho = { date: item.date, value: item.NhaPho || 0 };
      }
      if ((item.DaDongCua || 0) > peaks.DaDongCua.value) {
        peaks.DaDongCua = { date: item.date, value: item.DaDongCua || 0 };
      }
      if ((item.Khac || 0) > peaks.Khac.value) {
        peaks.Khac = { date: item.date, value: item.Khac || 0 };
      }
    });

    return peaks;
  }, [storeTypeSalesByDay]);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const maxYValue = React.useMemo(() => {
    return Math.max(
      ...storeTypeSalesByDay.flatMap((item) => [
        item.Mall || 0,
        item.Shophouse || 0,
        item.NhaPho || 0,
        item.DaDongCua || 0,
        item.Khac || 0,
      ])
    );
  }, [storeTypeSalesByDay]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="text-sm sm:text-base md:text-xl font-medium text-gray-700 text-center mb-4">
        Tổng doanh số loại cửa hàng
      </div>
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer
          width="100%"
          height={isMobile ? 300 : 400}
          minWidth={280}
        >
          <BarChart
            data={storeTypeSalesByDay}
            margin={{
              top: isMobile ? 30 : 50,
              right: isMobile ? 10 : 30,
              left: isMobile ? 10 : 20,
              bottom: isMobile ? 20 : 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              fontSize={isMobile ? 10 : 12}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
              tick={(props) => {
                const { x, y, payload } = props;
                const date = payload.value;

                // Kiểm tra xem có phải cuối tuần không
                const isWeekend = (() => {
                  if (!date) return false;
                  const match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
                  if (match) {
                    const [, year, month, day] = match;
                    const dateObj = new Date(
                      parseInt(year),
                      parseInt(month) - 1,
                      parseInt(day)
                    );
                    const dayOfWeek = dateObj.getDay();
                    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Chủ nhật, 6 = Thứ 7
                  }
                  return false;
                })();

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="middle"
                      fill={isWeekend ? "#dc2626" : "#6b7280"}
                      fontSize={isMobile ? 10 : 12}
                      fontWeight={isWeekend ? "bold" : "normal"}
                    >
                      {formatAxisDate(date)}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis
              domain={[0, maxYValue * 1]} // tăng 20% chiều cao
              tickFormatter={(v) => {
                if (typeof v === "number" && v >= 1_000_000)
                  return (v / 1_000_000).toFixed(1) + "M";
                if (typeof v === "number") return v.toLocaleString();
                return v;
              }}
              fontSize={isMobile ? 10 : 12}
              width={isMobile ? 60 : 80}
            />

            <Tooltip
              formatter={(value) => {
                if (typeof value === "number") {
                  if (value >= 1_000_000)
                    return `${(value / 1_000_000).toFixed(1)}M`;
                  return value.toLocaleString();
                }
                return value;
              }}
              contentStyle={{
                fontSize: isMobile ? 12 : 14,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: isMobile ? 10 : 12,
                paddingTop: isMobile ? 10 : 20,
              }}
            />
            <Bar dataKey="Mall" name="Mall" fill="#ff7f7f">
              <LabelList
                dataKey="Mall"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#ff7f7f"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.Mall === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.Mall.date &&
                      value === peakDays.Mall.value
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.Mall === value
                    );
                    if (!currentDataPoint) return "";

                    const maxValue =
                      maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (
                      typeof value === "number" &&
                      value === maxValue &&
                      value > 0
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  }
                }}
              />
            </Bar>
            <Bar dataKey="Shophouse" name="Shophouse" fill="#b39ddb">
              <LabelList
                dataKey="Shophouse"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#b39ddb"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.Shophouse === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.Shophouse.date &&
                      value === peakDays.Shophouse.value
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.Shophouse === value
                    );
                    if (!currentDataPoint) return "";

                    const maxValue =
                      maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (
                      typeof value === "number" &&
                      value === maxValue &&
                      value > 0
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  }
                }}
              />
            </Bar>
            <Bar dataKey="NhaPho" name="Nhà phố" fill="#8d6e63">
              <LabelList
                dataKey="NhaPho"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#8d6e63"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.NhaPho === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.NhaPho.date &&
                      value === peakDays.NhaPho.value
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.NhaPho === value
                    );
                    if (!currentDataPoint) return "";

                    const maxValue =
                      maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (
                      typeof value === "number" &&
                      value === maxValue &&
                      value > 0
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  }
                }}
              />
            </Bar>
            <Bar dataKey="DaDongCua" name="Đã đóng cửa" fill="#c5e1a5">
              <LabelList
                dataKey="DaDongCua"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#c5e1a5"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.DaDongCua === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.DaDongCua.date &&
                      value === peakDays.DaDongCua.value
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.DaDongCua === value
                    );
                    if (!currentDataPoint) return "";

                    const maxValue =
                      maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (
                      typeof value === "number" &&
                      value === maxValue &&
                      value > 0
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  }
                }}
              />
            </Bar>
            <Bar dataKey="Khac" name="Khác" fill="#81d4fa">
              <LabelList
                dataKey="Khac"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#81d4fa"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.Khac === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.Khac.date &&
                      value === peakDays.Khac.value
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = storeTypeSalesByDay.find(
                      (item) => item.Khac === value
                    );
                    if (!currentDataPoint) return "";

                    const maxValue =
                      maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (
                      typeof value === "number" &&
                      value === maxValue &&
                      value > 0
                    ) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  }
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StoreTypeSalesByDay;

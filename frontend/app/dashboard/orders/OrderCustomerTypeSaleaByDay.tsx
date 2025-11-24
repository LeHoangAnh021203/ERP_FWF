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

interface CustomerTypeSalesByDayData {
  date: string;
  KHTraiNghiem?: number;
  KHIron?: number;
  KHSilver?: number;
  KHBronze?: number;
  KHDiamond?: number;
  Khac?: number;
  [key: string]: string | number | undefined;
}

interface Props {
  isMobile: boolean;
  customerTypeSalesByDay: CustomerTypeSalesByDayData[];
}

const OrderCustomerTypeSaleaByDay: React.FC<Props> = ({
  isMobile,
  customerTypeSalesByDay,
}) => {
  // Create a map of max values for each date
  const maxValuesByDate = React.useMemo(() => {
    const maxMap = new Map<string, number>();
    customerTypeSalesByDay.forEach((item) => {
      const values = [
        item.KHTraiNghiem || 0,
        item.KHIron || 0,
        item.KHSilver || 0,
        item.KHBronze || 0,
        item.KHDiamond || 0,
        item.Khac || 0,
      ];
      maxMap.set(item.date, Math.max(...values));
    });
    return maxMap;
  }, [customerTypeSalesByDay]);

  // Find the peak day for each customer type (for mobile display)
  const peakDays = React.useMemo(() => {
    const peaks: Record<string, { date: string; value: number }> = {
      KHTraiNghiem: { date: "", value: 0 },
      KHIron: { date: "", value: 0 },
      KHSilver: { date: "", value: 0 },
      KHBronze: { date: "", value: 0 },
      KHDiamond: { date: "", value: 0 },
      Khac: { date: "", value: 0 },
    };

    customerTypeSalesByDay.forEach((item) => {
      // Check each customer type
      if ((item.KHTraiNghiem || 0) > peaks.KHTraiNghiem.value) {
        peaks.KHTraiNghiem = { date: item.date, value: item.KHTraiNghiem || 0 };
      }
      if ((item.KHIron || 0) > peaks.KHIron.value) {
        peaks.KHIron = { date: item.date, value: item.KHIron || 0 };
      }
      if ((item.KHSilver || 0) > peaks.KHSilver.value) {
        peaks.KHSilver = { date: item.date, value: item.KHSilver || 0 };
      }
      if ((item.KHBronze || 0) > peaks.KHBronze.value) {
        peaks.KHBronze = { date: item.date, value: item.KHBronze || 0 };
      }
      if ((item.KHDiamond || 0) > peaks.KHDiamond.value) {
        peaks.KHDiamond = { date: item.date, value: item.KHDiamond || 0 };
      }
      if ((item.Khac || 0) > peaks.Khac.value) {
        peaks.Khac = { date: item.date, value: item.Khac || 0 };
      }
    });

    return peaks;
  }, [customerTypeSalesByDay]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4" data-search-ref="orders_customer_type_by_day">
        Tổng thực thu theo loại khách hàng 
      </div>
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer
          width="100%"
          height={isMobile ? 300 : 400}
          minWidth={280}
        >
          <BarChart
            data={customerTypeSalesByDay}
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
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
              fontSize={isMobile ? 10 : 12}
              tickFormatter={(dateString) => {
                if (!dateString || typeof dateString !== "string")
                  return dateString;
                if (dateString.includes("-")) {
                  const d = new Date(dateString);
                  if (!isNaN(d.getTime())) {
                    return `${String(d.getDate()).padStart(2, "0")}/${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}`;
                  }
                }
                return dateString;
              }}
              tick={(props) => {
                const { x, y, payload } = props;
                const date = payload.value;
                
                // Kiểm tra xem có phải cuối tuần không
                const isWeekend = (() => {
                  if (!date) return false;
                  const match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
                  if (match) {
                    const [, year, month, day] = match;
                    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
                      textAnchor={isMobile ? "end" : "middle"}
                      fill={isWeekend ? "#dc2626" : "#6b7280"}
                      fontSize={isMobile ? 10 : 12}
                      fontWeight={isWeekend ? "bold" : "normal"}
                    >
                      {(() => {
                        if (!date || typeof date !== "string") return date;
                        if (date.includes("-")) {
                          const d = new Date(date);
                          if (!isNaN(d.getTime())) {
                            return `${String(d.getDate()).padStart(2, "0")}/${String(
                              d.getMonth() + 1
                            ).padStart(2, "0")}`;
                          }
                        }
                        return date;
                      })()}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis
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
                  if (value >= 1_000_000) {
                    return (value / 1_000_000).toFixed(1) + "M";
                  }
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
            <Bar
              dataKey="KHTraiNghiem"
              name="KH trải nghiệm"
              fill="#8d6e63"
              maxBarSize={isMobile ? 120 : 150}
            >
              <LabelList
                dataKey="KHTraiNghiem"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#8d6e63"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHTraiNghiem === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.KHTraiNghiem.date &&
                      value === peakDays.KHTraiNghiem.value
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHTraiNghiem === value
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
            <Bar
              dataKey="KHIron"
              name="KH Iron"
              fill="#b6d47a"
              maxBarSize={isMobile ? 120 : 150}
            >
              <LabelList
                dataKey="KHIron"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#b6d47a"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHIron === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.KHIron.date &&
                      value === peakDays.KHIron.value
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHIron === value
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
            <Bar
              dataKey="KHSilver"
              name="KH Silver"
              fill="#ff7f7f"
              maxBarSize={isMobile ? 120 : 150}
            >
              <LabelList
                dataKey="KHSilver"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#ff7f7f"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHSilver === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.KHSilver.date &&
                      value === peakDays.KHSilver.value
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHSilver === value
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
            <Bar
              dataKey="KHBronze"
              name="KH Bronze"
              fill="#81d4fa"
              maxBarSize={isMobile ? 120 : 150}
            >
              <LabelList
                dataKey="KHBronze"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#81d4fa"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHBronze === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.KHBronze.date &&
                      value === peakDays.KHBronze.value
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHBronze === value
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
            <Bar
              dataKey="KHDiamond"
              name="KH Diamond"
              fill="#f0bf4c"
              maxBarSize={isMobile ? 120 : 150}
            >
              <LabelList
                dataKey="KHDiamond"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#f0bf4c"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHDiamond === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.KHDiamond.date &&
                      value === peakDays.KHDiamond.value
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.KHDiamond === value
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
            <Bar
              dataKey="Khac"
              name="Khác"
              fill="#bccefb"
              maxBarSize={isMobile ? 120 : 150}
            >
              <LabelList
                dataKey="Khac"
                position="top"
                fontSize={isMobile ? 10 : 12}
                fill="#bccefb"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = customerTypeSalesByDay.find(
                      (item) => item.Khac === value
                    );
                    if (!currentDataPoint) return "";

                    if (
                      currentDataPoint.date === peakDays.Khac.date &&
                      value === peakDays.Khac.value
                    ) {
                      if (value >= 1_000_000) {
                        return (value / 1_000_000).toFixed(1) + "M";
                      }
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = customerTypeSalesByDay.find(
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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderCustomerTypeSaleaByDay;

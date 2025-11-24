"use client";

import React from "react";
import { Clock, Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/app/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";

interface ServiceSummaryData {
  totalServices: string;
  totalServicesServing: string;
  totalServiceDone: string;
  items?: Array<{
    serviceName: string;
    serviceUsageAmount: string;
    serviceUsagePercentage: string;
  }>;
}

interface BookingData {
  // Add the properties you need from booking data
  [key: string]: unknown;
}

interface ServiceSectionProps {
  bookingLoading: boolean;
  bookingError: string | null;
  bookingData: BookingData | null;
  serviceSummaryData?: ServiceSummaryData | null;
}

export default function ServiceSection({
  bookingLoading,
  bookingError,
  bookingData,
  serviceSummaryData,
}: ServiceSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { bookingLoading, bookingError, bookingData };
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;
  
  // Dynamic chart height for better mobile spacing
  const chartHeight = React.useMemo(() => (isMobile ? 440 : 700), [isMobile]);
  
  // Shared color palette for bars and matching label colors
  const barColors = React.useMemo(
    () => [
      "#9b51e0",
      "#8e44ad",
      "#a29bfe",
      "#6c5ce7",
      "#b388ff",
      "#7e57c2",
      "#9575cd",
      "#5e35b1",
      "#ab47bc",
      "#ba68c8",
    ],
    []
  );
  
  // Normalize Vietnamese strings by removing diacritics and standardizing whitespace
  const removeDiacritics = React.useCallback((input: string) =>
    input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  , []);

  // Build a normalized grouping key and a short label for chart display
  const getNormalizedKeyAndShortLabel = React.useCallback((rawName: string) => {
    const upperNoAccent = removeDiacritics(rawName).toUpperCase();

    // Prioritize COMBO CS / COMBO CHUYEN SAU before generic COMBO
    const comboCsMatch = upperNoAccent.match(/COMBO\s*CS\s*(\d+)/);
    const comboChuyenSauMatch = upperNoAccent.match(/COMBO\s*CHUYEN\s*SAU\s*(\d+)/);
    if (comboCsMatch || comboChuyenSauMatch) {
      const num = (comboCsMatch?.[1] || comboChuyenSauMatch?.[1] || "").trim();
      const key = `COMBO_CS_${num || "UNK"}`;
      const short = num ? `CS${num}` : "CS";
      return { key, short };
    }

    const comboMatch = upperNoAccent.match(/COMBO\s*(\d+)/);
    if (comboMatch) {
      const num = comboMatch[1].trim();
      return { key: `COMBO_${num}`, short: `COMBO${num}` };
    }

    const dvMatch = upperNoAccent.match(/DV\s*(\d+)/);
    if (dvMatch) {
      const num = dvMatch[1].trim();
      return { key: `DV_${num}`, short: `DV${num}` };
    }

    const ctMatch = upperNoAccent.match(/CT\s*(\d+)/);
    if (ctMatch) {
      const num = ctMatch[1].trim();
      return { key: `CT_${num}`, short: `CT${num}` };
    }

    if (upperNoAccent.includes("QUA TANG")) {
      return { key: "QUA_TANG", short: "QUÀ TẶNG" };
    }

    // Fallback: use the normalized full name
    return { key: upperNoAccent, short: rawName };
  }, [removeDiacritics]);

  // Aggregate services by normalized key to avoid duplicates, then compute Top 10
  const top10Data = React.useMemo(() => {
    const items = serviceSummaryData?.items || [];
    if (!items.length) return [] as Array<{ name: string; usage: number; percentage: number; fullName: string; color?: string }>;

    const grouped = new Map<string, { key: string; short: string; usage: number; fullName: string }>();

    for (const item of items) {
      const { key, short } = getNormalizedKeyAndShortLabel(item.serviceName);
      const usage = Number(item.serviceUsageAmount) || 0;
      const existing = grouped.get(key);
      if (existing) {
        existing.usage += usage;
        // Prefer keeping a more descriptive name as fullName
        if (item.serviceName.length > existing.fullName.length) {
          existing.fullName = item.serviceName;
        }
      } else {
        grouped.set(key, {
          key,
          short,
          usage,
          fullName: item.serviceName,
        });
      }
    }

    const aggregated = Array.from(grouped.values());
    const totalUsage = aggregated.reduce((sum, it) => sum + it.usage, 0) || 1;

    const sortedTop10Base = aggregated
      .map((it) => ({
        name: it.short,
        usage: it.usage,
        percentage: (it.usage / totalUsage) * 100,
        fullName: it.fullName,
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10)
      .reverse();

    // Assign colors based on final display order
    const colored = sortedTop10Base.map((d, idx) => ({
      ...d,
      color: barColors[idx % barColors.length],
    }));

    return colored;
  }, [serviceSummaryData, getNormalizedKeyAndShortLabel, barColors]);

  interface XAxisTickProps {
    x: number;
    y: number;
    payload?: { value?: string };
  }

  // Custom tick to color labels same as their corresponding bars
  const XAxisColoredTick = React.useCallback((props: XAxisTickProps) => {
    const { x, y, payload } = props;
    const value: string = payload?.value ?? "";
    const match = top10Data.find((d) => d.name === value);
    const fill = match?.color || "#334862";
    const fontSize = isMobile ? 10 : 13;
    // Rotate -45 degrees and offset to avoid overlap
    return (
      <g transform={`translate(${x},${y}) rotate(-45)`}>
        <text
          x={-6}
          y={12}
          textAnchor="end"
          fill={fill}
          fontSize={fontSize}
        >
          {value}
        </text>
      </g>
    );
  }, [top10Data, isMobile]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 sm:h-6 sm:w-6 text-[#f16a3f]" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#334862]">Dịch Vụ</h2>
      </div>

      {/* Service Summary KPIs (Real-time) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-[#41d1d9]/20 shadow-lg bg-gradient-to-br from-white to-[#41d1d9]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Tổng Dịch Vụ</CardTitle>
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-[#41d1d9]" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold text-[#f16a3f]">
              {serviceSummaryData
                ? Number(serviceSummaryData.totalServices).toLocaleString(
                    "vi-VN"
                  )
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">Theo ngày đã chọn</p>
          </CardContent>
        </Card>

        <Card className="border-[#fcb900]/20 shadow-lg bg-gradient-to-br from-white to-[#fcb900]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Đang Phục Vụ</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#fcb900]" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold text-[#f16a3f]">
              {serviceSummaryData
                ? Number(
                    serviceSummaryData.totalServicesServing
                  ).toLocaleString("vi-VN")
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">Thời điểm hiện tại</p>
          </CardContent>
        </Card>

        <Card className="border-[#ff6900]/20 shadow-lg bg-gradient-to-br from-white to-[#ff6900]/10 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Đã Hoàn Thành</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#ff6900]" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold text-[#f16a3f]">
              {serviceSummaryData
                ? Number(serviceSummaryData.totalServiceDone).toLocaleString(
                    "vi-VN"
                  )
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">Theo ngày đã chọn</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#9b51e0]/20 shadow-lg bg-gradient-to-br from-white to-[#9b51e0]/10">
        <CardHeader className="bg-[#9b51e0] text-white rounded-t-lg p-2">
          <CardTitle className="text-white font-bold">
            Top 10 Dịch Vụ Theo Số Lượt
          </CardTitle>
          <CardDescription className="text-white/90 font-medium">
            Xếp hạng theo số lượt sử dụng dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={top10Data}
              margin={{ top: isMobile ? 16 : 20, right: isMobile ? 24 : 80, left: 20, bottom: isMobile ? 120 : 140 }}
              barCategoryGap={isMobile ? "30%" : "20%"}
              maxBarSize={isMobile ? 28 : 40}
            >
              <defs>
                <linearGradient
                  id="serviceRevenueGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#9b51e0" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#a29bfe" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient
                  id="serviceGridGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="rgba(155,81,224,0.05)"
                    stopOpacity={0}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgba(155,81,224,0.15)"
                    stopOpacity={1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="2 4"
                stroke="url(#serviceGridGradient)"
                strokeWidth={1}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={(props) => <XAxisColoredTick {...props as XAxisTickProps} />}
                tickMargin={isMobile ? 8 : 12}
                height={isMobile ? 90 : 110}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: isMobile ? 10 : 12, fill: "#334862" }}
                tickFormatter={(value) => `${value}`}
                domain={[0, "dataMax"]}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  padding: isMobile ? "8px 12px" : "12px 16px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "500",
                }}
                formatter={(
                  value: number | string,
                  _name: string,
                  props: { payload?: { percentage: number } }
                ) => {
                  if (props && props.payload) {
                    return [
                      `${Number(value).toLocaleString(
                        "vi-VN"
                      )} lượt (${props.payload.percentage.toFixed(1)}%)`,
                      "Số lượt",
                    ];
                  }
                  return [
                    `${Number(value).toLocaleString("vi-VN")} lượt`,
                    "Số lượt",
                  ];
                }}
                labelFormatter={(
                  label: string,
                  payload: readonly { payload?: { fullName: string } }[]
                ) => {
                  if (payload && payload[0]?.payload) {
                    const data = payload[0].payload;
                    return `${data.fullName}`;
                  }
                  return label;
                }}
              />
              <Bar
                dataKey="usage"
                fill="url(#serviceRevenueGradient)"
                radius={[4, 4, 0, 0]}
                stroke="#9b51e0"
                strokeWidth={1}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey="usage"
                  position="top"
                  formatter={(label: unknown) => {
                    const v = Number(label);
                    return isNaN(v) ? "" : `${v.toLocaleString("vi-VN")}`;
                  }}
                  fontSize={isMobile ? 10 : 16}
                  fontWeight="bold"
                />
                {top10Data.map((d, idx) => (
                  <Cell key={`cell-${idx}`} fill={d.color || barColors[idx % barColors.length]} />
                ))}
              </Bar>
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                wrapperStyle={{ marginTop: isMobile ? 8 : 10, fontSize: isMobile ? 12 : 14 }}
                formatter={() => "Số lượt sử dụng (Top 10)"}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

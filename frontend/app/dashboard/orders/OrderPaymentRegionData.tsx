"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface PaymentRegionDataItem {
  region: string;
  bank: number;
  cash: number;
  card: number;
}

interface OrderPaymentRegionDataProps {
  paymentRegionData: PaymentRegionDataItem[];
  isMobile: boolean;
}

export default function OrderPaymentRegionData({
  paymentRegionData,
  isMobile,
}: OrderPaymentRegionDataProps) {

  // Create a map of max values for each region
  const maxValuesByRegion = React.useMemo(() => {
    const maxMap = new Map<string, number>();
    paymentRegionData.forEach(item => {
      const values = [
        item.bank || 0,
        item.cash || 0,
        item.card || 0
      ];
      maxMap.set(item.region, Math.max(...values));
    });
    return maxMap;
  }, [paymentRegionData]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-8 p-2 sm:p-4">
      <div className="text-base sm:text-2xl font-semibold text-gray-800 mb-4">
        Hình thức thanh toán theo vùng
      </div>
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer
          width="100%"
          height={isMobile ? 250 : 350}
          minWidth={280}
        >
          <BarChart
            data={paymentRegionData}
            margin={{
              top: 20,
              right: isMobile ? 20 : 40,
              left: isMobile ? 20 : 40,
              bottom: 20,
            }}
            barCategoryGap={isMobile ? 10 : 20}
            barGap={isMobile ? 4 : 8}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="region"
              fontSize={isMobile ? 10 : 12}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
            />
            <YAxis
              tickFormatter={(v: number | string) => {
                if (typeof v === "number" && v >= 1_000_000)
                  return (v / 1_000_000).toFixed(1) + "M";
                if (typeof v === "number") return v.toLocaleString();
                return v;
              }}
              fontSize={isMobile ? 10 : 12}
              width={isMobile ? 60 : 80}
            />
            <Tooltip
              formatter={(value: number | string) => {
                if (typeof value === "number") {
                  if (value >= 1_000_000)
                    return `${(value / 1_000_000).toFixed(1)}M`;
                  return value.toLocaleString();
                }
                return value;
              }}
              contentStyle={{
                fontSize: isMobile ? 12 : 14,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: isMobile ? 10 : 12,
                paddingTop: isMobile ? 10 : 20
              }}
            />
            <Bar
              dataKey="bank"
              name="Chuyển khoản"
              fill="#795548"
              maxBarSize={isMobile ? 40 : 50}
            >
              <LabelList
                dataKey="bank"
                position="top"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for highest bar of each region
                    const currentDataPoint = paymentRegionData.find(item => 
                      item.bank === value
                    );
                    if (!currentDataPoint) return "";
                    
                    const maxValue = maxValuesByRegion.get(currentDataPoint.region) || 0;
                    if (typeof value === "number" && value === maxValue && value > 0) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  } else {
                    // On desktop: show all labels
                    if (typeof value === "number" && value > 0) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  }
                }}
                fill="#795548"
                fontSize={isMobile ? 10 : 12}
              />
            </Bar>
            <Bar 
              dataKey="cash" 
              name="Tiền mặt" 
              fill="#c5e1a5" 
              maxBarSize={isMobile ? 40 : 50}
            >
              <LabelList
                dataKey="cash"
                position="top"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for highest bar of each region
                    const currentDataPoint = paymentRegionData.find(item => 
                      item.cash === value
                    );
                    if (!currentDataPoint) return "";
                    
                    const maxValue = maxValuesByRegion.get(currentDataPoint.region) || 0;
                    if (typeof value === "number" && value === maxValue && value > 0) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  } else {
                    // On desktop: show all labels
                    if (typeof value === "number" && value > 0) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  }
                }}
                fill="#c5e1a5"
                fontSize={isMobile ? 10 : 12}
              />
            </Bar>
            <Bar
              dataKey="card"
              name="Thẻ tín dụng/Ghi nợ"
              fill="#ff7f7f"
              maxBarSize={isMobile ? 40 : 50}
            >
              <LabelList
                dataKey="card"
                position="top"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for highest bar of each region
                    const currentDataPoint = paymentRegionData.find(item => 
                      item.card === value
                    );
                    if (!currentDataPoint) return "";
                    
                    const maxValue = maxValuesByRegion.get(currentDataPoint.region) || 0;
                    if (typeof value === "number" && value === maxValue && value > 0) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  } else {
                    // On desktop: show all labels
                    if (typeof value === "number" && value > 0) {
                      return (value / 1_000_000).toFixed(1) + "M";
                    }
                    return "";
                  }
                }}
                fill="#ff7f7f"
                fontSize={isMobile ? 10 : 12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
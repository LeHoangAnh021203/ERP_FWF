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

  // Lấy bottom 5 từ tổng data thay vì top 10
  const bottom5Data = React.useMemo(() => {
    if (!paymentRegionData || paymentRegionData.length === 0) {
      // Fallback data khi API chưa load
      return [
        { region: "Đang tải...", bank: 0, cash: 0, card: 0, total: 0 },
        { region: "Đang tải...", bank: 0, cash: 0, card: 0, total: 0 },
        { region: "Đang tải...", bank: 0, cash: 0, card: 0, total: 0 },
        { region: "Đang tải...", bank: 0, cash: 0, card: 0, total: 0 },
        { region: "Đang tải...", bank: 0, cash: 0, card: 0, total: 0 },
      ];
    }
    
    // Tính tổng doanh thu cho mỗi region
    const regionsWithTotal = paymentRegionData.map(item => ({
      ...item,
      total: (item.bank || 0) + (item.cash || 0) + (item.card || 0)
    }));
    
    // Sắp xếp theo tổng doanh thu tăng dần (thấp nhất lên đầu) và lấy 5 cuối
    const sortedByTotal = regionsWithTotal.sort((a, b) => a.total - b.total);
    const bottom5 = sortedByTotal.slice(0, 5);
    
    // Debug log để kiểm tra dữ liệu
    console.log('Payment Region Data from API:', paymentRegionData);
    console.log('Bottom 5 Data:', bottom5);
    
    return bottom5;
  }, [paymentRegionData]);

  // Create a map of max values for each region
  const maxValuesByRegion = React.useMemo(() => {
    const maxMap = new Map<string, number>();
    bottom5Data.forEach(item => {
      const values = [
        item.bank || 0,
        item.cash || 0,
        item.card || 0
      ];
      maxMap.set(item.region, Math.max(...values));
    });
    return maxMap;
  }, [bottom5Data]);

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
            data={bottom5Data}
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
                    const currentDataPoint = bottom5Data.find(item => 
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
                    const currentDataPoint = bottom5Data.find(item => 
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
                    const currentDataPoint = bottom5Data.find(item => 
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

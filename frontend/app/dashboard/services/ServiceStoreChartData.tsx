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

// Custom Tooltip component
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      combo: number;
      comboCS: number;
      service: number;
      addedon: number;
      gifts: number;
      total: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#795548]">Combo:</span>
            <span className="font-medium">{data.combo.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#8D6E63]">Combo CS:</span>
            <span className="font-medium">{data.comboCS.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#c5e1a5]">Dịch vụ:</span>
            <span className="font-medium">{data.service.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#f16a3f]">Cộng thêm:</span>
            <span className="font-medium">{data.addedon.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#8fd1fc]">Quà tặng:</span>
            <span className="font-medium">{data.gifts.toLocaleString()}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Tổng:</span>
            <span className="font-bold text-blue-600">{data.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Legend component
interface LegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

const CustomLegend = ({ payload }: LegendProps) => {
  if (!payload || payload.length === 0) return null;

  // Định nghĩa màu sắc chính xác cho từng loại dịch vụ
  const serviceColors: { [key: string]: string } = {
    "Combo": "#795548",
    "Combo CS": "#8D6E63", 
    "Dịch vụ": "#c5e1a5",
    "Added on": "#f16a3f",
    "Gifts": "#8fd1fc"
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index: number) => {
        const color = serviceColors[entry.value] || entry.color;
        return (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-sm" 
              style={{ backgroundColor: color }}
            ></div>
            <span 
              className="text-sm font-medium"
              style={{ color: color }}
            >
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};



interface ServiceStoreChartDataProps {
  shopLoading: boolean;
  shopError: string | null;
  isMobile: boolean;
  storeServiceChartData: Array<{
    store: string;
    combo: number;
    comboCS: number;
    service: number;
    addedon: number;
    gifts: number;
    total: number;
  }>;
}

export default function ServiceStoreChartData({
  shopLoading,
  shopError,
  isMobile,
  storeServiceChartData,
}: ServiceStoreChartDataProps) {
  // Tính tổng số dịch vụ
  const totalServices = storeServiceChartData.reduce((sum, store) => sum + store.total, 0);
  const totalStores = storeServiceChartData.length;
  const topStore = storeServiceChartData[0];

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-4">
      <div className="text-xl font-medium text-gray-700 text-center mb-4" data-search-ref="services_store">
        Tổng dịch vụ thực hiện theo cửa hàng
      </div>
      
      {/* Thống kê tổng quan */}
     
      {shopLoading && (
        <div className="text-blue-600 text-sm text-center mb-4">
          🔄 Đang tải dữ liệu cửa hàng...
        </div>
      )}
      {shopError && (
        <div className="text-red-600 text-sm text-center mb-4">
          ❌ Lỗi API cửa hàng: {shopError}
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px] md:min-w-0 ">
          <ResponsiveContainer
            width={isMobile ? 500 : "100%"}
            height={isMobile ? 800 : 800}
          >
            <BarChart
              data={storeServiceChartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: isMobile ? 60 : 120,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : v.toString())}
                tick={{ fontSize: isMobile ? 10 : 14 }}
              />
              <YAxis
                dataKey="store"
                type="category"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 150 : 200}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar
                dataKey="combo"
                name="Combo"
                stackId="a"
                fill="#795548"
              />
              <Bar
                dataKey="comboCS"
                name="Combo CS"
                stackId="a"
                fill="#8D6E63"
              />
              <Bar
                dataKey="service"
                name="Dịch vụ"
                stackId="a"
                fill="#c5e1a5"
              />
              <Bar
                dataKey="addedon"
                name="Cộng thêm"
                stackId="a"
                fill="#f16a3f"
              />
              <Bar 
                dataKey="gifts" 
                name="Quà tặng" 
                stackId="a" 
                fill="#8fd1fc"
              >
                <LabelList
                  dataKey="total"
                  position="right"
                  formatter={(value: React.ReactNode) => {
                    if (typeof value === "number") {
                      return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
                    }
                    return "";
                  }}
                  fill="#333"
                  fontSize={isMobile ? 10 : 12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
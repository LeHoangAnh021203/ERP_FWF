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
} from "recharts";

// Custom Tooltip component
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    combo: number;
    comboCS: number;
    service: number;
    addedon: number;
    gifts: number;
    total: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#795548]">Combo:</span>
            <span className="font-medium text-[#795548]">
              {(data.combo || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#8D6E63]">Combo CS:</span>
            <span className="font-medium text-[#8D6E63]">
              {(data.comboCS || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#689F38]">Dịch vụ:</span>
            <span className="font-medium text-[#689F38]">
              {(data.service || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#f16a3f]">Cộng thêm:</span>
            <span className="font-medium text-[#f16a3f]">
              {(data.addedon || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#8fd1fc]">Quà tặng:</span>
            <span className="font-medium text-[#8fd1fc]">
              {(data.gifts || 0).toLocaleString()}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Tổng:</span>
            <span className="font-bold text-blue-600">
              {(data.total || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface ServicesRegionDataProps {
  regionLoading: boolean;
  regionError: string | null;
  isMobile: boolean;
  regionChartData: Array<{
    region: string;
    combo: number;
    comboCS: number;
    service: number;
    addedon: number;
    gifts: number;
    total: number;
  }>;
}

export default function ServicesRegionData({
  regionLoading,
  regionError,
  isMobile,
  regionChartData,
}: ServicesRegionDataProps) {
  // Tính tổng số dịch vụ
  const totalServices = regionChartData.reduce(
    (sum, region) => sum + region.total,
    0
  );
  const totalRegions = regionChartData.length;
  const topRegion = regionChartData[0];

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-4">
      <div className="text-xl font-medium text-gray-700 text-center mb-4" data-search-ref="services_region">
        Tổng dịch vụ thực hiện theo khu vực
      </div>

      {/* Thống kê tổng quan */}
      
      {regionLoading && (
        <div className="text-blue-600 text-sm text-center mb-4">
          🔄 Đang tải dữ liệu khu vực...
        </div>
      )}
      {regionError && (
        <div className="text-red-600 text-sm text-center mb-4">
          ❌ Lỗi API khu vực: {regionError}
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px] md:min-w-0 ">
          <ResponsiveContainer
            width={isMobile ? 500 : "100%"}
            height={isMobile ? 400 : 500}
          >
            <BarChart
              data={regionChartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: isMobile ? 40 : 100,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${v / 1000}k` : v.toString()
                }
                tick={{ fontSize: isMobile ? 10 : 14 }}
              />
              <YAxis
                dataKey="region"
                type="category"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 120 : 150}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontSize: isMobile ? 10 : 14,
                }}
              />
              <Bar dataKey="combo" name="Combo" stackId="a" fill="#795548" />
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
                fill="#689F38"
              />
              <Bar
                dataKey="addedon"
                name="Cộng thêm"
                stackId="a"
                fill="#f16a3f"
              />
              <Bar dataKey="gifts" name="Quà tặng" stackId="a" fill="#8fd1fc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

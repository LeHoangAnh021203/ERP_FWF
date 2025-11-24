"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PieChartDataProps {
  pieChartData: Array<{
    key: string;
    label: string;
    value: number;
    color: string;
  }>;
  pieTop10Data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  pieTop10AvgData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  top10ServicesLoading: boolean;
  top10ServicesError: string | null;
  top10ServicesUsageLoading: boolean;
  top10ServicesUsageError: string | null;
  isMobile: boolean;
  renderPieLabel: (props: {
    percent?: number;
    x?: number;
    y?: number;
    index?: number;
  }) => React.JSX.Element | null;
}

// Custom tooltip component
interface TooltipPayload {
  value: number;
  name?: string;
  payload: {
    label?: string;
  };
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    
    // Calculate total from all payload items (this should be the total for the specific chart)
    const total = payload.reduce((sum: number, item: TooltipPayload) => sum + item.value, 0);
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
    
    // Determine if this is revenue data based on the chart title
    const isRevenueChart = label?.includes('giá buổi') || label?.includes('doanh thu') || label?.includes('Top 10 dịch vụ theo giá buổi');
    
    console.log('Tooltip label:', label, 'isRevenueChart:', isRevenueChart, 'data.value:', data.value, 'total:', total, 'percentage:', percentage);
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.name || data.payload.label}</p>
        <p className="text-sm text-gray-600">
          {isRevenueChart ? 'Doanh thu: ' : 'Số lượng: '}
          <span className="font-semibold">
            {isRevenueChart 
              ? `${(data.value / 1000000).toFixed(1)}M VNĐ`
              : data.value.toLocaleString()
            }
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Tỷ lệ: <span className="font-semibold">{percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function PieChartData({
  pieChartData,
  pieTop10Data,
  pieTop10AvgData,
  top10ServicesLoading,
  top10ServicesError,
  top10ServicesUsageLoading,
  top10ServicesUsageError,
  isMobile,
  renderPieLabel,
}: PieChartDataProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-3"  data-search-ref="services_pies">
      {/* PieChart tỉ lệ dịch vụ/combo/cộng thêm (có filter) */}
      <div className="w-full sm:w-1/3 bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-xl font-medium text-gray-700 text-center mb-4">
          Tỉ lệ dịch vụ/combo/cộng thêm
        </div>
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 320}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 120}
              label={renderPieLabel}
            >
              {pieChartData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip label="Tỉ lệ dịch vụ/combo/cộng thêm" />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="overflow-hidden">
          <ul className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
            {pieChartData.map((item) => (
              <li key={item.key} className="flex items-start gap-1">
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: item.color }}
                />
                <span className="break-words">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PieChart top 10 dịch vụ theo số lượng */}
      <div className="w-full sm:w-1/3 bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-xl font-medium text-gray-700 text-center mb-4">
          Top 10 dịch vụ theo số lượng
        </div>
        {top10ServicesLoading && (
          <div className="text-blue-600 text-sm text-center mb-4">
            🔄 Đang tải dữ liệu top 10 dịch vụ...
          </div>
        )}
        {top10ServicesError && (
          <div className="text-red-600 text-sm text-center mb-4">
            ❌ Lỗi API top 10 dịch vụ: {top10ServicesError}
          </div>
        )}
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 320}>
          <PieChart>
            <Pie
              data={pieTop10Data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 120}
              label={renderPieLabel}
            >
              {pieTop10Data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip label="Top 10 dịch vụ theo số lượng" />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="overflow-hidden">
          <ul className="flex flex-wrap  gap-2 mt-2 text-xs">
            {pieTop10Data.map((item) => (
              <li key={item.name} className="flex items-start gap-1">
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: item.color }}
                />
                <span className="break-words">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PieChart top 10 dịch vụ theo giá buổi */}
      <div className="w-full sm:w-1/3 bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-xl font-medium text-gray-700 text-center mb-4">
          Top 10 dịch vụ theo giá buổi
        </div>
        {top10ServicesUsageLoading && (
          <div className="text-blue-600 text-sm text-center mb-4">
            🔄 Đang tải dữ liệu top 10 dịch vụ theo giá buổi...
          </div>
        )}
        {top10ServicesUsageError && (
          <div className="text-red-600 text-sm text-center mb-4">
            ❌ Lỗi API top 10 dịch vụ theo giá buổi:{" "}
            {top10ServicesUsageError}
          </div>
        )}
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 320}>
          <PieChart>
            <Pie
              data={pieTop10AvgData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 120}
              label={renderPieLabel}
            >
              {pieTop10AvgData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip label="Top 10 dịch vụ theo giá buổi" />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="overflow-hidden">
          <ul className="flex flex-wrap  gap-2 mt-2 text-xs">
            {pieTop10AvgData.map((item) => (
              <li key={item.name} className="flex items-start gap-1">
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: item.color }}
                />
                <span className="break-words">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>        
    </div>
  );
}
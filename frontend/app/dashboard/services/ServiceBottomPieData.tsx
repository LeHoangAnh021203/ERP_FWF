"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Top10ServicesUsageData {
  serviceName: string;
  count: number;
}

// Custom tooltip component
interface TooltipPayload {
  value: number;
  name?: string;
  payload: {
    name?: string;
  };
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">
          {data.name || data.payload.name}
        </p>
        <p className="text-sm text-gray-600">
          {label?.includes("giá buổi") ? "Doanh thu: " : "Số lượng: "}
          <span className="font-semibold">
            {label?.includes("giá buổi")
              ? `${(data.value / 1000000).toFixed(1)}M VNĐ`
              : data.value.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

interface OrderBottomPieDataProps {
  bottom3ServicesUsageData: Top10ServicesUsageData[] | null;
  bottom3ServicesUsageLoading: boolean;
  bottom3ServicesUsageError: string | null;
  bottom3ServicesRevenueLoading: boolean;
  bottom3ServicesRevenueError: string | null;
  bottom3Data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  bottom3RevenueData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  filteredPieData: Array<{
    serviceName?: string;
    type: string;
  }>;
  isMobile: boolean;
}

export default function ServiceBottomPieData({
  bottom3ServicesUsageData,
  bottom3ServicesUsageLoading,
  bottom3ServicesUsageError,
  bottom3ServicesRevenueLoading,
  bottom3ServicesRevenueError,
  bottom3Data,
  bottom3RevenueData,
  filteredPieData,
  isMobile,
}: OrderBottomPieDataProps) {
  return (
    <>
      <style jsx>{`
        .recharts-pie-label-text {
          font-size: ${isMobile ? '8px' : '12px'} !important;
        }
      `}</style>
    <div className="flex flex-col lg:flex-row gap-2 justify-center" data-search-ref="services_bottom3">
      {/* PieChart bottom 3 dịch vụ theo số lượng */}
      <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-lg lg:text-xl font-medium text-gray-700 text-center mb-4">
          Bottom 3 dịch vụ theo số lượng
        </div>
        {bottom3ServicesUsageLoading && (
          <div className="text-blue-600 text-sm text-center mb-4">
            🔄 Đang tải dữ liệu bottom 3 dịch vụ...
          </div>
        )}
        {bottom3ServicesUsageError && (
          <div className="text-red-600 text-sm text-center mb-4">
            ❌ Lỗi API bottom 3 dịch vụ: {bottom3ServicesUsageError}
          </div>
        )}
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
          <PieChart>
            <Pie
              data={(() => {
                if (bottom3ServicesUsageData) {
                  // Sử dụng dữ liệu API
                  const grayShades = ["#bdbdbd", "#9e9e9e", "#e0e0e0"];
                  return bottom3ServicesUsageData.map((service, idx) => ({
                    name: service.serviceName,
                    value: service.count,
                    color: grayShades[idx % grayShades.length],
                  }));
                }

                // Fallback data nếu API chưa load
                const serviceCountMap = new Map();
                filteredPieData.forEach((d) => {
                  const name = d.serviceName || d.type;
                  serviceCountMap.set(
                    name,
                    (serviceCountMap.get(name) || 0) + 1
                  );
                });
                const sorted = Array.from(serviceCountMap.entries()).sort(
                  (a, b) => a[1] - b[1]
                );
                const bottom3 = sorted.slice(0, 3);
                // Màu xám cho từng phần
                const grayShades = ["#bdbdbd", "#9e9e9e", "#e0e0e0"];
                return bottom3.map(([name, value], idx) => ({
                  name,
                  value,
                  color: grayShades[idx % grayShades.length],
                }));
              })()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 45 : 90}
              label={({ percent }: { percent?: number }) =>
                percent && percent > 0.15
                  ? `${(percent * 100).toFixed(1)}%`
                  : ""
              }
              labelLine={false}
              isAnimationActive={false}
            >
              {(() => {
                if (bottom3ServicesUsageData) {
                  // Sử dụng dữ liệu API
                  const grayShades = ["#bdbdbd", "#9e9e9e", "#e0e0e0"];
                  return bottom3ServicesUsageData.map((service, idx) => (
                    <Cell
                      key={service.serviceName}
                      fill={grayShades[idx % grayShades.length]}
                    />
                  ));
                }

                // Fallback data nếu API chưa load
                const serviceCountMap = new Map();
                filteredPieData.forEach((d) => {
                  const name = d.serviceName || d.type;
                  serviceCountMap.set(
                    name,
                    (serviceCountMap.get(name) || 0) + 1
                  );
                });
                const sorted = Array.from(serviceCountMap.entries()).sort(
                  (a, b) => a[1] - b[1]
                );
                const bottom3 = sorted.slice(0, 3);
                const grayShades = ["#bdbdbd", "#9e9e9e", "#e0e0e0"];
                return bottom3.map(([name], idx) => (
                  <Cell key={name} fill={grayShades[idx % grayShades.length]} />
                ));
              })()}
            </Pie>
            <Tooltip
              content={<CustomTooltip label="Bottom 3 dịch vụ theo số lượng" />}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="overflow-hidden">
          <ul className="flex flex-wrap gap-2 mt-2 text-xs">
            {bottom3Data.map((item) => (
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

      {/* PieChart bottom 3 dịch vụ theo giá buổi */}
      <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg mt-5 p-4">
        <div className="text-lg lg:text-xl font-medium text-gray-700 text-center mb-4">
          Bottom 3 dịch vụ theo giá buổi
        </div>
        {bottom3ServicesRevenueLoading && (
          <div className="text-blue-600 text-sm text-center mb-4">
            🔄 Đang tải dữ liệu bottom 3 dịch vụ theo giá buổi...
          </div>
        )}
        {bottom3ServicesRevenueError && (
          <div className="text-red-600 text-sm text-center mb-4">
            ❌ Lỗi API bottom 3 dịch vụ theo giá buổi:{" "}
            {bottom3ServicesRevenueError}
          </div>
        )}
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
          <PieChart>
            <Pie
              data={bottom3RevenueData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 45 : 90}
              label={({ percent }: { percent?: number }) =>
                percent && percent > 0.15
                  ? `${(percent * 100).toFixed(1)}%`
                  : ""
              }
              labelLine={false}
              isAnimationActive={false}
            >
              {bottom3RevenueData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip label="Bottom 3 dịch vụ theo giá buổi" />}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex flex-wrap  gap-3 mt-2 text-xs">
          {bottom3Data.map((item) => (
            <li key={item.name} className=" flex gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: item.color }}
              />
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}

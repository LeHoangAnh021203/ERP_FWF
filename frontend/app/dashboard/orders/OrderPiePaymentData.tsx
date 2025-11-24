"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PiePaymentDataItem {
  name: string;
  value: number;
  color: string;
}

interface OrderPiePaymentDataProps {
  piePaymentData: PiePaymentDataItem[];
  totalAllPie: number;
  isMobile: boolean;
  renderPieLabel: (props: {
    percent?: number;
    x?: number;
    y?: number;
    index?: number;
  }) => React.ReactNode;
}

export default function OrderPiePaymentData({
  piePaymentData,
  totalAllPie,
  isMobile,
  renderPieLabel,
}: OrderPiePaymentDataProps) {
  return (
    <div className="w-full flex flex-col md:flex-row justify-center mt-8">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-3xl w-full">
        <div className="flex-1 flex justify-center">
          <ResponsiveContainer
            width="100%"
            height={isMobile ? 180 : 320}
            minWidth={180}
          >
            <PieChart>
              <Pie
                data={piePaymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : 120}
                label={renderPieLabel}
              >
                {piePaymentData.map((entry: PiePaymentDataItem) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | string) =>
                  `${value} (${(
                    (Number(value) / totalAllPie) *
                    100
                  ).toFixed(1)}%)`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="text-base sm:text-xl font-semibold text-gray-700 mb-4 text-center md:text-left">
            Tỉ lệ mua thẻ/dịch vụ lẻ/trả bằng thẻ
          </div>
          <ul className="space-y-2">
            {piePaymentData.map((item: PiePaymentDataItem) => (
              <li key={item.name} className="flex items-center gap-3">
                <span
                  className="inline-block w-5 h-5 rounded-full"
                  style={{ background: item.color }}
                ></span>
                <span className="font-medium text-gray-800">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
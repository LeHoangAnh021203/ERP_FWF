"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface Item { name: string; value: number; color: string }

interface PercentChartProps {
  productDataByDistrict: Item[];
  foxieCardDataByDistrict: Item[];
  serviceDataByDistrict: Item[];
}

export default function PercentChart({
  productDataByDistrict,
  foxieCardDataByDistrict,
  serviceDataByDistrict,
}: PercentChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="border-[#41d1d9]/20 shadow-lg bg-gradient-to-br from-white to-[#41d1d9]/10">
        <CardHeader className="bg-[#0891b2] text-white rounded-t-lg p-2">
          <CardTitle className="text-white font-bold">% Sản Phẩm Theo Cửa Hàng</CardTitle>
          <CardDescription className="text-white/90 font-medium">Phân bố sản phẩm theo từng cửa hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={productDataByDistrict}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
                animationBegin={0}
                animationDuration={2000}
                animationEasing="ease-out"
              >
                {productDataByDistrict.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={2}
                    filter="url(#glow)"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                formatter={(value) => [`${value}%`, 'Tỷ lệ']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-[#9b51e0]/20 shadow-lg bg-gradient-to-br from-white to-[#9b51e0]/10">
        <CardHeader className="bg-[#9b51e0] text-white rounded-t-lg p-2">
          <CardTitle className="text-white font-bold">% Thẻ Foxie Theo Cửa Hàng</CardTitle>
          <CardDescription className="text-white/90 font-medium">Phân bố thẻ Foxie theo từng cửa hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <defs>
                <filter id="foxieGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={foxieCardDataByDistrict}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
                animationBegin={300}
                animationDuration={2000}
                animationEasing="ease-out"
              >
                {foxieCardDataByDistrict.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={2}
                    filter="url(#foxieGlow)"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                formatter={(value) => [`${value}%`, 'Tỷ lệ']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-[#00b894]/20 shadow-lg bg-gradient-to-br from-white to-[#00b894]/10">
        <CardHeader className="bg-[#00b894] text-white rounded-t-lg p-2">
          <CardTitle className="text-white font-bold">% Dịch Vụ Theo Cửa Hàng</CardTitle>
          <CardDescription className="text-white/90 font-medium">Phân bố dịch vụ theo cửa hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <defs>
                <filter id="serviceGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={serviceDataByDistrict}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
                animationBegin={600}
                animationDuration={2000}
                animationEasing="ease-out"
              >
                {serviceDataByDistrict.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={2}
                    filter="url(#serviceGlow)"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                formatter={(value) => [`${value}%`, 'Tỷ lệ']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
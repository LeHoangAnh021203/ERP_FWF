"use client";

import React from "react";
import { Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { LegendPayload } from "recharts";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";

interface PieItem { name: string; value: number; color: string }

interface CustomerSectionProps {
  newCustomerLoading: boolean;
  newCustomerError: string | null;
  newCustomerTotal: number;
  newCustomerPieData: PieItem[];
  oldCustomerLoading: boolean;
  oldCustomerError: string | null;
  oldCustomerTotal: number;
  oldCustomerPieData: PieItem[];
}

export default function CustomerSection({
  newCustomerLoading,
  newCustomerError,
  newCustomerTotal,
  newCustomerPieData,
  oldCustomerLoading,
  oldCustomerError,
  oldCustomerTotal,
  oldCustomerPieData,
}: CustomerSectionProps) {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-[#f16a3f]" />
        <h2 className="text-2xl font-bold text-[#334862]">Khách Hàng</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#00d084]/20 shadow-lg bg-gradient-to-br from-white to-[#00d084]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách Mới Hôm Nay</CardTitle>
            <Users className="h-4 w-4 text-[#00d084]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f16a3f]">
              {newCustomerLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : newCustomerError ? (
                <span className="text-red-500">—</span>
              ) : (
                newCustomerTotal.toLocaleString("vi-VN")
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {newCustomerLoading ? "Đang tải..." : "Theo ngày đã chọn"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#0693e3]/20 shadow-lg bg-gradient-to-br from-white to-[#0693e3]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách Cũ Quay Lại</CardTitle>
            <Users className="h-4 w-4 text-[#0693e3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f16a3f]">
              {oldCustomerLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : oldCustomerError ? (
                <span className="text-red-500">—</span>
              ) : (
                oldCustomerTotal.toLocaleString("vi-VN")
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {oldCustomerLoading ? "Đang tải..." : "Theo ngày đã chọn"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#9b51e0]/20 shadow-lg bg-gradient-to-br from-white to-[#9b51e0]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Khách Hàng</CardTitle>
            <Users className="h-4 w-4 text-[#9b51e0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f16a3f]">
              {(newCustomerLoading || oldCustomerLoading) ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : (newCustomerError || oldCustomerError) ? (
                <span className="text-red-500">—</span>
              ) : (
                (newCustomerTotal + oldCustomerTotal).toLocaleString("vi-VN")
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {(newCustomerLoading || oldCustomerLoading) ? "Đang tải..." : "Khách mới + Khách cũ"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nguồn Khách Mới</CardTitle>
            <CardDescription>Phân loại theo kênh tiếp cận</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <PieChart>
                <defs>
                  <filter id="customerGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={newCustomerPieData}
                  cx="50%"
                  cy={isMobile ? "40%" : "45%"}
                  innerRadius={isMobile ? 30 : 40}
                  outerRadius={isMobile ? 70 : 100}
                  paddingAngle={2}
                  labelLine={false}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {newCustomerPieData.map((entry: PieItem, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={2}
                      filter="url(#customerGlow)"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  formatter={(value: number, _name: string, props: { payload?: { name: string } }) => [
                    `${Number(value).toLocaleString("vi-VN")} khách`,
                    props?.payload?.name || "Nguồn",
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={isMobile ? 60 : 60}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: isMobile ? 5 : 10,
                    paddingBottom: isMobile ? 5 : 10,
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    width: "100%",
                    fontSize: isMobile ? 9 : 12,
                    lineHeight: isMobile ? "1.2" : "1.4",
                  }}
                  formatter={(value: string, entry: LegendPayload) => {
                    const data: PieItem[] = newCustomerPieData;
                    const total = data.reduce((sum: number, item: PieItem) => sum + item.value, 0);
                    const p = (entry.payload as unknown as PieItem) || undefined;
                    const percentage = p?.value ? ((p.value / total) * 100).toFixed(1) : '0';
                    return `${value} (${percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {newCustomerPieData.length === 0 && (
              <div className="text-xs text-gray-500 mt-2">Không có dữ liệu khách mới theo nguồn trong khoảng ngày đã chọn.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nguồn Khách Cũ</CardTitle>
            <CardDescription>Kênh quay lại của khách cũ</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <PieChart>
                <defs>
                  <filter id="oldCustomerGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <Pie
                  data={oldCustomerPieData}
                  cx="50%"
                  cy={isMobile ? "40%" : "45%"}
                  innerRadius={isMobile ? 30 : 40}
                  outerRadius={isMobile ? 70 : 100}
                  paddingAngle={2}
                  labelLine={false}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {oldCustomerPieData.map((entry: PieItem, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={2}
                      filter="url(#oldCustomerGlow)"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  formatter={(value: number, _name: string, props: { payload?: { name: string } }) => [
                    `${Number(value).toLocaleString("vi-VN")} khách`,
                    props?.payload?.name || "Nguồn",
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={isMobile ? 120 : 60}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: isMobile ? 5 : 10,
                    paddingBottom: isMobile ? 5 : 10,
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    width: "100%",
                    fontSize: isMobile ? 9 : 12,
                    lineHeight: isMobile ? "1.2" : "1.4",
                    fontWeight: "500",
                  }}
                  formatter={(value: string, entry: LegendPayload) => {
                    const data: PieItem[] = oldCustomerPieData;
                    const total = data.reduce((sum: number, item: PieItem) => sum + item.value, 0);
                    const p = (entry.payload as unknown as PieItem) || undefined;
                    const percentage = p?.value ? ((p.value / total) * 100).toFixed(1) : '0';
                    return `${value} (${percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {oldCustomerPieData.length === 0 && (
              <div className="text-xs text-gray-500 mt-2">Không có dữ liệu khách cũ theo nguồn trong khoảng ngày đã chọn.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
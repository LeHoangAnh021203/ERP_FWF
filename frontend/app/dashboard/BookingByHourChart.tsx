"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export interface BookingByHourItem {
  type: string; // "09:00"
  count: number;
}

export default function BookingByHourChart({
  loading,
  error,
  data,
}: {
  loading: boolean;
  error: string | null;
  data: BookingByHourItem[] | null;
}) {
  const series = React.useMemo(() => {
    if (!data) return [] as BookingByHourItem[];
    return [...data].sort((a, b) => a.type.localeCompare(b.type));
  }, [data]);

  return (
    <Card className="border-[#41d1d9]/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-base">Số lượt booking theo khung giờ</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[260px] flex items-center justify-center text-[#41d1d9]">Đang tải biểu đồ…</div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : !series.length ? (
          <div className="text-gray-500 text-sm">Không có dữ liệu cho ngày đã chọn.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={series} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip formatter={(v: number) => `${v} lượt`} labelFormatter={(l) => `Khung giờ ${l}`} />
              <Bar dataKey="count" name="Số lượt" fill="#41d1d9" barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}



"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";

interface BookingData {
  notConfirmed: string;
  confirmed: string;
  denied: string;
  customerCome: string;
  customerNotCome: string;
  cancel: string;
  autoConfirmed: string;
}

interface BookingSectionProps {
  bookingLoading: boolean;
  bookingError: string | null;
  bookingData: BookingData | null;
}

export default function BookingSection({
  bookingLoading,
  bookingError,
  bookingData,
}: BookingSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-[#f16a3f]" />
        <h2 className="text-2xl font-bold text-[#334862]">Đặt Lịch</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#fcb900]/20 shadow-lg bg-gradient-to-br from-white to-[#fcb900]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách Đã Đến</CardTitle>
            <Clock className="h-4 w-4 text-[#fcb900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f16a3f]">
              {bookingLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : bookingError ? (
                <span className="text-red-500">—</span>
              ) : bookingData ? (
                parseInt(bookingData.customerCome).toLocaleString("vi-VN")
              ) : (
                "—"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {bookingLoading
                ? "Đang tải..."
                : bookingData
                ? `${Math.round(
                    (parseInt(bookingData.customerCome) /
                      (parseInt(bookingData.customerCome) +
                        parseInt(bookingData.customerNotCome))) *
                      100
                  )}% hoàn thành`
                : "Tỷ lệ hoàn thành"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#ff6900]/20 shadow-lg bg-gradient-to-br from-white to-[#ff6900]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách Chưa Đến
            </CardTitle>
            <Clock className="h-4 w-4 text-[#ff6900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f16a3f]">
              {bookingLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : bookingError ? (
                <span className="text-red-500">—</span>
              ) : bookingData ? (
                parseInt(bookingData.customerNotCome).toLocaleString("vi-VN")
              ) : (
                "—"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {bookingLoading ? "Đang tải..." : "Chưa thực hiện"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#ff6b6b]/20 shadow-lg bg-gradient-to-br from-white to-[#ff6b6b]/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ Chối</CardTitle>
            <Clock className="h-4 w-4 text-[#ff6b6b]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f16a3f]">
              {bookingLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : bookingError ? (
                <span className="text-red-500">—</span>
              ) : bookingData ? (
                parseInt(bookingData.denied).toLocaleString("vi-VN")
              ) : (
                "—"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {bookingLoading ? "Đang tải..." : "Không được chấp nhận"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

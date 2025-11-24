"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card";

interface FoxieBalanceTableProps {
  foxieBalanceLoading: boolean;
  foxieBalanceError: string | null;
  foxieBalanceData: {
    the_tien_kha_dung: number;
  } | null;
}

export default function FoxieBalanceTable({
  foxieBalanceLoading,
  foxieBalanceError,
  foxieBalanceData,
}: FoxieBalanceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Card className="border-[#9b51e0]/20 shadow-lg bg-gradient-to-br from-white to-[#9b51e0]/10">
      <CardHeader className="bg-[#9b51e0] text-white rounded-t-lg p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          <CardTitle className="text-white font-bold text-base sm:text-lg">
            Số Tiền Foxie Khả Dụng
          </CardTitle>
        </div>
        <CardDescription className="text-white/90 font-medium text-sm">
          Tổng số tiền khách hàng có thể sử dụng trên thẻ Foxie
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gradient-to-r from-[#9b51e0]/10 to-[#a29bfe]/10 rounded-lg border border-[#9b51e0]/20">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#9b51e0] rounded-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#334862]">
                    Số Dư Khả Dụng
                  </h3>
                </div>
              </div>
              <div className="text-right">
                {foxieBalanceLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
                ) : foxieBalanceError ? (
                  <span className="text-red-500 text-lg font-semibold">—</span>
                ) : foxieBalanceData ? (
                  <div className="text-2xl font-bold text-[#9b51e0]">
                    {formatCurrency(foxieBalanceData.the_tien_kha_dung)}
                  </div>
                ) : (
                  <span className="text-gray-400 text-lg font-semibold">—</span>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden p-3 space-y-3">
              <div className="flex items-center gap-3"></div>
              <div className="text-center">
                {foxieBalanceLoading ? (
                  <div className="animate-pulse bg-gray-200 h-6 w-24 rounded mx-auto"></div>
                ) : foxieBalanceError ? (
                  <span className="text-red-500 text-base font-semibold">
                    —
                  </span>
                ) : foxieBalanceData ? (
                  <div className="text-lg font-bold text-[#9b51e0]">
                    {formatCurrency(foxieBalanceData.the_tien_kha_dung)}
                  </div>
                ) : (
                  <span className="text-gray-400 text-base font-semibold">
                    —
                  </span>
                )}
              </div>
            </div>
          </div>

          {foxieBalanceError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                Lỗi tải dữ liệu: {foxieBalanceError}
              </p>
            </div>
          )}

          {foxieBalanceLoading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600 text-sm">Đang tải dữ liệu...</p>
            </div>
          )}

          {foxieBalanceData && !foxieBalanceLoading && !foxieBalanceError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs sm:text-sm text-gray-600">
                  Trạng Thái
                </div>
                <div className="font-semibold text-green-600 text-sm sm:text-base">
                  Hoạt Động
                </div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs sm:text-sm text-gray-600">Cập Nhật</div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">
                  Thời gian thực
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

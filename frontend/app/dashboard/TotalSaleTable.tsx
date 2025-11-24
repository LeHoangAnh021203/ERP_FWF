"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Banknote, Wallet, CreditCard, DollarSign } from "lucide-react";

export interface PaymentMethod {
  method: string;
  amount: number;
  percentage: number;
  transactions: number;
}

interface TotalSaleTableProps {
  allPaymentMethods: PaymentMethod[];
  totalRevenue: number;
  dateRangeText?: string; // e.g., "từ 01/12 đến 14/12"
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function TotalSaleTable({ allPaymentMethods, totalRevenue, dateRangeText }: TotalSaleTableProps) {
  return (
    <Card className="border-[#f16a3f]/20 shadow-lg bg-gradient-to-r from-white to-[#f16a3f]/5">
      <CardHeader>
        <CardTitle className="text-orange-500 font-bold text-lg sm:text-[25px] pt-2 pl-2 sm:pl-4">
          Bảng Tổng Doanh Số
          {dateRangeText && (
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-normal text-green-600 block sm:inline">{dateRangeText}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {/* Desktop Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 p-3 bg-gradient-to-r from-[#7bdcb5]/20 to-[#00d084]/20 rounded-lg font-semibold text-sm">
            <div className="col-span-4 text-gray-800">Phương thức thanh toán</div>
            <div className="col-span-3 text-right text-gray-800">Số tiền</div>
            <div className="col-span-3 text-center text-gray-800">Tỷ lệ</div>
            <div className="col-span-2 text-center text-gray-800">GD</div>
          </div>

          {allPaymentMethods
            .sort((a, b) => b.amount - a.amount)
            .map((method, index) => (
              <div
                key={`${method.method}-${index}`}
                className="border border-[#f16a3f]/10 rounded-lg hover:bg-gradient-to-r hover:from-[#f8a0ca]/10 hover:to-[#41d1d9]/10 transition-all duration-300"
              >
                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-3">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {method.method === "TM+CK+QT" && <Banknote className="h-4 w-4 text-[#00d084]" />}
                      {method.method === "Thanh toán ví" && <Wallet className="h-4 w-4 text-[#fcb900]" />}
                      {method.method === "Thẻ Foxie" && <CreditCard className="h-4 w-4 text-[#9b51e0]" />}
                      <span className="font-medium">{method.method}</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-right font-semibold">{formatCurrency(method.amount)}</div>
                  <div className="col-span-3 text-center">
                    <span className="text-sm font-medium bg-gradient-to-r from-[#f16a3f] to-[#d26e4b] bg-clip-text text-transparent">
                      {method.percentage}%
                    </span>
                  </div>
                  <div className="col-span-2 text-center text-sm text-muted-foreground">{method.transactions}</div>
                </div>

                {/* Mobile Layout */}
                <div className="sm:hidden p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {method.method === "TM+CK+QT" && <Banknote className="h-4 w-4 text-[#00d084]" />}
                      {method.method === "Thanh toán ví" && <Wallet className="h-4 w-4 text-[#fcb900]" />}
                      {method.method === "Thẻ Foxie" && <CreditCard className="h-4 w-4 text-[#9b51e0]" />}
                      <span className="font-medium text-sm">{method.method}</span>
                    </div>
                    <span className="text-sm font-medium bg-gradient-to-r from-[#f16a3f] to-[#d26e4b] bg-clip-text text-transparent">
                      {method.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{method.transactions} GD</span>
                    <span className="font-semibold text-sm">{formatCurrency(method.amount)}</span>
                  </div>
                </div>
              </div>
            ))}

          <div className="bg-[#f16a3f] rounded-lg font-bold border-2 border-[#f16a3f]">
            {/* Desktop Total Row */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-3">
              <div className="col-span-4 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-white" />
                <span className="text-white font-bold">TỔNG CỘNG</span>
              </div>
              <div className="col-span-3 text-right text-lg text-white font-bold">{formatCurrency(totalRevenue)}</div>
              <div className="col-span-3 text-center">
                <span className="text-sm text-white font-bold">100%</span>
              </div>
              <div className="col-span-2 text-center text-sm text-white font-bold">
                {allPaymentMethods.reduce((sum, method) => sum + method.transactions, 0)}
              </div>
            </div>

            {/* Mobile Total Row */}
            <div className="sm:hidden p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-white" />
                  <span className="text-white font-bold text-sm">TỔNG CỘNG</span>
                </div>
                <span className="text-sm text-white font-bold">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80">
                  {allPaymentMethods.reduce((sum, method) => sum + method.transactions, 0)} GD
                </span>
                <span className="text-white font-bold text-sm">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
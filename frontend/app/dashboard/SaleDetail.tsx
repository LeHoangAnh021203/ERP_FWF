"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { DollarSign } from "lucide-react";

export interface SalesDetailItem {
  productName: string;
  productPrice: string;
  productQuantity: string;
  productDiscount: string;
  productCode: string;
  productUnit: string;
  formatTable: string;
  cash: string;
  transfer: string;
  card: string;
  wallet: string;
  foxie: string;
}

interface SaleDetailProps {
  salesDetailLoading: boolean;
  salesDetailError: string | null;
  salesDetailData: SalesDetailItem[] | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

export default function SaleDetail({
  salesDetailLoading,
  salesDetailError,
  salesDetailData,
}: SaleDetailProps) {
  const [sortMode, setSortMode] = React.useState<"quantity" | "value">("quantity");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-[#f16a3f]" />
        <h2 className="text-2xl font-bold text-[#334862]">
          Chi Tiết Doanh Thu
        </h2>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sắp xếp theo:</span>
        <div className="inline-flex rounded-md overflow-hidden border border-gray-200">
          <button
            className={
              "px-3 py-1 text-sm " +
              (sortMode === "quantity"
                ? "bg-[#f16a3f] text-white"
                : "bg-white hover:bg-gray-50")
            }
            onClick={() => setSortMode("quantity")}
          >
            Số lượng
          </button>
          <button
            className={
              "px-3 py-1 text-sm border-l border-gray-200 " +
              (sortMode === "value"
                ? "bg-[#f16a3f] text-white"
                : "bg-white hover:bg-gray-50")
            }
            onClick={() => setSortMode("value")}
          >
            Giá trị
          </button>
        </div>
      </div>

      {/* Modern Detailed Revenue Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {salesDetailLoading ? (
          <div className="col-span-full flex items-center justify-center h-32">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f16a3f]"></div>
              <div className="text-lg text-gray-600">
                Đang tải dữ liệu chi tiết...
              </div>
            </div>
          </div>
        ) : salesDetailError ? (
          <div className="col-span-full flex items-center justify-center h-32">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <div className="text-lg">Lỗi tải dữ liệu: {salesDetailError}</div>
            </div>
          </div>
        ) : salesDetailData ? (
          <>
            {/* Products/Materials Card */}
            {(() => {
              const products = salesDetailData.filter(
                (item) => item.formatTable === "1"
              );
              if (products.length === 0) return null;

              const totalProducts = products.length;
              const totalRevenue = products.reduce(
                (sum, item) => sum + parseFloat(item.productPrice),
                0
              );
              const sortedProducts = [...products].sort((a, b) => {
                if (sortMode === "quantity") {
                  return (
                    parseFloat(b.productQuantity || "0") -
                    parseFloat(a.productQuantity || "0")
                  );
                }
                return (
                  parseFloat(b.productPrice || "0") -
                  parseFloat(a.productPrice || "0")
                );
              });

              return (
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-[#f16a3f]/10 via-white to-[#f16a3f]/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f16a3f]/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>

                  <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#f16a3f] to-[#e55a2b] rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            SP
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-[#334862]">
                            Sản phẩm / NVL
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {totalProducts} sản phẩm
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] font-bold text-[#f16a3f]">
                          {formatCurrency(totalRevenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tổng doanh thu
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {sortedProducts.slice(0, 8).map((item, index) => {
                        const revenue = parseFloat(item.productPrice);

                        return (
                          <div
                            key={index}
                            className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-[#f16a3f]/30 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#f16a3f] transition-colors">
                                  {item.productName.length > 50
                                    ? `${item.productName.substring(0, 50)}...`
                                    : item.productName}
                                </h4>
                                <div className="flex items-center gap-2 text-[14px] text-gray-500 mt-5">
                                  <span className=" bg-gray-100 px-2 py-1 rounded-full text-center pb-2 pt-2 pl-4 pr-4">
                                    SL: {item.productQuantity}
                                  </span>
                                  <span className=" bg-gray-100 px-2 py-1 rounded-full text-center pb-2 pt-2 pl-4 pr-4">
                                    {item.productUnit}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right ml-3">
                                <div className="text-lg font-bold text-[#f16a3f]">
                                  {formatCurrency(revenue)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Services Card */}
            {(() => {
              const services = salesDetailData.filter(
                (item) => item.formatTable === "2"
              );
              if (services.length === 0) return null;

              const totalServices = services.length;
              const totalRevenue = services.reduce(
                (sum, item) => sum + parseFloat(item.productPrice),
                0
              );
              const sortedServices = [...services].sort((a, b) => {
                if (sortMode === "quantity") {
                  return (
                    parseFloat(b.productQuantity || "0") -
                    parseFloat(a.productQuantity || "0")
                  );
                }
                return (
                  parseFloat(b.productPrice || "0") -
                  parseFloat(a.productPrice || "0")
                );
              });

              return (
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-[#0693e3]/10 via-white to-[#0693e3]/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0693e3]/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>

                  <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0693e3] to-[#0582c7] rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            SP
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-[#334862]">
                            Dịch vụ / PP
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {totalServices} dịch vụ
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] font-bold text-[#0693e3]">
                          {formatCurrency(totalRevenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tổng doanh thu
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {sortedServices.slice(0, 8).map((item, index) => {
                        const revenue = parseFloat(item.productPrice);

                        return (
                          <div
                            key={index}
                            className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-[#0693e3]/30 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#0693e3] transition-colors">
                                  {item.productName.length > 50
                                    ? `${item.productName.substring(0, 50)}...`
                                    : item.productName}
                                </h4>
                                <div className="flex items-center gap-2 text-[14px] text-gray-500 mt-5">
                                  <span className=" bg-gray-100 px-2 py-1 rounded-full text-center pb-2 pt-2 pl-4 pr-4 ">
                                    SL: {item.productQuantity}
                                  </span>
                                  <span className=" bg-gray-100 px-2 py-1 rounded-full text-center pb-2 pt-2 pl-4 pr-4">
                                    {item.productUnit}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right ml-3">
                                <div className="text-lg font-bold text-[#0693e3]">
                                  {formatCurrency(revenue)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Money Cards Card */}
            {(() => {
              const cards = salesDetailData.filter(
                (item) => item.formatTable === "3"
              );
              if (cards.length === 0) return null;

              const totalCards = cards.length;
              const totalRevenue = cards.reduce(
                (sum, item) => sum + parseFloat(item.productPrice),
                0
              );
              const sortedCards = [...cards].sort((a, b) => {
                if (sortMode === "quantity") {
                  return (
                    parseFloat(b.productQuantity || "0") -
                    parseFloat(a.productQuantity || "0")
                  );
                }
                return (
                  parseFloat(b.productPrice || "0") -
                  parseFloat(a.productPrice || "0")
                );
              });

              return (
                <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-[#9b51e0]/10 via-white to-[#9b51e0]/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#9b51e0]/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>

                  <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#9b51e0] to-[#8e44ad] rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            TT
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-[#334862]">
                            Thẻ tiền
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {totalCards} lượt
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] font-bold text-[#9b51e0]">
                          {formatCurrency(totalRevenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tổng doanh thu
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {sortedCards.slice(0, 8).map((item, index) => {
                        const revenue = parseFloat(item.productPrice);

                        return (
                          <div
                            key={index}
                            className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-[#9b51e0]/30 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#9b51e0] transition-colors">
                                  {item.productName.length > 50
                                    ? `${item.productName.substring(0, 50)}...`
                                    : item.productName}
                                </h4>
                                <div className="flex items-center gap-2 text-[14px] text-gray-500 mt-5">
                                  <span className=" bg-gray-100 px-2 py-1 rounded-full text-center pb-2 pt-2 pl-4 pr-4">
                                    SL: {item.productQuantity}
                                  </span>
                                  <span className=" bg-gray-100 px-2 py-1 rounded-full text-center pb-2 pt-2 pl-4 pr-4">
                                    {item.productUnit}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right ml-3">
                                <div className="text-lg font-bold text-[#9b51e0]">
                                  {formatCurrency(revenue)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </>
        ) : (
          <div className="col-span-full flex items-center justify-center h-32">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">📊</span>
              </div>
              <div className="text-lg">Chưa có dữ liệu</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

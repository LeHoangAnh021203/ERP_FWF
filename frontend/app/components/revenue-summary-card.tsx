"use client";

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, CreditCard, DollarSign } from 'lucide-react';

interface RevenueSummaryData {
  totalRevenue: number;
  actualRevenue: number;
  revenueGrowth: number;
  actualGrowth: number;
}

interface RevenueSummaryCardProps {
  data: RevenueSummaryData;
  loading?: boolean;
  error?: string | null;
}

export function RevenueSummaryCard({ data, loading, error }: RevenueSummaryCardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-red-600 text-center">
            <p className="font-medium">Lỗi tải dữ liệu</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return {
      value: `${isPositive ? '+' : ''}${growth.toFixed(2)}%`,
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50',
      borderColor: isPositive ? 'border-green-200' : 'border-red-200'
    };
  };

  const foxieCardGrowth = formatGrowth(data.revenueGrowth);
  const actualRevenueGrowth = formatGrowth(data.actualGrowth);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tổng trả thẻ Foxie */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <CreditCard className="h-5 w-5" />
            Tổng trả thẻ Foxie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-bold text-orange-900 mb-1">
                {formatCurrency(data.totalRevenue)}
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${foxieCardGrowth.bgColor} ${foxieCardGrowth.borderColor} ${foxieCardGrowth.color}`}
                >
                  <foxieCardGrowth.icon className="h-3 w-3 mr-1" />
                  {foxieCardGrowth.value}
                </Badge>
                <span className="text-sm text-orange-700">so với kỳ trước</span>
              </div>
            </div>
            <div className="text-sm text-orange-600">
              💳 Tổng giá trị thẻ Foxie đã thanh toán
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tổng thực thu */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <DollarSign className="h-5 w-5" />
            Tổng thực thu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {formatCurrency(data.actualRevenue)}
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${actualRevenueGrowth.bgColor} ${actualRevenueGrowth.borderColor} ${actualRevenueGrowth.color}`}
                >
                  <actualRevenueGrowth.icon className="h-3 w-3 mr-1" />
                  {actualRevenueGrowth.value}
                </Badge>
                <span className="text-sm text-green-700">so với kỳ trước</span>
              </div>
            </div>
            <div className="text-sm text-green-600">
              💰 Tổng doanh thu thực tế đã thu về
            </div>
          </div>
        </CardContent>
      </Card>

      {/* So sánh tỷ lệ */}
      <Card className="md:col-span-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            Phân tích hiệu quả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {((data.actualRevenue / data.totalRevenue) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700">
                Tỷ lệ thu thực tế
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {formatCurrency(data.actualRevenue - data.totalRevenue)}
              </div>
              <div className="text-sm text-blue-700">
                Chênh lệch thu thực tế
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {Math.abs(parseFloat(actualRevenueGrowth.value.replace('+', '').replace('%', '')))}%
              </div>
              <div className="text-sm text-blue-700">
                Tăng trưởng thực thu
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


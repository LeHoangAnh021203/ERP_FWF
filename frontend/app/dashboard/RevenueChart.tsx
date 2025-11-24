"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip } from "recharts";

export interface RankingItem { name: string; revenue: number; fullName: string; growth: number }
export interface FoxieItem { name: string; foxiePayment: number; fullName: string; growth: number }

interface RevenueChartProps {
  showTopRanking: boolean;
  setShowTopRanking: (v: boolean) => void;
  rankingData: RankingItem[];
  showTopFoxieRanking: boolean;
  setShowTopFoxieRanking: (v: boolean) => void;
  foxieRankingData: FoxieItem[];
}

export default function RevenueChart({
  showTopRanking,
  setShowTopRanking,
  rankingData,
  showTopFoxieRanking,
  setShowTopFoxieRanking,
  foxieRankingData,
}: RevenueChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-[#0693e3]/20 shadow-lg">
        <CardHeader className="bg-[#0693e3] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="p-2">
              <CardTitle className="text-white font-bold">Ranking Chi Nhánh Theo Doanh Số</CardTitle>
              <CardDescription className="text-white/90 font-medium">Xếp hạng theo TM/CK/QT (triệu VNĐ)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showTopRanking ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowTopRanking(true)}
                className="text-xs bg-white text-[#0693e3] hover:bg-gray-100 border-white font-semibold"
              >
                Top 10
              </Button>
              <Button
                variant={!showTopRanking ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowTopRanking(false)}
                className="text-xs bg-white text-[#0693e3] hover:bg-gray-100 border-white font-semibold"
              >
                Bottom 10
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={rankingData} layout="horizontal" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={showTopRanking ? "#0693e3" : "#cf2e2e"} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={showTopRanking ? "#41d1d9" : "#ff6b6b"} stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(241,106,63,0.1)" stopOpacity={0}/>
                  <stop offset="100%" stopColor="rgba(241,106,63,0.2)" stopOpacity={1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="2 4" stroke="url(#gridGradient)" strokeWidth={1} />

              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}
                formatter={(value: number | string) => (typeof value === 'number' && !isNaN(value) ? [`${value.toFixed(1)}M VNĐ`, 'Doanh thu'] : ['0M VNĐ', 'Doanh thu'])}
                labelFormatter={(label: string, payload: readonly { payload?: { fullName: string; growth: number } }[]) => (payload && payload[0]?.payload ? `${payload[0].payload.fullName} (${payload[0].payload.growth > 0 ? '+' : ''}${payload[0].payload.growth}%)` : label)}
              />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[0, 8, 8, 0]} stroke={showTopRanking ? "#0693e3" : "#cf2e2e"} strokeWidth={1} animationBegin={0} animationDuration={1500} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-[#00d084]/20 shadow-lg">
        <CardHeader className="bg-[#00d084] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="p-2">
              <CardTitle className="text-white font-bold">Ranking Chi Nhánh Theo Thẻ Foxie</CardTitle>
              <CardDescription className="text-white/90 font-medium">Xếp hạng thanh toán thẻ Foxie (triệu VNĐ)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showTopFoxieRanking ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowTopFoxieRanking(true)}
                className="text-xs bg-white text-[#00d084] hover:bg-gray-100 border-white font-semibold"
              >
                Top 10
              </Button>
              <Button
                variant={!showTopFoxieRanking ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowTopFoxieRanking(false)}
                className="text-xs bg-white text-[#00d084] hover:bg-gray-100 border-white font-semibold"
              >
                Bottom 10
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={foxieRankingData} layout="horizontal" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <defs>
                <linearGradient id="foxieGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={showTopFoxieRanking ? "#00d084" : "#fcb900"} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={showTopFoxieRanking ? "#7bdcb5" : "#fdd835"} stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="foxieGridGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0,208,132,0.05)" stopOpacity={0}/>
                  <stop offset="100%" stopColor="rgba(0,208,132,0.15)" stopOpacity={1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="2 4" stroke="url(#foxieGridGradient)" strokeWidth={1} />

              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontSize: '14px', fontWeight: '500' }}
                formatter={(value: number | string) => [`${Number(value).toFixed(1)}M VNĐ`, 'Thanh toán Foxie']}
                labelFormatter={(label: string, payload: readonly { payload?: { fullName: string; growth: number } }[]) => (payload && payload[0]?.payload ? `${payload[0].payload.fullName} (${payload[0].payload.growth > 0 ? '+' : ''}${payload[0].payload.growth}%)` : label)}
              />
              <Bar dataKey="foxiePayment" fill="url(#foxieGradient)" radius={[0, 8, 8, 0]} stroke={showTopFoxieRanking ? "#00d084" : "#fcb900"} strokeWidth={1} animationBegin={200} animationDuration={1500} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
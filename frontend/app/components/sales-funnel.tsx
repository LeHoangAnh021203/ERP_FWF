"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const funnelStages = [
  { stage: "Leads", count: 1250, percentage: 100, color: "bg-blue-500" },
  { stage: "Qualified", count: 875, percentage: 70, color: "bg-green-500" },
  { stage: "Proposals", count: 425, percentage: 34, color: "bg-yellow-500" },
  { stage: "Negotiations", count: 180, percentage: 14, color: "bg-orange-500" },
  { stage: "Closed Won", count: 95, percentage: 7.6, color: "bg-purple-500" },
]

export function SalesFunnel() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sales Funnel</CardTitle>
        <p className="text-sm text-gray-600">Track your sales pipeline performance</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {funnelStages.map((stage, index) => (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{stage.stage}</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{stage.count}</span>
                  <span className="text-sm text-gray-500 ml-2">({stage.percentage}%)</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${stage.color}`}
                    style={{ width: `${stage.percentage}` }}
                  />
                </div>
              </div>
              {index < funnelStages.length - 1 && (
                <div className="text-center text-xs text-gray-400 mt-1">
                  ↓ {((funnelStages[index + 1].count / stage.count) * 100).toFixed(1)}% conversion
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

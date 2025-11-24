import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface RegionStat {
  region: string;
  ordersThisWeek: number;
  deltaOrders: number;
  revenueThisWeek: number;
  percentDelta: number | null;
}

interface PieRegionRevenueData {
  name: string;
  value: number;
}

interface OrderActualCollectionProps {
  regionStats: RegionStat[];
  totalRevenueThisWeek: number;
  totalPercentChange: number;
  pieRegionRevenueData: PieRegionRevenueData[];
  isMobile: boolean;
}

const COLORS = [
  "#8d6e63",
  "#b39ddb",
  "#81d4fa",
  "#f0bf4c",
  "#ff7f7f",
  "#9ee347",
];

const OrderActualCollection: React.FC<OrderActualCollectionProps> = ({
  regionStats,
  totalRevenueThisWeek,
  totalPercentChange,
  pieRegionRevenueData,
  isMobile,
}) => (
  <div className="flex flex-col lg:flex-row w-full bg-white rounded-xl shadow-lg gap-4 mt-5 h-fit lg:h-[550px] items-center">
    <div className="overflow-x-auto w-full lg:w-1/2 justify-center items-center rounded-xl ml-0 lg:ml-2">
      <div className="text-base sm:text-xl font-medium text-gray-700 text-center p-2" data-search-ref="orders_region_pie">
        Thực thu tại các khu vực
      </div>
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-x-auto">
        <table className="min-w-[700px] w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-yellow-100 text-gray-900">
              <th className="px-4 py-2 border-b font-semibold text-left">Khu vực</th>
              <th className="px-4 py-2 border-b font-semibold text-right">Số đơn</th>
              <th className="px-4 py-2 border-b font-semibold text-right">Δ</th>
              <th className="px-4 py-2 border-b font-semibold text-right">Thực thu</th>
              <th className="px-4 py-2 border-b font-semibold text-right">% Δ</th>
              <th className="px-4 py-2 border-b font-semibold text-right">Tỉ trọng</th>
            </tr>
          </thead>
          <tbody>
            {regionStats.map((r) => (
              <tr key={r.region} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-left">{r.region}</td>
                <td className="px-4 py-2 border-b text-right">{r.ordersThisWeek}</td>
                <td
                  className={`px-4 py-2 border-b text-right ${
                    r.deltaOrders > 0
                      ? "text-green-600"
                      : r.deltaOrders < 0
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {r.deltaOrders} {r.deltaOrders > 0 ? "↑" : r.deltaOrders < 0 ? "↓" : ""}
                </td>
                <td className="px-4 py-2 border-b text-right">{r.revenueThisWeek.toLocaleString()}</td>
                <td
                  className={`px-4 py-2 border-b text-right ${
                    r.percentDelta && r.percentDelta > 0
                      ? "text-green-600"
                      : r.percentDelta && r.percentDelta < 0
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {r.percentDelta === null
                    ? "N/A"
                    : `${r.percentDelta.toFixed(1)}%`}
                  {r.percentDelta && r.percentDelta > 0
                    ? "↑"
                    : r.percentDelta && r.percentDelta < 0
                    ? "↓"
                    : ""}
                </td>
                <td className="px-4 py-2 border-b text-right">
                  {totalRevenueThisWeek === 0
                    ? "0.00"
                    : ((r.revenueThisWeek / totalRevenueThisWeek) * 100).toFixed(2)}
                  %
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-100">
              <td className="px-4 py-2 border-t text-left">Tổng cộng</td>
              <td className="px-4 py-2 border-t text-right">
                {regionStats.reduce((sum, r) => sum + r.ordersThisWeek, 0)}
              </td>
              <td className="px-4 py-2 border-t text-right">
                {regionStats.reduce((sum, r) => sum + r.deltaOrders, 0)}
              </td>
              <td className="px-4 py-2 border-t text-right">
                {totalRevenueThisWeek.toLocaleString()}
              </td>
              <td className={`px-4 py-2 border-t text-right ${
                totalPercentChange > 0
                  ? "text-green-600"
                  : totalPercentChange < 0
                  ? "text-red-500"
                  : ""
              }`}>
                {`${totalPercentChange.toFixed(1)}%`}
                {totalPercentChange > 0
                  ? "↑"
                  : totalPercentChange < 0
                  ? "↓"
                  : ""}
              </td>
              <td className="px-4 py-2 border-t text-right">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    {/* Tổng thực thu tại các khu vực trong tuần */}
    <div className="flex flex-col justify-center items-center w-full lg:w-1/2">
      <div className="flex-1 flex flex-col items-center md:items-start">
      <div className="text-base sm:text-xl font-medium text-gray-700 text-center p-2">
        Tổng thực thu tại các khu vực 
      </div>
        <ResponsiveContainer width="100%" height={320} minWidth={320}>
          <PieChart className="mt-10 mb-10">
            <Pie
              data={pieRegionRevenueData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 70 : 120}
              label={({ percent }) =>
                percent !== undefined
                  ? `${(percent * 100).toFixed(0)}%`
                  : ""
              }
            >
              {pieRegionRevenueData.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                if (typeof value === "number") {
                  if (value >= 1_000_000)
                    return `${(value / 1_000_000).toFixed(1)}M`;
                  return value.toLocaleString();
                }
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="space-y-2 mb-2">
          {pieRegionRevenueData.map((item, idx) => (
            <li key={item.name} className="flex items-center gap-3">
              <span
                className="inline-block w-5 h-5 rounded-full"
                style={{ background: COLORS[idx % COLORS.length] }}
              ></span>
              <span className="font-medium text-gray-800">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default OrderActualCollection;
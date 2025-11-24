import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  LabelList,
} from "recharts";

interface OrdersChartDataPoint {
  date: string;
  orders: number;
  avgPerShop: number;
}

interface Props {
  isMobile: boolean;
  ordersChartData: OrdersChartDataPoint[];
}

const OrdersChartData: React.FC<Props> = ({ isMobile, ordersChartData }) => (
  <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
    <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4" data-search-ref="orders_orders_chart">
      Số lượng đơn hàng theo ngày (-đơn mua thẻ)
    </div>
    <div className="w-full overflow-x-auto">
      <ResponsiveContainer
        width="100%"
        height={isMobile ? 320 : 400}
        minWidth={isMobile ? 600 : 700} // tăng minWidth trên mobile
      >
        <BarChart
          data={ordersChartData}
          margin={{
            top: isMobile ? 20 : 30,
            right: isMobile ? 10 : 40,
            left: isMobile ? 10 : 40,
            bottom: isMobile ? 30 : 40,
          }}
          barCategoryGap={isMobile ? 20 : 15} // tăng khoảng cách trên mobile
          barGap={isMobile ? 6 : 4}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={isMobile ? -30 : -30}
            textAnchor="end"
            height={isMobile ? 50 : 70}
            tick={(props) => {
              const { x, y, payload } = props;
              const date = payload.value;
              
              // Kiểm tra xem có phải cuối tuần không
              const isWeekend = (() => {
                if (!date) return false;
                                  const match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
                if (match) {
                  const [, year, month, day] = match;
                  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  const dayOfWeek = dateObj.getDay();
                  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Chủ nhật, 6 = Thứ 7
                }
                return false;
              })();

              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill={isWeekend ? "#dc2626" : "#6b7280"}
                    fontSize={isMobile ? 10 : 14}
                    fontWeight={isWeekend ? "bold" : "normal"}
                  >
                    {(() => {
                      if (!date || typeof date !== "string") return date;
                      if (date.includes("-")) {
                        const d = new Date(date);
                        if (!isNaN(d.getTime())) {
                          return `${String(d.getDate()).padStart(
                            2,
                            "0"
                          )}/${String(d.getMonth() + 1).padStart(2, "0")}`;
                        }
                      }
                      return date;
                    })()}
                  </text>
                </g>
              );
            }}
          />
          <YAxis
            domain={[0, "dataMax + 300"]}
            yAxisId="left"
            orientation="left"
            tickCount={6}
            fontSize={isMobile ? 10 : 14}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickCount={6}
            fontSize={isMobile ? 10 : 14}
            domain={[(dataMax: number) => -Math.ceil(dataMax*1.5), (dataMax: number) => Math.ceil(dataMax)]}
          />
          <Tooltip
            formatter={(value: string | number) => {
              if (typeof value === "number") {
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(1)}M`;
                return value.toLocaleString();
              }
              return value;
            }}
          />
          <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 14 }} />
          <Bar
            yAxisId="left"
            dataKey="orders"
            name="Số đơn hàng"
            fill="#f87171"
            barSize={isMobile ? 18 : 30}
          >
            <LabelList
              dataKey="orders"
              position="top"
              formatter={(value: React.ReactNode): React.ReactNode => {
                if (typeof value === "number") {
                  return Math.round(value);
                }
                return "";
              }}
              style={{ fontSize: isMobile ? 10 : 14 }}
            />
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgPerShop"
            name="Trung bình số lượng đơn tại mỗi shop"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: isMobile ? 3 : 5, fill: "#2563eb" }}
            activeDot={{ r: isMobile ? 5 : 7 }}
            label={({ x, y, value }: { x: number; y: number; value: string | number }) => {
              if (typeof value === "number") {
                return (
                  <text
                    x={x}
                    y={y - (isMobile ? 10 : 16)}
                    fill="#2563eb"
                    fontWeight={600}
                    fontSize={isMobile ? 10 : 14}
                    textAnchor="middle"
                  >
                    {Math.round(value)}
                  </text>
                );
              }
              return <></>;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default OrdersChartData;
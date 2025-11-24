import React from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

interface CustomerTypeTrendChartProps {
  isMobile: boolean;
  customerTypeTrendData: Record<string, number | string>[];
  customerTypeKeys: string[];
  COLORS: string[];
}

const CustomerTypeTrendChart: React.FC<CustomerTypeTrendChartProps> = ({
  isMobile,
  customerTypeTrendData,
  customerTypeKeys,
  COLORS,
}) => (
  <div
    className={`bg-white pt-2 mt-5 rounded-xl shadow-lg ${
      isMobile ? "w-full max-w-xs mx-auto flex flex-col items-center" : ""
    }`}
    style={{ minWidth: isMobile ? 220 : undefined }}
  >
    <h2 className="text-base lg:text-xl text-center font-semibold text-gray-800 p-3" data-search-ref="customers_type_trend">
      Số khách mới chia theo loại
    </h2>
    <div className="w-full flex justify-center">
      <ResponsiveContainer
        width="100%"
        height={isMobile ? 180 : 350}
        minWidth={220}
      >
        <LineChart
          data={customerTypeTrendData}
          margin={{
            top: isMobile ? 10 : 30,
            right: 10,
            left: 10,
            bottom: isMobile ? 20 : 40,
          }}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            angle={isMobile ? -20 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 40 : 60}
            tickFormatter={(date) => {
              if (!date) return "";
              const match = String(date).match(/^\d{4}-(\d{2})-(\d{2})$/);
              if (match) {
                const [, month, day] = match;
                return `${day}/${month}`;
              }
              return String(date);
            }}
            tick={(props) => {
              const { x, y, payload } = props;
              const date = payload.value;
              
                                // Kiểm tra xem có phải cuối tuần không
                  const isWeekend = (() => {
                    if (!date) return false;
                    const match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
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
                    textAnchor="middle"
                    fill={isWeekend ? "#dc2626" : "#6b7280"}
                    fontSize={isMobile ? 10 : 12}
                    fontWeight={isWeekend ? "bold" : "normal"}
                  >
                    {payload.value ? (() => {
                      const match = String(payload.value).match(/^\d{4}-(\d{2})-(\d{2})$/);
                      if (match) {
                        const [, month, day] = match;
                        return `${day}/${month}`;
                      }
                      return String(payload.value);
                    })() : ""}
                  </text>
                </g>
              );
            }}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            tickFormatter={(value) => (value > 0 ? `${value} khách` : value)}
            padding={{ bottom: 10, top: 10 }}
          />
          <Tooltip />
          <Legend
            wrapperStyle={{
              paddingTop: isMobile ? "" : "20px",
              fontSize: isMobile ? "10px" : "14px",
              color: "#4b5563",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: isMobile ? "nowrap" : "wrap",
              width: "100%",
              maxHeight: isMobile ? 80 : undefined,
              overflowY: isMobile ? "auto" : undefined,
            }}
            iconType="circle"
            iconSize={isMobile ? 8 : 10}
            verticalAlign={isMobile ? "bottom" : undefined}
          />
          {customerTypeKeys.map((type, idx) => (
            <Line
              key={type}
              type="natural"
              dataKey={type}
              name={type}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: COLORS[idx % COLORS.length],
                stroke: "#fff",
                strokeWidth: 2,
              }}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default CustomerTypeTrendChart;
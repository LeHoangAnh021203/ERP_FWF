import React from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, PieChart, Pie, Cell } from "recharts";

interface NewCustomerChartData {
  date: string;
  value: number;
  value2?: number;
}

interface GenderRatioData {
  gender: string;
  count: number;
}

interface CustomerGenderPieProps {
  isMobile: boolean;
  loadingNewCustomer: boolean;
  errorNewCustomer: string | null;
  newCustomerChartData: NewCustomerChartData[];
  loadingGenderRatio: boolean;
  errorGenderRatio: string | null;
  genderRatioData: GenderRatioData[];
  COLORS: string[];
}

const CustomerGenderPie: React.FC<CustomerGenderPieProps> = ({
  isMobile,
  loadingNewCustomer,
  errorNewCustomer,
  newCustomerChartData,
  loadingGenderRatio,
  errorGenderRatio,
  genderRatioData,
  COLORS,
}) => (
  <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-4">
    {/* Số khách tạo mới*/}
    <div
      className={`bg-white rounded-xl shadow p-2 ${
        isMobile
          ? "w-full flex justify-center items-center mx-auto"
          : "lg:w-1/2"
      } ${isMobile ? "max-w-xs" : ""}`}
      style={{ minWidth: isMobile ? 220 : undefined }}
    >
      <div className="w-full">
        <h2 className="text-base lg:text-xl text-center font-semibold text-gray-800 mb-2">
          Số khách tạo mới
        </h2>
        {loadingNewCustomer ? (
          <div>Đang tải dữ liệu...</div>
        ) : errorNewCustomer ? (
          <div className="text-red-500">{errorNewCustomer}</div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={isMobile ? 220 : 350}
            minWidth={220}
          >
            <LineChart
              data={newCustomerChartData}
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
                  const match = String(date).match(
                    /^\d{4}-(\d{2})-(\d{2})$/
                  );
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
                tickFormatter={(value) =>
                  value > 0 ? `${value} ` : value
                }
                padding={{ bottom: 10, top: 10 }}
              />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  paddingTop: isMobile ? 0 : "20px",
                  fontSize: isMobile ? "10px" : "14px",
                  color: "#4b5563",
                  display: isMobile ? "none" : undefined,
                }}
                iconType="circle"
                iconSize={isMobile ? 8 : 10}
              />
              <Line
                type="natural"
                dataKey="value"
                name="Số khách mới trong hệ thống"
                stroke="#5bd1d7"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#5bd1d7",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                animationDuration={1500}
              />
              <Line
                type="natural"
                dataKey="value2"
                name="Số khách mới trong hệ thống (kỳ trước)"
                stroke="#eb94cf"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#eb94cf",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
    {/* Tỉ lệ nam/nữ */}
    <div
      className={`bg-white rounded-xl shadow p-2 ${
        isMobile
          ? "w-full max-w-xs mx-auto flex flex-col items-center"
          : "lg:w-1/2"
      }`}
      style={{ minWidth: isMobile ? 220 : undefined }}
    >
      <h2 className="text-base lg:text-xl font-semibold text-gray-800 mb-2 text-center">
        Tỷ lệ nam/nữ khách mới tạo
      </h2>
      <div className="w-full flex justify-center">
        {loadingGenderRatio ? (
          <div>Loading...</div>
        ) : errorGenderRatio ? (
          <div className="text-red-500">{errorGenderRatio}</div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={isMobile ? 180 : 350}
            minWidth={220}
          >
            <PieChart>
              <Pie
                data={genderRatioData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? "0%" : "0%"}
                outerRadius={isMobile ? "40%" : "80%"}
                fill="#f933347"
                dataKey="count"
                nameKey="gender"
                labelLine={false}
                label={({
                  cx = 0,
                  cy = 0,
                  midAngle = 0,
                  innerRadius = 0,
                  outerRadius = 0,
                  percent = 0,
                  gender = "",
                  index = 0,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = (innerRadius + outerRadius) / 0.8;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={COLORS[index % COLORS.length]}
                      fontSize={isMobile ? 12 : 16}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontWeight={600}
                    >
                      {`${gender}: ${(percent * 100).toFixed(1)}%`}
                    </text>
                  );
                }}
              >
                {genderRatioData.map((entry, idx) => (
                  <Cell
                    key={entry.gender}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={{
                  paddingTop: isMobile ? 0 : "20px",
                  fontSize: isMobile ? "10px" : "14px",
                  color: "#4b5563",
                  display: isMobile ? "none" : undefined,
                }}
                iconType="circle"
                iconSize={isMobile ? 8 : 10}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  </div>
);

export default CustomerGenderPie;
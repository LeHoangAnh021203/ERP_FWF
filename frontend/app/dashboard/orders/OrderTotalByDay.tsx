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
  LabelList,
} from "recharts";

interface RegionalSalesByDayData {
  date: string;
  HCM: number;
  HaNoi: number;
  DaNang: number;
  NhaTrang: number;
  DaDongCua: number;
  total?: number;
}

interface OrderTotalByDayProps {
  data: RegionalSalesByDayData[];
  isMobile: boolean;
  formatAxisDate: (date: string) => string;
}

function formatMillion(val: number) {
  if (!val) return "0M";
  return (val / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "M";
}

// Type for recharts label content props
interface LabelProps {
  value?: string | number;
  x?: string | number;
  y?: string | number;
}

const OrderTotalByDay: React.FC<OrderTotalByDayProps> = ({ data, isMobile, formatAxisDate }) => (
  <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
    <div className="text-base sm:text-xl font-medium text-gray-700 text-center mb-4" data-search-ref="orders_total_by_day">
      Tổng thực thu tại các khu vực theo ngày
    </div>
    <div className="w-full ">
      <ResponsiveContainer width="100%" height={isMobile ? 220 : 400}>
        <BarChart
          data={data}
          margin={{
            top: isMobile ? 10 : 30,
            right: 10,
            left: 10,
            bottom: isMobile ? 20 : 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={isMobile ? -20 : -30}
            textAnchor="end"
            height={isMobile ? 40 : 60}
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
                    {formatAxisDate(date)}
                  </text>
                </g>
              );
            }}
          />
          <YAxis
            tickFormatter={(v: number) => formatMillion(v)}
          />
          <Tooltip
            formatter={(value: number) => formatMillion(value)}
            
          />
          <Legend
            wrapperStyle={{
              paddingTop: isMobile ? 0 : 10,
              paddingBottom: isMobile ? 0 : 10,
              fontSize: isMobile ? 10 : 14,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          />
          <Bar dataKey="HCM" stackId="a" fill="#8d6e63" name="HCM" />
          <Bar dataKey="HaNoi" stackId="a" fill="#b6d47a" name="Hà Nội" />
          <Bar dataKey="DaNang" stackId="a" fill="#81d4fa" name="Đà Nẵng" />
          <Bar dataKey="NhaTrang" stackId="a" fill="#ff7f7f" name="Nha Trang" />
          <Bar dataKey="DaDongCua" stackId="a" fill="#f0bf4c" name="Đã đóng cửa">
            {!isMobile && (
              <LabelList
                dataKey="total"
                position="top"
                content={({ value, x, y }: LabelProps) => {
                  if (typeof value === "number") {
                    return (
                      <text
                        x={x}
                        y={typeof y === "number" ? y - 8 : y}
                        textAnchor="middle"
                        fill="#f0bf4c"
                        fontWeight={700}
                        fontSize={12}
                        
                        className="text-align-center"
                      >
                        {formatMillion(value)}
                      </text>
                    );
                  }
                  if (typeof value === "string") {
                    return (
                      <text
                        x={x}
                        y={typeof y === "number" ? y - 8 : y}
                        textAnchor="middle"
                        fill="#f0bf4c"
                        fontWeight={700}
                        fontSize={16}
                      >
                        {value}
                      </text>
                    );
                  }
                  return null;
                }}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default OrderTotalByDay;
import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface CustomerAppDownloadBarChartProps {
  isMobile: boolean;
  loading: boolean;
  error: string | null;
  sortedAppDownloadStatusData: Record<string, string | number>[];
}

const CustomerAppDownloadBarChart: React.FC<CustomerAppDownloadBarChartProps> = ({
  isMobile,
  loading,
  error,
  sortedAppDownloadStatusData,
}) => (
  <div className="w-full bg-white rounded-xl shadow-lg mt-4 lg:mt-5">
    <div className="text-lg lg:text-xl font-medium text-gray-700 text-center pt-6 lg:pt-10"  data-search-ref="customers_app_bar">
      Khách tải app/không tải
    </div>
    <div className="flex justify-center items-center py-4 lg:py-8">
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={isMobile ? 220 : 300}
          minWidth={isMobile ? 180 : 320}
        >
          <BarChart data={sortedAppDownloadStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              fontSize={isMobile ? 9 : 12}
              tickFormatter={(date: string) => {
                if (!date) return "";
                // Xử lý chuẩn: YYYY-MM-DD hoặc YYYY-MM-DDTHH:mm:ss
                const match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
                if (match) {
                  const [, , month, day] = match;
                  return `${day}/${month}`;
                }
                // Nếu là dạng DD/MM/YYYY hoặc DD/MM
                const match2 = String(date).match(/^(\d{2})\/(\d{2})(?:\/\d{4})?$/);
                if (match2) {
                  return `${match2[1]}/${match2[2]}`;
                }
                // Nếu là dạng ISO nhưng không match trên
                if (typeof date === "string" && date.length >= 10) {
                  return date.slice(8, 10) + "/" + date.slice(5, 7);
                }
                return date;
              }}
              tick={(props) => {
                const { x, y, payload } = props;
                const date = payload.value;
                
                // Kiểm tra xem có phải cuối tuần không
                const isWeekend = (() => {
                  if (!date) return false;
                  // Xử lý nhiều format date khác nhau
                  let match = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
                  if (match) {
                    const [, year, month, day] = match;
                    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const dayOfWeek = dateObj.getDay();
                    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Chủ nhật, 6 = Thứ 7
                  }
                  // Nếu là dạng DD/MM/YYYY
                  match = String(date).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                  if (match) {
                    const [, day, month, year] = match;
                    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const dayOfWeek = dateObj.getDay();
                    return dayOfWeek === 0 || dayOfWeek === 6;
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
                      fontSize={isMobile ? 9 : 12}
                      fontWeight={isWeekend ? "bold" : "normal"}
                    >
                      {payload.value ? (() => {
                        // Xử lý chuẩn: YYYY-MM-DD hoặc YYYY-MM-DDTHH:mm:ss
                        const match = String(payload.value).match(/^(\d{4})-(\d{2})-(\d{2})/);
                        if (match) {
                          const [, , month, day] = match;
                          return `${day}/${month}`;
                        }
                        // Nếu là dạng DD/MM/YYYY hoặc DD/MM
                        const match2 = String(payload.value).match(/^(\d{2})\/(\d{2})(?:\/\d{4})?$/);
                        if (match2) {
                          return `${match2[1]}/${match2[2]}`;
                        }
                        // Nếu là dạng ISO nhưng không match trên
                        if (typeof payload.value === "string" && payload.value.length >= 10) {
                          return payload.value.slice(8, 10) + "/" + payload.value.slice(5, 7);
                        }
                        return String(payload.value);
                      })() : ""}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis allowDecimals={false} fontSize={isMobile ? 9 : 12} />
            <Tooltip />
            <Legend fontSize={isMobile ? 9 : 12} />
            <Bar
              dataKey="downloaded"
              fill="#9ee347"
              name="Đã tải app"
              label={
                isMobile
                  ? undefined
                  : {
                      position: "top",
                      fontSize: 14,
                      fontWeight: 600,
                      fill: "#9ee347",
                    }
              }
            />
            <Bar
              dataKey="notDownloaded"
              fill="#f0bf4c"
              name="Chưa tải app"
              label={
                isMobile
                  ? undefined
                  : {
                      position: "top",
                      fontSize: 14,
                      fontWeight: 600,
                      fill: "#f0bf4c",
                    }
              }
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

export default CustomerAppDownloadBarChart;
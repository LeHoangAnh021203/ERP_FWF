import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface AppDownloadPieData {
  name: string;
  value: number;
}

interface CustomerAppDownloadPieChartProps {
  appDownloadPieData: AppDownloadPieData[];
  loadingAppDownload: boolean;
  errorAppDownload: string | null;
}

const APP_CUSTOMER_PIE_COLORS = [
  "#ff7f7f",
  "#b39ddb",
  "#8d6e63",
  "#c5e1a5",
  "#81d4fa",
  "#f0bf4c",
  "#bccefb",
  "#a9b8c3",
];

const CustomerAppDownloadPieChart: React.FC<CustomerAppDownloadPieChartProps> = ({
  appDownloadPieData,
  loadingAppDownload,
  errorAppDownload,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="text-sm sm:text-base md:text-xl font-medium text-gray-700 text-center mb-4" data-search-ref="customers_app_pie">
        Tỷ lệ tải app
      </div>
      <div className="w-full flex justify-center ">
        {loadingAppDownload ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : errorAppDownload ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">{errorAppDownload}</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 400} minWidth={280}>
            <PieChart>
              <Pie
                data={appDownloadPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? "25%" : "30%"}
                outerRadius={isMobile ? "50%" : "60%"}
                label={({ percent }) =>
                  percent && percent > 0.05
                    ? `${(percent * 100).toFixed(0)}%`
                    : ""
                }
                labelLine={false}
              >
                {appDownloadPieData.map((entry, idx) => (
                  <Cell
                    key={entry.name}
                    fill={APP_CUSTOMER_PIE_COLORS[idx % APP_CUSTOMER_PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), 'Số lượng']}
                contentStyle={{
                  fontSize: isMobile ? 12 : 14,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px'
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: isMobile ? 10 : 12,
                  paddingTop: isMobile ? 10 : 20,
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CustomerAppDownloadPieChart;
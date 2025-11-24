"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Custom Tooltip component
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, item) => sum + (item.value || 0), 0);
    
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}:</span>
              </div>
              <span className="font-medium">{item.value?.toLocaleString()}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Tổng:</span>
            <span className="font-bold text-blue-600">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface WeeklyServiceChartDataProps {
  weeklyServiceChartData: Array<{
    date: string;
    combo: number;
    service: number;
    addedon: number;
    foxcard: number;
  }>;
  isMobile: boolean;
}



export default function WeeklyServiceChartData({
  weeklyServiceChartData,
  isMobile,
}: WeeklyServiceChartDataProps) {
  // Tính tổng số dịch vụ
  const totalServices = weeklyServiceChartData.reduce((sum, day) => 
    sum + (day.combo || 0) + (day.service || 0) + (day.addedon || 0) + (day.foxcard || 0), 0
  );
  
  const totalDays = weeklyServiceChartData.length;
  const avgPerDay = totalDays > 0 ? Math.round(totalServices / totalDays) : 0;
  
  // Tìm ngày có nhiều dịch vụ nhất
  const peakDay = weeklyServiceChartData.reduce((peak, day) => {
    const dayTotal = (day.combo || 0) + (day.service || 0) + (day.addedon || 0) + (day.foxcard || 0);
    const peakTotal = (peak.combo || 0) + (peak.service || 0) + (peak.addedon || 0) + (peak.foxcard || 0);
    return dayTotal > peakTotal ? day : peak;
  }, weeklyServiceChartData[0] || { date: '', combo: 0, service: 0, addedon: 0, foxcard: 0 });

  // Create a map of max values for each date
  const maxValuesByDate = React.useMemo(() => {
    const maxMap = new Map<string, number>();
    weeklyServiceChartData.forEach(item => {
      const values = [
        item.combo || 0,
        item.service || 0,
        item.addedon || 0,
        item.foxcard || 0
      ];
      maxMap.set(item.date, Math.max(...values));
    });
    return maxMap;
  }, [weeklyServiceChartData]);

  // Find the peak day for each service type (for mobile display)
  const peakDays = React.useMemo(() => {
    const peaks: Record<string, { date: string; value: number }> = {
      combo: { date: '', value: 0 },
      service: { date: '', value: 0 },
      addedon: { date: '', value: 0 },
      foxcard: { date: '', value: 0 }
    };
    
    weeklyServiceChartData.forEach(item => {
      // Check each service type
      if ((item.combo || 0) > peaks.combo.value) {
        peaks.combo = { date: item.date, value: item.combo || 0 };
      }
      if ((item.service || 0) > peaks.service.value) {
        peaks.service = { date: item.date, value: item.service || 0 };
      }
      if ((item.addedon || 0) > peaks.addedon.value) {
        peaks.addedon = { date: item.date, value: item.addedon || 0 };
      }
      if ((item.foxcard || 0) > peaks.foxcard.value) {
        peaks.foxcard = { date: item.date, value: item.foxcard || 0 };
      }
    });
    
    return peaks;
  }, [weeklyServiceChartData]);

  // Calculate the maximum value from all data
  const maxValue = React.useMemo(() => {
    let max = 0;
    weeklyServiceChartData.forEach(item => {
      const values = [
        item.combo || 0,
        item.service || 0,
        item.addedon || 0,
        item.foxcard || 0
      ];
      const itemMax = Math.max(...values);
      if (itemMax > max) {
        max = itemMax;
      }
    });
    return max;
  }, [weeklyServiceChartData]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-2 sm:p-4">
      <div className="text-sm sm:text-base md:text-xl font-medium text-gray-700 text-center mb-4"  data-search-ref="services_weekly">
        Tổng dịch vụ thực hiện
      </div>
      
      {/* Thống kê tổng quan */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalServices.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Tổng dịch vụ</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{avgPerDay.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Trung bình/ngày</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {((peakDay.combo || 0) + (peakDay.service || 0) + (peakDay.addedon || 0) + (peakDay.foxcard || 0)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Ngày cao nhất: {peakDay.date}
          </div>
        </div>
      </div> */}
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400} minWidth={280}>
          <BarChart
            data={weeklyServiceChartData}
            margin={{ 
              top: isMobile ? 30 : 50, 
              right: isMobile ? 10 : 30, 
              left: isMobile ? 10 : 20, 
              bottom: isMobile ? 20 : 5 
            }}
            barCategoryGap={isMobile ? 2 : 4}
            barGap={isMobile ? 1 : 2}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              fontSize={isMobile ? 10 : 12}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
              tick={({ x, y, payload }) => {
                const dateStr = payload.value;
                // Parse date string like "15 thg 6" to determine if it's weekend
                const isWeekend = (() => {
                  try {
                    const match = dateStr.match(/^(\d{1,2}) thg (\d{1,2})$/);
                    if (match) {
                      const [, day, month] = match;
                      const year = new Date().getFullYear();
                      const date = new Date(year, parseInt(month) - 1, parseInt(day));
                      const dayOfWeek = date.getDay();
                      // 0 = Sunday, 6 = Saturday
                      return dayOfWeek === 0 || dayOfWeek === 6;
                    }
                    return false;
                  } catch {
                    return false;
                  }
                })();

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor={isMobile ? "end" : "middle"}
                      fill={isWeekend ? "#ff6b6b" : "#666"}
                      fontSize={isMobile ? 10 : 12}
                      fontWeight={isWeekend ? "bold" : "normal"}
                    >
                      {payload.value}
                    </text>
                    {isWeekend && (
                      <rect
                        x={-20}
                        y={-5}
                        width={40}
                        height={20}
                        fill="rgba(255, 107, 107, 0.1)"
                        rx={3}
                      />
                    )}
                  </g>
                );
              }}
            />
            <YAxis
              fontSize={isMobile ? 10 : 12}
              width={isMobile ? 60 : 80}
              domain={[0, maxValue]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                fontSize: isMobile ? 10 : 12,
                paddingTop: isMobile ? 10 : 20
              }}
            />
            <Bar dataKey="combo" name="Combo" fill="#795548" maxBarSize={isMobile ? 80 : 120}>
              <LabelList 
                dataKey="combo" 
                position="top" 
                fontSize={isMobile ? 10 : 12} 
                fill="#795548"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.combo === value
                    );
                    if (!currentDataPoint) return "";
                    
                    if (currentDataPoint.date === peakDays.combo.date && value === peakDays.combo.value) {
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.combo === value
                    );
                    if (!currentDataPoint) return "";
                    
                    const maxValue = maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (typeof value === "number" && value === maxValue && value > 0) {
                      return value.toString();
                    }
                    return "";
                  }
                }}
              />
            </Bar>
            <Bar dataKey="service" name="Dịch vụ" fill="#689F38" maxBarSize={isMobile ? 80 : 120}>
              <LabelList 
                dataKey="service" 
                position="top" 
                fontSize={isMobile ? 10 : 12} 
                fill="#689F38"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.service === value
                    );
                    if (!currentDataPoint) return "";
                    
                    if (currentDataPoint.date === peakDays.service.date && value === peakDays.service.value) {
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.service === value
                    );
                    if (!currentDataPoint) return "";
                    
                    const maxValue = maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (typeof value === "number" && value === maxValue && value > 0) {
                      return value.toString();
                    }
                    return "";
                  }
                }}
              />
            </Bar>
            <Bar dataKey="addedon" name="Cộng thêm" fill="#f16a3f" maxBarSize={isMobile ? 80 : 120}>
              <LabelList 
                dataKey="addedon" 
                position="top" 
                fontSize={isMobile ? 10 : 12} 
                fill="#f16a3f"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.addedon === value
                    );
                    if (!currentDataPoint) return "";
                    
                    if (currentDataPoint.date === peakDays.addedon.date && value === peakDays.addedon.value) {
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.addedon === value
                    );
                    if (!currentDataPoint) return "";
                    
                    const maxValue = maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (typeof value === "number" && value === maxValue && value > 0) {
                      return value.toString();
                    }
                    return "";
                  }
                }}
              />
            </Bar>
            <Bar dataKey="foxcard" name="Fox card" fill="#c86b82" maxBarSize={isMobile ? 80 : 120}>
              <LabelList 
                dataKey="foxcard" 
                position="top" 
                fontSize={isMobile ? 10 : 12} 
                fill="#c86b82"
                formatter={(value: React.ReactNode) => {
                  if (typeof value === "number" && value === 0) {
                    return "";
                  }
                  if (isMobile) {
                    // On mobile: only show label for the peak day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.foxcard === value
                    );
                    if (!currentDataPoint) return "";
                    
                    if (currentDataPoint.date === peakDays.foxcard.date && value === peakDays.foxcard.value) {
                      return value.toString();
                    }
                    return "";
                  } else {
                    // On desktop: show label for highest bar of each day
                    const currentDataPoint = weeklyServiceChartData.find(item => 
                      item.foxcard === value
                    );
                    if (!currentDataPoint) return "";
                    
                    const maxValue = maxValuesByDate.get(currentDataPoint.date) || 0;
                    if (typeof value === "number" && value === maxValue && value > 0) {
                      return value.toString();
                    }
                    return "";
                  }
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
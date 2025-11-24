import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface CustomerPaymentPieChartProps {
  isMobile: boolean;
  paymentPercentNewPieData: PieData[];
  paymentPercentOldPieData: PieData[];
}

const CustomerPaymentPieChart: React.FC<CustomerPaymentPieChartProps> = ({
  isMobile,
  paymentPercentNewPieData,
  paymentPercentOldPieData,
}) => (
  <div className="flex flex-col lg:flex-row gap-2">
    <div className="w-full bg-white rounded-xl shadow-lg mt-4 lg:mt-5">
      <div className="text-lg lg:text-xl font-medium text-gray-700 text-center pt-6 lg:pt-10">
        Tỉ lệ các hình thức thanh toán ( khách mới )
      </div>
      <div className="flex justify-center items-center 18 lg:py-8">
        <ResponsiveContainer
          width="100%"
          height={isMobile ? 220 : 300}
          minWidth={isMobile ? 180 : 320}
        >
          <PieChart>
            <Pie
              data={paymentPercentNewPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="60%"
              label={
                isMobile
                  ? (props: PieLabelRenderProps) => {
                      const { percent, x, y, index } = props;
                      if (
                        !percent ||
                        percent <= 0 ||
                        typeof index !== "number" ||
                        index < 0
                      )
                        return null;
                      const color =
                        paymentPercentNewPieData[index]?.color ||
                        "#333";
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={10}
                          fontWeight={600}
                          fill={color}
                        >
                          {`${(percent * 100).toFixed(1)}%`}
                        </text>
                      );
                    }
                  : (props: PieLabelRenderProps) => {
                      const { percent, x, y, index } = props;
                      if (
                        !percent ||
                        percent <= 0 ||
                        typeof index !== "number" ||
                        index < 0
                      )
                        return null;
                      const color =
                        paymentPercentNewPieData[index]?.color ||
                        "#333";
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={14}
                          fontWeight={600}
                          fill={color}
                        >
                          {`${(percent * 100).toFixed(1)}%`}
                        </text>
                      );
                    }
              }
              labelLine={false}
            >
              {paymentPercentNewPieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: Payload<number, string>) =>
                `${Number(value).toLocaleString()} (${props.payload.percent?.toFixed(2)}%)`
              }
            />
            <Legend
              wrapperStyle={{
                paddingTop: 10,
                paddingBottom: 10,
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                width: "100%",
                fontSize: isMobile ? 9 : 12,
              }}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    {/* Tỉ lệ đơn mua thẻ/ sản phẩm/ dịch vụ (khách cũ) */}
    <div className="w-full bg-white rounded-xl shadow-lg mt-4 lg:mt-5">
      <div className="text-lg lg:text-xl font-medium text-gray-700 text-center pt-6 lg:pt-10">
        Tỉ lệ các hình thức thanh toán ( khách cũ )
      </div>
      <div className="flex justify-center items-center py-4 lg:py-8">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentPercentOldPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="60%"
              label={
                isMobile
                  ? (props: PieLabelRenderProps) => {
                      const { percent, x, y, index } = props;
                      if (
                        !percent ||
                        percent <= 0 ||
                        typeof index !== "number" ||
                        index < 0
                      )
                        return null;
                      const color =
                        paymentPercentOldPieData[index]?.color ||
                        "#333";
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={10}
                          fontWeight={600}
                          fill={color}
                        >
                          {`${(percent * 100).toFixed(1)}%`}
                        </text>
                      );
                    }
                  : (props: PieLabelRenderProps) => {
                      const { percent, x, y, index } = props;
                      if (
                        !percent ||
                        percent <= 0 ||
                        typeof index !== "number" ||
                        index < 0
                      )
                        return null;
                      const color =
                        paymentPercentOldPieData[index]?.color ||
                        "#333";
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={14}
                          fontWeight={600}
                          fill={color}
                        >
                          {`${(percent * 100).toFixed(1)}%`}
                        </text>
                      );
                    }
              }
              labelLine={false}
            >
              {paymentPercentOldPieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              wrapperStyle={{
                paddingTop: 10,
                paddingBottom: 10,
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                width: "100%",
                fontSize: isMobile ? 9 : 12,
              }}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default CustomerPaymentPieChart;
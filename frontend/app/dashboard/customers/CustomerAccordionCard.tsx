import React, { useState } from "react";

interface CustomerAccordionCardProps {
  mainValue: number | string;
  mainLabel: string;
  mainPercentChange?: number;
  maleValue?: number | string;
  malePercentChange?: number;
  femaleValue?: number | string;
  femalePercentChange?: number;
  avgRevenueMale?: number | string;
  avgServiceMale?: number | string;
  avgRevenueFemale?: number | string;
  avgServiceFemale?: number | string;
  loading?: boolean;
  error?: string | null;
}

const CustomerAccordionCard: React.FC<CustomerAccordionCardProps> = ({
  mainValue,
  mainLabel,
  mainPercentChange,
  maleValue,
  malePercentChange,
  femaleValue,
  femalePercentChange,
  avgRevenueMale,
  avgServiceMale,
  avgRevenueFemale,
  avgServiceFemale,
  loading,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedMale, setExpandedMale] = useState(false);
  const [expandedFemale, setExpandedFemale] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Main Card */}
      <div
        className="p-4 lg:p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors mb-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-sm lg:text-xl text-gray-700 mb-2 text-center font-semibold">
          {mainLabel}
        </div>
        <div className="text-3xl lg:text-5xl font-bold text-[#f66035] mb-2">
          {loading ? (
            <span>Đang tải dữ liệu...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : typeof mainValue === 'string' && mainValue.includes('Đang tải') ? (
            <span>{mainValue}</span>
          ) : (
            <>
              {mainValue} <span className="text-lg lg:text-2xl">khách</span>
            </>
          )}
        </div>
        {mainPercentChange !== undefined && mainPercentChange !== null && !loading && !error && (
          <div
            className={`text-base lg:text-xl font-semibold ${
              mainPercentChange > 0
                ? "text-green-600"
                : mainPercentChange < 0
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {mainPercentChange > 0 ? "↑" : mainPercentChange < 0 ? "↓" : ""}{" "}
            {Math.abs(mainPercentChange).toFixed(2)}%
          </div>
        )}
        <div className="mt-2 text-xl text-green-600 transition-transform duration-200">
          {isExpanded ? "⌃" : "⌄"}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="flex justify-center items-center border-t border-gray-200">
          {/* Male Card */}
          {/* <div className="w-1/2 p-4 border-r border-gray-100">
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={() => setExpandedMale(!expandedMale)}
            >
              <div className="flex gap-2 justify-center items-center">
                <div className="text-lg font-semibold text-gray-800">
                  Lượt khách nam thực đi
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {maleValue !== undefined && maleValue !== null ? maleValue.toLocaleString() : "Đang tải..."}{" "}
                  <span className="text-sm">khách</span>
                </div>
                {malePercentChange !== undefined && malePercentChange !== null && (
                  <div
                    className={`text-sm font-semibold ${
                      malePercentChange > 0
                        ? "text-green-600"
                        : malePercentChange < 0
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {malePercentChange > 0
                      ? "↑"
                      : malePercentChange < 0
                      ? "↓"
                      : ""}{" "}
                    {Math.abs(malePercentChange).toFixed(2)}%
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center text-lg text-blue-600 transition-transform duration-200">
                {expandedMale ? "⌃" : "⌄"}
              </div>
            </div>

            Male Details
            {expandedMale && (
              <div className="mt-4 pl-4 border-l-2 border-blue-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Trung bình đơn thực thu nam
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      {avgRevenueMale?.toLocaleString() ?? 0}{" "}
                      <span className="text-sm">VNĐ</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Trung bình đơn thẻ foxie nam
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      {avgServiceMale?.toLocaleString() ?? 0}{" "}
                      <span className="text-sm">VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div> */}

          {/* Female Card */}
          <div className="w-1/2 p-4 border-l border-gray-100">
            {/* <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={() => setExpandedFemale(!expandedFemale)}
            >
              <div className="flex gap-2 justify-center items-center">
                <div className="text-lg font-semibold text-gray-800">
                  Lượt khách nữ thực đi
                </div>
                <div className="text-2xl font-bold text-pink-600">
                  {femaleValue !== undefined && femaleValue !== null ? femaleValue.toLocaleString() : "Đang tải..."}{" "}
                  <span className="text-sm">khách</span>
                </div>
                {femalePercentChange !== undefined && femalePercentChange !== null && (
                  <div
                    className={`text-sm font-semibold ${
                      femalePercentChange > 0
                        ? "text-green-600"
                        : femalePercentChange < 0
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {femalePercentChange > 0
                      ? "↑"
                      : femalePercentChange < 0
                      ? "↓"
                      : ""}{" "}
                    {Math.abs(femalePercentChange).toFixed(2)}%
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center text-lg text-pink-600 transition-transform duration-200">
                {expandedFemale ? "⌃" : "⌄"}
              </div>
            </div> */}

            {/* Female Details */}
            {/* {expandedFemale && (
              <div className="mt-4 pl-4 border-l-2 border-pink-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Trung bình đơn thực thu nữ
                    </div>
                    <div className="text-lg font-bold text-pink-700">
                      {avgRevenueFemale?.toLocaleString() ?? 0}{" "}
                      <span className="text-sm">VNĐ</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Trung bình đơn thẻ foxie nữ
                    </div>
                    <div className="text-lg font-bold text-purple-700">
                      {avgServiceFemale?.toLocaleString() ?? 0}{" "}
                      <span className="text-sm">VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAccordionCard;

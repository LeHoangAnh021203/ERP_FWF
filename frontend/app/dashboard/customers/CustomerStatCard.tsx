import React from "react";

interface CustomerStatCardProps {
  value: number | string;
  label: string;
  color: string;
  loading?: boolean;
  error?: string | null;
  unit?: string;
}

const CustomerStatCard: React.FC<CustomerStatCardProps> = ({
  value,
  label,
  color,
  loading,
  error,
  unit = "đ",
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 lg:p-6 flex flex-col items-center">
      <div className="text-sm lg:text-xl text-gray-700 mb-2 text-center">
        {label}
      </div>
      <div className={`text-2xl font-bold ${color} mb-2`}>
        {loading ? (
          <span>Đang tải...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <>
            {value ?? 0}
            <span className="text-lg lg:text-2xl">{unit}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerStatCard; 
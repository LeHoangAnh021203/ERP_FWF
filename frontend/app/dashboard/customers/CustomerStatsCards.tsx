import React from "react";
import CustomerStatCard from "./CustomerStatCard";

interface CustomerStatsCardsProps {
  loading: boolean;
  error: string | null;
  avgRevenueMale: number | string;
  avgRevenueFemale: number | string;
  avgServiceMale: number | string;
  avgServiceFemale: number | string;
}

const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({
  loading,
  error,
  avgRevenueMale,
  avgRevenueFemale,
  avgServiceMale,
  avgServiceFemale,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6 mt-5">
    <CustomerStatCard
      value={avgRevenueMale}
      label="Trung bình đơn thực thu (Nam)"
      color="text-[#f66035]"
      loading={loading}
      error={error}
    />
    <CustomerStatCard
      value={avgRevenueFemale}
      label="Trung bình đơn thực thu (Nữ)"
      color="text-[#0693e3]"
      loading={loading}
      error={error}
    />
    <CustomerStatCard
      value={avgServiceMale}
      label="Trung bình đơn dịch vụ (Nam)"
      color="text-[#00d082]"
      loading={loading}
      error={error}
    />
    <CustomerStatCard
      value={avgServiceFemale}
      label="Trung bình đơn dịch vụ (Nữ)"
      color="text-[#9b51e0]"
      loading={loading}
      error={error}
    />
  </div>
);

export default CustomerStatsCards;
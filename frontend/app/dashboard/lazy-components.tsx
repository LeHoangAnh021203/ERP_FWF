import { lazy } from "react";

// Lazy load all dashboard components
export const StatsCards = lazy(() =>
  import("@/app/components/stats-cards").then((module) => ({
    default: module.StatsCards,
  })),
);
export const RevenueChart = lazy(() =>
  import("@/app/components/revenue-chart").then((module) => ({
    default: module.RevenueChart,
  })),
);
export const RecentActivity = lazy(() =>
  import("@/app/components/recent-activity").then((module) => ({
    default: module.RecentActivity,
  })),
);
export const TasksWidget = lazy(() =>
  import("@/app/components/tasks-widget").then((module) => ({
    default: module.TasksWidget,
  })),
);
export const CustomerInsights = lazy(() =>
  import("@/app/components/customer-insights").then((module) => ({
    default: module.CustomerInsights,
  })),
);
export const QuickActions = lazy(() =>
  import("@/app/components/quick-actions").then((module) => ({
    default: module.QuickActions,
  })),
);
export const TopSaleChart = lazy(() =>
  import("./TopSaleChart").then((module) => ({
    default: module.default,
  })),
);

// Lazy load dashboard-specific components
export const TotalSaleTable = lazy(() =>
  import("./TotalSaleTable").then((module) => ({
    default: module.default,
  })),
);

export const SaleDetail = lazy(() =>
  import("./SaleDetail").then((module) => ({
    default: module.default,
  })),
);

export const KPIChart = lazy(() =>
  import("./KPIChart").then((module) => ({
    default: module.default,
  })),
);

export const CustomerSection = lazy(() =>
  import("./CustomerSection").then((module) => ({
    default: module.default,
  })),
);

export const BookingSection = lazy(() =>
  import("./BookingSection").then((module) => ({
    default: module.default,
  })),
);

export const BookingByHourChart = lazy(() =>
  import("./BookingByHourChart").then((module) => ({
    default: module.default,
  })),
);

export const ServiceSection = lazy(() =>
  import("./ServiceSection").then((module) => ({
    default: module.default,
  })),
);

export const FoxieBalanceTable = lazy(() =>
  import("./FoxieBalanceTable").then((module) => ({
    default: module.default,
  })),
);

export const SalesByHourTable = lazy(() =>
  import("./SalesByHourTable").then((module) => ({
    default: module.default,
  })),
);

export const GrowthByPaymentChart = lazy(() =>
  import("./GrowthByPaymentChart").then((module) => ({
    default: module.default,
  })),
);
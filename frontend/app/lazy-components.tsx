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

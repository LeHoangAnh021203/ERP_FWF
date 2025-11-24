"use client";
import { lazy } from "react";

// Lazy load all chart components
export const ServicesFilter = lazy(() => import("./ServicesFilter"));
export const WeeklyServiceChartData = lazy(() => import("./ServiceWeeklyChartData"));
export const PieChartData = lazy(() => import("./ServicePieChartData"));
export const ServiceBottomPieData = lazy(() => import("./ServiceBottomPieData"));
export const ServiceStatCards = lazy(() => import("./ServiceStatCards"));
export const ServiceStoreChartData = lazy(() => import("./ServiceStoreChartData"));
export const ServicesRegionData = lazy(() => import("./ServicesRegionData"));
export const ServicesTable = lazy(() => import("./ServicesTable")); 
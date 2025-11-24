"use client";
import { lazy } from 'react';

// Lazy load all chart components
export const LazyCustomerFacilityHourTable = lazy(() => import('./CustomerFacilityHourTable'));
export const LazyCustomerFilters = lazy(() => import('./CustomerFilters'));
export const LazyCustomerSummaryCard = lazy(() => import('./CustomerSummaryCard'));
export const LazyCustomerStatsCards = lazy(() => import('./CustomerStatsCards'));
export const LazyCustomerGenderPie = lazy(() => import('./CustomerGenderPie'));
export const LazyCustomerNewChart = lazy(() => import('./CustomerNewChart'));
export const LazyCustomerTypeTrendChart = lazy(() => import('./CustomerTypeTrendChart'));
export const LazyCustomerSourceBarChart = lazy(() => import('./CustomerSourceBarChart'));
export const LazyCustomerAppDownloadBarChart = lazy(() => import('./CustomerAppDownloadBarChart'));
export const LazyCustomerAppDownloadPieChart = lazy(() => import('./CustomerAppDownloadPieChart'));
export const LazyCustomerPaymentPieChart = lazy(() => import('../accounting/CustomerPaymentPieChart')); 
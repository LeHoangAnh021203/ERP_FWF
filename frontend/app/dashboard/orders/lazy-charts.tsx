"use client";
import { lazy } from 'react';

// Lazy load all chart components
export const LazyOrderFilter = lazy(() => import('./OrderFilter'));
export const LazyOrderRegionalSalesByDay = lazy(() => import('./OrderRegionalSalesByDay'));
export const LazyOrderStoreTypeSalesByDay = lazy(() => import('./OrderStoreTypeSalesByDay'));
export const LazyOrderTotalSales = lazy(() => import('./OrderTotalSales'));
export const LazyOrderActualCollection = lazy(() => import('./OrderActualCollection'));
export const LazyOrderTotalByDay = lazy(() => import('./OrderTotalByDay'));
export const LazyOrderTotalByStore = lazy(() => import('./OrderTotalByStore'));
export const LazyOrderCustomerTypeSaleaByDay = lazy(() => import('./OrderCustomerTypeSaleaByDay'));
export const LazyOrderTop10LocationChartData = lazy(() => import('./OrderTop10LocationChartData'));
export const LazyOrderActualStoreSale = lazy(() => import('./OrderActualStoreSale'));
export const LazyOrdersChartData = lazy(() => import('./OrdersChartData'));
export const LazyOrderTop10StoreOfOrder = lazy(() => import('./OrderTop10StoreOfOrder'));
export const LazyOrderOfStore = lazy(() => import('./OrderOfStore'));
export const LazyOrderStatCards = lazy(() => import('./OrderStatCards'));
export const LazyOrderPiePaymentData = lazy(() => import('./OrderPiePaymentData'));
export const LazyOrderPaymentRegionData = lazy(() => import('./OrderPaymentRegionData')); 
export const LazyOrderDailyBreakdown = lazy(() => import('./OrderDailyBreakdown'));
export const LazyOrderStatCardsWithAPI = lazy(() => import('./OrderStatCardsWithAPI'));
export const LazyShopTypeRevenueChart = lazy(() => import('./ShopTypeRevenueChart'));
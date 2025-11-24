"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import { Notification, useNotification } from "@/app/components/notification";
import { SEARCH_TARGETS, normalize } from "@/app/lib/search-targets";
import { usePageStatus } from "@/app/hooks/usePageStatus";
import { useDashboardData } from "@/app/hooks/useDashboardData";
import { useDateRange } from "@/app/contexts/DateContext";
import { ApiService } from "@/app/lib/api-service";

import { QuickActions } from "@/app/components/quick-actions";
import { DollarSign } from "lucide-react";
import {
  TotalSaleTable,
  SaleDetail,
  KPIChart,
  CustomerSection,
  BookingSection,
  BookingByHourChart,
  ServiceSection,
  FoxieBalanceTable,
  SalesByHourTable,
  GrowthByPaymentChart,
} from "./lazy-components";
import { LazyLoadingWrapper, ConditionalRender } from "./LazyLoadingWrapper";

interface PaymentMethod {
  method: string;
  amount: number;
  percentage: number;
  transactions: number;
}

// Real data only: no mock datasets for dashboard

/* const revenueRankingData = [
  {
    rank: 1,
    name: "Chi nhánh Quận 1",
    revenue: 45000000,
    growth: 15,
    type: "top",
  },
  {
    rank: 2,
    name: "Chi nhánh Quận 3",
    revenue: 38000000,
    growth: 12,
    type: "top",
  },
  {
    rank: 3,
    name: "Chi nhánh Quận 7",
    revenue: 32000000,
    growth: 8,
    type: "top",
  },
  {
    rank: 4,
    name: "Chi nhánh Thủ Đức",
    revenue: 28000000,
    growth: 6,
    type: "top",
  },
  {
    rank: 5,
    name: "Chi nhánh Quận 2",
    revenue: 25000000,
    growth: 4,
    type: "top",
  },
  {
    rank: 6,
    name: "Chi nhánh Quận 5",
    revenue: 22000000,
    growth: 2,
    type: "top",
  },
  {
    rank: 7,
    name: "Chi nhánh Quận 8",
    revenue: 18000000,
    growth: -1,
    type: "top",
  },
  {
    rank: 8,
    name: "Chi nhánh Quận 9",
    revenue: 15000000,
    growth: -3,
    type: "top",
  },
  {
    rank: 9,
    name: "Chi nhánh Quận 6",
    revenue: 12000000,
    growth: -5,
    type: "top",
  },
  {
    rank: 10,
    name: "Chi nhánh Quận 4",
    revenue: 8000000,
    growth: -8,
    type: "top",
  },
  {
    rank: 11,
    name: "Chi nhánh Bình Thạnh",
    revenue: 6000000,
    growth: -12,
    type: "bottom",
  },
  {
    rank: 12,
    name: "Chi nhánh Tân Bình",
    revenue: 4500000,
    growth: -15,
    type: "bottom",
  },
  {
    rank: 13,
    name: "Chi nhánh Gò Vấp",
    revenue: 3200000,
    growth: -18,
    type: "bottom",
  },
  {
    rank: 14,
    name: "Chi nhánh Phú Nhuận",
    revenue: 2800000,
    growth: -22,
    type: "bottom",
  },
  {
    rank: 15,
    name: "Chi nhánh Tân Phú",
    revenue: 2200000,
    growth: -25,
    type: "bottom",
  },
  {
    rank: 16,
    name: "Chi nhánh Bình Tân",
    revenue: 1800000,
    growth: -28,
    type: "bottom",
  },
  {
    rank: 17,
    name: "Chi nhánh Quận 11",
    revenue: 1500000,
    growth: -32,
    type: "bottom",
  },
  {
    rank: 18,
    name: "Chi nhánh Quận 12",
    revenue: 1200000,
    growth: -35,
    type: "bottom",
  },
  {
    rank: 19,
    name: "Chi nhánh Hóc Môn",
    revenue: 800000,
    growth: -40,
    type: "bottom",
  },
  {
    rank: 20,
    name: "Chi nhánh Củ Chi",
    revenue: 500000,
    growth: -45,
    type: "bottom",
  },
]; */

/* const foxieRankingData = [
  {
    rank: 1,
    name: "Chi nhánh Quận 1",
    revenue: 45000000,
    growth: 15,
    type: "top",
  },
  {
    rank: 2,
    name: "Chi nhánh Quận 3",
    revenue: 38000000,
    growth: 12,
    type: "top",
  },
  {
    rank: 3,
    name: "Chi nhánh Quận 7",
    revenue: 32000000,
    growth: 8,
    type: "top",
  },
  {
    rank: 4,
    name: "Chi nhánh Thủ Đức",
    revenue: 28000000,
    growth: 6,
    type: "top",
  },
  {
    rank: 5,
    name: "Chi nhánh Quận 2",
    revenue: 25000000,
    growth: 4,
    type: "top",
  },
  {
    rank: 6,
    name: "Chi nhánh Quận 5",
    revenue: 22000000,
    growth: 2,
    type: "top",
  },
  {
    rank: 7,
    name: "Chi nhánh Quận 8",
    revenue: 18000000,
    growth: -1,
    type: "top",
  },
  {
    rank: 8,
    name: "Chi nhánh Quận 9",
    revenue: 15000000,
    growth: -3,
    type: "top",
  },
  {
    rank: 9,
    name: "Chi nhánh Quận 6",
    revenue: 12000000,
    growth: -5,
    type: "top",
  },
  {
    rank: 10,
    name: "Chi nhánh Quận 4",
    revenue: 8000000,
    growth: -8,
    type: "top",
  },
  {
    rank: 11,
    name: "Chi nhánh Bình Thạnh",
    revenue: 6000000,
    growth: -12,
    type: "bottom",
  },
  {
    rank: 12,
    name: "Chi nhánh Tân Bình",
    revenue: 4500000,
    growth: -15,
    type: "bottom",
  },
  {
    rank: 13,
    name: "Chi nhánh Gò Vấp",
    revenue: 3200000,
    growth: -18,
    type: "bottom",
  },
  {
    rank: 14,
    name: "Chi nhánh Phú Nhuận",
    revenue: 2800000,
    growth: -22,
    type: "bottom",
  },
  {
    rank: 15,
    name: "Chi nhánh Tân Phú",
    revenue: 2200000,
    growth: -25,
    type: "bottom",
  },
  {
    rank: 16,
    name: "Chi nhánh Bình Tân",
    revenue: 1800000,
    growth: -28,
    type: "bottom",
  },
  {
    rank: 17,
    name: "Chi nhánh Quận 11",
    revenue: 1500000,
    growth: -32,
    type: "bottom",
  },
  {
    rank: 18,
    name: "Chi nhánh Quận 12",
    revenue: 1200000,
    growth: -35,
    type: "bottom",
  },
  {
    rank: 19,
    name: "Chi nhánh Hóc Môn",
    revenue: 800000,
    growth: -40,
    type: "bottom",
  },
  {
    rank: 20,
    name: "Chi nhánh Củ Chi",
    revenue: 500000,
    growth: -45,
    type: "bottom",
  },
]; */

// No mock fallback; render skeleton until real data is available

/* const productDataByDistrict = [
  { name: "Q1", value: 28, color: "#ff6b6b" },
  { name: "Q3", value: 22, color: "#4ecdc4" },
  { name: "Q7", value: 18, color: "#45b7d1" },
  { name: "Thủ Đức", value: 15, color: "#96ceb4" },
  { name: "Q2", value: 12, color: "#feca57" },
  { name: "Khác", value: 5, color: "#ff9ff3" },
]; */

/* const foxieCardDataByDistrict = [
  { name: "Q1", value: 32, color: "#6c5ce7" },
  { name: "Q3", value: 25, color: "#a29bfe" },
  { name: "Q7", value: 20, color: "#fd79a8" },
  { name: "Thủ Đức", value: 13, color: "#fdcb6e" },
  { name: "Q2", value: 8, color: "#e17055" },
  { name: "Khác", value: 2, color: "#74b9ff" },
]; */

/* const serviceDataByDistrict = [
  { name: "Q1", value: 30, color: "#00b894" },
  { name: "Q3", value: 24, color: "#00cec9" },
  { name: "Q7", value: 19, color: "#55a3ff" },
  { name: "Thủ Đức", value: 16, color: "#fd79a8" },
  { name: "Q2", value: 9, color: "#fdcb6e" },
  { name: "Khác", value: 2, color: "#e84393" },
]; */

// Daily KPI Growth Data (last 7 days) - will be created inside component

export default function Dashboard() {
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();
  const hasShownSuccess = useRef(false);
  const hasShownError = useRef(false);
  const { fromDate, toDate } = useDateRange();
  
  // Track which data sections have been loaded and notified
  const notifiedDataRef = useRef<Set<string>>(new Set());
  const {
    reportPageError,
    reportDataLoadSuccess,
    reportPagePerformance,
    reportDataLoadError,
  } = usePageStatus("dashboard");

  const { loading, error, apiErrors, apiSuccesses } = useDashboardData();
  
  // Memoize date strings to prevent unnecessary re-renders
  const fromDateStr = React.useMemo(() => {
    if (!fromDate) return "";
    // Extract just the date part (YYYY-MM-DD) for comparison
    return fromDate.split("T")[0];
  }, [fromDate]);
  
  const toDateStr = React.useMemo(() => {
    if (!toDate) return "";
    // Extract just the date part (YYYY-MM-DD) for comparison
    return toDate.split("T")[0];
  }, [toDate]);
  
  const searchParamQuery = (() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    return url.searchParams.get("q") || "";
  })();

  // Fetch sales summary data using direct API call (like the original)
  const [salesSummaryData, setSalesSummaryData] = useState<{
    totalRevenue: string;
    cash: string;
    transfer: string;
    card: string;
    actualRevenue: string;
    foxieUsageRevenue: string;
    walletUsageRevenue: string;
    toPay: string;
    debt: string;
  } | null>(null);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  // Use ApiService with authentication like other pages
  React.useEffect(() => {
    const fetchSalesSummary = async () => {
      if (!fromDateStr || !toDateStr) return;

      try {
        setSalesLoading(true);
        setSalesError(null);

        // Format dates for API (DD/MM/YYYY format like the API expects)
        const formatDateForAPI = (dateString: string) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(fromDateStr + "T00:00:00");
        const endDate = formatDateForAPI(toDateStr + "T23:59:59");

        console.log("🔄 Fetching sales summary via ApiService with dates:", {
          startDate,
          endDate,
        });

        // Use direct fetch from client to avoid Vercel proxy timeout
        const data = (await ApiService.getDirect(
          `real-time/sales-summary-copied?dateStart=${startDate}&dateEnd=${endDate}`
        )) as {
          totalRevenue: string;
          cash: string;
          transfer: string;
          card: string;
          actualRevenue: string;
          foxieUsageRevenue: string;
          walletUsageRevenue: string;
          toPay: string;
          debt: string;
        };

        

        console.log("✅ Sales summary data received:", data);
        console.log("🔍 Debug - Data structure check:", {
          hasTotalRevenue: !!data.totalRevenue,
          hasCash: !!data.cash,
          hasTransfer: !!data.transfer,
          hasCard: !!data.card,
          hasFoxieUsageRevenue: !!data.foxieUsageRevenue,
          hasWalletUsageRevenue: !!data.walletUsageRevenue,
        });

        setSalesSummaryData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch sales summary";
        setSalesError(errorMessage);
        console.error("❌ Sales summary fetch error:", err);
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSalesSummary();
  }, [fromDateStr, toDateStr]);

  const [kpiViewMode, setKpiViewMode] = useState<"monthly" | "daily">(
    "monthly"
  );

  // KPI Monthly revenue API state (for Target KPI only - cumulative from start of month)
  const [kpiMonthlyRevenueLoading, setKpiMonthlyRevenueLoading] =
    useState(true);
  const [kpiMonthlyRevenueError, setKpiMonthlyRevenueError] = useState<
    string | null
  >(null);

  // Service summary API state
  const [serviceSummaryData, setServiceSummaryData] = useState<{
    totalServices: string;
    totalServicesServing: string;
    totalServiceDone: string;
    items: Array<{
      serviceName: string;
      serviceUsageAmount: string;
      serviceUsagePercentage: string;
    }>;
  } | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Auth expiration modal state
  const [authExpired, setAuthExpired] = useState(false);

  // New customers API state (for current date range)
  const [newCustomerData, setNewCustomerData] = useState<Array<{
    count: number;
    type: string;
  }> | null>(null);
  const [newCustomerLoading, setNewCustomerLoading] = useState(true);
  const [newCustomerError, setNewCustomerError] = useState<string | null>(null);

  // Old customers API state (for current date range)
  const [oldCustomerData, setOldCustomerData] = useState<Array<{
    count: number;
    type: string;
  }> | null>(null);
  const [oldCustomerLoading, setOldCustomerLoading] = useState(true);
  const [oldCustomerError, setOldCustomerError] = useState<string | null>(null);

  // Foxie balance API state
  const [foxieBalanceData, setFoxieBalanceData] = useState<{
    the_tien_kha_dung: number;
  } | null>(null);
  const [foxieBalanceLoading, setFoxieBalanceLoading] = useState(true);
  const [foxieBalanceError, setFoxieBalanceError] = useState<string | null>(
    null
  );

  // Sales by hour API state
  const [salesByHourData, setSalesByHourData] = useState<Array<{
    date: string;
    totalSales: number;
    timeRange: string;
  }> | null>(null);
  const [salesByHourLoading, setSalesByHourLoading] = useState(true);
  const [salesByHourError, setSalesByHourError] = useState<string | null>(null);

  // Sales detail API state
  const [salesDetailData, setSalesDetailData] = useState<Array<{
    productName: string;
    productPrice: string;
    productQuantity: string;
    productDiscount: string;
    productCode: string;
    productUnit: string;
    formatTable: string;
    cash: string;
    transfer: string;
    card: string;
    wallet: string;
    foxie: string;
  }> | null>(null);
  const [salesDetailLoading, setSalesDetailLoading] = useState(true);
  const [salesDetailError, setSalesDetailError] = useState<string | null>(null);

  // Booking by hour API state
  const [bookingByHourData, setBookingByHourData] = useState<Array<{ type: string; count: number }> | null>(null);
  const [bookingByHourLoading, setBookingByHourLoading] = useState(true);
  const [bookingByHourError, setBookingByHourError] = useState<string | null>(null);

  // Booking API state
  const [bookingData, setBookingData] = useState<{
    notConfirmed: string;
    confirmed: string;
    denied: string;
    customerCome: string;
    customerNotCome: string;
    cancel: string;
    autoConfirmed: string;
  } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Daily revenue API state (for current day only)
  const [dailyRevenueLoading, setDailyRevenueLoading] = useState(true);
  const [dailyRevenueError, setDailyRevenueError] = useState<string | null>(
    null
  );

  // KPI daily series (real per-day data from start of month to today)
  const [kpiDailySeries, setKpiDailySeries] = useState<Array<{
    dateLabel: string; // DD/MM
    isoDate: string; // yyyy-MM-dd
    total: number; // cash+transfer+card
  }> | null>(null);
  const [kpiDailySeriesLoading, setKpiDailySeriesLoading] = useState(true);
  const [kpiDailySeriesError, setKpiDailySeriesError] = useState<string | null>(
    null
  );

  // Actual revenue (new API) for KPI
  const [actualRevenueToday, setActualRevenueToday] = useState<number | null>(null);
  const [actualRevenueMTD, setActualRevenueMTD] = useState<number | null>(null);

  // Fetch service summary (real-time) using ApiService via proxy
  React.useEffect(() => {
    const fetchServiceSummary = async () => {
      if (!fromDateStr || !toDateStr) return;

      try {
        setServiceError(null);

        const formatDateForAPI = (isoDateString: string) => {
          // isoDateString like yyyy-MM-ddTHH:mm:ss from DateContext
          const [datePart] = isoDateString.split("T");
          const [year, month, day] = datePart.split("-");
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(fromDateStr + "T00:00:00");
        const endDate = formatDateForAPI(toDateStr + "T23:59:59");

        const data = (await ApiService.getDirect(
          `real-time/service-summary?dateStart=${startDate}&dateEnd=${endDate}`
        )) as {
          totalServices: string;
          totalServicesServing: string;
          totalServiceDone: string;
          items: Array<{
            serviceName: string;
            serviceUsageAmount: string;
            serviceUsagePercentage: string;
          }>;
        };

        

        setServiceSummaryData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch service summary";
        setServiceError(errorMessage);
        console.error("❌ Service summary fetch error:", err);
      } finally {
        // setServiceLoading(false); // Removed as per edit hint
      }
    };

    fetchServiceSummary();
  }, [fromDateStr, toDateStr]);

  // Fetch new customers by source (real-time) using ApiService via proxy
  React.useEffect(() => {
    const fetchNewCustomers = async () => {
      if (!fromDateStr || !toDateStr) return;

      try {
        setNewCustomerLoading(true);
        setNewCustomerError(null);

        const formatDateForAPI = (dateString: string) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(fromDateStr + "T00:00:00");
        const endDate = formatDateForAPI(toDateStr + "T23:59:59");

        const data = (await ApiService.getDirect(
          `real-time/get-new-customer?dateStart=${startDate}&dateEnd=${endDate}`
        )) as Array<{
          count: number;
          type: string;
        }>;

        setNewCustomerData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch new customers";
        setNewCustomerError(errorMessage);
        console.error("❌ New customers fetch error:", err);
      } finally {
        setNewCustomerLoading(false);
      }
    };

    fetchNewCustomers();
  }, [fromDateStr, toDateStr]);

  // Fetch old customers by source (real-time) using ApiService via proxy
  React.useEffect(() => {
    const fetchOldCustomers = async () => {
      if (!fromDateStr || !toDateStr) return;

      try {
        setOldCustomerLoading(true);
        setOldCustomerError(null);

        const formatDateForAPI = (dateString: string) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(fromDateStr + "T00:00:00");
        const endDate = formatDateForAPI(toDateStr + "T23:59:59");

        const data = (await ApiService.getDirect(
          `real-time/get-old-customer?dateStart=${startDate}&dateEnd=${endDate}`
        )) as Array<{
          count: number;
          type: string;
        }>;

        setOldCustomerData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch old customers";
        setOldCustomerError(errorMessage);
        console.error("❌ Old customers fetch error:", err);
      } finally {
        setOldCustomerLoading(false);
      }
    };

    fetchOldCustomers();
  }, [fromDateStr, toDateStr]);

  // Fetch Foxie balance using ApiService via proxy
  React.useEffect(() => {
    const fetchFoxieBalance = async () => {
      try {
        setFoxieBalanceLoading(true);
        setFoxieBalanceError(null);

        console.log("🔄 Fetching Foxie balance via direct API call");

        // Use direct API call instead of proxy for this specific endpoint
        const response = await fetch(
          "https://app.facewashfox.com/api/ws/fwf@the_tien_kha_dung",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                typeof window !== "undefined"
                  ? localStorage.getItem("token") || ""
                  : ""
              }`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as {
          the_tien_kha_dung: number;
        };

        console.log("✅ Foxie balance data received:", data);
        setFoxieBalanceData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch Foxie balance";
        setFoxieBalanceError(errorMessage);
        console.error("❌ Foxie balance fetch error:", err);
      } finally {
        setFoxieBalanceLoading(false);
      }
    };

    fetchFoxieBalance();
  }, []); // Empty dependency - fetch once on mount

  // Fetch sales by hour (real-time) using ApiService via proxy
  React.useEffect(() => {
    const fetchSalesByHour = async () => {
      if (!fromDateStr || !toDateStr) return;

      try {
        setSalesByHourLoading(true);
        setSalesByHourError(null);

        const formatDateForAPI = (dateString: string) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(fromDateStr + "T00:00:00");
        const endDate = formatDateForAPI(toDateStr + "T23:59:59");

        console.log("🔄 Fetching sales by hour via ApiService with dates:", {
          startDate,
          endDate,
        });

        const data = (await ApiService.getDirect(
          `real-time/get-sales-by-hour?dateStart=${startDate}&dateEnd=${endDate}`
        )) as Array<{
          date: string;
          totalSales: number;
          timeRange: string;
        }>;

        console.log("✅ Sales by hour data received:", data);
        setSalesByHourData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch sales by hour";
        setSalesByHourError(errorMessage);
        console.error("❌ Sales by hour fetch error:", err);
      } finally {
        setSalesByHourLoading(false);
      }
    };

    fetchSalesByHour();
  }, [fromDateStr, toDateStr]);

  // Fetch Actual Revenue for KPI (day and month-to-date)
  React.useEffect(() => {
    const run = async () => {
      try {
        const today = toDateStr ? new Date(toDateStr) : new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const toDdMmYyyy = (d: Date) => {
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };
        const dayStr = toDdMmYyyy(today);
        const startMonthStr = toDdMmYyyy(firstDay);
        const [dayValue, mtdValue] = await Promise.all([
          ApiService.getDirect(`real-time/get-actual-revenue?dateStart=${dayStr}&dateEnd=${dayStr}`),
          ApiService.getDirect(`real-time/get-actual-revenue?dateStart=${startMonthStr}&dateEnd=${dayStr}`),
        ]);
        setActualRevenueToday(Number(dayValue || 0));
        setActualRevenueMTD(Number(mtdValue || 0));
      } catch {
        // ignore
      }
    };
    run();
  }, [fromDateStr, toDateStr]);

  // Fetch booking by hour (real-time)
  React.useEffect(() => {
    const fetchBookingByHour = async () => {
      if (!fromDateStr || !toDateStr) return;
      try {
        setBookingByHourLoading(true);
        setBookingByHourError(null);
        const toDdMmYyyy = (dateString: string) => {
          const d = new Date(dateString);
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };
        const start = toDdMmYyyy(fromDateStr + "T00:00:00");
        const end = toDdMmYyyy(toDateStr + "T23:59:59");
        const data = (await ApiService.getDirect(
          `real-time/get-booking-by-hour?dateStart=${start}&dateEnd=${end}`
        )) as Array<{ count: number; type: string }>;
        setBookingByHourData(data || []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch booking by hour";
        setBookingByHourError(msg);
      } finally {
        setBookingByHourLoading(false);
      }
    };
    fetchBookingByHour();
  }, [fromDateStr, toDateStr]);

  const newCustomerTotal = React.useMemo(() => {
    if (!newCustomerData || newCustomerData.length === 0) return 0;
    return newCustomerData.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0
    );
  }, [newCustomerData]);

  const oldCustomerTotal = React.useMemo(() => {
    if (!oldCustomerData || oldCustomerData.length === 0) return 0;
    return oldCustomerData.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0
    );
  }, [oldCustomerData]);

  // --- colorPalette useMemo để tránh deps bị warning ---
  const colorPalette = React.useMemo(
    () => [
      "#f16a3f",
      "#0693e3",
      "#00d084",
      "#fcb900",
      "#9b51e0",
      "#41d1d9",
      "#ff6b6b",
      "#7bdcb5",
      "#ff6900",
      "#4ecdc4",
    ],
    []
  );

  const newCustomerPieData = React.useMemo(() => {
    if (!newCustomerData || newCustomerData.length === 0)
      return [] as Array<{ name: string; value: number; color: string }>;
    return newCustomerData.map((item, idx) => ({
      name: item.type,
      value: Number(item.count || 0),
      color: colorPalette[idx % colorPalette.length],
    }));
  }, [newCustomerData, colorPalette]);

  const oldCustomerPieData = React.useMemo(() => {
    if (!oldCustomerData || oldCustomerData.length === 0)
      return [] as Array<{ name: string; value: number; color: string }>;
    return oldCustomerData.map((item, idx) => ({
      name: item.type,
      value: Number(item.count || 0),
      color: colorPalette[idx % colorPalette.length],
    }));
  }, [oldCustomerData, colorPalette]);

  // Fetch sales detail (real-time) using ApiService via proxy
  React.useEffect(() => {
    const fetchSalesDetail = async () => {
      if (!fromDateStr || !toDateStr) return;

      try {
        setSalesDetailLoading(true);
        setSalesDetailError(null);

        const formatDateForAPI = (dateString: string) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(fromDateStr + "T00:00:00");
        const endDate = formatDateForAPI(toDateStr + "T23:59:59");

        const data = (await ApiService.getDirect(
          `real-time/sales-detail?dateStart=${startDate}&dateEnd=${endDate}`
        )) as Array<{
          productName: string;
          productPrice: string;
          productQuantity: string;
          productDiscount: string;
          productCode: string;
          productUnit: string;
          formatTable: string;
          cash: string;
          transfer: string;
          card: string;
          wallet: string;
          foxie: string;
        }>;

        setSalesDetailData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch sales detail";
        setSalesDetailError(errorMessage);
        console.error("❌ Sales detail fetch error:", err);
      } finally {
        setSalesDetailLoading(false);
      }
    };

    fetchSalesDetail();
  }, [fromDateStr, toDateStr]);

  // Fetch booking data (real-time) using ApiService via proxy
  React.useEffect(() => {
    const fetchBookingData = async () => {
      if (!fromDateStr || !toDateStr) return;

      try {
        setBookingLoading(true);
        setBookingError(null);

        const formatDateForAPI = (dateString: string) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(fromDateStr + "T00:00:00");
        const endDate = formatDateForAPI(toDateStr + "T23:59:59");

        console.log("🔄 Fetching booking data via ApiService with dates:", {
          startDate,
          endDate,
        });

        const data = (await ApiService.getDirect(
          `real-time/booking?dateStart=${startDate}&dateEnd=${endDate}`
        )) as {
          notConfirmed: string;
          confirmed: string;
          denied: string;
          customerCome: string;
          customerNotCome: string;
          cancel: string;
          autoConfirmed: string;
        };

        console.log("✅ Booking data received:", data);
        setBookingData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch booking data";
        setBookingError(errorMessage);
        console.error("❌ Booking data fetch error:", err);
      } finally {
        setBookingLoading(false);
      }
    };

    fetchBookingData();
  }, [fromDateStr, toDateStr]);

  // Fetch daily revenue (current day only) using ApiService via proxy
  React.useEffect(() => {
    const fetchDailyRevenue = async () => {
      try {
        setDailyRevenueLoading(true);
        setDailyRevenueError(null);

        // Get current date in DD/MM/YYYY format
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        const todayStr = `${day}/${month}/${year}`;

        console.log("🔄 Fetching daily revenue for today:", todayStr);

        const data = (await ApiService.getDirect(
          `real-time/sales-summary?dateStart=${todayStr}&dateEnd=${todayStr}`
        )) as {
          totalRevenue: string;
          cash: string;
          transfer: string;
          card: string;
          actualRevenue: string;
          foxieUsageRevenue: string;
          walletUsageRevenue: string;
          toPay: string;
          debt: string;
        };

        console.log("✅ Daily revenue data received:", data);
        // setDailyRevenueData(data); // This line is removed
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch daily revenue";
        setDailyRevenueError(errorMessage);
        console.error("❌ Daily revenue fetch error:", err);
      } finally {
        setDailyRevenueLoading(false);
      }
    };

    fetchDailyRevenue();
  }, []); // Empty dependency array - only fetch once on mount

  // Fetch KPI monthly revenue (for Target KPI only - cumulative from start of month)
  React.useEffect(() => {
    const fetchKpiMonthlyRevenue = async () => {
      try {
        setKpiMonthlyRevenueLoading(true);
        setKpiMonthlyRevenueError(null);

        // Get start of current month and current date
        const today = new Date();
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

        const formatDateForAPI = (date: Date) => {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const startDate = formatDateForAPI(firstDayOfMonth);
        const endDate = formatDateForAPI(today);

        console.log(
          "🔄 Fetching KPI monthly revenue (cumulative from start of month):",
          { startDate, endDate }
        );

        const data = (await ApiService.getDirect(
          `real-time/sales-summary?dateStart=${startDate}&dateEnd=${endDate}`
        )) as {
          totalRevenue: string;
          cash: string;
          transfer: string;
          card: string;
          actualRevenue: string;
          foxieUsageRevenue: string;
          walletUsageRevenue: string;
          toPay: string;
          debt: string;
        };

        console.log("✅ KPI monthly revenue data received:", data);
        // setKpiMonthlyRevenueData(data); // This line is removed
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch KPI monthly revenue";
        setKpiMonthlyRevenueError(errorMessage);
        console.error("❌ KPI monthly revenue fetch error:", err);
      } finally {
        setKpiMonthlyRevenueLoading(false);
      }
    };

    fetchKpiMonthlyRevenue();
  }, []); // Empty dependency - fetch once on mount

  // Fetch daily KPI series (TM+CK+QT per day) from start of month to today
  // Only fetch once on mount - this data doesn't depend on date range
  const hasFetchedKpiSeries = React.useRef(false);
  React.useEffect(() => {
    if (hasFetchedKpiSeries.current) return;
    hasFetchedKpiSeries.current = true;
    const fetchDailySeries = async () => {
      try {
        setKpiDailySeriesLoading(true);
        setKpiDailySeriesError(null);

        const today = new Date();
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

        const toDdMmYyyy = (date: Date) => {
          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const yyyy = date.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };
        const toIsoYyyyMmDd = (date: Date) => {
          const dd = String(date.getDate()).padStart(2, "0");
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const yyyy = date.getFullYear();
          return `${yyyy}-${mm}-${dd}`;
        };

        const results: Array<{
          dateLabel: string;
          isoDate: string;
          total: number;
        }> = [];
        
        // Create array of all dates from first day of month to today
        const dates: Date[] = [];
        for (
          let d = new Date(firstDayOfMonth);
          d <= today;
          d.setDate(d.getDate() + 1)
        ) {
          dates.push(new Date(d));
        }

        // Fetch all dates in parallel for better performance
        const parseCurrency = (v: unknown) =>
          typeof v === "string"
            ? Number(v.replace(/[^0-9.-]/g, "")) || 0
            : Number(v) || 0;

        const fetchPromises = dates.map(async (d) => {
          const ddmmyyyy = toDdMmYyyy(d);
          try {
            const data = (await ApiService.getDirect(
              `real-time/sales-summary?dateStart=${ddmmyyyy}&dateEnd=${ddmmyyyy}`
            )) as {
              cash: string;
              transfer: string;
              card: string;
            };
            const total =
              parseCurrency(data.cash) +
              parseCurrency(data.transfer) +
              parseCurrency(data.card);
            return {
              dateLabel: `${String(d.getDate()).padStart(2, "0")}/${String(
                d.getMonth() + 1
              ).padStart(2, "0")}`,
              isoDate: toIsoYyyyMmDd(d),
              total,
            };
          } catch (err) {
            // Return zero for failed requests
            console.error(`Failed to fetch data for ${ddmmyyyy}:`, err);
            return {
              dateLabel: `${String(d.getDate()).padStart(2, "0")}/${String(
                d.getMonth() + 1
              ).padStart(2, "0")}`,
              isoDate: toIsoYyyyMmDd(d),
              total: 0,
            };
          }
        });

        // Wait for all requests to complete in parallel
        const fetchedResults = await Promise.all(fetchPromises);
        results.push(...fetchedResults);

        setKpiDailySeries(results);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch daily KPI series";
        setKpiDailySeriesError(message);
        console.error("❌ Daily KPI series fetch error:", err);
      } finally {
        setKpiDailySeriesLoading(false);
      }
    };

    fetchDailySeries();
  }, []);

  // Process sales summary data similar to orders page
  const paymentMethods = React.useMemo(() => {
    console.log("🔍 Debug - salesSummaryData:", salesSummaryData);

    if (!salesSummaryData) {
      console.log("❌ No salesSummaryData available, returning empty array");
      return [];
    }

    const totalRevenue = parseFloat(salesSummaryData.totalRevenue);
    const cashAmount = parseFloat(salesSummaryData.cash);
    const transferAmount = parseFloat(salesSummaryData.transfer);
    const cardAmount = parseFloat(salesSummaryData.card);
    const foxieAmount = Math.abs(
      parseFloat(salesSummaryData.foxieUsageRevenue)
    ); // Make positive
    const walletAmount = Math.abs(
      parseFloat(salesSummaryData.walletUsageRevenue)
    ); // Make positive

    console.log("🔍 Debug - Parsed amounts:", {
      totalRevenue,
      cashAmount,
      transferAmount,
      cardAmount,
      foxieAmount,
      walletAmount,
    });

    const methods: PaymentMethod[] = [
      {
        method: "TM+CK+QT",
        amount: cashAmount + transferAmount + cardAmount,
        percentage:
          totalRevenue > 0
            ? Math.round(
                ((cashAmount + transferAmount + cardAmount) / totalRevenue) *
                  100
              )
            : 0,
        transactions: Math.floor(
          (cashAmount + transferAmount + cardAmount) / 100000
        ), // Estimate transactions
      },
      {
        method: "Thanh toán ví",
        amount: walletAmount,
        percentage:
          totalRevenue > 0
            ? Math.round((walletAmount / totalRevenue) * 100)
            : 0,
        transactions: Math.floor(walletAmount / 100000), // Estimate transactions
      },
      {
        method: "Thẻ Foxie",
        amount: foxieAmount,
        percentage:
          totalRevenue > 0 ? Math.round((foxieAmount / totalRevenue) * 100) : 0,
        transactions: Math.floor(foxieAmount / 100000), // Estimate transactions
      },
    ];

    return methods;
  }, [salesSummaryData]);

  console.log("🔍 Debug - paymentMethods:", paymentMethods);
  console.log("🔍 Debug - Using real data:", paymentMethods.length > 0);

  const totalRevenue = paymentMethods.reduce(
    (sum: number, method: PaymentMethod) => sum + method.amount,
    0
  );

  // Default target, can be overridden by user input
  const DEFAULT_MONTH_TARGET = 9750000000;
  
  // User-editable monthly target (stored in localStorage)
  const [userMonthlyTarget, setUserMonthlyTarget] = React.useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kpi_monthly_target');
      return stored ? Number(stored) : null;
    }
    return null;
  });
  
  const COMPANY_MONTH_TARGET = userMonthlyTarget ?? DEFAULT_MONTH_TARGET;

  // Special holiday days (per month) entered by the user, persisted in localStorage
  const currentMonthKeyForHoliday = React.useMemo(() => {
    const now = toDate ? new Date(toDate.split("T")[0]) : new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, [toDate]);

  const [specialHolidays, setSpecialHolidays] = React.useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`kpi_special_holidays_${currentMonthKeyForHoliday}`);
        if (!raw) return [];
        const arr = JSON.parse(raw) as number[];
        return Array.isArray(arr) ? arr.filter((d) => Number.isFinite(d)) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `kpi_special_holidays_${currentMonthKeyForHoliday}`,
        JSON.stringify(specialHolidays)
      );
    }
  }, [specialHolidays, currentMonthKeyForHoliday]);
  const sectionRefs = React.useRef({
    dashboard_total_sale_table: React.createRef<HTMLDivElement>(),
    dashboard_foxie_balance: React.createRef<HTMLDivElement>(),
    dashboard_sales_by_hour: React.createRef<HTMLDivElement>(),
    dashboard_sale_detail: React.createRef<HTMLDivElement>(),
    dashboard_kpi: React.createRef<HTMLDivElement>(),
    dashboard_customer_section: React.createRef<HTMLDivElement>(),
    dashboard_booking_section: React.createRef<HTMLDivElement>(),
    dashboard_service_section: React.createRef<HTMLDivElement>(),
  });
  const normalizeKey = (s: string) => normalize(s).replace(/\s+/g, "");

  const [highlightKey, setHighlightKey] = React.useState<string | null>(null);

  const endDateObj = React.useMemo(() => {
    if (!toDate) return null;
    return new Date(toDate.split("T")[0]);
  }, [toDate]);
  const daysInMonth = endDateObj
    ? new Date(endDateObj.getFullYear(), endDateObj.getMonth() + 1, 0).getDate()
    : 0;
  const lastDay = endDateObj ? endDateObj.getDate() : 0;
  
  // ---------- KPI Ngày: lấy ngày hiện tại (hôm nay) thay vì ngày cuối range ----------
  const today = new Date();
  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;
  const todayDay = today.getDate();
  
  const weekendTargetPerDay = 500000000; // 500M per weekend day
  const holidayTargetPerDay = 600000000; // 600M per special holiday
  const year = endDateObj ? endDateObj.getFullYear() : new Date().getFullYear();
  const month = endDateObj ? endDateObj.getMonth() : new Date().getMonth();
  const holidayDaysSet = new Set<number>(specialHolidays.map((d) => Math.max(1, Math.min(d, daysInMonth))));
  // Count holidays that fall on weekend to avoid double counting
  let holidayDaysCount = 0;
  let weekendDaysCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay();
    const isHoliday = holidayDaysSet.has(day);
    const isWeekend = dow === 0 || dow === 6;
    if (isHoliday) holidayDaysCount++;
    if (isWeekend && !isHoliday) weekendDaysCount++; // weekend but not holiday
  }
  const totalFixedTarget = holidayDaysCount * holidayTargetPerDay + weekendDaysCount * weekendTargetPerDay;
  const weekdayDaysCount = Math.max(0, daysInMonth - holidayDaysCount - weekendDaysCount);
  const weekdayTargetPerDay = weekdayDaysCount > 0 
    ? Math.max(0, (COMPANY_MONTH_TARGET - totalFixedTarget) / weekdayDaysCount) 
    : 0;
  
  // Get target for a specific day
  const getDailyTargetForDay = (day: number): number => {
    if (daysInMonth === 0 || !endDateObj) return 0;
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (holidayDaysSet.has(day)) {
      return holidayTargetPerDay;
    }
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      return weekendTargetPerDay;
    }
    return weekdayTargetPerDay;
  };
  
  const dailyTargetForCurrentDay = todayDay > 0 ? getDailyTargetForDay(todayDay) : 0;
  
  // Calculate target until now (cumulative from day 1 to lastDay)
  const targetUntilNow = React.useMemo(() => {
    if (daysInMonth === 0 || lastDay === 0 || !endDateObj) return 0;
    let sum = 0;
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        sum += weekendTargetPerDay;
      } else {
        sum += weekdayTargetPerDay;
      }
    }
    return sum;
  }, [daysInMonth, lastDay, year, month, weekendTargetPerDay, weekdayTargetPerDay, endDateObj]);

  // Get selected day from date picker (toDate) or use today
  const selectedDay = endDateObj ? endDateObj.getDate() : todayDay;
  const selectedDateStr = toDateStr || todayDateStr;
  
  // Calculate target for selected day (for daily mode)
  const selectedDayTarget = selectedDay > 0 ? getDailyTargetForDay(selectedDay) : 0;
  
  // Khi ở chế độ "Ngày", dùng ngày được chọn từ date picker; khi ở chế độ "Tháng", dùng ngày cuối range
  const dailyKpiDateStr = selectedDateStr;
  const dailyKpiRevenue = actualRevenueToday ?? (
    kpiDailySeries && dailyKpiDateStr
      ? kpiDailySeries.find((e) => e.isoDate === dailyKpiDateStr)?.total || 0
      : 0
  );
  
  // Use selected day target for daily mode, or today's target as fallback
  const dailyTargetForSelectedDay = selectedDayTarget || dailyTargetForCurrentDay;
  
  const dailyPercentage =
    dailyTargetForSelectedDay > 0
      ? (dailyKpiRevenue / dailyTargetForSelectedDay) * 100
      : 0;
  const dailyKpiLeft = Math.max(0, dailyTargetForSelectedDay - dailyKpiRevenue);

  // ---------- KPI Tháng: sum từ ngày 1 đến ngày cuối range ----------
  const currentRevenue = actualRevenueMTD ?? (() => {
    if (!kpiDailySeries || !toDate || !endDateObj) return 0;
    const monthKey = `${endDateObj.getFullYear()}-${String(
      endDateObj.getMonth() + 1
    ).padStart(2, "0")}`;
    let sum = 0;
    for (const e of kpiDailySeries || []) {
      if (e.isoDate.startsWith(monthKey)) {
        const eDay = Number(e.isoDate.split("-")[2]);
        if (eDay <= lastDay) sum += e.total;
      }
    }
    return sum;
  })();
  const currentPercentage =
    targetUntilNow > 0 ? (currentRevenue / targetUntilNow) * 100 : 0;
  const remainingTarget = Math.max(0, targetUntilNow - currentRevenue);

  const dailyKpiGrowthData = React.useMemo(() => {
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    if (!kpiDailySeries) return [];
    
    // Helper to get target for a specific date
    const getTargetForDate = (dateStr: string): number => {
      const [yyyy, mm, dd] = dateStr.split("-");
      const jsDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      const dayOfWeek = jsDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        return weekendTargetPerDay;
      }
      return weekdayTargetPerDay;
    };
    
    return kpiDailySeries.map((d) => {
      const [yyyy, mm, dd] = d.isoDate.split("-");
      const jsDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      const targetForThisDay = getTargetForDate(d.isoDate);
      return {
        day: dayNames[jsDate.getDay()],
        date: d.dateLabel,
        revenue: d.total,
        target: targetForThisDay,
        percentage:
          targetForThisDay > 0
            ? (d.total / targetForThisDay) * 100
            : 0,
        isToday: jsDate.toDateString() === new Date().toDateString(),
      };
    });
  }, [kpiDailySeries, weekendTargetPerDay, weekdayTargetPerDay]);

  // Status logic cho hiển thị trạng thái (dùng selected day target)
  const dailyStatus =
    dailyTargetForSelectedDay === 0
      ? "ontrack"
      : dailyKpiRevenue >= dailyTargetForSelectedDay
      ? dailyKpiRevenue > dailyTargetForSelectedDay * 1.1
        ? "ahead"
        : "ontrack"
      : "behind";
  const monthlyStatus =
    targetUntilNow === 0
      ? "ontrack"
      : currentRevenue >= targetUntilNow
      ? currentRevenue > targetUntilNow * 1.1
        ? "ahead"
        : "ontrack"
      : "behind";

  // -------- Render tách riêng cho Ngày và Tháng --------
  React.useEffect(() => {
    // If navigated here with ?q=, trigger search once
    if (searchParamQuery) {
      const event = new CustomEvent("global-search", {
        detail: { query: searchParamQuery },
      });
      window.dispatchEvent(event);
      // Clean URL param without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      window.history.replaceState({}, "", url.toString());
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { query?: string };
      const q = normalize(detail?.query || "");
      if (!q) return;
      const map = SEARCH_TARGETS.map((t) => ({
        keys: [
          normalizeKey(t.label),
          ...t.keywords.map((k) => normalizeKey(k)),
        ],
        refKey: t.refKey,
      }));
      const found = map.find((m) =>
        m.keys.some((k) => normalizeKey(q).includes(k))
      );
      const allowed = [
        "dashboard_total_sale_table",
        "dashboard_foxie_balance",
        "dashboard_sales_by_hour",
        "dashboard_sale_detail",
        "dashboard_kpi",
        "dashboard_customer_section",
        "dashboard_booking_section",
        "dashboard_service_section",
      ] as const;
      const ref =
        found && (allowed as readonly string[]).includes(found.refKey)
          ? (
              sectionRefs.current as Record<
                string,
                React.RefObject<HTMLDivElement>
              >
            )[found.refKey]
          : null;
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightKey(found!.refKey);
        window.setTimeout(() => setHighlightKey(null), 1200);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("global-search", handler as EventListener);
      // Support anchor hash direct navigation: #refKey
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const target = (
          sectionRefs.current as Record<string, React.RefObject<HTMLDivElement>>
        )[hash];
        if (target?.current) {
          setTimeout(
            () =>
              target.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              }),
            0
          );
        }
      }
      // Listener for direct jump events from header within same route
      const jumpHandler = (ev: Event) => {
        const refKey = (ev as CustomEvent).detail?.refKey as string | undefined;
        if (!refKey) return;
        const target = (
          sectionRefs.current as Record<string, React.RefObject<HTMLDivElement>>
        )[refKey];
        if (target?.current)
          target.current.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      window.addEventListener("jump-to-ref", jumpHandler as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("global-search", handler as EventListener);
        window.removeEventListener("jump-to-ref", (() => {}) as EventListener);
      }
    };
  }, [searchParamQuery]);

  // Monitor API success notifications
  useEffect(() => {
    if (apiSuccesses.length > 0 && !hasShownSuccess.current) {
      const successMessage =
        apiSuccesses.length === 1
          ? apiSuccesses[0]
          : `${apiSuccesses.length} data sources loaded successfully`;

      showSuccess(successMessage);
      hasShownSuccess.current = true;
      reportDataLoadSuccess("dashboard", apiSuccesses.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSuccesses]); // Functions are stable, no need in deps

  // Monitor sales summary success
  useEffect(() => {
    if (
      !salesLoading &&
      !salesError &&
      salesSummaryData &&
      !notifiedDataRef.current.has("sales-summary")
    ) {
      showSuccess("✅ Dữ liệu tổng doanh số đã được tải thành công!");
      notifiedDataRef.current.add("sales-summary");
      reportDataLoadSuccess("sales-summary", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesLoading, salesError, salesSummaryData]); // Functions are stable

  // Monitor API error notifications
  useEffect(() => {
    if (apiErrors.length > 0 && !hasShownError.current) {
      const errorMessage =
        apiErrors.length === 1
          ? apiErrors[0]
          : `${apiErrors.length} data sources failed to load`;

      showError(errorMessage);
      hasShownError.current = true;
      reportDataLoadError("dashboard", errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiErrors]); // Functions are stable

  // Monitor general error
  useEffect(() => {
    if (error && !hasShownError.current) {
      showError(error);
      hasShownError.current = true;
      reportPageError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]); // Functions are stable

  // Monitor sales summary error
  useEffect(() => {
    if (salesError && !hasShownError.current) {
      showError(`Sales data error: ${salesError}`);
      hasShownError.current = true;
      reportPageError(`Lỗi tải dữ liệu sales summary: ${salesError}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesError]); // Functions are stable

  // Watch for auth expiration across all API errors
  useEffect(() => {
    const authErrorTexts = [
      "Authentication failed - please login again",
      "No valid token",
    ];
    const anyAuthError = [
      salesError,
      serviceError,
      bookingError,
      dailyRevenueError,
      kpiMonthlyRevenueError,
      newCustomerError,
    ].some((e) => e && authErrorTexts.some((t) => String(e).includes(t)));
    if (anyAuthError) setAuthExpired(true);
  }, [
    salesError,
    serviceError,
    bookingError,
    dailyRevenueError,
    kpiMonthlyRevenueError,
    newCustomerError,
  ]);

  // Listen to global auth expired event from ApiService
  useEffect(() => {
    const handler = () => setAuthExpired(true);
    if (typeof window !== "undefined") {
      window.addEventListener("auth-expired", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth-expired", handler);
      }
    };
  }, []);

  // Monitor booking data success
  useEffect(() => {
    if (
      !bookingLoading &&
      !bookingError &&
      bookingData &&
      !notifiedDataRef.current.has("booking")
    ) {
      showSuccess("✅ Dữ liệu đặt lịch đã được tải thành công!");
      notifiedDataRef.current.add("booking");
      reportDataLoadSuccess("booking", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingLoading, bookingError, bookingData]); // Functions are stable

  // Monitor KPI data success
  useEffect(() => {
    if (
      !kpiDailySeriesLoading &&
      !kpiMonthlyRevenueLoading &&
      !kpiDailySeriesError &&
      kpiDailySeries &&
      !notifiedDataRef.current.has("kpi")
    ) {
      showSuccess("✅ Dữ liệu KPI đã được tải thành công!");
      notifiedDataRef.current.add("kpi");
      reportDataLoadSuccess("kpi", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    kpiDailySeriesLoading,
    kpiMonthlyRevenueLoading,
    kpiDailySeriesError,
    kpiDailySeries,
  ]); // Functions are stable

  // Monitor customer data success
  useEffect(() => {
    if (
      !newCustomerLoading &&
      !oldCustomerLoading &&
      !newCustomerError &&
      !oldCustomerError &&
      (newCustomerData || oldCustomerData) &&
      !notifiedDataRef.current.has("customer")
    ) {
      showSuccess("✅ Dữ liệu khách hàng đã được tải thành công!");
      notifiedDataRef.current.add("customer");
      reportDataLoadSuccess("customer", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    newCustomerLoading,
    oldCustomerLoading,
    newCustomerError,
    oldCustomerError,
    newCustomerData,
    oldCustomerData,
  ]); // Functions are stable

  // Monitor service data success
  useEffect(() => {
    if (
      !bookingLoading &&
      !serviceError &&
      serviceSummaryData &&
      !notifiedDataRef.current.has("service")
    ) {
      showSuccess("✅ Dữ liệu dịch vụ đã được tải thành công!");
      notifiedDataRef.current.add("service");
      reportDataLoadSuccess("service", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingLoading, serviceError, serviceSummaryData]); // Functions are stable

  // Monitor foxie balance success
  useEffect(() => {
    if (
      !foxieBalanceLoading &&
      !foxieBalanceError &&
      foxieBalanceData &&
      !notifiedDataRef.current.has("foxie-balance")
    ) {
      showSuccess("✅ Dữ liệu số dư Foxie đã được tải thành công!");
      notifiedDataRef.current.add("foxie-balance");
      reportDataLoadSuccess("foxie-balance", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foxieBalanceLoading, foxieBalanceError, foxieBalanceData]); // Functions are stable

  // Monitor sales by hour success
  useEffect(() => {
    if (
      !salesByHourLoading &&
      !salesByHourError &&
      salesByHourData &&
      !notifiedDataRef.current.has("sales-by-hour")
    ) {
      showSuccess("✅ Dữ liệu doanh số theo giờ đã được tải thành công!");
      notifiedDataRef.current.add("sales-by-hour");
      reportDataLoadSuccess("sales-by-hour", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesByHourLoading, salesByHourError, salesByHourData]); // Functions are stable

  // Monitor sales detail success
  useEffect(() => {
    if (
      !salesDetailLoading &&
      !salesDetailError &&
      salesDetailData &&
      !notifiedDataRef.current.has("sales-detail")
    ) {
      showSuccess("✅ Dữ liệu chi tiết doanh số đã được tải thành công!");
      notifiedDataRef.current.add("sales-detail");
      reportDataLoadSuccess("sales-detail", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesDetailLoading, salesDetailError, salesDetailData]); // Functions are stable

  // Monitor booking by hour success
  useEffect(() => {
    if (
      !bookingByHourLoading &&
      !bookingByHourError &&
      bookingByHourData &&
      !notifiedDataRef.current.has("booking-by-hour")
    ) {
      showSuccess("✅ Dữ liệu đặt lịch theo giờ đã được tải thành công!");
      notifiedDataRef.current.add("booking-by-hour");
      reportDataLoadSuccess("booking-by-hour", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingByHourLoading, bookingByHourError, bookingByHourData]); // Functions are stable

  // Monitor booking data error
  useEffect(() => {
    if (bookingError && !hasShownError.current) {
      showError(`Booking data error: ${bookingError}`);
      hasShownError.current = true;
      reportPageError(`Lỗi tải dữ liệu booking: ${bookingError}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingError]); // Functions are stable

  // Report page performance
  useEffect(() => {
    if (!loading) {
      reportPagePerformance({ loadTime: 2000 });
    }
  }, [loading, reportPagePerformance]);

  const isDaily = kpiViewMode === "daily";

  // Sample aggregation ( giả lập, bạn cần thay bằng logic thực tế hoặc gọi API tổng hợp từng tháng )
  const [paymentGrowthByMonth, setPaymentGrowthByMonth] = React.useState<
    Array<{ month: string; tmckqt: number; foxie: number; vi: number }>
  >([]);
  const [loadingGrowth, setLoadingGrowth] = React.useState(true);
  const [compareFromDay, setCompareFromDay] = React.useState(1);
  const [compareToDay, setCompareToDay] = React.useState(31);
  const [compareMonth, setCompareMonth] = React.useState("");
  
  // New mode: 2 separate months with individual day ranges
  const [month1, setMonth1] = React.useState<string>("");
  const [month2, setMonth2] = React.useState<string>("");
  const [month1FromDay, setMonth1FromDay] = React.useState(1);
  const [month1ToDay, setMonth1ToDay] = React.useState(31);
  const [month2FromDay, setMonth2FromDay] = React.useState(1);
  const [month2ToDay, setMonth2ToDay] = React.useState(31);

  // Cache for individual months to avoid re-fetching
  const monthCacheRef = React.useRef<Map<string, {
    data: { month: string; tmckqt: number; foxie: number; vi: number };
    timestamp: number;
  }>>(new Map());

  // Monitor growth by payment success (placed after state declarations)
  useEffect(() => {
    if (
      !loadingGrowth &&
      paymentGrowthByMonth.length > 0 &&
      !notifiedDataRef.current.has("growth-by-payment")
    ) {
      showSuccess("✅ Dữ liệu tăng trưởng thanh toán đã được tải thành công!");
      notifiedDataRef.current.add("growth-by-payment");
      reportDataLoadSuccess("growth-by-payment", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingGrowth, paymentGrowthByMonth]); // Functions are stable

  // Helper function to fetch a single month's data and update state
  const fetchSingleMonth = React.useCallback(async (
    monthKey: string,
    month: string,
    year: number
  ): Promise<{ month: string; tmckqt: number; foxie: number; vi: number }> => {
    // Check cache first
    const cached = monthCacheRef.current.get(monthKey);
    const now = Date.now();
    const cacheDuration = 10 * 60 * 1000; // 10 minutes
    if (cached && now - cached.timestamp < cacheDuration) {
      // Still update state if not already present
      setPaymentGrowthByMonth(prev => {
        if (prev.some(d => d.month === monthKey)) {
          return prev;
        }
        const updated = [...prev, cached.data].sort((a, b) => {
          const [mA, yA] = a.month.split("/").map(Number);
          const [mB, yB] = b.month.split("/").map(Number);
          if (yA !== yB) return yA - yB;
          return mA - mB;
        });
        return updated;
      });
      return cached.data;
    }

    // Fetch from API
    const lastDayOfMonth = new Date(year, Number(month), 0).getDate();
    const startDate = `01/${month}/${year}`;
    const endDate = `${lastDayOfMonth}/${month}/${year}`;

    const parse = (v: string | number | undefined) => {
      if (typeof v === "string") {
        return Number((v || "").replace(/[^\d.-]/g, "")) || 0;
      }
      return Number(v) || 0;
    };

    try {
      console.log(`[Dashboard] Fetching sales data for ${monthKey}:`, { startDate, endDate })
      const res = await ApiService.getDirect(
        `real-time/sales-summary?dateStart=${startDate}&dateEnd=${endDate}`
      );
      console.log(`[Dashboard] Successfully fetched sales data for ${monthKey}`)
      const parsed = res as {
        cash?: string | number;
        transfer?: string | number;
        card?: string | number;
        foxieUsageRevenue?: string | number;
        walletUsageRevenue?: string | number;
      };
      const data = {
        month: monthKey,
        tmckqt: parse(parsed.cash) + parse(parsed.transfer) + parse(parsed.card),
        foxie: Math.abs(parse(parsed.foxieUsageRevenue)),
        vi: Math.abs(parse(parsed.walletUsageRevenue)),
      };

      // Cache the data
      monthCacheRef.current.set(monthKey, {
        data,
        timestamp: Date.now(),
      });

      // Update state if month not already in paymentGrowthByMonth
      setPaymentGrowthByMonth(prev => {
        if (prev.some(d => d.month === monthKey)) {
          return prev; // Already exists
        }
        const updated = [...prev, data].sort((a, b) => {
          const [mA, yA] = a.month.split("/").map(Number);
          const [mB, yB] = b.month.split("/").map(Number);
          if (yA !== yB) return yA - yB;
          return mA - mB;
        });
        return updated;
      });

      return data;
    } catch (err) {
      console.error(`Failed to fetch sales data for ${monthKey}:`, err);
      return {
        month: monthKey,
        tmckqt: 0,
        foxie: 0,
        vi: 0,
      };
    }
  }, []);

  // Fetch only current month and previous month (lazy loading)
  React.useEffect(() => {
    let isSubscribed = true;
    async function fetchInitialMonths() {
      setLoadingGrowth(true);
      const dateNow = new Date();
      
      // Get current month
      const currentMonth = String(dateNow.getMonth() + 1).padStart(2, "0");
      const currentYear = dateNow.getFullYear();
      const currentMonthKey = `${currentMonth}/${currentYear}`;

      // Get previous month
      const prevDate = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1);
      const prevMonth = String(prevDate.getMonth() + 1).padStart(2, "0");
      const prevYear = prevDate.getFullYear();
      const prevMonthKey = `${prevMonth}/${prevYear}`;

      try {
        // Fetch only 2 months in parallel
        const [currentData, prevData] = await Promise.all([
          fetchSingleMonth(currentMonthKey, currentMonth, currentYear),
          fetchSingleMonth(prevMonthKey, prevMonth, prevYear),
        ]);

        if (isSubscribed) {
          const initialData = [prevData, currentData].sort((a, b) => {
            const [mA, yA] = a.month.split("/").map(Number);
            const [mB, yB] = b.month.split("/").map(Number);
            if (yA !== yB) return yA - yB;
            return mA - mB;
          });
          
          setPaymentGrowthByMonth(initialData);
          setCompareMonth(prevMonthKey); // Set default compare month to previous month
          setLoadingGrowth(false);
        }
      } catch (err) {
        console.error("Failed to fetch initial months:", err);
        if (isSubscribed) setLoadingGrowth(false);
      }
    }
    fetchInitialMonths();
    return () => {
      isSubscribed = false;
    };
  }, [fetchSingleMonth]);

  return (
    <div className="p-3 sm:p-6">
      {/* Notification Component */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {authExpired && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md text-center">
            <div className="text-xl font-semibold text-[#334862] mb-2">
              Hết phiên đăng nhập
            </div>
            <div className="text-sm text-gray-600 mb-6">
              Cần đăng nhập lại để tiếp tục sử dụng hệ thống.
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => setAuthExpired(false)}
              >
                Để sau
              </button>
              <a
                href="/login"
                className="px-4 py-2 rounded-md bg-[#f16a3f] hover:bg-[#e55a2b] text-white"
              >
                Đăng nhập lại
              </a>
            </div>
          </div>
        </div>
      )}

      <div
        className="mb-3 sm:mb-6"
        ref={sectionRefs.current.dashboard_total_sale_table}
      >
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
          Dashboard
        </h1>

        <p className="text-gray-600 flex flex-wrap items-center gap-[3px] text-sm sm:text-base">
          Welcome back! Here&apos;s what&apos;s happening with{" "}
          <span className="text-orange-500 flex">Face Wash Fox</span> today.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        }
      >
        <QuickActions />
      </Suspense>

      {/* Top Sale Chart */}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance ">
              Dashboard Quản Lý Kinh Doanh
            </h1>
          </div>
        </div>

        {/* DOANH SỐ SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-[#f16a3f]" />
            <h2 className="text-2xl font-bold text-[#334862]">Doanh Số</h2>
          </div>

          {/* KPI Chart */}
          <div
            ref={sectionRefs.current.dashboard_kpi}
            className={
              highlightKey === "dashboard_kpi"
                ? "ring-2 ring-[#41d1d9] rounded-lg"
                : ""
            }
          >
            <LazyLoadingWrapper type="chart" minHeight="400px">
              {/* Always show KPIChart - let it handle its own loading states internally */}
              <KPIChart
                kpiDailySeriesLoading={kpiDailySeriesLoading}
                kpiDailySeriesError={kpiDailySeriesError}
                dailyKpiGrowthData={dailyKpiGrowthData}
                kpiViewMode={kpiViewMode}
                setKpiViewMode={setKpiViewMode}
                currentDayForDaily={isDaily ? selectedDay : lastDay}
                currentPercentage={isDaily ? dailyPercentage : currentPercentage}
                dailyPercentageForCurrentDay={
                  isDaily ? dailyPercentage : currentPercentage
                }
                kpiMonthlyRevenueLoading={kpiMonthlyRevenueLoading}
                dailyRevenueLoading={dailyRevenueLoading}
                targetStatus={isDaily ? dailyStatus : monthlyStatus}
                monthlyTarget={COMPANY_MONTH_TARGET} // đây là Mục tiêu tháng này - có thể chỉnh sửa
                onMonthlyTargetChange={(target) => {
                  setUserMonthlyTarget(target);
                  localStorage.setItem('kpi_monthly_target', target.toString());
                }}
                specialHolidays={specialHolidays}
                onSpecialHolidaysChange={(days) => setSpecialHolidays(days)}
                dailyTargetForCurrentDay={isDaily ? dailyTargetForSelectedDay : dailyTargetForCurrentDay}
                dailyTargetForToday={
                  isDaily ? dailyTargetForSelectedDay : targetUntilNow
                } // Đến nay cần đạt: ngày hoặc tháng
                remainingTarget={isDaily ? dailyKpiLeft : remainingTarget}
                remainingDailyTarget={isDaily ? dailyKpiLeft : remainingTarget}
                dailyTargetPercentageForCurrentDay={100.0}
                currentRevenue={isDaily ? dailyKpiRevenue : currentRevenue}
              />
            </LazyLoadingWrapper>
          </div>

          {/* Bảng Tổng Doanh Số */}
          <LazyLoadingWrapper type="table" minHeight="300px">
            <ConditionalRender
              loading={salesLoading}
              error={salesError}
              data={salesSummaryData}
              fallback={
                <div className="border-[#f16a3f]/20 shadow-lg bg-gradient-to-r from-white to-[#f16a3f]/5 rounded-lg p-4 sm:p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="hidden sm:grid grid-cols-12 gap-4 p-3 bg-gradient-to-r from-[#7bdcb5]/20 to-[#00d084]/20 rounded-lg font-semibold text-sm mb-3">
                    <div className="col-span-4 h-4 bg-gray-200 rounded" />
                    <div className="col-span-3 h-4 bg-gray-200 rounded" />
                    <div className="col-span-3 h-4 bg-gray-200 rounded" />
                    <div className="col-span-2 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-[#f16a3f]/10 rounded-lg p-3"
                      >
                        <div className="hidden sm:grid grid-cols-12 gap-4">
                          <div className="col-span-4 h-4 bg-gray-200 rounded" />
                          <div className="col-span-3 h-4 bg-gray-200 rounded" />
                          <div className="col-span-3 h-4 bg-gray-200 rounded" />
                          <div className="col-span-2 h-4 bg-gray-200 rounded" />
                        </div>
                        <div className="sm:hidden space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="h-4 w-28 bg-gray-200 rounded" />
                            <div className="h-4 w-10 bg-gray-200 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="h-4 w-12 bg-gray-200 rounded" />
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#f16a3f] rounded-lg mt-3">
                    <div className="hidden sm:grid grid-cols-12 gap-4 p-3">
                      <div className="col-span-4 h-5 bg-white/40 rounded" />
                      <div className="col-span-3 h-5 bg-white/40 rounded" />
                      <div className="col-span-3 h-5 bg-white/40 rounded" />
                      <div className="col-span-2 h-5 bg-white/40 rounded" />
                    </div>
                    <div className="sm:hidden p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-28 bg-white/40 rounded" />
                        <div className="h-4 w-12 bg-white/40 rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-10 bg-white/40 rounded" />
                        <div className="h-4 w-24 bg-white/40 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <TotalSaleTable
                allPaymentMethods={paymentMethods}
                totalRevenue={totalRevenue}
              />
            </ConditionalRender>
          </LazyLoadingWrapper>

          {/* Growth By Payment Chart */}
          <LazyLoadingWrapper type="chart" minHeight="450px">
            {loadingGrowth ? (
              <div className="w-full flex justify-center items-center min-h-[450px] rounded-lg bg-gray-50 text-[#41d1d9] text-lg font-semibold">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#41d1d9]"></div>
                  <span>Đang tải dữ liệu tăng trưởng...</span>
                </div>
              </div>
            ) : paymentGrowthByMonth.length === 0 ? (
              <div className="w-full flex justify-center items-center min-h-[450px] rounded-lg bg-gray-50 text-gray-600">
                Không có dữ liệu để hiển thị
              </div>
            ) : (
              <GrowthByPaymentChart
                data={paymentGrowthByMonth}
                compareFromDay={compareFromDay}
                compareToDay={compareToDay}
                compareMonth={compareMonth}
                setCompareFromDay={setCompareFromDay}
                setCompareToDay={setCompareToDay}
                setCompareMonth={setCompareMonth}
                onMonthSelect={fetchSingleMonth}
                // New mode props
                month1={month1}
                month2={month2}
                month1FromDay={month1FromDay}
                month1ToDay={month1ToDay}
                month2FromDay={month2FromDay}
                month2ToDay={month2ToDay}
                setMonth1={setMonth1}
                setMonth2={setMonth2}
                setMonth1FromDay={setMonth1FromDay}
                setMonth1ToDay={setMonth1ToDay}
                setMonth2FromDay={setMonth2FromDay}
                setMonth2ToDay={setMonth2ToDay}
              />
            )}
          </LazyLoadingWrapper>
        </div>

          {/* FOXIE BALANCE SECTION */}
          <div
            ref={sectionRefs.current.dashboard_foxie_balance}
            className={
              highlightKey === "dashboard_foxie_balance"
                ? "ring-2 ring-[#41d1d9] rounded-lg"
                : ""
            }
          >
            <LazyLoadingWrapper type="table" minHeight="200px">
              <ConditionalRender
                loading={foxieBalanceLoading}
                error={foxieBalanceError}
                data={foxieBalanceData}
              >
                <FoxieBalanceTable
                  foxieBalanceLoading={foxieBalanceLoading}
                  foxieBalanceError={foxieBalanceError}
                  foxieBalanceData={foxieBalanceData}
                />
              </ConditionalRender>
            </LazyLoadingWrapper>
          </div>

          {/* CHI TIẾT DOANH THU SECTION */}
          <div
            ref={sectionRefs.current.dashboard_sale_detail}
            className={
              highlightKey === "dashboard_sale_detail"
                ? "ring-2 ring-[#41d1d9] rounded-lg"
                : ""
            }
          >
            <LazyLoadingWrapper type="table" minHeight="300px">
              <ConditionalRender
                loading={salesDetailLoading}
                error={salesDetailError}
                data={salesDetailData}
              >
                <SaleDetail
                  salesDetailLoading={salesDetailLoading}
                  salesDetailError={salesDetailError}
                  salesDetailData={salesDetailData}
                />
              </ConditionalRender>
            </LazyLoadingWrapper>
          </div>

          {/* SALES BY HOUR SECTION */}
          <div
            ref={sectionRefs.current.dashboard_sales_by_hour}
            className={
              highlightKey === "dashboard_sales_by_hour"
                ? "ring-2 ring-[#41d1d9] rounded-lg"
                : ""
            }
          >
            <LazyLoadingWrapper type="table" minHeight="300px">
              <ConditionalRender
                loading={salesByHourLoading}
                error={salesByHourError}
                data={salesByHourData}
              >
                <SalesByHourTable
                  salesByHourLoading={salesByHourLoading}
                  salesByHourError={salesByHourError}
                  salesByHourData={salesByHourData}
                />
              </ConditionalRender>
            </LazyLoadingWrapper>
          </div>

          {/* Revenue Charts */}
          {/* <RevenueChart
            showTopRanking={showTopRanking}
            setShowTopRanking={setShowTopRanking}
            rankingData={getRankingChartData()}
            showTopFoxieRanking={showTopFoxieRanking}
            setShowTopFoxieRanking={setShowTopFoxieRanking}
            foxieRankingData={getFoxieRankingChartData()}
          /> */}

          {/* Service & Foxie Cards */}
          {/* <PercentChart
            productDataByDistrict={productDataByDistrict}
            foxieCardDataByDistrict={foxieCardDataByDistrict}
            serviceDataByDistrict={serviceDataByDistrict}
          /> */}


        {/* KHÁCH HÀNG SECTION */}
        <div
          ref={sectionRefs.current.dashboard_customer_section}
          className={
            highlightKey === "dashboard_customer_section"
              ? "ring-2 ring-[#41d1d9] rounded-lg"
              : ""
          }
        >
          <LazyLoadingWrapper type="section" minHeight="400px">
            <ConditionalRender
              loading={newCustomerLoading || oldCustomerLoading}
              error={newCustomerError || oldCustomerError}
              data={(newCustomerData || oldCustomerData) ? { newCustomerData, oldCustomerData } : null}
            >
              <CustomerSection
                newCustomerLoading={newCustomerLoading}
                newCustomerError={newCustomerError}
                newCustomerTotal={newCustomerTotal}
                newCustomerPieData={newCustomerPieData}
                oldCustomerLoading={oldCustomerLoading}
                oldCustomerError={oldCustomerError}
                oldCustomerTotal={oldCustomerTotal}
                oldCustomerPieData={oldCustomerPieData}
              />
            </ConditionalRender>
          </LazyLoadingWrapper>
        </div>

        {/* ĐẶT LỊCH SECTION */}
        <div
          ref={sectionRefs.current.dashboard_booking_section}
          className={
            highlightKey === "dashboard_booking_section"
              ? "ring-2 ring-[#41d1d9] rounded-lg"
              : ""
          }
        >
          <LazyLoadingWrapper type="section" minHeight="300px">
            <ConditionalRender
              loading={bookingLoading}
              error={bookingError}
              data={bookingData}
            >
              <BookingSection
                bookingLoading={bookingLoading}
                bookingError={bookingError}
                bookingData={bookingData}
              />
            </ConditionalRender>
          </LazyLoadingWrapper>
        </div>

         {/* BOOKING BY HOUR CHART */}
         <LazyLoadingWrapper type="chart" minHeight="300px">
           <ConditionalRender
             loading={bookingByHourLoading}
             error={bookingByHourError}
             data={bookingByHourData}
           >
             <BookingByHourChart loading={bookingByHourLoading} error={bookingByHourError} data={bookingByHourData} />
           </ConditionalRender>
         </LazyLoadingWrapper>

        {/* DỊCH VỤ SECTION */}
        <div
          ref={sectionRefs.current.dashboard_service_section}
          className={
            highlightKey === "dashboard_service_section"
              ? "ring-2 ring-[#41d1d9] rounded-lg"
              : ""
          }
        >
          <LazyLoadingWrapper type="section" minHeight="400px">
            <ConditionalRender
              loading={bookingLoading || !serviceSummaryData}
              error={bookingError || serviceError}
              data={serviceSummaryData || bookingData}
            >
              <ServiceSection
                bookingLoading={bookingLoading}
                bookingError={bookingError}
                bookingData={bookingData}
                serviceSummaryData={serviceSummaryData}
              />
            </ConditionalRender>
          </LazyLoadingWrapper>
        </div>

       
      </div>
    </div>
  );
}

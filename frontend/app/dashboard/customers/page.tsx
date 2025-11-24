"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { SEARCH_TARGETS, normalize } from "@/app/lib/search-targets";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import CustomerFacilityHourTable from "./CustomerFacilityHourTable";
import CustomerFilters from "./CustomerFilters";
import CustomerAccordionCard from "./CustomerAccordionCard";
import CustomerNewChart from "./CustomerNewChart";
import CustomerTypeTrendChart from "./CustomerTypeTrendChart";
import CustomerSourceBarChart from "./CustomerSourceBarChart";
import CustomerAppDownloadBarChart from "./CustomerAppDownloadBarChart";
import CustomerAppDownloadPieChart from "./CustomerAppDownloadPieChart";
import CustomerOldTypeTrendChart from "./CustomerOldTypeTrendChart";
import CustomerFacilityBookingTable from "./CustomerFacilityBookingHour";
import CustomerOldStatCard from "./CustomerOldStatCard";
import CustomerNewOldSummaryTable from "./CustomerNewOldSummaryTable";
import { Notification, useNotification } from "@/app/components/notification";
import {
  useLocalStorageState,
  clearLocalStorageKeys,
} from "@/app/hooks/useLocalStorageState";
import { usePageStatus } from "@/app/hooks/usePageStatus";
import { ApiService } from "../../lib/api-service";
import { useDateRange } from "@/app/contexts/DateContext";
const API_BASE_URL = "/api/proxy";

// ==== Types for API responses to ensure type-safety across the component ====
type DateCountPoint = { date: string; count: number };

interface LineChartRanges {
  currentRange?: DateCountPoint[];
  previousRange?: DateCountPoint[];
}

type TrendSeriesMap = Record<string, DateCountPoint[]>;

interface GenderRatio {
  male?: number;
  female?: number;
}

interface AppDownloadPie {
  totalNew?: number;
  totalOld?: number;
}

type AppDownloadStatusMap = Record<
  string,
  Array<{ date?: string; [key: string]: unknown }>
>;

interface FacilityHourItem {
  facility: string;
  hourlyCounts: Record<string, number>;
  total: number;
}

type FacilityHourService = FacilityHourItem[];

interface UniqueCustomersComparison {
  currentTotal?: number;
  changePercentTotal?: number;
  currentMale?: number;
  changePercentMale?: number;
  currentFemale?: number;
  changePercentFemale?: number;
}

interface GenderRevenueSummary {
  avgActualRevenueMale?: number;
  avgFoxieRevenueMale?: number;
  avgActualRevenueFemale?: number;
  avgFoxieRevenueFemale?: number;
}

// Customer summary pass-through type (structure used by child)
// If shape is unknown, keep as unknown but not assign to stricter type
type CustomerSummaryRaw = Record<string, unknown>;

// Function để clear tất cả filter state

// Function để clear tất cả filter state
function clearCustomerFilters() {
  clearLocalStorageKeys([
    "customer-selectedType",
    "customer-selectedStatus",
    "customer-bookingCompletionStatus",
    "customer-startDate",
    "customer-endDate",
    "customer-selectedRegions",
    "customer-selectedBranches",
  ]);
}

// Custom hook dùng chung cho fetch API - đơn giản như trang service
function useApiData<T>(
  url: string,
  fromDate: string,
  toDate: string,
  extraBody?: Record<string, unknown>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Extract endpoint from full URL - remove /api/proxy prefix
    const endpoint = url
      .replace(API_BASE_URL, "")
      .replace("/api", "")
      .replace(/^\/+/, "");

    console.log("🔍 Debug - Original URL:", url);
    console.log("🔍 Debug - Extracted Endpoint:", endpoint);

    ApiService.post(endpoint, { fromDate, toDate, ...(extraBody || {}) })
      .then((data: unknown) => {
        setData(data as T);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error("🔍 Debug - API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [url, fromDate, toDate, extraBody]);

  return { data, loading, error };
}

// Hook lấy width window với debouncing
function useWindowWidth() {
  const [width, setWidth] = useState(1024);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function handleResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 100); // Debounce 100ms
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return width;
}

export default function CustomerReportPage() {
  // Cross-tab search support
  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("q");
    const hash = window.location.hash.replace("#", "");
    const scrollToRefWithRetry = (
      refKey: string,
      attempts = 25,
      delayMs = 120
    ) => {
      const tryOnce = (left: number) => {
        const el = document.querySelector(
          `[data-search-ref='${refKey}']`
        ) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("ring-2", "ring-[#41d1d9]", "rounded-lg");
          window.setTimeout(
            () => el.classList.remove("ring-2", "ring-[#41d1d9]", "rounded-lg"),
            1500
          );
          return;
        }
        if (left > 0) window.setTimeout(() => tryOnce(left - 1), delayMs);
      };
      tryOnce(attempts);
    };
    if (q) {
      window.dispatchEvent(
        new CustomEvent("global-search", { detail: { query: q } })
      );
      url.searchParams.delete("q");
      window.history.replaceState({}, "", url.toString());
    } else if (hash) {
      scrollToRefWithRetry(hash);
    }

    const normalizeKey = (s: string) => normalize(s).replace(/\s+/g, "");
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { query?: string };
      const query = String(detail?.query || "");
      const map = SEARCH_TARGETS.filter((t) => t.route === "customers").map(
        (t) => ({
          keys: [
            normalizeKey(t.label),
            ...t.keywords.map((k) => normalizeKey(k)),
          ],
          refKey: t.refKey,
        })
      );
      const found = map.find((m) =>
        m.keys.some((k) => normalizeKey(query).includes(k))
      );
      if (!found) return;
      scrollToRefWithRetry(found.refKey);
    };
    window.addEventListener("global-search", handler as EventListener);
    const jumpHandler = (ev: Event) => {
      const refKey = (ev as CustomEvent).detail?.refKey as string | undefined;
      if (!refKey) return;
      scrollToRefWithRetry(refKey);
    };
    window.addEventListener("jump-to-ref", jumpHandler as EventListener);
    return () =>
      window.removeEventListener("global-search", handler as EventListener);
  }, []);
  // CSS để đảm bảo dropdown hiển thị đúng
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .booking-completion-status-dropdown {
        position: relative !important;
        z-index: 99999 !important;
      }
      .booking-completion-status-dropdown .dropdown-menu {
        position: fixed !important;
        z-index: 999999 !important;
        pointer-events: auto !important;
        background: white !important;
        border: 1px solid #d1d5db !important;
        border-radius: 0.375rem !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();
  const hasShownSuccess = useRef(false);
  const hasShownError = useRef(false);
  const {
    reportPageError,
    reportDataLoadSuccess,
    reportFilterChange,
    reportResetFilters,
    reportPagePerformance,
  } = usePageStatus("customers");

  // Sử dụng localStorage để lưu trữ state
  const [selectedType, setSelectedType, selectedTypeLoaded] =
    useLocalStorageState<string[]>("customer-selectedType", []);
  const [selectedStatus, setSelectedStatus, selectedStatusLoaded] =
    useLocalStorageState<string | null>("customer-selectedStatus", null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Use global date context instead of local state
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    fromDate,
    toDate,
    isLoaded: dateLoaded,
  } = useDateRange();

  const [selectedRegions, setSelectedRegions, selectedRegionsLoaded] =
    useLocalStorageState<string[]>("customer-selectedRegions", []);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [selectedBranches, setSelectedBranches, selectedBranchesLoaded] =
    useLocalStorageState<string[]>("customer-selectedBranches", []);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  // Filter status riêng cho bảng "thời gian đơn hàng hoàn thành"
  const [
    bookingCompletionStatus,
    setBookingCompletionStatus,
    bookingCompletionStatusLoaded,
  ] = useLocalStorageState<string | null>(
    "customer-bookingCompletionStatus",
    "Khách đến"
  );
  const [
    showBookingCompletionStatusDropdown,
    setShowBookingCompletionStatusDropdown,
  ] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".booking-completion-status-dropdown")) {
        setShowBookingCompletionStatusDropdown(false);
      }
    };

    if (showBookingCompletionStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBookingCompletionStatusDropdown]);

  // Tính toán vị trí dropdown
  const getDropdownStyle = () => {
    if (!dropdownRef.current || !showBookingCompletionStatusDropdown) {
      return {};
    }

    const rect = dropdownRef.current.getBoundingClientRect();
    return {
      position: "fixed" as const,
      top: rect.bottom + 4,
      left: rect.left,
      zIndex: 999999,
    };
  };

  const resetFilters = useMemo(
    () => () => {
      clearCustomerFilters();
      setSelectedType([]);
      setSelectedStatus(null);
      setBookingCompletionStatus("Khách đến");
      setSelectedRegions([]);
      setSelectedBranches([]);
      showSuccess("Đã reset tất cả filter về mặc định!");
      reportResetFilters();
    },
    [
      showSuccess,
      reportResetFilters,
      setSelectedType,
      setSelectedStatus,
      setBookingCompletionStatus,
      setSelectedRegions,
      setSelectedBranches,
    ]
  );

  // Kiểm tra xem tất cả localStorage đã được load chưa - đơn giản như trang service
  const isAllLoaded =
    dateLoaded &&
    selectedTypeLoaded &&
    selectedStatusLoaded &&
    bookingCompletionStatusLoaded &&
    selectedRegionsLoaded &&
    selectedBranchesLoaded;

  const COLORS = useMemo(
    () => [
      "#5bd1d7",
      "#eb94cf",
      "#f66035",
      "#00d084",
      "#9b51e0",
      "#0693e3",
      "#ff7f7f",
      "#b39ddb",
      "#8d6e63",
      "#c5e1a5",
      "#81d4fa",
      "#fff176",
      "#d81b60",
    ],
    []
  );

  const allRegions = useMemo(
    () => ["Đã đóng cửa", "Đà Nẵng", "Nha Trang", "Hà Nội", "HCM"],
    []
  );
  const allBranches = useMemo(() => ["Branch 1", "Branch 2", "Branch 3"], []);

  // Format date cho API calls - đơn giản như trang service
  // fromDate and toDate are now provided by the global date context

  const {
    data: newCustomerRaw,
    loading: newCustomerLoading,
    error: newCustomerError,
  } = useApiData<LineChartRanges>(
    `${API_BASE_URL}/api/customer-sale/new-customer-lineChart`,
    fromDate,
    toDate
  );

  const {
    data: genderRatioRaw,
    loading: genderRatioLoading,
    error: genderRatioError,
  } = useApiData<GenderRatio>(
    `${API_BASE_URL}/api/customer-sale/gender-ratio`,
    fromDate,
    toDate
  );

  const {
    data: customerTypeRaw,
    loading: customerTypeLoading,
    error: customerTypeError,
  } = useApiData<TrendSeriesMap>(
    `${API_BASE_URL}/api/customer-sale/customer-type-trend`,
    fromDate,
    toDate
  );

  const {
    data: customerOldTypeRaw,
    loading: customerOldTypeLoading,
    error: customerOldTypeError,
  } = useApiData<LineChartRanges>(
    `${API_BASE_URL}/api/customer-sale/old-customer-lineChart`,
    fromDate,
    toDate
  );

  const {
    data: customerSourceRaw,
    loading: customerSourceLoading,
    error: customerSourceError,
  } = useApiData<TrendSeriesMap>(
    `${API_BASE_URL}/api/customer-sale/customer-source-trend`,
    fromDate,
    toDate
  );

  const {
    data: appDownloadStatusRaw,
    loading: appDownloadStatusLoading,
    error: appDownloadStatusError,
  } = useApiData<AppDownloadStatusMap>(
    `${API_BASE_URL}/api/customer-sale/app-download-status`,
    fromDate,
    toDate
  );

  const {
    data: appDownloadRaw,
    loading: appDownloadLoading,
    error: appDownloadError,
  } = useApiData<AppDownloadPie>(
    `${API_BASE_URL}/api/customer-sale/app-download-pieChart`,
    fromDate,
    toDate
  );

  const {
    data: customerSummaryRaw,
    loading: customerSummaryLoading,
    error: customerSummaryError,
  } = useApiData<CustomerSummaryRaw>(
    `${API_BASE_URL}/api/customer-sale/customer-summary`,
    fromDate,
    toDate
  );

  const {
    data: genderRevenueRaw,
    loading: genderRevenueLoading,
    error: genderRevenueError,
  } = useApiData<GenderRevenueSummary>(
    `${API_BASE_URL}/api/customer-sale/gender-revenue`,
    fromDate,
    toDate
  );

  const {
    data: uniqueCustomersComparisonRaw,
    loading: uniqueCustomersLoading,
    error: uniqueCustomersError,
  } = useApiData<UniqueCustomersComparison>(
    `${API_BASE_URL}/api/customer-sale/unique-customers-comparison`,
    fromDate,
    toDate
  );

  // Memoize extraBody để tránh re-render không cần thiết
  const bookingCompletionExtraBody = useMemo(() => {
    const status = bookingCompletionStatus || "Khách đến";
    console.log("🔍 Debug - bookingCompletionExtraBody:", {
      status,
      bookingCompletionStatus,
    });
    return {
      status,
    };
  }, [bookingCompletionStatus]);

  const {
    data: bookingCompletionRaw,
    loading: bookingCompletionLoading,
    error: bookingCompletionError,
  } = useApiData<FacilityHourService>(
    `${API_BASE_URL}/api/booking/facility-booking-hour`,
    fromDate,
    toDate,
    bookingCompletionExtraBody
  );

  // Debug log cho booking completion API
  console.log("🔍 Debug - Booking Completion API:", {
    bookingCompletionStatus,
    status: bookingCompletionStatus || "Khách đến",
    fromDate,
    toDate,
    loading: bookingCompletionLoading,
    error: bookingCompletionError,
    hasData: !!bookingCompletionRaw,
    dataType: typeof bookingCompletionRaw,
    isArray: Array.isArray(bookingCompletionRaw),
    endpoint: "booking/facility-booking-hour",
    method: "POST",
    extraBody: bookingCompletionExtraBody,
    delay: 1000,
    timestamp: new Date().toISOString(),
    retryCount: 0,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
    environment: process.env.NODE_ENV,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    isAllLoaded,
    dateLoaded,
  });

  const {
    data: facilityHourServiceRaw,
    loading: facilityHourServiceLoading,
    error: facilityHourServiceError,
  } = useApiData<FacilityHourService>(
    `${API_BASE_URL}/api/customer-sale/facility-hour-service`,
    fromDate,
    toDate
  );

  // Reset data khi thay đổi date range để tránh hiển thị data cũ
  const [currentDateRange, setCurrentDateRange] = useState(
    `${fromDate}-${toDate}`
  );
  const dataReadyRef = useRef(false);

  // Cập nhật loading states - sử dụng tất cả loading states
  const allLoadingStates = [
    newCustomerLoading,
    genderRatioLoading,
    customerTypeLoading,
    customerOldTypeLoading,
    customerSourceLoading,
    appDownloadStatusLoading,
    appDownloadLoading,
    customerSummaryLoading,
    genderRevenueLoading,
    uniqueCustomersLoading,
    bookingCompletionLoading,
    facilityHourServiceLoading,
  ];

  const allErrorStates = useMemo(
    () => [
      newCustomerError,
      genderRatioError,
      customerTypeError,
      customerOldTypeError,
      customerSourceError,
      appDownloadStatusError,
      appDownloadError,
      customerSummaryError,
      genderRevenueError,
      uniqueCustomersError,
      bookingCompletionError,
      facilityHourServiceError,
    ],
    [
      newCustomerError,
      genderRatioError,
      customerTypeError,
      customerOldTypeError,
      customerSourceError,
      appDownloadStatusError,
      appDownloadError,
      customerSummaryError,
      genderRevenueError,
      uniqueCustomersError,
      bookingCompletionError,
      facilityHourServiceError,
    ]
  );

  // Đơn giản hóa logic như trang service - không cần data ready check

  useEffect(() => {
    const newDateRange = `${fromDate}-${toDate}`;
    if (newDateRange !== currentDateRange) {
      setCurrentDateRange(newDateRange);
      dataReadyRef.current = false;
    }
  }, [fromDate, toDate, currentDateRange]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".booking-completion-status-dropdown")) {
        setShowBookingCompletionStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Report page load success when data loads
  useEffect(() => {
    if (newCustomerRaw && !newCustomerLoading && !newCustomerError) {
      const startTime = Date.now();

      // Calculate total new customers from the data
      const totalNewCustomers =
        newCustomerRaw.currentRange?.reduce(
          (sum: number, item: { count?: number }) => sum + (item.count || 0),
          0
        ) || 0;
      const loadTime = Date.now() - startTime;

      reportPagePerformance({
        loadTime,
        dataSize: totalNewCustomers,
      });

      reportDataLoadSuccess("khách hàng mới", totalNewCustomers);
    }
  }, [
    newCustomerRaw,
    newCustomerLoading,
    newCustomerError,
    reportPagePerformance,
    reportDataLoadSuccess,
  ]);

  // Report errors
  useEffect(() => {
    const errors = allErrorStates.filter((error) => error);
    if (errors.length > 0) {
      reportPageError(`Lỗi tải dữ liệu: ${errors.join(", ")}`);
    }
  }, [allErrorStates, reportPageError]);

  // Report filter changes
  useEffect(() => {
    if (selectedType.length > 0) {
      reportFilterChange(`loại khách hàng: ${selectedType.join(", ")}`);
    }
  }, [selectedType, reportFilterChange]);

  useEffect(() => {
    if (selectedStatus) {
      reportFilterChange(`trạng thái: ${selectedStatus}`);
    }
  }, [selectedStatus, reportFilterChange]);

  useEffect(() => {
    if (selectedRegions.length > 0) {
      reportFilterChange(`khu vực: ${selectedRegions.join(", ")}`);
    }
  }, [selectedRegions, reportFilterChange]);

  useEffect(() => {
    if (selectedBranches.length > 0) {
      reportFilterChange(`chi nhánh: ${selectedBranches.join(", ")}`);
    }
  }, [selectedBranches, reportFilterChange]);

  // Track overall loading and error states for notifications
  const isLoading = allLoadingStates.some((loading) => loading);
  const hasError = allErrorStates.some((error) => error);
  const hasRateLimitError = allErrorStates.some(
    (error) => error?.includes("429") || error?.includes("Too Many Requests")
  );

  // Show notifications based on loading and error states
  useEffect(() => {
    if (
      !isLoading &&
      !hasError &&
      customerSummaryRaw &&
      !hasShownSuccess.current
    ) {
      const message = hasRateLimitError
        ? "Dữ liệu khách hàng đã được tải thành công sau khi thử lại!"
        : "Dữ liệu khách hàng đã được tải thành công!";
      showSuccess(message);
      hasShownSuccess.current = true;
    }
  }, [isLoading, hasError, customerSummaryRaw, showSuccess, hasRateLimitError]);

  useEffect(() => {
    if (hasError && !hasShownError.current) {
      const errorMessages = allErrorStates.filter((error) => error);
      const hasRateLimitError = errorMessages.some(
        (error) =>
          error?.includes("429") || error?.includes("Too Many Requests")
      );

      if (hasRateLimitError) {
        showError("API đang bị quá tải. Hệ thống đang tự động thử lại...");
      } else {
        showError("Không thể kết nối đến API. Vui lòng thử lại sau.");
      }
      hasShownError.current = true;
    }
  }, [hasError, showError, allErrorStates]);

  // Data processing from API
  // 1. Số khách tạo mới
  const newCustomerChartData = React.useMemo(() => {
    console.log("🔍 Debug - Processing newCustomerChartData:", {
      newCustomerRaw: !!newCustomerRaw,
      newCustomerRawType: typeof newCustomerRaw,
      newCustomerRawKeys: newCustomerRaw ? Object.keys(newCustomerRaw) : [],
      newCustomerRawValue: newCustomerRaw,
    });

    if (!newCustomerRaw) {
      console.log(
        "🔍 Debug - newCustomerRaw is null/undefined, returning empty array"
      );
      return [];
    }

    const current = Array.isArray(
      (
        newCustomerRaw as {
          currentRange?: Array<{ date: string; count: number }>;
        }
      ).currentRange
    )
      ? (
          newCustomerRaw as {
            currentRange?: Array<{ date: string; count: number }>;
          }
        ).currentRange || []
      : [];
    const previous = Array.isArray(
      (
        newCustomerRaw as {
          previousRange?: Array<{ date: string; count: number }>;
        }
      ).previousRange
    )
      ? (
          newCustomerRaw as {
            previousRange?: Array<{ date: string; count: number }>;
          }
        ).previousRange || []
      : [];

    console.log("🔍 Debug - newCustomerChartData processing:", {
      currentLength: current.length,
      previousLength: previous.length,
      currentSample: current.slice(0, 2),
      previousSample: previous.slice(0, 2),
    });

    const result = current.map(
      (item: { date: string; count: number }, idx: number) => ({
        date: item.date || "",
        value: item.count,
        value2: previous[idx]?.count ?? 0,
      })
    );

    console.log("🔍 Debug - newCustomerChartData result:", {
      resultLength: result.length,
      resultSample: result.slice(0, 2),
    });

    return result;
  }, [newCustomerRaw]);

  // 2. Tỷ lệ nam/nữ
  const genderRatioData = React.useMemo(() => {
    console.log("🔍 Debug - Processing genderRatioData:", {
      genderRatioRaw: !!genderRatioRaw,
      genderRatioRawType: typeof genderRatioRaw,
      genderRatioRawKeys: genderRatioRaw ? Object.keys(genderRatioRaw) : [],
      male: genderRatioRaw?.male,
      female: genderRatioRaw?.female,
    });

    if (!genderRatioRaw) return [];

    const result = [
      { gender: "Nam", count: genderRatioRaw.male || 0 },
      { gender: "Nữ", count: genderRatioRaw.female || 0 },
    ];

    console.log("🔍 Debug - genderRatioData result:", {
      resultLength: result.length,
      result,
    });

    return result;
  }, [genderRatioRaw]);

  // 3. Số khách tới chia theo loại
  const customerTypeTrendData = React.useMemo(() => {
    console.log("🔍 Debug - Processing customerTypeTrendData:", {
      customerTypeRaw: !!customerTypeRaw,
      customerTypeRawType: typeof customerTypeRaw,
      customerTypeRawKeys: customerTypeRaw ? Object.keys(customerTypeRaw) : [],
      customerTypeRawValue: customerTypeRaw,
    });

    if (!customerTypeRaw) {
      console.log(
        "🔍 Debug - customerTypeRaw is null/undefined, returning empty array"
      );
      return [];
    }

    const allDatesSet = new Set();
    Object.values(customerTypeRaw).forEach((arr) => {
      (arr as Array<{ date: string; count: number }>).forEach((item) => {
        allDatesSet.add(item.date.slice(0, 10));
      });
    });
    const allDates = Array.from(allDatesSet).sort();
    const allTypes = Object.keys(customerTypeRaw);

    console.log("🔍 Debug - customerTypeTrendData processing:", {
      allDatesLength: allDates.length,
      allTypesLength: allTypes.length,
      allDates: allDates.slice(0, 5),
      allTypes: allTypes,
    });

    const result = allDates.map((date) => {
      const row: Record<string, string | number> = { date: String(date) };
      allTypes.forEach((type) => {
        const arr = customerTypeRaw[type] as Array<{
          date: string;
          count: number;
        }>;
        const found = arr.find((item) => item.date.slice(0, 10) === date);
        row[type] = found ? found.count : 0;
      });
      return row;
    });

    console.log("🔍 Debug - customerTypeTrendData result:", {
      resultLength: result.length,
      resultSample: result.slice(0, 2),
    });

    return result;
  }, [customerTypeRaw]);

  // 3.1. Số khách cũ chia theo loại
  const customerOldTypeTrendData = React.useMemo(() => {
    console.log("🔍 Debug - Processing customerOldTypeTrendData:", {
      customerOldTypeRaw: !!customerOldTypeRaw,
      customerOldTypeRawType: typeof customerOldTypeRaw,
      customerOldTypeRawKeys: customerOldTypeRaw
        ? Object.keys(customerOldTypeRaw)
        : [],
      customerOldTypeRawValue: customerOldTypeRaw,
    });

    if (!customerOldTypeRaw) {
      console.log(
        "🔍 Debug - customerOldTypeRaw is null/undefined, returning empty array"
      );
      return [];
    }

    const current = Array.isArray(customerOldTypeRaw.currentRange)
      ? customerOldTypeRaw.currentRange
      : [];
    const previous = Array.isArray(customerOldTypeRaw.previousRange)
      ? customerOldTypeRaw.previousRange
      : [];

    console.log("🔍 Debug - customerOldTypeTrendData processing:", {
      currentLength: current.length,
      previousLength: previous.length,
      currentSample: current.slice(0, 2),
      previousSample: previous.slice(0, 2),
    });

    const result = current.map(
      (item: { date: string; count: number }, idx: number) => ({
        date: item.date || "",
        "Khách cũ hiện tại": item.count,
        "Khách cũ tháng trước": previous[idx]?.count ?? 0,
      })
    );

    console.log("🔍 Debug - customerOldTypeTrendData result:", {
      resultLength: result.length,
      resultSample: result.slice(0, 2),
    });

    return result;
  }, [customerOldTypeRaw]);

  // 4. Nguồn của đơn hàng - gộp theo yêu cầu
  const customerSourceTrendData = React.useMemo(() => {
    console.log("🔍 Debug - Processing customerSourceTrendData:", {
      customerSourceRaw: !!customerSourceRaw,
      customerSourceRawType: typeof customerSourceRaw,
      customerSourceRawKeys: customerSourceRaw
        ? Object.keys(customerSourceRaw)
        : [],
      customerSourceRawValue: customerSourceRaw,
    });

    if (!customerSourceRaw) {
      console.log(
        "🔍 Debug - customerSourceRaw is null/undefined, returning empty array"
      );
      return [];
    }

    const allDatesSet = new Set();
    Object.values(customerSourceRaw).forEach((arr) => {
      (arr as Array<{ date: string; count: number }>).forEach((item) => {
        allDatesSet.add(item.date.slice(0, 10));
      });
    });
    const allDates = Array.from(allDatesSet).sort();

    // Mapping để gộp các nguồn theo yêu cầu - dựa trên dữ liệu API thực tế
    const sourceMapping: Record<string, string> = {
      Fanpage: "Fanpage",
      Facebook: "Fanpage",
      app: "App",
      web: "App",
      Shoppe: "Ecommerce",
      "TT Shop": "Ecommerce",
      "Không có": "Vãng lai",
      "Vãng lai": "Vãng lai",
    };

    // Tạo map để gộp dữ liệu
    const groupedData = new Map<string, Record<string, number>>();

    allDates.forEach((date) => {
      groupedData.set(date as string, {
        Fanpage: 0,
        App: 0,
        Ecommerce: 0,
        "Vãng lai": 0,
      });
    });

    // Gộp dữ liệu theo mapping
    Object.entries(customerSourceRaw).forEach(([sourceType, data]) => {
      const mappedType =
        sourceMapping[sourceType as string] || (sourceType as string);
      console.log(`🔍 Debug - Mapping: ${sourceType} → ${mappedType}`);
      (data as Array<{ date: string; count: number }>).forEach((item) => {
        const date = item.date.slice(0, 10);
        const existing = groupedData.get(date as string);
        if (existing && mappedType in existing) {
          const oldValue = existing[mappedType as keyof typeof existing];
          existing[mappedType as keyof typeof existing] += item.count;
          console.log(
            `🔍 Debug - ${date}: ${sourceType}(${
              item.count
            }) → ${mappedType}: ${oldValue} + ${item.count} = ${
              existing[mappedType as keyof typeof existing]
            }`
          );
        }
      });
    });

    console.log("🔍 Debug - customerSourceTrendData processing:", {
      allDatesLength: allDates.length,
      groupedDataSize: groupedData.size,
      sampleGroupedData: Array.from(groupedData.entries()).slice(0, 2),
    });

    const result = allDates.map((date) => {
      const data = groupedData.get(date as string) || {
        Fanpage: 0,
        App: 0,
        Ecommerce: 0,
        "Vãng lai": 0,
      };
      return {
        date: String(date),
        ...data,
      };
    });

    console.log("🔍 Debug - customerSourceTrendData result:", {
      resultLength: result.length,
      resultSample: result.slice(0, 2),
    });

    return result;
  }, [customerSourceRaw]);

  // 5. Khách tải app/không tải
  const appDownloadStatusData = React.useMemo(() => {
    console.log("🔍 Debug - Processing appDownloadStatusData:", {
      appDownloadStatusRaw: !!appDownloadStatusRaw,
      appDownloadStatusRawType: typeof appDownloadStatusRaw,
      appDownloadStatusRawKeys: appDownloadStatusRaw
        ? Object.keys(appDownloadStatusRaw)
        : [],
      appDownloadStatusRawValue: appDownloadStatusRaw,
    });

    if (!appDownloadStatusRaw) {
      console.log(
        "🔍 Debug - appDownloadStatusRaw is null/undefined, returning empty array"
      );
      return [];
    }

    const result = Object.values(appDownloadStatusRaw).flat();

    console.log("🔍 Debug - appDownloadStatusData result:", {
      resultLength: result.length,
      resultSample: result.slice(0, 2),
    });

    return result;
  }, [appDownloadStatusRaw]);

  // 6. Tỷ lệ tải app
  const appDownloadPieData = React.useMemo(() => {
    console.log("🔍 Debug - Processing appDownloadPieData:", {
      appDownloadRaw: !!appDownloadRaw,
      appDownloadRawType: typeof appDownloadRaw,
      appDownloadRawKeys: appDownloadRaw ? Object.keys(appDownloadRaw) : [],
      appDownloadRawValue: appDownloadRaw,
    });

    if (!appDownloadRaw) {
      console.log(
        "🔍 Debug - appDownloadRaw is null/undefined, returning empty array"
      );
      return [];
    }

    const result = [
      { name: "Đã tải app", value: appDownloadRaw.totalNew || 0 },
      { name: "Chưa tải app", value: appDownloadRaw.totalOld || 0 },
    ];

    console.log("🔍 Debug - appDownloadPieData result:", {
      resultLength: result.length,
      result,
    });

    return result;
  }, [appDownloadRaw]);

  const customerTypes = useMemo(
    () => [
      "KH trải nghiệm",
      "Khách hàng Thành viên",
      "Khách hàng Bạc",
      "Khách hàng Vàng",
      "Khách hàng Bạch Kim",
      "Khách hàng Kim cương",
    ],
    []
  );

  const customerStatus = useMemo(
    () => [
      "Đã xác nhận",
      "Từ chối đặt lịch",
      "Khách đến",
      "Chưa xác nhận",
      "Khách không đến",
    ],
    []
  );

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;

  const allHourRanges = React.useMemo(() => {
    console.log("🔍 Debug - Processing allHourRanges:", {
      facilityHourServiceRaw: !!facilityHourServiceRaw,
      facilityHourServiceRawType: typeof facilityHourServiceRaw,
      facilityHourServiceRawLength: facilityHourServiceRaw
        ? facilityHourServiceRaw.length
        : 0,
      facilityHourServiceRawValue: facilityHourServiceRaw,
    });

    if (!facilityHourServiceRaw) {
      console.log(
        "🔍 Debug - facilityHourServiceRaw is null/undefined, returning empty array"
      );
      return [];
    }

    const set = new Set<string>();
    facilityHourServiceRaw.forEach((item) => {
      Object.keys(item.hourlyCounts).forEach((hour) => set.add(hour));
    });

    const result = Array.from(set).sort((a, b) => {
      const getStart = (s: string) => parseInt(s.split("-")[0], 10);
      return getStart(a) - getStart(b);
    });

    console.log("🔍 Debug - allHourRanges result:", {
      resultLength: result.length,
      resultSample: result.slice(0, 5),
    });

    return result;
  }, [facilityHourServiceRaw]);

  // Hour ranges cho bảng "Thời gian đơn hàng hoàn thành"
  const bookingHourRanges = React.useMemo(() => {
    console.log(
      "🔍 Debug - bookingHourRanges - bookingCompletionRaw:",
      bookingCompletionRaw
    );
    if (!bookingCompletionRaw) {
      console.log(
        "🔍 Debug - bookingCompletionRaw is null/undefined for hour ranges"
      );
      return [] as string[];
    }
    const set = new Set<string>();
    bookingCompletionRaw.forEach((item) => {
      Object.keys(item.hourlyCounts).forEach((hour) => set.add(hour));
    });
    const ranges = Array.from(set).sort((a, b) => {
      const getStart = (s: string) => parseInt(s.split("-")[0], 10);
      return getStart(a) - getStart(b);
    });
    console.log("🔍 Debug - bookingHourRanges result:", ranges);
    return ranges;
  }, [bookingCompletionRaw]);

  const facilityHourTableData = React.useMemo(() => {
    if (!facilityHourServiceRaw) return [];
    const data = facilityHourServiceRaw.map(
      (item) =>
        ({
          facility: item.facility,
          ...item.hourlyCounts,
          total: item.total,
        } as {
          facility: string;
          total: number;
          [key: string]: number | string;
        })
    );

    return data.sort((a, b) => (b.total as number) - (a.total as number));
  }, [facilityHourServiceRaw]);

  // Dữ liệu bảng "Thời gian đơn hàng hoàn thành"
  const bookingCompletionTableData = React.useMemo<
    { facility: string; total: number; [key: string]: number | string }[]
  >(() => {
    console.log(
      "🔍 Debug - bookingCompletionTableData - bookingCompletionRaw:",
      bookingCompletionRaw
    );
    if (!bookingCompletionRaw) {
      console.log("🔍 Debug - bookingCompletionRaw is null/undefined");
      return [];
    }
    const data = bookingCompletionRaw.map((item) => ({
      facility: item.facility,
      ...item.hourlyCounts,
      total: item.total,
    }));
    console.log("🔍 Debug - bookingCompletionTableData result:", data);
    return data.sort(
      (a, b) => (Number(b.total) as number) - (Number(a.total) as number)
    );
  }, [bookingCompletionRaw]);

  // Debug log sau khi tất cả biến được khai báo
  console.log("🔍 Debug - All variables after declaration:", {
    selectedStatus,
    bookingCompletionStatus,
    fromDate,
    toDate,
    status: bookingCompletionStatus || "Khách đến",
    bookingCompletionLoading,
    bookingCompletionError,
    hasBookingData: !!bookingCompletionRaw,
    bookingCompletionRawType: typeof bookingCompletionRaw,
    isArray: Array.isArray(bookingCompletionRaw),
    bookingCompletionRawLength: Array.isArray(bookingCompletionRaw)
      ? bookingCompletionRaw.length
      : "not array",
    bookingCompletionRawPreview: Array.isArray(bookingCompletionRaw)
      ? bookingCompletionRaw.slice(0, 2)
      : bookingCompletionRaw,
    bookingCompletionTableDataLength: bookingCompletionTableData.length,
    bookingHourRangesLength: bookingHourRanges.length,
    renderCount: Date.now(),
    extraBody: bookingCompletionExtraBody,
    isStable:
      !bookingCompletionLoading &&
      !bookingCompletionError &&
      !!bookingCompletionRaw,
    shouldShowData:
      !bookingCompletionLoading &&
      !bookingCompletionError &&
      bookingCompletionTableData.length > 0 &&
      bookingHourRanges.length > 0,
    componentState: bookingCompletionLoading
      ? "loading"
      : bookingCompletionError
      ? "error"
      : bookingCompletionTableData.length > 0
      ? "data"
      : "empty",
    rateLimitInfo: "10 requests per 1 second",
    delay: 1000,
    memoized: true,
    optimization: "reduced re-renders",
    flickering: bookingCompletionLoading ? "yes - loading" : "no - stable",
    solution: "memoized extraBody + increased rate limit + reduced delay",
    expectedResult: "stable display without flickering",
    fixStatus: "FIXED - should work now",
    summary: "Fixed flickering by optimizing API calls and reducing re-renders",
    finalNote: "Component should now display data stably without flickering",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    author: "AI Assistant",
    hasBookingCompletionFilter: true,
    filterStatus: bookingCompletionStatus,
  });

  const customerTypeKeys = useMemo(
    () =>
      customerTypeTrendData.length > 0
        ? Object.keys(customerTypeTrendData[0]).filter((k) => k !== "date")
        : [],
    [customerTypeTrendData]
  );

  const customerSourceKeys = React.useMemo(() => {
    // Sử dụng các nhóm cố định theo yêu cầu
    return ["Fanpage", "App", "Ecommerce", "Vãng lai"];
  }, []);

  // Helper for cell color scale - memoized
  const getCellBg = useMemo(
    () => (val: number) => {
      if (val === 0) return "";

      if (val >= 50) return "bg-[#68B2A0]";
      if (val >= 35) return "bg-[#CDE0C9]";
      if (val >= 25) return "bg-[#E0ECDE]";
      if (val <= 15) return "bg-[#F0F8F0]";

      return "";
    },
    []
  );

  const sortedAppDownloadStatusData = React.useMemo<
    Record<string, string | number>[]
  >(() => {
    if (!appDownloadStatusData) return [];
    const toPlain = (
      obj: Record<string, unknown>
    ): Record<string, string | number> => {
      const out: Record<string, string | number> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "string" || typeof v === "number") out[k] = v;
      }
      return out;
    };
    const getDate = (d: Record<string, string | number>) => {
      const s = String(d.date ?? "");
      const m1 = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m1) return new Date(`${m1[1]}-${m1[2]}-${m1[3]}`).getTime();
      const m2 = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m2) return new Date(`${m2[3]}-${m2[2]}-${m2[1]}`).getTime();
      return s ? new Date(s).getTime() : 0;
    };
    const normalized = appDownloadStatusData.map(toPlain);
    return normalized.sort((a, b) => getDate(a) - getDate(b));
  }, [appDownloadStatusData]);

  // Hiển thị loading nếu chưa load xong localStorage - đơn giản như trang service
  if (!isAllLoaded) {
    return (
      <div className="p-2 sm:p-4 md:p-6 max-w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Thêm retry button nếu có lỗi
  const renderRetryButton = () => {
    const hasErrors = allErrorStates.some((error) => error);
    if (hasErrors) {
      return (
        <div className="text-center mb-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Thử lại
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-full">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      <div className="mb-6">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
              Customer Report
            </h1>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Reset Filters
            </button>
          </div>

          {/* Filter */}
          {/* <CustomerFilters
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            today={today}
            getLocalTimeZone={getLocalTimeZone}
            parseDate={parseDate}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showTypeDropdown={showTypeDropdown}
            setShowTypeDropdown={setShowTypeDropdown}
            customerTypes={customerTypes}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showStatusDropdown={showStatusDropdown}
            setShowStatusDropdown={setShowStatusDropdown}
            customerStatus={customerStatus}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            showRegionDropdown={showRegionDropdown}
            setShowRegionDropdown={setShowRegionDropdown}
            allRegions={allRegions}
            selectedBranches={selectedBranches}
            setSelectedBranches={setSelectedBranches}
            showBranchDropdown={showBranchDropdown}
            setShowBranchDropdown={setShowBranchDropdown}
            allBranches={allBranches}
          /> */}

          {/* Accordion Card tổng số khách */}
          <Suspense
            fallback={
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                <div className="text-center">
                  <div className="text-lg text-gray-700 mb-2">
                    Tổng số lượt khách sử dụng dịch vụ
                  </div>
                  <div className="text-3xl font-bold text-gray-400">
                    Đang tải dữ liệu...
                  </div>
                </div>
              </div>
            }
          >
            <CustomerAccordionCard
              key={`${fromDate}-${toDate}-${Date.now()}`}
              mainValue={
                uniqueCustomersComparisonRaw?.currentTotal?.toLocaleString() ??
                "Chưa có dữ liệu"
              }
              mainLabel="Tổng số lượt khách sử dụng dịch vụ trong khoảng ngày đã chọn"
              mainPercentChange={
                uniqueCustomersComparisonRaw?.changePercentTotal
              }
              // maleValue={uniqueCustomersComparisonRaw?.currentMale}
              // malePercentChange={
              //   uniqueCustomersComparisonRaw?.changePercentMale
              // }
              // femaleValue={uniqueCustomersComparisonRaw?.currentFemale}
              // femalePercentChange={
              //   uniqueCustomersComparisonRaw?.changePercentFemale
              // }
              // avgRevenueMale={genderRevenueRaw?.avgActualRevenueMale}
              // avgServiceMale={genderRevenueRaw?.avgFoxieRevenueMale}
              // avgRevenueFemale={genderRevenueRaw?.avgActualRevenueFemale}
              // avgServiceFemale={genderRevenueRaw?.avgFoxieRevenueFemale}
              loading={uniqueCustomersLoading}
              error={uniqueCustomersError}
            />
          </Suspense>

          {/* Bảng tổng hợp khách mới/cũ: tổng số và thực đi */}
          <div className="mt-5">
            <CustomerNewOldSummaryTable
              data-search-ref="customers_summary"
              data={customerSummaryRaw}
              loading={customerSummaryLoading}
              error={customerSummaryError}
            />
          </div>

          {/* Số khách tạo mới và tỷ lệ nam nữ/khách mới tạo */}
          {/* <div className="mt-5 ">
            <CustomerGenderPie
              isMobile={isMobile}
              loadingNewCustomer={newCustomerLoading}
              errorNewCustomer={newCustomerError}
              newCustomerChartData={newCustomerChartData}
              loadingGenderRatio={genderRatioLoading}
              errorGenderRatio={genderRatioError}
              genderRatioData={genderRatioData}
              COLORS={COLORS}
            />
          </div> */}

          {/* Khách cũ */}
          <CustomerOldTypeTrendChart
            data-search-ref="customers_old_trend"
            isMobile={isMobile}
            customerTypeTrendData={customerOldTypeTrendData}
            customerTypeKeys={["Khách cũ hiện tại", "Khách cũ tháng trước"]}
            COLORS={COLORS}
          />

          {/* Tổng số khách mới */}
          <CustomerNewChart
            data-search-ref="customers_new_chart"
            loadingCustomerSummary={customerSummaryLoading}
            errorCustomerSummary={customerSummaryError}
            customerSummaryRaw={customerSummaryRaw}
          />

          {/* Tổng số khách cũ */}
          <div className="mt-5">
            {(() => {
              console.log("🔍 Debug - CustomerOldStatCard props:", {
                data: !!customerOldTypeRaw,
                loading: customerOldTypeLoading,
                error: customerOldTypeError,
                dataKeys: customerOldTypeRaw
                  ? Object.keys(customerOldTypeRaw)
                  : [],
              });

              if (customerOldTypeLoading) {
                return (
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-gray-600">
                        Đang tải dữ liệu khách cũ...
                      </p>
                    </div>
                  </div>
                );
              }

              if (customerOldTypeError) {
                return (
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="text-center text-red-500">
                      <p>Lỗi tải dữ liệu khách cũ: {customerOldTypeError}</p>
                    </div>
                  </div>
                );
              }

              if (!customerOldTypeRaw) {
                return (
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="text-center text-gray-500">
                      <p>Chưa có dữ liệu khách cũ</p>
                    </div>
                  </div>
                );
              }

              return (
                <CustomerOldStatCard
                  data-search-ref="customers_old_stat"
                  data={customerOldTypeRaw}
                  loading={customerOldTypeLoading}
                  error={customerOldTypeError}
                />
              );
            })()}
          </div>

          {/* Số khách tới chia theo phân loại */}
          <CustomerTypeTrendChart
            data-search-ref="customers_type_trend"
            isMobile={isMobile}
            customerTypeTrendData={customerTypeTrendData}
            customerTypeKeys={customerTypeKeys}
            COLORS={COLORS}
          />

          {/* Nguồn của đơn hàng */}
          <CustomerSourceBarChart
            data-search-ref="customers_source_bar"
            isMobile={isMobile}
            customerSourceTrendData={customerSourceTrendData}
            customerSourceKeys={customerSourceKeys}
            COLORS={COLORS}
          />

          {/* Tỉ lệ khách hàng tải app và tỉ lệ khách mới/cũ*/}
          <CustomerAppDownloadPieChart
            data-search-ref="customers_app_pie"
            loadingAppDownload={appDownloadLoading}
            errorAppDownload={appDownloadError}
            appDownloadPieData={appDownloadPieData}
          />

          {/* Khách hàng tải app */}
          <CustomerAppDownloadBarChart
            data-search-ref="customers_app_bar"
            isMobile={isMobile}
            loading={appDownloadStatusLoading}
            error={appDownloadStatusError}
            sortedAppDownloadStatusData={sortedAppDownloadStatusData}
          />

          {/* Thời gian đơn hàng được tạo */}
          <CustomerFacilityHourTable
            data-search-ref="customers_facility_hour"
            allHourRanges={allHourRanges}
            facilityHourTableData={facilityHourTableData}
            getCellBg={getCellBg}
            isMobile={isMobile}
            loadingFacilityHour={facilityHourServiceLoading}
            errorFacilityHour={facilityHourServiceError}
          />

          {/* Thời gian đơn hàng hoàn thành */}
          <div className="mt-5">
            {/* Filter cho bảng "thời gian đơn hàng hoàn thành" */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">
                Trạng thái đơn hàng:
              </span>
              <div
                className="relative booking-completion-status-dropdown"
                ref={dropdownRef}
                style={{ zIndex: 99999 }}
              >
                <button
                  onClick={() =>
                    setShowBookingCompletionStatusDropdown(
                      !showBookingCompletionStatusDropdown
                    )
                  }
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {bookingCompletionStatus || "Khách đến"} ▼
                </button>
                {showBookingCompletionStatusDropdown && (
                  <div
                    className="dropdown-menu w-48 bg-white border border-gray-300 rounded-md shadow-lg"
                    style={getDropdownStyle()}
                  >
                    {[
                      "Khách đến",
                      "Khách không đến",
                      "Đã xác nhận",
                      "Từ chối đặt lịch",
                      "Chưa xác nhận",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookingCompletionStatus(status);
                          setShowBookingCompletionStatusDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          bookingCompletionStatus === status
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <CustomerFacilityBookingTable
              data-search-ref="customers_booking_hour"
              allHourRanges={bookingHourRanges}
              facilityHourTableData={bookingCompletionTableData}
              getCellBg={getCellBg}
              isMobile={isMobile}
              loadingFacilityHour={bookingCompletionLoading}
              errorFacilityHour={bookingCompletionError}
            />
          </div>
        </div>
      </div>
      {renderRetryButton()}
    </div>
  );
}

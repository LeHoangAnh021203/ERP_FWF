"use client";

import React, { createContext, useContext, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { useLocalStorageState } from '@/app/hooks/useLocalStorageState';
import { ApiService } from '@/app/lib/api-service';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

interface DateContextType {
  startDate: CalendarDate;
  endDate: CalendarDate;
  setStartDate: (date: CalendarDate) => void;
  setEndDate: (date: CalendarDate) => void;
  resetToDefault: () => void;
  // Formatted dates for API calls
  fromDate: string;
  toDate: string;
  // Loading state
  isLoaded: boolean;
  rangeAlert?: RangeAlertResponse | null;
}

interface RangeAlertResponse {
  globalMin: string;
  globalMax: string;
  minMap: Record<string, string>;
  maxMap: Record<string, string>;
  message?: string;
}

interface RouteRangeAlertConfig {
  match: string;
  datasetKeys?: string[];
  title?: string;
  messageTemplate?: string;
}

const RANGE_ALERT_ROUTE_CONFIGS: RouteRangeAlertConfig[] = [
  {
    match: "/dashboard/orders",
    datasetKeys: ["sales_transaction"],
    title: "Đơn hàng",
    messageTemplate:
      "Tab Đơn hàng chỉ có dữ liệu từ {from} đến {to}. Vui lòng chọn lại khoảng thời gian nằm trong phạm vi này.",
  },
  {
    match: "/dashboard/customers",
    datasetKeys: ["customer_sale_record"],
    title: "Khách hàng",
    messageTemplate:
      "Tab Khách hàng chỉ có dữ liệu từ {from} đến {to}.",
  },
  {
    match: "/dashboard/services",
    datasetKeys: ["service_record"],
    title: "Dịch vụ",
    messageTemplate:
      "Tab Dịch vụ chỉ có dữ liệu từ {from} đến {to}.",
  },
  {
    match: "/dashboard/calendar",
    datasetKeys: ["booking_record"],
    title: "Lịch làm việc",
    messageTemplate:
      "Tab Lịch làm việc chỉ hiển thị dữ liệu từ {from} đến {to}.",
  },
  {
    match: "/dashboard/accounting",
    datasetKeys: ["sales_transaction"],
    title: "Kế toán",
    messageTemplate:
      "Tab Kế toán chỉ hỗ trợ dữ liệu trong khoảng {from} - {to}.",
  },
];

const DateContext = createContext<DateContextType | undefined>(undefined);

interface DateProviderProps {
  children: ReactNode;
  defaultStartDate?: CalendarDate;
  defaultEndDate?: CalendarDate;
  storageKey?: string;
}

export function DateProvider({ 
  children, 
  defaultStartDate = today(getLocalTimeZone()).subtract({ days: 7 }),
  defaultEndDate = today(getLocalTimeZone()),
  storageKey = 'global-date-range'
}: DateProviderProps) {
  const pathname = usePathname();
  const [startDate, setStartDate, startDateLoaded] = useLocalStorageState<CalendarDate>(
    `${storageKey}-startDate`,
    defaultStartDate
  );
  const [endDate, setEndDate, endDateLoaded] = useLocalStorageState<CalendarDate>(
    `${storageKey}-endDate`,
    defaultEndDate
  );

  const isLoaded = startDateLoaded && endDateLoaded;

  const [rangeAlert, setRangeAlert] = useState<RangeAlertResponse | null>(null);
  const [rangeModalOpen, setRangeModalOpen] = useState(false);
  const [rangeModalTitle, setRangeModalTitle] = useState("Thông báo");
  const [rangeModalMessage, setRangeModalMessage] = useState("");
  const lastAlertKeyRef = useRef<string | null>(null);

  const activeRouteConfig = useMemo(() => {
    if (!pathname) return null;
    const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
    return RANGE_ALERT_ROUTE_CONFIGS.find((config) =>
      normalized.startsWith(config.match)
    ) ?? null;
  }, [pathname]);

  useEffect(() => {
    const fetchRangeAlert = async () => {
      try {
        const data = (await ApiService.getDirect("customer-sale/range-time-alert")) as RangeAlertResponse;
        setRangeAlert(data);
      } catch (error) {
        console.error("Failed to fetch range-time-alert:", error);
      }
    };
    fetchRangeAlert();
  }, []);

  const calendarToDate = (date?: CalendarDate): Date | null => {
    if (!date) return null;
    return new Date(date.year, date.month - 1, date.day, 0, 0, 0);
  };

  useEffect(() => {
    if (!rangeAlert || !isLoaded || !activeRouteConfig) {
      lastAlertKeyRef.current = null;
      setRangeModalOpen(false);
      return;
    }

    const selectedStart = calendarToDate(startDate);
    const selectedEnd = calendarToDate(endDate);
    if (!selectedStart || !selectedEnd) return;

    const { datasetKeys } = activeRouteConfig;

    const datasetDates = (keys?: string[], map?: Record<string, string>) => {
      if (!keys || !keys.length || !map) return [];
      return keys
        .map((key) => map[key])
        .filter((value): value is string => Boolean(value))
        .map((value) => new Date(value));
    };

    const minCandidates = datasetDates(datasetKeys, rangeAlert.minMap);
    const maxCandidates = datasetDates(datasetKeys, rangeAlert.maxMap);

    let effectiveMin = new Date(rangeAlert.globalMin);
    if (minCandidates.length) {
      effectiveMin = minCandidates.reduce(
        (latest, date) => (date > latest ? date : latest),
        minCandidates[0]
      );
    }

    let effectiveMax = new Date(rangeAlert.globalMax);
    if (maxCandidates.length) {
      effectiveMax = maxCandidates.reduce(
        (earliest, date) => (date < earliest ? date : earliest),
        maxCandidates[0]
      );
    }

    if (effectiveMin > effectiveMax) {
      effectiveMin = new Date(rangeAlert.globalMin);
      effectiveMax = new Date(rangeAlert.globalMax);
    }

    const outOfRange =
      selectedStart < effectiveMin || selectedEnd > effectiveMax;

    const currentKey = `${activeRouteConfig.match}_${selectedStart.toISOString()}_${selectedEnd.toISOString()}`;

    if (outOfRange) {
      if (lastAlertKeyRef.current !== currentKey) {
        lastAlertKeyRef.current = currentKey;
        const formatDateTime = (date: Date) =>
          date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

        const template =
          activeRouteConfig.messageTemplate ||
          rangeAlert.message ||
          "Chỉ có dữ liệu trong khoảng {from} - {to}.";

        const message = template
          .replace("{from}", formatDateTime(effectiveMin))
          .replace("{to}", formatDateTime(effectiveMax));

        setRangeModalTitle(
          activeRouteConfig.title || "Khoảng thời gian không hợp lệ"
        );
        setRangeModalMessage(message);
        setRangeModalOpen(true);
      }
    } else {
      lastAlertKeyRef.current = null;
      setRangeModalOpen(false);
    }
  }, [rangeAlert, startDate, endDate, isLoaded, activeRouteConfig]);

  // Format dates for API calls
  const fromDate = startDate
    ? `${startDate.year}-${String(startDate.month).padStart(2, "0")}-${String(
        startDate.day
      ).padStart(2, "0")}T00:00:00`
    : "";
  const toDate = endDate
    ? `${endDate.year}-${String(endDate.month).padStart(2, "0")}-${String(
        endDate.day
      ).padStart(2, "0")}T23:59:59`
    : "";

  const resetToDefault = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };

  const value: DateContextType = {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    resetToDefault,
    fromDate,
    toDate,
    isLoaded,
    rangeAlert,
  };

  return (
    <DateContext.Provider value={value}>
      {children}
      <Dialog open={rangeModalOpen} onOpenChange={setRangeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{rangeModalTitle}</DialogTitle>
            <DialogDescription>{rangeModalMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setRangeModalOpen(false)}>
              Đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DateContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateProvider');
  }
  return context;
}

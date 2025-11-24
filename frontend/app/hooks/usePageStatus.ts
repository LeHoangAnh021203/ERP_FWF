import { useEffect, useCallback } from 'react';

interface PageStatus {
  page: string;
  lastActivity: Date;
  dataLoaded: boolean;
  errorCount: number;
  successCount: number;
  lastError?: string;
  lastSuccess?: string;
}

// Global event emitter for real-time notifications
class NotificationEventEmitter {
  private listeners: Set<() => void> = new Set();

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit() {
    this.listeners.forEach(callback => callback());
  }
}

export const notificationEmitter = new NotificationEventEmitter();

// Simple per-page debouncing and backoff to avoid 429 spam
const lastPostAtByPage: Record<string, number> = {};
const pendingTimerByPage: Record<string, ReturnType<typeof setTimeout> | undefined> = {};
const latestPayloadByPage: Record<string, Partial<PageStatus>> = {};
const inFlightByPage: Record<string, boolean> = {};

async function postPageStatus(pageName: string, payload: Partial<PageStatus>) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageName, ...payload })
    });

    if (response.status === 429) {
      // Basic backoff once to reduce UI jitter
      await new Promise(r => setTimeout(r, 1000));
      return fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageName, ...payload })
      }).catch(() => undefined);
    }

    return response;
  } catch {
    return undefined;
  }
}

export function usePageStatus(pageName: string) {
  // Update page status to API
  const updatePageStatus = useCallback(async (statusData: Partial<PageStatus>) => {
    // Debounce per page to a maximum frequency
    latestPayloadByPage[pageName] = { ...latestPayloadByPage[pageName], ...statusData };

    const now = Date.now();
    const minIntervalMs = 1200; // ~1.2s to smooth bursts
    const timeSinceLast = now - (lastPostAtByPage[pageName] || 0);

    const scheduleSend = () => {
      if (inFlightByPage[pageName]) return; // avoid piling up while in-flight
      const payload = latestPayloadByPage[pageName] || statusData;
      inFlightByPage[pageName] = true;
      postPageStatus(pageName, payload)
        .finally(() => {
          lastPostAtByPage[pageName] = Date.now();
          inFlightByPage[pageName] = false;
          // Emit event after successful attempt or completion to avoid UI flicker
          notificationEmitter.emit();
        })
        .catch(() => {
          inFlightByPage[pageName] = false;
        });
    };

    // If enough time has passed, send immediately; otherwise debounce
    if (timeSinceLast >= minIntervalMs) {
      if (pendingTimerByPage[pageName]) {
        clearTimeout(pendingTimerByPage[pageName]!);
        pendingTimerByPage[pageName] = undefined;
      }
      scheduleSend();
    } else {
      if (pendingTimerByPage[pageName]) clearTimeout(pendingTimerByPage[pageName]!);
      pendingTimerByPage[pageName] = setTimeout(() => {
        pendingTimerByPage[pageName] = undefined;
        scheduleSend();
      }, minIntervalMs - timeSinceLast);
    }
  }, [pageName]);

  // Report page load success with objective status
  const reportPageLoad = useCallback((message?: string) => {
    updatePageStatus({
      dataLoaded: true,
      successCount: 1,
      lastSuccess: message || `Trang ${getPageDisplayName(pageName)} đã sẵn sàng sử dụng`
    });
  }, [updatePageStatus, pageName]);

  // Report page error with objective status
  const reportPageError = useCallback((error: string) => {
    updatePageStatus({
      errorCount: 1,
      lastError: error
    });
  }, [updatePageStatus]);

  // Report page activity with objective status
  const reportPageActivity = useCallback((activity: string) => {
    updatePageStatus({
      lastSuccess: activity
    });
  }, [updatePageStatus]);

  // Report data load success with objective metrics
  const reportDataLoadSuccess = useCallback((dataType: string, count?: number) => {
    const message = count 
      ? `Dữ liệu ${dataType}: ${count.toLocaleString()} bản ghi đã sẵn sàng`
      : `Dữ liệu ${dataType} đã được tải thành công`;
    
    updatePageStatus({
      successCount: 1,
      lastSuccess: message
    });
  }, [updatePageStatus]);

  // Report data load error with objective status
  const reportDataLoadError = useCallback((dataType: string, error: string) => {
    updatePageStatus({
      errorCount: 1,
      lastError: `Không thể tải dữ liệu ${dataType}: ${error}`
    });
  }, [updatePageStatus]);

  // Report filter changes with objective status
  const reportFilterChange = useCallback((filterType: string) => {
    updatePageStatus({
      lastSuccess: `Bộ lọc ${filterType} đã được cập nhật`
    });
  }, [updatePageStatus]);

  // Report reset filters with objective status
  const reportResetFilters = useCallback(() => {
    updatePageStatus({
      lastSuccess: 'Tất cả bộ lọc đã được đặt lại về mặc định'
    });
  }, [updatePageStatus]);

  // Report chart interactions with objective status
  const reportChartInteraction = useCallback((chartType: string, action: string) => {
    updatePageStatus({
      lastSuccess: `Biểu đồ ${chartType}: ${action}`
    });
  }, [updatePageStatus]);

  // Report page performance with objective metrics
  const reportPagePerformance = useCallback((metrics: { loadTime?: number; dataSize?: number }) => {
    let message = `Trang ${getPageDisplayName(pageName)} đã tải xong`;
    
    if (metrics.loadTime) {
      message += ` (${metrics.loadTime}ms)`;
    }
    
    if (metrics.dataSize) {
      message += ` - ${metrics.dataSize} bản ghi`;
    }
    
    updatePageStatus({
      dataLoaded: true,
      successCount: 1,
      lastSuccess: message
    });
  }, [updatePageStatus, pageName]);

  // Initialize page status on mount
  useEffect(() => {
    updatePageStatus({
      dataLoaded: false,
      errorCount: 0,
      successCount: 0
    });
  }, [updatePageStatus]);

  return {
    reportPageLoad,
    reportPageError,
    reportPageActivity,
    reportDataLoadSuccess,
    reportDataLoadError,
    reportFilterChange,
    reportResetFilters,
    reportChartInteraction,
    reportPagePerformance
  };
}

// Helper function to get display name for pages
function getPageDisplayName(pageName: string): string {
  const pageNames: { [key: string]: string } = {
    'customers': 'Khách hàng',
    'orders': 'Đơn hàng',
    'services': 'Dịch vụ',
    'dashboard': 'Tổng quan'
  };
  return pageNames[pageName] || pageName;
} 
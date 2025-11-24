import { NextResponse } from "next/server";

const API_ENDPOINTS: Array<{ name: string; url: string; expectedStatus: number }> = [];

interface PageStatus {
  page: string;
  lastActivity: Date;
  dataLoaded: boolean;
  errorCount: number;
  successCount: number;
  lastError?: string;
  lastSuccess?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "api_error" | "api_status" | "system_health" | "api_performance";
}


const pageStatuses: Map<string, PageStatus> = new Map();

async function checkAPIStatus() {
  const results = [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  for (const endpoint of API_ENDPOINTS) {
    const startTime = Date.now();
    try {
      const response = await fetch(`${baseUrl}${endpoint.url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: response.status,
        responseTime: Date.now() - startTime,
        isHealthy: response.status === endpoint.expectedStatus,
        error: null,
      });
    } catch (error) {
      results.push({
        name: endpoint.name,
        url: endpoint.url,
        status: "ERROR",
        responseTime: Date.now() - startTime,
        isHealthy: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

async function getSystemHealth() {
  try {
    const fs = await import("fs").then((m) => m.promises);
    const path = await import("path");

    const dataFiles = [
      "data/danh_sach_ban_hang.json",
      "data/khach_hang_su_dung_app.json",
      "data/dich_vu_ban_hang.json",
      "data/ban_hang_doanh_so.json",
    ];

    const fileStatus = await Promise.all(
      dataFiles.map(async (file) => {
        try {
          const filePath = path.join(process.cwd(), file);
          await fs.access(filePath);
          const stats = await fs.stat(filePath);
          return {
            name: path.basename(file),
            exists: true,
            size: stats.size,
            lastModified: stats.mtime,
          };
        } catch (error) {
          return {
            name: path.basename(file),
            exists: false,
            error: error instanceof Error ? error.message : "File not found",
          };
        }
      })
    );

    return {
      timestamp: new Date(),
      fileStatus,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    };
  } catch (error) {
    return {
      timestamp: new Date(),
      error: error instanceof Error ? error.message : "System health check failed",
    };
  }
}

function formatTimeAgo(timestamp: Date) {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

function getPageDisplayName(pageName: string) {
  const pageNames: Record<string, string> = {
    customers: "Khách hàng",
    orders: "Đơn hàng",
    services: "Dịch vụ",
    dashboard: "Tổng quan",
  };
  return pageNames[pageName] || pageName;
}

function generatePageNotifications(): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  pageStatuses.forEach((status, pageName) => {
    const inactiveMinutes = Math.floor((now.getTime() - status.lastActivity.getTime()) / 60000);

    if (status.errorCount > 0 && status.lastError) {
      notifications.push({
        id: `${pageName}_error_${Date.now()}`,
        title: `${getPageDisplayName(pageName)} - Lỗi`,
        message: status.lastError,
        time: formatTimeAgo(status.lastActivity),
        read: false,
        type: "api_error",
      });
    }

    if (status.successCount > 0 && status.lastSuccess) {
      notifications.push({
        id: `${pageName}_success_${Date.now()}`,
        title: `${getPageDisplayName(pageName)} - Thành công`,
        message: status.lastSuccess,
        time: formatTimeAgo(status.lastActivity),
        read: false,
        type: "api_status",
      });
    }

    if (inactiveMinutes > 30 && status.dataLoaded) {
      notifications.push({
        id: `${pageName}_inactive_${Date.now()}`,
        title: `${getPageDisplayName(pageName)} - Không hoạt động`,
        message: `Trang không có hoạt động trong ${Math.floor(inactiveMinutes / 60)} giờ`,
        time: formatTimeAgo(status.lastActivity),
        read: false,
        type: "system_health",
      });
    }
  });

  return notifications;
}

 function updatePageStatus(pageName: string, data: Partial<PageStatus>) {
  const now = new Date();
  const current = pageStatuses.get(pageName) || {
    page: pageName,
    lastActivity: now,
    dataLoaded: false,
    errorCount: 0,
    successCount: 0,
  };

  pageStatuses.set(pageName, { ...current, ...data, lastActivity: now });
}

export async function GET() {
  try {
    const apiStatus = await checkAPIStatus();
    const systemHealth = await getSystemHealth();

    const notifications: Notification[] = [];

    apiStatus.forEach((api, index) => {
      if (!api.isHealthy) {
        notifications.push({
          id: `api_error_${index}`,
          title: `${api.name} - Error`,
          message: `Error: ${api.error || `Status ${api.status}`}, Response time: ${api.responseTime}ms`,
          time: "Vừa xong",
          read: false,
          type: "api_error",
        });
      }
    });

    notifications.push(...generatePageNotifications());

    if (pageStatuses.size > 0) {
      const activePages = Array.from(pageStatuses.values()).filter((p) => p.dataLoaded).length;
      notifications.push({
        id: "system_status",
        title: "Trạng thái hệ thống",
        message: `${activePages}/${pageStatuses.size} trang đã sẵn sàng sử dụng`,
        time: "Vừa xong",
        read: true,
        type: "system_health",
      });
    }

    if (systemHealth.fileStatus) {
      const healthyFiles = systemHealth.fileStatus?.filter((f: { exists: boolean }) => f.exists).length ?? 0;

      if (healthyFiles < systemHealth.fileStatus.length) {
        notifications.push({
          id: "system_files",
          title: "Data Files Status",
          message: `${healthyFiles}/${systemHealth.fileStatus.length} data files accessible`,
          time: "Vừa xong",
          read: false,
          type: "system_health",
        });
      }
    }

    if (systemHealth.memoryUsage) {
      const memoryMB = Math.round(systemHealth.memoryUsage.heapUsed / 1024 / 1024);
      if (memoryMB > 512) {
        notifications.push({
          id: "memory_usage",
          title: "Memory Usage",
          message: `Heap used: ${memoryMB}MB, Uptime: ${Math.round(systemHealth.uptime / 60)} minutes`,
          time: "Vừa xong",
          read: true,
          type: "api_performance",
        });
      }
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      notifications,
      count: unreadCount,
      apiStatus,
      systemHealth,
      pageStatuses: Object.fromEntries(pageStatuses),
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching API status:", error);
    return NextResponse.json(
      {
        notifications: [
          {
            id: "api_error",
            title: "API Status Check Failed",
            message: "Không thể kiểm tra trạng thái API",
            time: "Vừa xong",
            read: false,
            type: "api_error",
          },
        ],
        count: 1,
        error: "Failed to check API status",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { pageName, ...statusData } = await request.json();
    if (!pageName) {
      return NextResponse.json({ error: "Page name is required" }, { status: 400 });
    }

    updatePageStatus(pageName, statusData);
    return NextResponse.json({ success: true, message: `Page status updated for ${pageName}` });
  } catch (error) {
    console.error("Error updating page status:", error);
    return NextResponse.json({ error: "Failed to update page status" }, { status: 500 });
  }
}

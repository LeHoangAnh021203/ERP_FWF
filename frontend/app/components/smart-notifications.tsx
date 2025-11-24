import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { notificationEmitter } from "../hooks/usePageStatus";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type:
    | "order"
    | "sales"
    | "api_status"
    | "api_performance"
    | "database"
    | "api_error"
    | "system_health"
    | "api_auth"
    | "page_status";
}

interface PageStatus {
  page: string;
  lastActivity: Date;
  dataLoaded: boolean;
  errorCount: number;
  successCount: number;
  lastError?: string;
  lastSuccess?: string;
}

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pageStatuses, setPageStatuses] = useState<Record<string, PageStatus>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "api_status":
      case "api_performance":
      case "api_error":
      case "api_auth":
        return "🔗";
      case "database":
      case "system_health":
        return "⚙️";
      case "order":
        return "📦";
      case "sales":
        return "📈";
      case "page_status":
        return "📄";
      default:
        return "📢";
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "api_status":
      case "api_performance":
      case "api_auth":
      case "database":
      case "system_health":
      case "page_status":
        return "text-blue-600";
      case "api_error":
        return "text-red-600";
      case "order":
        return "text-green-600";
      case "sales":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  // Get notification priority for sorting
  const getNotificationPriority = (type: string) => {
    switch (type) {
      case "api_error":
        return 1;
      case "order":
        return 2;
      case "sales":
        return 3;
      case "page_status":
        return 4;
      case "api_status":
        return 5;
      default:
        return 6;
    }
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch("/api/notifications", {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
          setPageStatuses(data.pageStatuses || {});
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.warn("Failed to fetch notifications:", error);
        setNotificationCount(0);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Refresh notifications every 30 seconds instead of 5 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // Force refresh when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      const fetchNotifications = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const response = await fetch("/api/notifications", {
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications || []);
            setNotificationCount(data.count || 0);
            setPageStatuses(data.pageStatuses || {});
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.warn("Failed to fetch notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [showNotifications]);

  // Listen for real-time notification updates
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const data = await response.json();
          const newCount = data.count || 0;

          // Check if there are new notifications
          if (newCount > notificationCount) {
            setHasNewNotifications(true);
            // Auto-hide new notification indicator after 3 seconds
            setTimeout(() => setHasNewNotifications(false), 3000);
          }

          setNotifications(data.notifications || []);
          setNotificationCount(newCount);
          setPageStatuses(data.pageStatuses || {});
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    const unsubscribe = notificationEmitter.subscribe(fetchNotifications);
    return () => {
      unsubscribe();
    };
  }, [notificationCount]);

  // Mark notifications as read when dropdown opens
  // XÓA hoàn toàn useEffect đánh dấu đã đọc khi mở dropdown

  
  const sortedNotifications = notifications.sort((a, b) => {
    //
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    if (timeA !== timeB) {
      return timeB - timeA; // Newest first
    }

  
    const priorityA = getNotificationPriority(a.type);
    const priorityB = getNotificationPriority(b.type);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

  
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }

    return 0;
  });

  // Generate page status notifications
  const generatePageStatusNotifications = () => {
    const pageNotifications: Notification[] = [];
    const now = new Date();

    Object.entries(pageStatuses).forEach(([pageName, status]) => {
      const timeSinceLastActivity =
        now.getTime() - new Date(status.lastActivity).getTime();
      const minutesSinceActivity = Math.floor(timeSinceLastActivity / 60000);

      // Report page errors
      if (status.errorCount > 0 && status.lastError) {
        pageNotifications.push({
          id: `${pageName}_error_${Date.now()}`,
          title: `${getPageDisplayName(pageName)} - Lỗi`,
          message: status.lastError,
          time: formatTimeAgo(new Date(status.lastActivity)),
          read: false,
          type: "page_status",
        });
      }

      // Report page success
      if (status.successCount > 0 && status.lastSuccess) {
        pageNotifications.push({
          id: `${pageName}_success_${Date.now()}`,
          title: `${getPageDisplayName(pageName)} - Thành công`,
          message: status.lastSuccess,
          time: formatTimeAgo(new Date(status.lastActivity)),
          read: true,
          type: "page_status",
        });
      }

      // Report inactive pages
      if (minutesSinceActivity > 30 && status.dataLoaded) {
        pageNotifications.push({
          id: `${pageName}_inactive_${Date.now()}`,
          title: `${getPageDisplayName(pageName)} - Không hoạt động`,
          message: `Trang ${getPageDisplayName(
            pageName
          )} không có hoạt động trong ${Math.floor(
            minutesSinceActivity / 60
          )} giờ`,
          time: formatTimeAgo(new Date(status.lastActivity)),
          read: true,
          type: "page_status",
        });
      }
    });

    // Sort page notifications by time (newest first), then by priority
    return pageNotifications.sort((a, b) => {
      // First sort by time (newest first)
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      if (timeA !== timeB) {
        return timeB - timeA; // Newest first
      }

      // If same time, sort by priority (error notifications first)
      const priorityA =
        a.type === "api_error" ? 1 : a.type === "page_status" ? 2 : 3;
      const priorityB =
        b.type === "api_error" ? 1 : b.type === "page_status" ? 2 : 3;
      return priorityA - priorityB;
    });
  };

  // Helper function to get display name for pages
  const getPageDisplayName = (pageName: string): string => {
    const pageNames: { [key: string]: string } = {
      customers: "Khách hàng",
      orders: "Đơn hàng",
      services: "Dịch vụ",
      dashboard: "Tổng quan",
    };
    return pageNames[pageName] || pageName;
  };

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${hours} giờ trước`;
  };

  // Combine regular notifications with page status notifications
  const allNotifications = [
    ...sortedNotifications,
    ...generatePageStatusNotifications(),
  ];

  // Tính số thông báo chưa đọc luôn dựa trên notifications thực tế
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative p-2 sm:p-0">
          <Bell
            className={`h-5 w-5 sm:h-5 sm:w-5 text-[#d04d65] transition-all duration-300 ${
              hasNewNotifications ? "animate-pulse" : ""
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#d04d65] text-white text-[10px] sm:text-xs rounded-full h-4 w-4 flex items-center justify-center transition-all duration-300">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-y-auto"
      >
        <DropdownMenuLabel>
          Thông báo thông minh ({unreadCount})
          {Object.keys(pageStatuses).length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Theo dõi {Object.keys(pageStatuses).length} trang
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <DropdownMenuItem disabled className="text-gray-500">
            Đang tải thông báo...
          </DropdownMenuItem>
        ) : allNotifications.length > 0 ? (
          allNotifications.slice(0, 8).map((notification, index) => (
            <DropdownMenuItem
              key={notification.id || index}
              className="flex items-start p-3 gap-3"
            >
              <div className="text-lg">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium text-sm ${getNotificationColor(
                    notification.type
                  )}`}
                >
                  {notification.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {notification.message}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {notification.time}
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-gray-500">
            Chưa có hoạt động nào được ghi nhận
          </DropdownMenuItem>
        )}
        {allNotifications.length > 8 && (
          <DropdownMenuItem className="text-center text-blue-600">
            Xem tất cả thông báo ({allNotifications.length})
          </DropdownMenuItem>
        )}
        {Object.keys(pageStatuses).length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-gray-500">
              Trạng thái trang
            </DropdownMenuLabel>
            {Object.entries(pageStatuses).map(([pageName, status]) => (
              <DropdownMenuItem key={pageName} className="text-xs p-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      status.errorCount > 0
                        ? "bg-red-500"
                        : status.successCount > 0
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="font-medium">
                    {getPageDisplayName(pageName)}
                  </span>
                  <span className="text-gray-500">
                    {status.dataLoaded ? "Đã tải" : "Chưa tải"}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

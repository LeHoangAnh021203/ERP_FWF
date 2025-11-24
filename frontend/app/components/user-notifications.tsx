"use client";
import React, { useEffect } from 'react';
import { useNotifications } from './notifications';

interface FilterChangeNotificationProps {
  filterType: string;
  value: string | string[];
  showNotification?: boolean;
}

export const FilterChangeNotification: React.FC<FilterChangeNotificationProps> = ({
  filterType,
  value,
  showNotification = true
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (showNotification && value) {
      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      addNotification({
        type: 'info',
        title: 'Bộ lọc đã thay đổi',
        message: `${filterType}: ${displayValue}`,
        duration: 3000
      });
    }
  }, [filterType, value, showNotification, addNotification]);

  return null;
};

interface DateChangeNotificationProps {
  startDate: string;
  endDate: string;
  showNotification?: boolean;
}

export const DateChangeNotification: React.FC<DateChangeNotificationProps> = ({
  startDate,
  endDate,
  showNotification = true
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (showNotification && startDate && endDate) {
      addNotification({
        type: 'info',
        title: 'Khoảng thời gian đã thay đổi',
        message: `Từ ${startDate} đến ${endDate}`,
        duration: 3000
      });
    }
  }, [startDate, endDate, showNotification, addNotification]);

  return null;
};

interface DataRefreshNotificationProps {
  isRefreshing: boolean;
  showNotification?: boolean;
}

export const DataRefreshNotification: React.FC<DataRefreshNotificationProps> = ({
  isRefreshing,
  showNotification = true
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isRefreshing && showNotification) {
      addNotification({
        type: 'info',
        title: 'Đang làm mới',
        message: 'Đang cập nhật dữ liệu...',
        duration: 2000
      });
    }
  }, [isRefreshing, showNotification, addNotification]);

  return null;
};

interface ExportNotificationProps {
  isExporting: boolean;
  exportType: string;
  showNotification?: boolean;
}

export const ExportNotification: React.FC<ExportNotificationProps> = ({
  isExporting,
  exportType,
  showNotification = true
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isExporting && showNotification) {
      addNotification({
        type: 'info',
        title: 'Đang xuất dữ liệu',
        message: `Đang xuất ${exportType}...`,
        duration: 3000
      });
    }
  }, [isExporting, exportType, showNotification, addNotification]);

  return null;
};

interface MobileNotificationProps {
  isMobile: boolean;
  showNotification?: boolean;
}

export const MobileNotification: React.FC<MobileNotificationProps> = ({
  isMobile,
  showNotification = true
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isMobile && showNotification) {
      addNotification({
        type: 'warning',
        title: 'Chế độ di động',
        message: 'Giao diện đã được tối ưu cho thiết bị di động',
        duration: 4000
      });
    }
  }, [isMobile, showNotification, addNotification]);

  return null;
};

export default FilterChangeNotification; 
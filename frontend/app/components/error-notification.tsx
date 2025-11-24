"use client";
import React, { useEffect } from 'react';
import { useNotifications } from './notifications';

interface ErrorNotificationProps {
  error: string | null;
  title?: string;
  message?: string;
  showNotification?: boolean;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  title = 'Lỗi',
  message = 'Có lỗi xảy ra khi tải dữ liệu',
  showNotification = true
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (error && showNotification) {
      addNotification({
        type: 'error',
        title,
        message: `${message}: ${error}`,
        duration: 6000
      });
    }
  }, [error, title, message, showNotification, addNotification]);

  return null;
};

interface LoadingNotificationProps {
  loading: boolean;
  title?: string;
  message?: string;
  showNotification?: boolean;
}

export const LoadingNotification: React.FC<LoadingNotificationProps> = ({
  loading,
  title = 'Đang tải',
  message = 'Đang tải dữ liệu...',
  showNotification = false
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (loading && showNotification) {
      addNotification({
        type: 'info',
        title,
        message,
        duration: 3000
      });
    }
  }, [loading, title, message, showNotification, addNotification]);

  return null;
};

interface SuccessNotificationProps {
  data: unknown;
  title?: string;
  message?: string;
  showNotification?: boolean;
}

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  data,
  title = 'Thành công',
  message = 'Dữ liệu đã được tải thành công!',
  showNotification = true
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (data && showNotification) {
      addNotification({
        type: 'success',
        title,
        message,
        duration: 4000
      });
    }
  }, [data, title, message, showNotification, addNotification]);

  return null;
};

export default ErrorNotification; 
import { useEffect, useState } from 'react';
import { useNotifications } from '../components/notifications';

interface LoadingState {
  loading: boolean;
  error: string | null;
  data: unknown;
}

interface UseNotificationStatusProps {
  loadingStates: LoadingState[];
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  showLoadingNotification?: boolean;
}

export const useNotificationStatus = ({
  loadingStates,
  successMessage = "Dữ liệu đã được tải thành công!",
  errorMessage = "Có lỗi xảy ra khi tải dữ liệu",
  loadingMessage = "Đang tải dữ liệu...",
  showLoadingNotification = false
}: UseNotificationStatusProps) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Check if any state is loading
    const isLoading = loadingStates.some(state => state.loading);
    const hasError = loadingStates.some(state => state.error);
    const hasData = loadingStates.some(state => state.data && !state.loading);

    // Show loading notification if enabled
    if (isLoading && showLoadingNotification) {
      addNotification({
        type: 'info',
        title: 'Đang tải',
        message: loadingMessage,
        duration: 3000
      });
    }

    // Show success notification when data is loaded
    if (hasData && !isLoading && !hasError) {
      addNotification({
        type: 'success',
        title: 'Thành công',
        message: successMessage,
        duration: 4000
      });
    }

    // Show error notification
    if (hasError && !isLoading) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: errorMessage,
        duration: 6000
      });
    }
  }, [loadingStates, successMessage, errorMessage, loadingMessage, showLoadingNotification, addNotification]);
};

// Hook for single loading state
export const useSingleNotificationStatus = (
  loadingState: LoadingState,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    loadingMessage?: string;
    showLoadingNotification?: boolean;
  }
) => {
  useNotificationStatus({
    loadingStates: [loadingState],
    successMessage: options?.successMessage,
    errorMessage: options?.errorMessage,
    loadingMessage: options?.loadingMessage,
    showLoadingNotification: options?.showLoadingNotification
  });
};

// Hook for API data with notifications
export const useApiDataWithNotifications = <T>(
  url: string,
  fromDate: string,
  toDate: string,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    loadingMessage?: string;
    showLoadingNotification?: boolean;
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Show loading notification if enabled
    if (options?.showLoadingNotification) {
      addNotification({
        type: 'info',
        title: 'Đang tải',
        message: options.loadingMessage || 'Đang tải dữ liệu...',
        duration: 3000
      });
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromDate, toDate }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            return null;
          }
          throw new Error("API error: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
        
        // Show success notification
        if (data) {
          addNotification({
            type: 'success',
            title: 'Thành công',
            message: options?.successMessage || 'Dữ liệu đã được tải thành công!',
            duration: 4000
          });
        }
      })
      .catch((err) => {
        if (!err.message.includes("404")) {
          setError(err.message);
          
          // Show error notification
          addNotification({
            type: 'error',
            title: 'Lỗi',
            message: options?.errorMessage || 'Có lỗi xảy ra khi tải dữ liệu',
            duration: 6000
          });
        }
        setLoading(false);
      });
  }, [url, fromDate, toDate, addNotification, options]);

  return { data, loading, error };
}; 
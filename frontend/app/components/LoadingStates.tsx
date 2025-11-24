import React from 'react';
import { SkeletonCard, SkeletonChart, SkeletonTable, SkeletonPieChart, SkeletonStatsCard } from './ui/skeleton';

interface LoadingStatesProps {
  type: 'card' | 'chart' | 'table' | 'pie' | 'stats';
  className?: string;
  rows?: number;
  cols?: number;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type,
  className = '',
  rows,
  cols,
}) => {
  switch (type) {
    case 'card':
      return <SkeletonCard className={className} />;
    case 'chart':
      return <SkeletonChart className={className} />;
    case 'table':
      return <SkeletonTable rows={rows} cols={cols} className={className} />;
    case 'pie':
      return <SkeletonPieChart className={className} />;
    case 'stats':
      return <SkeletonStatsCard className={className} />;
    default:
      return <SkeletonCard className={className} />;
  }
};

// Error state component
interface ErrorStateProps {
  error: string | null;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading wrapper component
interface LoadingWrapperProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingType?: 'card' | 'chart' | 'table' | 'pie' | 'stats';
  className?: string;
  skeletonProps?: {
    rows?: number;
    cols?: number;
  };
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  error,
  onRetry,
  children,
  loadingType = 'card',
  className = '',
  skeletonProps,
}) => {
  if (loading) {
    return (
      <LoadingStates
        type={loadingType}
        className={className}
        rows={skeletonProps?.rows}
        cols={skeletonProps?.cols}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  return <>{children}</>;
};

// Stale data indicator
interface StaleDataIndicatorProps {
  isStale: boolean;
  className?: string;
}

export const StaleDataIndicator: React.FC<StaleDataIndicatorProps> = ({
  isStale,
  className = '',
}) => {
  if (!isStale) return null;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}>
      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></div>
      Đang cập nhật...
    </div>
  );
};

// Performance indicator
interface PerformanceIndicatorProps {
  loadTime: number;
  className?: string;
}

export const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({
  loadTime,
  className = '',
}) => {
  const getPerformanceColor = (time: number) => {
    if (time < 1000) return 'text-green-600';
    if (time < 3000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceText = (time: number) => {
    if (time < 1000) return 'Tuyệt vời';
    if (time < 3000) return 'Tốt';
    return 'Chậm';
  };

  return (
    <div className={`text-xs ${getPerformanceColor(loadTime)} ${className}`}>
      {getPerformanceText(loadTime)} ({loadTime.toFixed(0)}ms)
    </div>
  );
};

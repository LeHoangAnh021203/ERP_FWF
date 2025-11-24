"use client";
import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'spinner' | 'skeleton' | 'dots';
}

export const LoadingSpinner: React.FC<LoadingProps> = ({ 
  message = "Đang tải...", 
  size = 'md',
  type = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (type === 'skeleton') {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="ml-3 text-gray-600">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      <span className={`ml-3 text-gray-600 ${textSizes[size]}`}>{message}</span>
    </div>
  );
};

export const ChartLoading: React.FC<{ message?: string }> = ({ message = "Đang tải biểu đồ..." }) => (
  <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-6 text-center">
    <LoadingSpinner message={message} size="md" type="spinner" />
  </div>
);

export const TableLoading: React.FC<{ message?: string }> = ({ message = "Đang tải bảng..." }) => (
  <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-6 text-center">
    <LoadingSpinner message={message} size="md" type="spinner" />
  </div>
);

export const StatsLoading: React.FC<{ message?: string }> = ({ message = "Đang tải thống kê..." }) => (
  <div className="w-full bg-white rounded-xl shadow-lg mt-5 p-6 text-center">
    <LoadingSpinner message={message} size="md" type="spinner" />
  </div>
);

export default LoadingSpinner; 
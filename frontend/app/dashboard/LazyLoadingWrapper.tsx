"use client";

import React, { Suspense } from "react";
import { SkeletonChart, SkeletonTable, SkeletonCard } from "@/app/components/ui/skeleton";

interface LazyLoadingWrapperProps {
  children: React.ReactNode;
  type?: "chart" | "table" | "card" | "section";
  minHeight?: string;
}

export const LazyLoadingWrapper: React.FC<LazyLoadingWrapperProps> = ({
  children,
  type = "section",
  minHeight = "300px",
}) => {
  const LoadingComponent = () => {
    switch (type) {
      case "chart":
        return (
          <div style={{ minHeight }}>
            <SkeletonChart />
          </div>
        );
      case "table":
        return (
          <div style={{ minHeight }}>
            <SkeletonTable rows={5} cols={4} />
          </div>
        );
      case "card":
        return (
          <div style={{ minHeight }}>
            <SkeletonCard />
          </div>
        );
      default:
        return (
          <div style={{ minHeight }} className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#41d1d9]"></div>
              <span className="text-gray-600 text-sm">Đang tải...</span>
            </div>
          </div>
        );
    }
  };

  return <Suspense fallback={<LoadingComponent />}>{children}</Suspense>;
};

// Wrapper component that only shows content when data is ready
interface ConditionalRenderProps {
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
  data: unknown;
  fallback?: React.ReactNode;
  minHeight?: string;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  loading,
  error,
  data,
  fallback,
  minHeight = "300px",
}) => {
  // Show error if exists
  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200" style={{ minHeight }}>
        <span className="text-red-600 text-sm">{error}</span>
      </div>
    );
  }

  // Show loading ONLY if still loading (not based on data existence)
  // Let components handle empty data states themselves
  if (loading) {
    return (
      fallback || (
        <div style={{ minHeight }} className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#41d1d9]"></div>
            <span className="text-gray-600 text-sm">Đang tải dữ liệu...</span>
          </div>
        </div>
      )
    );
  }

  // Loading is complete, show children (even if data is empty/null)
  // Components will handle their own empty states
  return <>{children}</>;
};


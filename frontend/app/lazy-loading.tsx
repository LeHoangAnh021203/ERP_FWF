"use client";
import React, { Suspense, lazy } from 'react';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Đang tải...</span>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Đã xảy ra lỗi
            </h3>
            <p className="text-gray-600 mb-4">
              Không thể tải nội dung. Vui lòng thử lại.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy loading wrapper
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const LazyComponent = lazy(() => 
    Promise.resolve({ default: Component })
  );

  const WrappedComponent = (props: P) => (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Lazy loading for chart components
export const LazyChart = withLazyLoading(({ children }: { children: React.ReactNode }) => (
  <div className="w-full">
    {children}
  </div>
));

// Lazy loading for table components
export const LazyTable = withLazyLoading(({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-x-auto">
    {children}
  </div>
));

// Lazy loading for card components
export const LazyCard = withLazyLoading(({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    {children}
  </div>
));

export default withLazyLoading; 
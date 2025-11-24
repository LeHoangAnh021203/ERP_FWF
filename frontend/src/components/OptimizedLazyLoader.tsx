import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface OptimizedLazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  onLoad?: () => void;
}

export const OptimizedLazyLoader: React.FC<OptimizedLazyLoaderProps> = ({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  onLoad
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          onLoad?.();
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasLoaded, onLoad]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Optimized chart wrapper with lazy loading
interface OptimizedChartWrapperProps {
  children: ReactNode;
  title: string;
  isMobile: boolean;
  className?: string;
}

export const OptimizedChartWrapper: React.FC<OptimizedChartWrapperProps> = ({
  children,
  title,
  isMobile,
  className = ''
}) => {
  return (
    <OptimizedLazyLoader
      className={`bg-white pt-2 mt-5 rounded-xl shadow-lg ${
        isMobile ? "w-full max-w-xs mx-auto flex flex-col items-center" : ""
      } ${className}`}
      fallback={
        <div className="bg-white pt-2 mt-5 rounded-xl shadow-lg p-6">
          <h2 className="text-base lg:text-xl text-center font-semibold text-gray-800 mb-4">
            {title}
          </h2>
          <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
        </div>
      }
    >
      {children}
    </OptimizedLazyLoader>
  );
};

// Optimized table wrapper
interface OptimizedTableWrapperProps {
  children: ReactNode;
  title: string;
  isMobile: boolean;
  className?: string;
}

export const OptimizedTableWrapper: React.FC<OptimizedTableWrapperProps> = ({
  children,
  title,
  isMobile,
  className = ''
}) => {
  return (
    <OptimizedLazyLoader
      className={`bg-white pt-2 mt-5 rounded-xl shadow-lg overflow-hidden ${
        isMobile ? "w-full" : ""
      } ${className}`}
      fallback={
        <div className="bg-white pt-2 mt-5 rounded-xl shadow-lg p-6">
          <h2 className="text-base lg:text-xl text-center font-semibold text-gray-800 mb-4">
            {title}
          </h2>
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </OptimizedLazyLoader>
  );
};


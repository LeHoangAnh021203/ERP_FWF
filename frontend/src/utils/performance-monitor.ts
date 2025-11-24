import React from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, (metric: number) => void> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure execution time
  measureTime<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    this.recordMetric(name, duration);
    return result;
  }

  // Measure async execution time
  async measureTimeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;
    
    this.recordMetric(name, duration);
    return result;
  }

  // Record a metric
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Notify observers
    this.observers.get(name)?.(value);

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && value > 100) {
      console.warn(`⚠️ Slow operation detected: ${name} took ${value.toFixed(2)}ms`);
    }
  }

  // Get average metric
  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // Get all metrics
  getAllMetrics(): Record<string, { avg: number; count: number; min: number; max: number }> {
    const result: Record<string, { avg: number; count: number; min: number; max: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[name] = {
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    }
    
    return result;
  }

  // Clear metrics
  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }

  // Subscribe to metric changes
  subscribe(name: string, callback: (metric: number) => void): () => void {
    this.observers.set(name, callback);
    return () => this.observers.delete(name);
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  const measureTime = <T>(name: string, fn: () => T): T => {
    return monitor.measureTime(name, fn);
  };

  const measureTimeAsync = <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    return monitor.measureTimeAsync(name, fn);
  };

  const getMetrics = () => monitor.getAllMetrics();
  const clearMetrics = (name?: string) => monitor.clearMetrics(name);

  return {
    measureTime,
    measureTimeAsync,
    getMetrics,
    clearMetrics
  };
}

// Memory usage monitoring
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  if ('memory' in performance) {
    const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
    if (memory) {
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }
  }
  
  return {
    used: 0,
    total: 0,
    percentage: 0
  };
}

// Network performance monitoring
export function measureNetworkPerformance(url: string): Promise<number> {
  return new Promise((resolve) => {
    const start = performance.now();
    
    fetch(url, { method: 'HEAD' })
      .then(() => {
        const end = performance.now();
        resolve(end - start);
      })
      .catch(() => {
        resolve(-1); // Error
      });
  });
}

// Component render performance
export function withPerformanceMonitoring<T extends React.ComponentType<unknown>>(
  Component: T,
  name: string
): T {
  const WrappedComponent = React.forwardRef<unknown, React.ComponentProps<T>>((props, ref) => {
    const monitor = PerformanceMonitor.getInstance();
    
    return monitor.measureTime(name, () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const componentProps = Object.assign({}, props, { ref }) as any;
      return React.createElement(Component, componentProps);
    });
  });
  
  WrappedComponent.displayName = `withPerformanceMonitoring(${name})`;
  return WrappedComponent as unknown as T;
}

export default PerformanceMonitor.getInstance();


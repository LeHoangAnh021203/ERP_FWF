import React, { useState, useEffect } from 'react';
import { getCacheStats, clearApiCache } from '../hooks/useOptimizedApiData';

interface PerformanceMetricsProps {
  className?: string;
  showDetails?: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  className = '',
  showDetails = false,
}) => {
  const [cacheStats, setCacheStats] = useState<{
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    totalSize: string;
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setCacheStats(getCacheStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    clearApiCache();
    setCacheStats(getCacheStats());
  };

  if (!showDetails && !cacheStats) return null;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Performance Metrics</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {cacheStats && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Cache Entries:</span>
            <span className="font-medium">{cacheStats.totalEntries}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Valid:</span>
            <span className="text-green-600 font-medium">{cacheStats.validEntries}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Expired:</span>
            <span className="text-red-600 font-medium">{cacheStats.expiredEntries}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Cache Size:</span>
            <span className="font-medium">{cacheStats.totalSize}</span>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Performance Tips</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Cache reduces API calls by {cacheStats?.validEntries || 0} requests</li>
                <li>• Stale-while-revalidate shows data instantly</li>
                <li>• Debounced requests prevent API spam</li>
                <li>• Priority loading optimizes user experience</li>
              </ul>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClearCache}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Clear Cache
              </button>
              <button
                onClick={() => setCacheStats(getCacheStats())}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Refresh Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    apiCallCount: 0,
    cacheHitRate: 0,
    averageResponseTime: 0,
  });

  const startPageLoad = () => {
    const startTime = performance.now();
    return () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
    };
  };

  const recordApiCall = (responseTime: number) => {
    setMetrics(prev => ({
      ...prev,
      apiCallCount: prev.apiCallCount + 1,
      averageResponseTime: (prev.averageResponseTime + responseTime) / 2,
    }));
  };

  const recordCacheHit = () => {
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: prev.cacheHitRate + 1,
    }));
  };

  return {
    metrics,
    startPageLoad,
    recordApiCall,
    recordCacheHit,
  };
};

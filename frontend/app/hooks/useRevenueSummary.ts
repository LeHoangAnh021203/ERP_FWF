import { useState, useEffect } from 'react';

interface RevenueSummaryData {
  totalRevenue: number;
  actualRevenue: number;
  revenueGrowth: number;
  actualGrowth: number;
}

interface UseRevenueSummaryReturn {
  data: RevenueSummaryData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRevenueSummary(fromDate?: string, toDate?: string): UseRevenueSummaryReturn {
  const [data, setData] = useState<RevenueSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tạo URL với query parameters
      const params = new URLSearchParams();
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const url = `/api/sales/revenue-summary${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching revenue summary:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}


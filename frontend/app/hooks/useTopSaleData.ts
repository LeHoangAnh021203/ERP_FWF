import { useState, useEffect } from 'react';
import { ApiService } from '../lib/api-service';

interface TopSaleData {
  employeeName: string;
  bookingCount: number;
}

export function useTopSaleData(fromDate: string, toDate: string) {
  const [data, setData] = useState<TopSaleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    ApiService.post('booking/top-booking', { fromDate, toDate })
      .then((response: unknown) => {
        setData(response as TopSaleData[]);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Top Sale API Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [fromDate, toDate]);

  return { data, loading, error };
}

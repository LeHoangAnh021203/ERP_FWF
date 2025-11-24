import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as T;
}

// Hook for debouncing filter changes
export function useFilterDebounce<T>(
  initialValue: T,
  delay: number = 500,
  onChange?: (value: T) => void
) {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    if (onChange && debouncedValue !== initialValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, initialValue]);

  return [value, setValue, debouncedValue] as const;
}

// Hook for search with debouncing
export function useSearchDebounce(
  initialQuery: string = '',
  delay: number = 300,
  onSearch?: (query: string) => void
) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (onSearch && debouncedQuery !== initialQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, initialQuery]);

  const clearSearch = () => {
    setQuery('');
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    clearSearch,
  };
}

// Hook for form validation with debouncing
export function useValidationDebounce<T>(
  value: T,
  validator: (value: T) => string | null,
  delay: number = 500
) {
  const [error, setError] = useState<string | null>(null);
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    const validationError = validator(debouncedValue);
    setError(validationError);
  }, [debouncedValue, validator]);

  return error;
}

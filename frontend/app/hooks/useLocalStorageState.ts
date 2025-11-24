import { useState, useEffect } from 'react'
import { CalendarDate } from '@internationalized/date'

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Lấy giá trị từ localStorage hoặc sử dụng defaultValue
  const [state, setState] = useState<T>(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Đánh dấu rằng component đã mount trên client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sử dụng useEffect để load từ localStorage sau khi component mount
  useEffect(() => {
    if (typeof window === 'undefined' || !isClient) {
      return
    }
    
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        
        // Xử lý đặc biệt cho CalendarDate
        if (key.includes('Date') && parsed && typeof parsed === 'object' && 'year' in parsed && 'month' in parsed && 'day' in parsed) {
          setState(new CalendarDate(parsed.year, parsed.month, parsed.day) as T)
        } else {
          setState(parsed)
        }
      }
      setIsLoaded(true)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      setIsLoaded(true)
    }
  }, [key, isClient])

  // Cập nhật localStorage khi state thay đổi
  useEffect(() => {
    if (typeof window === 'undefined' || !isClient) {
      return
    }
    
    try {
      // Xử lý đặc biệt cho CalendarDate khi serialize
      let valueToStore = state
      if (key.includes('Date') && state && typeof state === 'object' && 'year' in state && 'month' in state && 'day' in state) {
        const dateState = state as unknown as { year: number; month: number; day: number }
        valueToStore = {
          year: dateState.year,
          month: dateState.month,
          day: dateState.day
        } as T
      }
      
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, state, isClient])

  return [state, setState, isLoaded]
}

// Utility function để clear multiple localStorage keys
export function clearLocalStorageKeys(keys: string[]) {
  if (typeof window !== 'undefined') {
    keys.forEach(key => window.localStorage.removeItem(key));
  }
} 
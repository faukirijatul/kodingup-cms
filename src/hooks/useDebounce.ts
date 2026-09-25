import { useEffect, useState } from 'react';
import { DEFAULT_DEBOUNCE_TIME_MS } from '@/constants/debounce';

export function useDebounce<T>(value: T, delay = DEFAULT_DEBOUNCE_TIME_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

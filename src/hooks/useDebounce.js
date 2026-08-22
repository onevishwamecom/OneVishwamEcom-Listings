import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounced value hook - delays updating the value until after wait ms of inactivity.
 * Useful for search inputs to avoid excessive re-renders/filtering.
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Debounced callback hook - returns a debounced version of the callback.
 * The callback is only invoked after `wait` ms of no calls.
 */
export function useDebouncedCallback(callback, wait) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, wait);
    },
    [wait]
  );
}

/**
 * Throttled callback hook - ensures callback fires at most once per `limit` ms.
 */
export function useThrottledCallback(callback, limit) {
  const inThrottle = useRef(false);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    (...args) => {
      if (!inThrottle.current) {
        callbackRef.current(...args);
        inThrottle.current = true;
        setTimeout(() => (inThrottle.current = false), limit);
      }
    },
    [limit]
  );
}
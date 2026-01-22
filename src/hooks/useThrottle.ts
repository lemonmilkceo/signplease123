import { useRef, useCallback, useEffect } from "react";

/**
 * 값을 스로틀링하는 훅
 * 지정된 간격 동안 최대 한 번만 값을 업데이트합니다.
 * 
 * @param value - 스로틀링할 값
 * @param interval - 스로틀 간격 (밀리초)
 * @returns 스로틀링된 값
 * 
 * @example
 * const throttledScroll = useThrottle(scrollPosition, 100);
 * // 스크롤 이벤트가 아무리 많이 발생해도 100ms마다 한 번만 업데이트
 */
export function useThrottle<T>(value: T, interval: number): T {
  const lastExecutedRef = useRef<number>(Date.now());
  const throttledValueRef = useRef<T>(value);

  if (Date.now() - lastExecutedRef.current >= interval) {
    lastExecutedRef.current = Date.now();
    throttledValueRef.current = value;
  }

  return throttledValueRef.current;
}

/**
 * 함수를 스로틀링하는 훅
 * 지정된 간격 동안 최대 한 번만 함수를 실행합니다.
 * 
 * @param callback - 스로틀링할 함수
 * @param delay - 스로틀 간격 (밀리초)
 * @returns 스로틀링된 함수
 * 
 * @example
 * const handleScroll = useThrottledCallback((e) => {
 *   console.log('Scrolled:', e.target.scrollTop);
 * }, 100);
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = delay - (now - lastExecutedRef.current);

      if (remaining <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
        lastExecutedRef.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastExecutedRef.current = Date.now();
          timeoutRef.current = undefined;
          callback(...args);
        }, remaining);
      }
    },
    [callback, delay]
  ) as T;

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * 디바운스된 함수를 반환하는 훅
 * 마지막 호출 후 지정된 시간이 지나야 함수가 실행됩니다.
 * 
 * @param callback - 디바운스할 함수
 * @param delay - 디바운스 딜레이 (밀리초)
 * @returns 디바운스된 함수
 * 
 * @example
 * const debouncedSearch = useDebouncedCallback((query) => {
 *   fetchSearchResults(query);
 * }, 300);
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

export default useThrottle;

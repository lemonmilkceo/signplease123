import { useCallback, useRef, useEffect } from "react";

interface PrefetchOptions {
  /** 프리페칭 딜레이 (ms, 기본값: 100) */
  delay?: number;
  /** 캐시 TTL (ms, 기본값: 5분) */
  cacheTTL?: number;
}

// 전역 캐시
const prefetchCache = new Map<string, { data: unknown; timestamp: number }>();

/**
 * 데이터 프리페칭 훅
 * hover 또는 포커스 시 데이터를 미리 로드
 * 
 * @example
 * const { prefetch, getPrefetchedData } = usePrefetch();
 * 
 * // hover 시 프리페칭
 * <Link 
 *   to="/contracts/1"
 *   onMouseEnter={() => prefetch("contract-1", () => fetchContract(1))}
 * >
 *   계약서
 * </Link>
 * 
 * // 페이지에서 프리페칭된 데이터 사용
 * const cached = getPrefetchedData("contract-1");
 */
export function usePrefetch(options: PrefetchOptions = {}) {
  const { delay = 100, cacheTTL = 5 * 60 * 1000 } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Set<string>>(new Set());

  // 캐시 정리
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      prefetchCache.forEach((value, key) => {
        if (now - value.timestamp > cacheTTL) {
          prefetchCache.delete(key);
        }
      });
    };

    const interval = setInterval(cleanup, 60000); // 1분마다 정리
    return () => clearInterval(interval);
  }, [cacheTTL]);

  // 프리페치 실행
  const prefetch = useCallback(
    async <T>(key: string, fetcher: () => Promise<T>): Promise<void> => {
      // 이미 캐시에 있거나 진행 중이면 스킵
      if (prefetchCache.has(key) || pendingRef.current.has(key)) {
        return;
      }

      // 딜레이 후 실행
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          pendingRef.current.add(key);
          const data = await fetcher();
          prefetchCache.set(key, { data, timestamp: Date.now() });
        } catch (error) {
          // 프리페칭 실패는 무시
          console.debug("Prefetch failed:", key, error);
        } finally {
          pendingRef.current.delete(key);
        }
      }, delay);
    },
    [delay]
  );

  // 프리페칭 취소
  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 캐시된 데이터 가져오기
  const getPrefetchedData = useCallback(
    <T>(key: string): T | null => {
      const cached = prefetchCache.get(key);
      if (!cached) return null;

      // TTL 체크
      if (Date.now() - cached.timestamp > cacheTTL) {
        prefetchCache.delete(key);
        return null;
      }

      return cached.data as T;
    },
    [cacheTTL]
  );

  // 캐시 삭제
  const invalidateCache = useCallback((key: string) => {
    prefetchCache.delete(key);
  }, []);

  // 전체 캐시 삭제
  const clearCache = useCallback(() => {
    prefetchCache.clear();
  }, []);

  return {
    prefetch,
    cancelPrefetch,
    getPrefetchedData,
    invalidateCache,
    clearCache,
  };
}

/**
 * 라우트 전환 시 프리페칭을 위한 훅
 * Link 컴포넌트와 함께 사용
 * 
 * @example
 * const prefetchProps = useLinkPrefetch("/contracts/1", () => fetchContract(1));
 * <Link to="/contracts/1" {...prefetchProps}>계약서</Link>
 */
export function useLinkPrefetch<T>(
  _to: string, // 라우트 경로 (캐시 키로 사용 가능)
  fetcher: () => Promise<T>,
  options: PrefetchOptions = {}
) {
  const { prefetch, cancelPrefetch, getPrefetchedData } = usePrefetch(options);
  const cacheKey = `route:${_to}`;

  const handleMouseEnter = useCallback(() => {
    prefetch(cacheKey, fetcher);
  }, [prefetch, cacheKey, fetcher]);

  const handleMouseLeave = useCallback(() => {
    cancelPrefetch();
  }, [cancelPrefetch]);

  const handleFocus = useCallback(() => {
    prefetch(cacheKey, fetcher);
  }, [prefetch, cacheKey, fetcher]);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    getCachedData: () => getPrefetchedData<T>(cacheKey),
  };
}

/**
 * 이미지 프리로딩 훅
 * 
 * @example
 * const { preloadImage } = useImagePreload();
 * preloadImage("/images/hero.jpg");
 */
export function useImagePreload() {
  const loadedImages = useRef<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<void> => {
    if (loadedImages.current.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedImages.current.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(
    (sources: string[]): Promise<void[]> => {
      return Promise.all(sources.map(preloadImage));
    },
    [preloadImage]
  );

  return {
    preloadImage,
    preloadImages,
  };
}

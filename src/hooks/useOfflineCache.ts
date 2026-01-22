import { useState, useEffect, useCallback } from "react";
import { useOnlineStatus } from "./useOnlineStatus";
import { getLocalStorage, setLocalStorage } from "../utils";

interface CacheOptions<T> {
  /** 캐시 키 */
  key: string;
  /** 데이터 fetch 함수 */
  fetcher: () => Promise<T>;
  /** 캐시 만료 시간 (밀리초, 기본값: 5분) */
  ttl?: number;
  /** 초기값 */
  initialData?: T;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

interface UseOfflineCacheReturn<T> {
  /** 캐시된 또는 fetch된 데이터 */
  data: T | undefined;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 캐시된 데이터 사용 중인지 여부 */
  isFromCache: boolean;
  /** 수동 새로고침 */
  refetch: () => Promise<void>;
  /** 캐시 삭제 */
  clearCache: () => void;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5분

/**
 * 오프라인 캐싱을 지원하는 데이터 fetch 훅
 * 온라인 시 fetch하고 캐시, 오프라인 시 캐시 데이터 사용
 * 
 * @example
 * const { data, isLoading, isFromCache } = useOfflineCache({
 *   key: "contracts",
 *   fetcher: () => fetchContracts(),
 *   ttl: 10 * 60 * 1000, // 10분
 * });
 * 
 * {isFromCache && <Banner>오프라인 모드 - 저장된 데이터입니다</Banner>}
 */
export function useOfflineCache<T>({
  key,
  fetcher,
  ttl = DEFAULT_TTL,
  initialData,
}: CacheOptions<T>): UseOfflineCacheReturn<T> {
  const isOnline = useOnlineStatus();
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const cacheKey = `offline_cache_${key}`;

  // 캐시에서 데이터 로드
  const loadFromCache = useCallback((): T | undefined => {
    const cached = getLocalStorage<CachedData<T> | null>(cacheKey, null);
    
    if (!cached) return undefined;

    const isExpired = Date.now() - cached.timestamp > ttl;
    
    // 오프라인이면 만료되어도 캐시 사용
    if (!isOnline || !isExpired) {
      return cached.data;
    }
    
    return undefined;
  }, [cacheKey, ttl, isOnline]);

  // 캐시에 데이터 저장
  const saveToCache = useCallback((newData: T) => {
    const cacheData: CachedData<T> = {
      data: newData,
      timestamp: Date.now(),
    };
    setLocalStorage(cacheKey, cacheData);
  }, [cacheKey]);

  // 데이터 fetch
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newData = await fetcher();
      setData(newData);
      setIsFromCache(false);
      saveToCache(newData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("데이터를 불러오는데 실패했습니다"));
      
      // fetch 실패 시 캐시 데이터 사용
      const cachedData = loadFromCache();
      if (cachedData) {
        setData(cachedData);
        setIsFromCache(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, saveToCache, loadFromCache]);

  // 수동 새로고침
  const refetch = useCallback(async () => {
    if (isOnline) {
      await fetchData();
    }
  }, [isOnline, fetchData]);

  // 캐시 삭제
  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
  }, [cacheKey]);

  // 초기 로드 및 온라인 상태 변경 시 처리
  useEffect(() => {
    const cachedData = loadFromCache();

    if (isOnline) {
      // 온라인: fetch 시도
      fetchData();
    } else if (cachedData) {
      // 오프라인: 캐시 데이터 사용
      setData(cachedData);
      setIsFromCache(true);
      setIsLoading(false);
    } else {
      // 오프라인이고 캐시도 없음
      setIsLoading(false);
      setError(new Error("오프라인 상태입니다. 인터넷 연결을 확인해주세요."));
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    isLoading,
    error,
    isFromCache,
    refetch,
    clearCache,
  };
}

/**
 * 간단한 오프라인 상태 알림 컴포넌트용 훅
 */
export function useOfflineNotice() {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      // 다시 온라인이 되었을 때
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
    showReconnected,
  };
}

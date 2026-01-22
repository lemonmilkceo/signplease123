import { useState, useEffect, useCallback, useReducer } from "react";
import { supabase } from "../lib/supabase";
import type { ApiResponse } from "../types";

// ============================================================================
// Types
// ============================================================================

interface ResourceState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

type ResourceAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { data: T[]; total: number } }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_ITEM"; payload: T }
  | { type: "UPDATE_ITEM"; payload: { id: string; updates: Partial<T> } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "RESET" };

interface UseResourceOptions<T> {
  /** 초기 데이터 */
  initialData?: T[];
  /** 자동 fetch 여부 (기본값: true) */
  autoFetch?: boolean;
  /** 필터 조건 */
  filter?: Record<string, unknown>;
  /** 정렬 조건 */
  orderBy?: { column: string; ascending?: boolean };
  /** 페이지네이션 */
  pagination?: { page: number; pageSize: number };
  /** 실시간 구독 여부 */
  realtime?: boolean;
}

interface UseResourceReturn<T> {
  /** 데이터 목록 */
  data: T[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 전체 개수 */
  total: number;
  /** 데이터 새로고침 */
  refetch: () => Promise<void>;
  /** 항목 추가 */
  create: (item: Partial<T>) => Promise<ApiResponse<T>>;
  /** 항목 수정 */
  update: (id: string, updates: Partial<T>) => Promise<ApiResponse<T>>;
  /** 항목 삭제 */
  remove: (id: string) => Promise<ApiResponse<null>>;
  /** 상태 리셋 */
  reset: () => void;
}

// ============================================================================
// Reducer
// ============================================================================

function createResourceReducer<T>() {
  return function resourceReducer(
    state: ResourceState<T>,
    action: ResourceAction<T>
  ): ResourceState<T> {
    switch (action.type) {
      case "FETCH_START":
        return { ...state, isLoading: true, error: null };

      case "FETCH_SUCCESS":
        return {
          ...state,
          data: action.payload.data,
          total: action.payload.total,
          isLoading: false,
          error: null,
        };

      case "FETCH_ERROR":
        return { ...state, isLoading: false, error: action.payload };

      case "ADD_ITEM":
        return {
          ...state,
          data: [action.payload, ...state.data],
          total: state.total + 1,
        };

      case "UPDATE_ITEM": {
        const { id, updates } = action.payload;
        return {
          ...state,
          data: state.data.map((item) =>
            (item as { id: string }).id === id ? { ...item, ...updates } : item
          ),
        };
      }

      case "REMOVE_ITEM":
        return {
          ...state,
          data: state.data.filter(
            (item) => (item as { id: string }).id !== action.payload
          ),
          total: state.total - 1,
        };

      case "RESET":
        return { data: [], isLoading: false, error: null, total: 0 };

      default:
        return state;
    }
  };
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Supabase 테이블에 대한 CRUD 작업을 위한 제네릭 훅
 * 
 * @example
 * const { data, isLoading, create, update, remove } = useResource<Contract>("contracts", {
 *   filter: { employer_id: userId },
 *   orderBy: { column: "created_at", ascending: false },
 *   realtime: true,
 * });
 */
export function useResource<T extends { id: string }>(
  tableName: string,
  options: UseResourceOptions<T> = {}
): UseResourceReturn<T> {
  const {
    initialData = [],
    autoFetch = true,
    filter,
    orderBy,
    pagination,
    realtime = false,
  } = options;

  const reducer = createResourceReducer<T>();
  const [state, dispatch] = useReducer(reducer, {
    data: initialData,
    isLoading: autoFetch,
    error: null,
    total: initialData.length,
  });

  // Fetch 함수
  const refetch = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      let query = supabase.from(tableName).select("*", { count: "exact" });

      // 필터 적용
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // 정렬 적용
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? false,
        });
      }

      // 페이지네이션 적용
      if (pagination) {
        const { page, pageSize } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
        return;
      }

      dispatch({
        type: "FETCH_SUCCESS",
        payload: { data: (data as T[]) || [], total: count || 0 },
      });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다",
      });
    }
  }, [tableName, filter, orderBy, pagination]);

  // Create
  const create = useCallback(
    async (item: Partial<T>): Promise<ApiResponse<T>> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .insert(item)
          .select()
          .single();

        if (error) {
          return { data: null, error: { code: error.code, message: error.message }, success: false };
        }

        dispatch({ type: "ADD_ITEM", payload: data as T });
        return { data: data as T, error: null, success: true };
      } catch (err) {
        return {
          data: null,
          error: { code: "UNKNOWN", message: err instanceof Error ? err.message : "생성 실패" },
          success: false,
        };
      }
    },
    [tableName]
  );

  // Update
  const update = useCallback(
    async (id: string, updates: Partial<T>): Promise<ApiResponse<T>> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          return { data: null, error: { code: error.code, message: error.message }, success: false };
        }

        dispatch({ type: "UPDATE_ITEM", payload: { id, updates } });
        return { data: data as T, error: null, success: true };
      } catch (err) {
        return {
          data: null,
          error: { code: "UNKNOWN", message: err instanceof Error ? err.message : "수정 실패" },
          success: false,
        };
      }
    },
    [tableName]
  );

  // Remove
  const remove = useCallback(
    async (id: string): Promise<ApiResponse<null>> => {
      try {
        const { error } = await supabase.from(tableName).delete().eq("id", id);

        if (error) {
          return { data: null, error: { code: error.code, message: error.message }, success: false };
        }

        dispatch({ type: "REMOVE_ITEM", payload: id });
        return { data: null, error: null, success: true };
      } catch (err) {
        return {
          data: null,
          error: { code: "UNKNOWN", message: err instanceof Error ? err.message : "삭제 실패" },
          success: false,
        };
      }
    },
    [tableName]
  );

  // Reset
  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // 자동 fetch
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  // 실시간 구독
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel(`${tableName}_changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          if (payload.eventType === "INSERT") {
            dispatch({ type: "ADD_ITEM", payload: payload.new as T });
          } else if (payload.eventType === "UPDATE") {
            dispatch({
              type: "UPDATE_ITEM",
              payload: { id: (payload.new as T).id, updates: payload.new as Partial<T> },
            });
          } else if (payload.eventType === "DELETE") {
            dispatch({ type: "REMOVE_ITEM", payload: (payload.old as T).id });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, realtime]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    total: state.total,
    refetch,
    create,
    update,
    remove,
    reset,
  };
}

/**
 * 단일 리소스 조회를 위한 훅
 */
export function useSingleResource<T extends { id: string }>(
  tableName: string,
  id: string | null
): {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fetchError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setData(result as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  }, [tableName, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

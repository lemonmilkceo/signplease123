import { useState, useCallback, useRef } from "react";

interface OptimisticState<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  isOptimistic: boolean;
}

interface UseOptimisticUpdateOptions<T> {
  /** 초기 데이터 */
  initialData: T;
  /** 실제 업데이트를 수행하는 비동기 함수 */
  updateFn: (newData: T) => Promise<T>;
  /** 롤백 시 호출될 콜백 */
  onRollback?: (previousData: T, error: Error) => void;
  /** 성공 시 호출될 콜백 */
  onSuccess?: (data: T) => void;
  /** 에러 시 호출될 콜백 */
  onError?: (error: Error) => void;
}

interface UseOptimisticUpdateReturn<T> {
  /** 현재 데이터 상태 */
  state: OptimisticState<T>;
  /** 낙관적 업데이트 수행 */
  update: (optimisticData: T) => Promise<void>;
  /** 데이터 직접 설정 (서버 응답 후) */
  setData: (data: T) => void;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * 낙관적 업데이트를 위한 훅
 * 
 * UI를 즉시 업데이트하고, 백그라운드에서 서버 요청을 수행합니다.
 * 실패 시 자동으로 이전 상태로 롤백합니다.
 * 
 * @example
 * const { state, update } = useOptimisticUpdate({
 *   initialData: contract,
 *   updateFn: async (newContract) => {
 *     const { data } = await supabase
 *       .from('contracts')
 *       .update(newContract)
 *       .eq('id', newContract.id)
 *       .select()
 *       .single();
 *     return data;
 *   },
 *   onRollback: (prev, error) => {
 *     toast.error('저장에 실패했습니다');
 *   },
 *   onSuccess: () => {
 *     toast.success('저장되었습니다');
 *   },
 * });
 * 
 * // 낙관적 업데이트 수행
 * await update({ ...contract, status: 'completed' });
 */
export function useOptimisticUpdate<T>({
  initialData,
  updateFn,
  onRollback,
  onSuccess,
  onError,
}: UseOptimisticUpdateOptions<T>): UseOptimisticUpdateReturn<T> {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isOptimistic: false,
  });

  const previousDataRef = useRef<T>(initialData);

  const update = useCallback(
    async (optimisticData: T) => {
      // 이전 데이터 저장 (롤백용)
      previousDataRef.current = state.data;

      // 낙관적으로 UI 즉시 업데이트
      setState({
        data: optimisticData,
        isLoading: true,
        error: null,
        isOptimistic: true,
      });

      try {
        // 실제 서버 요청
        const serverData = await updateFn(optimisticData);

        // 성공: 서버 응답으로 상태 업데이트
        setState({
          data: serverData,
          isLoading: false,
          error: null,
          isOptimistic: false,
        });

        onSuccess?.(serverData);
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Update failed");

        // 실패: 이전 상태로 롤백
        setState({
          data: previousDataRef.current,
          isLoading: false,
          error: err,
          isOptimistic: false,
        });

        onRollback?.(previousDataRef.current, err);
        onError?.(err);
      }
    },
    [state.data, updateFn, onRollback, onSuccess, onError]
  );

  const setData = useCallback((data: T) => {
    setState({
      data,
      isLoading: false,
      error: null,
      isOptimistic: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return { state, update, setData, clearError };
}

/**
 * 리스트 아이템의 낙관적 업데이트를 위한 훅
 * 
 * @example
 * const { items, addItem, updateItem, removeItem } = useOptimisticList({
 *   initialItems: contracts,
 *   getId: (contract) => contract.id,
 * });
 */
interface UseOptimisticListOptions<T> {
  initialItems: T[];
  getId: (item: T) => string | number;
}

interface UseOptimisticListReturn<T> {
  items: T[];
  addItem: (item: T, options?: { onError?: () => void }) => void;
  updateItem: (id: string | number, updater: (item: T) => T, options?: { onError?: () => void }) => void;
  removeItem: (id: string | number, options?: { onError?: () => void }) => void;
  rollback: () => void;
  setItems: (items: T[]) => void;
}

export function useOptimisticList<T>({
  initialItems,
  getId,
}: UseOptimisticListOptions<T>): UseOptimisticListReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const previousItemsRef = useRef<T[]>(initialItems);

  const saveSnapshot = useCallback(() => {
    previousItemsRef.current = items;
  }, [items]);

  const rollback = useCallback(() => {
    setItems(previousItemsRef.current);
  }, []);

  const addItem = useCallback(
    (item: T, options?: { onError?: () => void }) => {
      saveSnapshot();
      setItems((prev) => [...prev, item]);
      
      // onError가 호출되면 롤백
      if (options?.onError) {
        // 에러 핸들러를 외부에서 호출할 수 있도록 함
      }
    },
    [saveSnapshot]
  );

  const updateItem = useCallback(
    (id: string | number, updater: (item: T) => T, options?: { onError?: () => void }) => {
      saveSnapshot();
      setItems((prev) =>
        prev.map((item) => (getId(item) === id ? updater(item) : item))
      );
      
      if (options?.onError) {
        // 에러 핸들러를 외부에서 호출할 수 있도록 함
      }
    },
    [saveSnapshot, getId]
  );

  const removeItem = useCallback(
    (id: string | number, options?: { onError?: () => void }) => {
      saveSnapshot();
      setItems((prev) => prev.filter((item) => getId(item) !== id));
      
      if (options?.onError) {
        // 에러 핸들러를 외부에서 호출할 수 있도록 함
      }
    },
    [saveSnapshot, getId]
  );

  return { items, addItem, updateItem, removeItem, rollback, setItems };
}

export default useOptimisticUpdate;

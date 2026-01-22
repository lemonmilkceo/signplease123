import { useEffect, useCallback, useState } from "react";
import { useBlocker } from "react-router-dom";

interface UseUnsavedChangesOptions {
  /** 변경사항이 있는지 여부 */
  hasChanges: boolean;
  /** 이탈 확인 메시지 */
  message?: string;
  /** 브라우저 beforeunload 이벤트도 처리할지 */
  blockBrowserNavigation?: boolean;
}

interface UseUnsavedChangesReturn {
  /** 현재 블록 상태 */
  isBlocked: boolean;
  /** 이탈 확인 후 진행 */
  proceed: () => void;
  /** 이탈 취소 */
  cancel: () => void;
  /** 변경사항 리셋 (저장 완료 시 호출) */
  resetChanges: () => void;
}

/**
 * 저장되지 않은 변경사항이 있을 때 페이지 이탈을 막는 훅
 * 
 * @example
 * const form = useFormValidation({ ... });
 * const { isBlocked, proceed, cancel } = useUnsavedChanges({
 *   hasChanges: form.isDirty,
 *   message: "저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?",
 * });
 * 
 * // 확인 모달 표시
 * {isBlocked && (
 *   <ConfirmModal
 *     message="저장하지 않은 변경사항이 있습니다."
 *     onConfirm={proceed}
 *     onCancel={cancel}
 *   />
 * )}
 */
export function useUnsavedChanges({
  hasChanges,
  message = "저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?",
  blockBrowserNavigation = true,
}: UseUnsavedChangesOptions): UseUnsavedChangesReturn {
  const [shouldBlock, setShouldBlock] = useState(hasChanges);

  // hasChanges 변경 시 업데이트
  useEffect(() => {
    setShouldBlock(hasChanges);
  }, [hasChanges]);

  // React Router 네비게이션 블록
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldBlock && currentLocation.pathname !== nextLocation.pathname
  );

  // 브라우저 beforeunload 이벤트 처리 (새로고침, 탭 닫기 등)
  useEffect(() => {
    if (!blockBrowserNavigation || !shouldBlock) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock, message, blockBrowserNavigation]);

  // 이탈 진행
  const proceed = useCallback(() => {
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  }, [blocker]);

  // 이탈 취소
  const cancel = useCallback(() => {
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker]);

  // 변경사항 리셋 (저장 완료 시)
  const resetChanges = useCallback(() => {
    setShouldBlock(false);
  }, []);

  return {
    isBlocked: blocker.state === "blocked",
    proceed,
    cancel,
    resetChanges,
  };
}

/**
 * 간단한 확인 모달용 훅 (useUnsavedChanges와 함께 사용)
 */
interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function useConfirmDialog(): {
  dialogProps: ConfirmDialogProps | null;
  showConfirm: (options: Omit<ConfirmDialogProps, "isOpen">) => void;
  hideConfirm: () => void;
} {
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps | null>(null);

  const showConfirm = useCallback((options: Omit<ConfirmDialogProps, "isOpen">) => {
    setDialogProps({ ...options, isOpen: true });
  }, []);

  const hideConfirm = useCallback(() => {
    setDialogProps(null);
  }, []);

  return { dialogProps, showConfirm, hideConfirm };
}

export default useUnsavedChanges;

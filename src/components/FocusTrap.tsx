import { useEffect, useRef, ReactNode } from "react";

interface FocusTrapProps {
  /** 자식 요소 */
  children: ReactNode;
  /** 활성화 여부 */
  active?: boolean;
  /** 초기 포커스 요소 선택자 (기본: 첫 번째 포커스 가능 요소) */
  initialFocus?: string;
  /** ESC 키 눌렀을 때 콜백 */
  onEscape?: () => void;
  /** 포커스 트랩 해제 시 원래 요소로 복귀 여부 */
  restoreFocus?: boolean;
}

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * 포커스 트랩 컴포넌트
 * 모달, 다이얼로그 등에서 포커스가 외부로 벗어나지 않도록 함
 * 
 * @example
 * <FocusTrap active={isModalOpen} onEscape={closeModal}>
 *   <Modal>...</Modal>
 * </FocusTrap>
 */
export function FocusTrap({
  children,
  active = true,
  initialFocus,
  onEscape,
  restoreFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 포커스 가능한 요소 목록 가져오기
  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => el.offsetParent !== null); // 보이는 요소만
  };

  // 초기 포커스 설정
  useEffect(() => {
    if (!active) return;

    // 이전 포커스 요소 저장
    previousActiveElement.current = document.activeElement as HTMLElement;

    // 초기 포커스 설정
    const focusableElements = getFocusableElements();
    
    if (initialFocus) {
      const initialElement = containerRef.current?.querySelector<HTMLElement>(initialFocus);
      if (initialElement) {
        initialElement.focus();
        return;
      }
    }

    // 첫 번째 포커스 가능 요소에 포커스
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    return () => {
      // 포커스 복원
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, initialFocus, restoreFocus]);

  // 키보드 이벤트 처리
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC 키
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      // Tab 키 트랩
      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();
        
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab (역방향)
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab (순방향)
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onEscape]);

  // 외부 클릭 시 포커스 복원
  useEffect(() => {
    if (!active) return;

    const handleFocusOut = (event: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.relatedTarget as Node)
      ) {
        // 포커스가 컨테이너 외부로 이동하려 하면 첫 번째 요소로 포커스
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    containerRef.current?.addEventListener("focusout", handleFocusOut);
    return () =>
      containerRef.current?.removeEventListener("focusout", handleFocusOut);
  }, [active]);

  return (
    <div ref={containerRef} data-focus-trap={active ? "true" : "false"}>
      {children}
    </div>
  );
}

/**
 * 포커스 트랩을 위한 훅
 * 커스텀 구현이 필요할 때 사용
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const focusableElements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) || []
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return containerRef;
}

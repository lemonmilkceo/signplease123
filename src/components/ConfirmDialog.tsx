import { useEffect, useRef } from "react";
import { Button } from "./ui";
import { cn } from "../utils";

interface ConfirmDialogProps {
  /** 다이얼로그 열림 상태 */
  isOpen: boolean;
  /** 제목 */
  title?: string;
  /** 메시지 */
  message: string;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  /** 확인 버튼 스타일 */
  confirmVariant?: "primary" | "destructive";
  /** 확인 콜백 */
  onConfirm: () => void;
  /** 취소 콜백 */
  onCancel: () => void;
}

/**
 * 확인 다이얼로그 컴포넌트
 * 
 * @example
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   title="삭제 확인"
 *   message="정말 삭제하시겠습니까?"
 *   confirmText="삭제"
 *   confirmVariant="destructive"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */
export function ConfirmDialog({
  isOpen,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // ESC 키로 닫기 및 포커스 트랩
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
      
      // 포커스 트랩
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // 다이얼로그 열릴 때 취소 버튼에 포커스
    cancelButtonRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 animate-in fade-in duration-200"
      )}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className={cn(
          "w-full max-w-sm bg-card rounded-2xl shadow-xl p-6",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        <h2
          id="confirm-title"
          className="text-title text-foreground mb-2"
        >
          {title}
        </h2>
        
        <p
          id="confirm-message"
          className="text-body text-muted-foreground mb-6"
        >
          {message}
        </p>

        <div className="flex gap-3">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            size="md"
            fullWidth
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="md"
            fullWidth
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

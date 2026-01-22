import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastIcons: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️",
};

const toastStyles: Record<ToastType, string> = {
  success: "bg-success/10 border-success/20 text-success",
  error: "bg-destructive/10 border-destructive/20 text-destructive",
  info: "bg-primary/10 border-primary/20 text-primary",
  warning: "bg-warning/10 border-warning/20 text-warning",
};

/**
 * 개별 토스트 컴포넌트
 */
function ToastItem({ 
  toast, 
  onClose 
}: { 
  toast: Toast; 
  onClose: () => void;
}) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
        animate-slide-up backdrop-blur-lg
        ${toastStyles[toast.type]}
      `}
    >
      <span aria-hidden="true">{toastIcons[toast.type]}</span>
      <p className="text-body font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="알림 닫기"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * 토스트 컨테이너 - 토스트 목록 렌더링
 */
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 max-w-[448px] mx-auto pointer-events-none"
      aria-label="알림 목록"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        </div>
      ))}
    </div>
  );
}

/**
 * 토스트 프로바이더
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    // 자동 제거
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (message: string, duration?: number) => addToast("success", message, duration),
    error: (message: string, duration?: number) => addToast("error", message, duration),
    info: (message: string, duration?: number) => addToast("info", message, duration),
    warning: (message: string, duration?: number) => addToast("warning", message, duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * 토스트 훅
 * @example
 * const { toast } = useToast();
 * toast.success("저장되었습니다!");
 * toast.error("오류가 발생했습니다");
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

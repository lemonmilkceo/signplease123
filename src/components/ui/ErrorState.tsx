import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  suggestion?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * 에러 상태를 표시하는 컴포넌트
 * 에러 메시지와 복구 방법을 안내
 */
export function ErrorState({
  title = "오류가 발생했습니다",
  message,
  suggestion,
  onRetry,
  retryLabel = "다시 시도",
  className = "",
}: ErrorStateProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <span className="text-4xl" aria-hidden="true">⚠️</span>
      </div>
      <h3 className="text-body font-semibold text-destructive mb-2">{title}</h3>
      <p className="text-caption text-muted-foreground mb-2">{message}</p>
      {suggestion && (
        <p className="text-caption text-muted-foreground mb-4">{suggestion}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

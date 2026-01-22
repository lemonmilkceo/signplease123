interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-10 h-10 border-3",
};

/**
 * 재사용 가능한 로딩 스피너 컴포넌트
 */
export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={`
        animate-spin rounded-full border-primary border-t-transparent
        ${sizeClasses[size]}
        ${className}
      `}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * 전체 화면 또는 영역 로딩 상태 컴포넌트
 */
export function LoadingState({ 
  message = "로딩 중...", 
  size = "lg",
  className = "" 
}: LoadingStateProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-16 ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-body text-muted-foreground">{message}</p>
    </div>
  );
}

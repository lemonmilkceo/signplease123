import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

/**
 * 빈 상태를 표시하는 컴포넌트
 * 검색 결과 없음, 목록이 비어있음 등의 상태에 사용
 */
export function EmptyState({
  icon = "📭",
  title,
  message,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
      role="status"
    >
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
        <span className="text-4xl" aria-hidden="true">{icon}</span>
      </div>
      {title && (
        <h3 className="text-body font-semibold text-foreground mb-2">{title}</h3>
      )}
      <p className="text-body text-muted-foreground mb-2">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

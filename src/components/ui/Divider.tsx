interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  children?: React.ReactNode;
}

/**
 * 구분선 컴포넌트
 * 텍스트와 함께 사용 가능 (예: "또는" 구분선)
 */
export function Divider({ 
  orientation = "horizontal", 
  className = "",
  children 
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div 
        className={`w-px bg-border self-stretch ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (children) {
    return (
      <div className={`flex items-center gap-4 ${className}`} role="separator">
        <div className="flex-1 h-px bg-border" />
        <span className="text-caption text-muted-foreground">{children}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return (
    <div 
      className={`h-px bg-border w-full ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}

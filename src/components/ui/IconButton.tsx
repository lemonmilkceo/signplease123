import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type IconButtonSize = "sm" | "md" | "lg";
type IconButtonVariant = "default" | "ghost" | "outline";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string; // 필수: 접근성을 위한 레이블
  icon: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  badge?: number;
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "w-8 h-8 min-w-[44px] min-h-[44px]", // 터치 타겟 44px 보장
  md: "w-10 h-10 min-w-[44px] min-h-[44px]",
  lg: "w-12 h-12",
};

const variantClasses: Record<IconButtonVariant, string> = {
  default: "bg-secondary text-foreground hover:bg-secondary/80",
  ghost: "bg-transparent text-foreground hover:bg-secondary",
  outline: "bg-transparent border border-border text-foreground hover:bg-secondary",
};

/**
 * 접근성을 고려한 아이콘 버튼 컴포넌트
 * aria-label 필수 prop으로 스크린 리더 지원
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      "aria-label": ariaLabel,
      icon,
      size = "md",
      variant = "ghost",
      badge,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`
          relative inline-flex items-center justify-center rounded-xl
          transition-colors focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      >
        <span aria-hidden="true">{icon}</span>
        {badge !== undefined && badge > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center"
            aria-label={`${badge}개의 알림`}
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

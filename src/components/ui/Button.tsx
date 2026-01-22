import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 */
  variant?: ButtonVariant;
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
}

/**
 * 재사용 가능한 버튼 컴포넌트
 * 
 * @example
 * // 기본 Primary 버튼
 * <Button>저장하기</Button>
 * 
 * // Secondary 버튼
 * <Button variant="secondary">취소</Button>
 * 
 * // 전체 너비 버튼
 * <Button fullWidth size="lg">계약서 작성하기</Button>
 * 
 * // Destructive 버튼
 * <Button variant="destructive">삭제</Button>
 */

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "bg-transparent text-foreground hover:bg-secondary",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-caption min-h-[36px]",
  md: "px-5 py-3 text-body min-h-[44px]",
  lg: "px-6 py-4 text-body-lg min-h-[56px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "lg", fullWidth = false, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed touch-target
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

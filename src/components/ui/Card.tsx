import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 스타일 변형 */
  variant?: "default" | "outlined" | "filled";
  /** 인터랙티브 카드 (호버 효과) */
  interactive?: boolean;
}

/**
 * 카드 컴포넌트
 * 
 * CardHeader, CardContent, CardFooter와 함께 사용하여 구조화된 카드 UI를 만들 수 있습니다.
 * 
 * @example
 * // 기본 카드
 * <Card>
 *   <CardHeader>제목</CardHeader>
 *   <CardContent>내용</CardContent>
 *   <CardFooter>
 *     <Button>확인</Button>
 *   </CardFooter>
 * </Card>
 * 
 * // 인터랙티브 카드 (클릭 가능)
 * <Card interactive onClick={handleClick}>
 *   클릭 가능한 카드
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", interactive = false, className = "", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card border border-border shadow-card",
      outlined: "bg-transparent border border-border",
      filled: "bg-secondary border-none",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-5",
          variantClasses[variant],
          interactive && "hover:shadow-md hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// CardHeader 컴포넌트
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// CardContent 컴포넌트
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

// CardFooter 컴포넌트
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-4 pt-4 border-t border-border", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

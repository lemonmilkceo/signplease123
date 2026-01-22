import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../utils";

interface PageTransitionProps {
  children: ReactNode;
  /** 애니메이션 유형 */
  type?: "fade" | "slide-up" | "slide-left" | "scale";
  /** 애니메이션 지속 시간 (ms) */
  duration?: number;
  /** 애니메이션 딜레이 (ms) */
  delay?: number;
}

/**
 * 페이지 전환 애니메이션 컴포넌트
 * 
 * @example
 * <PageTransition type="fade">
 *   <DashboardContent />
 * </PageTransition>
 */
export function PageTransition({
  children,
  type = "fade",
  duration = 300,
  delay = 0,
}: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // 페이지 변경 시 애니메이션 리셋
    setIsVisible(false);
    
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [location.pathname, children, delay]);

  const animationStyles = {
    fade: {
      enter: "opacity-100",
      exit: "opacity-0",
    },
    "slide-up": {
      enter: "opacity-100 translate-y-0",
      exit: "opacity-0 translate-y-4",
    },
    "slide-left": {
      enter: "opacity-100 translate-x-0",
      exit: "opacity-0 translate-x-4",
    },
    scale: {
      enter: "opacity-100 scale-100",
      exit: "opacity-0 scale-95",
    },
  };

  const styles = animationStyles[type];

  return (
    <div
      className={cn(
        "transition-all",
        isVisible ? styles.enter : styles.exit
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {displayChildren}
    </div>
  );
}

/**
 * 리스트 아이템 스태거 애니메이션
 * 
 * @example
 * <StaggeredList>
 *   {items.map((item, index) => (
 *     <StaggeredItem key={item.id} index={index}>
 *       <ItemCard item={item} />
 *     </StaggeredItem>
 *   ))}
 * </StaggeredList>
 */
interface StaggeredListProps {
  children: ReactNode;
  /** 아이템 간 딜레이 (ms) */
  staggerDelay?: number;
  className?: string;
}

export function StaggeredList({
  children,
  staggerDelay = 50,
  className,
}: StaggeredListProps) {
  return (
    <div
      className={className}
      style={{
        // CSS 변수로 스태거 딜레이 전달
        "--stagger-delay": `${staggerDelay}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface StaggeredItemProps {
  children: ReactNode;
  /** 아이템 인덱스 */
  index: number;
  className?: string;
}

export function StaggeredItem({ children, index, className }: StaggeredItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 50); // 50ms 간격으로 순차 표시

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2",
        className
      )}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * 모달/팝업 애니메이션 wrapper
 */
interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 백드롭 클릭 시 닫기 */
  closeOnBackdrop?: boolean;
}

export function AnimatedModal({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
}: AnimatedModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 다음 프레임에 애니메이션 시작
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // 애니메이션 완료 후 언마운트
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "transition-opacity duration-200",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md",
          "transition-all duration-200",
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export default PageTransition;

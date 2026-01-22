import { useState, useEffect, useRef, ImgHTMLAttributes } from "react";
import { cn } from "../../utils";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** 로딩 중 표시할 placeholder */
  placeholder?: "skeleton" | "blur" | "none";
  /** 이미지 로딩 실패 시 대체 이미지 */
  fallbackSrc?: string;
  /** 컨테이너 클래스 */
  containerClassName?: string;
}

/**
 * Intersection Observer를 사용한 이미지 lazy loading 컴포넌트
 * 
 * @example
 * <LazyImage
 *   src="/images/profile.jpg"
 *   alt="프로필 이미지"
 *   placeholder="skeleton"
 *   className="w-20 h-20 rounded-full"
 * />
 */
export function LazyImage({
  src,
  alt,
  placeholder = "skeleton",
  fallbackSrc,
  className,
  containerClassName,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // 50px 전에 미리 로드 시작
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc) {
      setIsLoaded(true);
    }
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {/* Placeholder */}
      {!isLoaded && placeholder !== "none" && (
        <div
          className={cn(
            "absolute inset-0",
            placeholder === "skeleton" && "bg-muted animate-pulse",
            placeholder === "blur" && "bg-muted/50 backdrop-blur-sm",
            className
          )}
          aria-hidden="true"
        />
      )}

      {/* 실제 이미지 */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}

      {/* 에러 상태 (fallback 없을 때) */}
      {hasError && !fallbackSrc && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted",
            className
          )}
          role="img"
          aria-label={`${alt} 이미지 로드 실패`}
        >
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default LazyImage;

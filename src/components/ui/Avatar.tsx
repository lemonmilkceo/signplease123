import { ImgHTMLAttributes, forwardRef, useState } from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size"> {
  size?: AvatarSize;
  fallback?: string;
  name?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-2xl",
};

/**
 * 아바타 컴포넌트
 * 이미지가 없거나 로드 실패 시 이니셜 표시
 */
export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ size = "md", fallback, name, src, alt, className = "", ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    // 이름에서 이니셜 추출
    const getInitials = (name?: string) => {
      if (!name) return fallback || "?";
      const parts = name.trim().split(" ");
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
      }
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const showFallback = !src || hasError;

    if (showFallback) {
      return (
        <div
          className={`
            inline-flex items-center justify-center rounded-full 
            bg-primary/10 text-primary font-medium
            ${sizeClasses[size]}
            ${className}
          `}
          aria-label={alt || name || "아바타"}
        >
          {getInitials(name)}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || name || "아바타"}
        onError={() => setHasError(true)}
        className={`
          rounded-full object-cover
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

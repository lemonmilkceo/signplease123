interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * 기본 스켈레톤 요소
 */
export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  return (
    <div
      className={`
        bg-secondary
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * 계약서 카드 스켈레톤
 */
export function ContractCardSkeleton() {
  return (
    <div className="p-4 bg-card border border-border rounded-2xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton variant="rectangular" className="w-10 h-10" />
          <div>
            <Skeleton className="w-24 h-4 mb-2" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
        <Skeleton className="w-16 h-6" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-24 h-3" />
      </div>
    </div>
  );
}

/**
 * 계약서 목록 스켈레톤
 */
export function ContractListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="계약서 목록 로딩 중">
      {Array.from({ length: count }).map((_, index) => (
        <ContractCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * 프로필 스켈레톤
 */
export function ProfileSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5" role="status" aria-label="프로필 로딩 중">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="rectangular" className="w-16 h-16 rounded-2xl" />
        <div>
          <Skeleton className="w-24 h-5 mb-2" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between py-3 border-b border-border last:border-0">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

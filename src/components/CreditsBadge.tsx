import { Link } from "react-router-dom";
import { useCredits } from "../hooks/useCredits";

interface CreditsBadgeProps {
  variant?: "default" | "compact" | "detailed";
  showPurchaseLink?: boolean;
  className?: string;
}

export default function CreditsBadge({
  variant = "default",
  showPurchaseLink = true,
  className = "",
}: CreditsBadgeProps) {
  const { totalContractCredits, totalLegalCredits, isLoading } = useCredits();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-secondary rounded-lg h-8 w-20 ${className}`} />
    );
  }

  // 컴팩트 버전 (아이콘 + 숫자만)
  if (variant === "compact") {
    return (
      <Link
        to="/pricing"
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors ${className}`}
      >
        <span className="text-sm">📄</span>
        <span className="text-caption font-semibold text-foreground">
          {totalContractCredits}
        </span>
      </Link>
    );
  }

  // 상세 버전 (계약서 + 법률검토)
  if (variant === "detailed") {
    return (
      <div className={`bg-card border border-border rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-body font-semibold text-foreground">내 크레딧</h4>
          {showPurchaseLink && (
            <Link
              to="/pricing"
              className="text-caption text-primary font-medium hover:underline"
            >
              충전하기
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary rounded-lg p-3 text-center">
            <span className="text-2xl block mb-1">📄</span>
            <p className="text-display font-bold text-foreground">{totalContractCredits}</p>
            <p className="text-caption text-muted-foreground">계약서</p>
          </div>
          <div className="bg-secondary rounded-lg p-3 text-center">
            <span className="text-2xl block mb-1">⚖️</span>
            <p className="text-display font-bold text-foreground">{totalLegalCredits}</p>
            <p className="text-caption text-muted-foreground">법률검토</p>
          </div>
        </div>
      </div>
    );
  }

  // 기본 버전
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm">📄</span>
        <span className="text-body font-semibold text-foreground">
          {totalContractCredits}건
        </span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-sm">⚖️</span>
        <span className="text-body font-semibold text-foreground">
          {totalLegalCredits}회
        </span>
      </div>
      {showPurchaseLink && (
        <>
          <div className="w-px h-4 bg-border" />
          <Link
            to="/pricing"
            className="text-caption text-primary font-medium hover:underline"
          >
            충전
          </Link>
        </>
      )}
    </div>
  );
}

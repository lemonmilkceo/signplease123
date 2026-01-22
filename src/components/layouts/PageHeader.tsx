import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "../icons";

interface PageHeaderProps {
  /** 페이지 제목 */
  title: string;
  /** 부제목 (선택) */
  subtitle?: string;
  /** 뒤로가기 버튼 표시 여부 */
  showBack?: boolean;
  /** 뒤로가기 시 이동할 경로 (기본: history.back) */
  backTo?: string;
  /** 우측 액션 버튼들 */
  actions?: ReactNode;
  /** 헤더 하단 추가 컨텐츠 (탭, 검색바 등) */
  children?: ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** sticky 여부 */
  sticky?: boolean;
}

/**
 * 공통 페이지 헤더 컴포넌트
 * - 뒤로가기, 제목, 액션 버튼 등을 포함
 * - sticky 옵션으로 스크롤 시 상단 고정
 */
export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  backTo,
  actions,
  children,
  className = "",
  sticky = true,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={`
        ${sticky ? "sticky top-0 z-10" : ""} 
        bg-background/80 backdrop-blur-lg border-b border-border
        ${className}
      `}
    >
      <div className="mobile-container py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="뒤로 가기"
              >
                <ChevronLeftIcon className="w-5 h-5 text-foreground" />
              </button>
            )}
            <div>
              <h1 className="text-title text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-caption text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}

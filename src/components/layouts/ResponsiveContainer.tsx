import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  /** 컨테이너 최대 너비 */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  /** 패딩 크기 */
  padding?: "none" | "sm" | "md" | "lg";
  /** 중앙 정렬 여부 */
  centered?: boolean;
  /** 추가 클래스 */
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-md", // 448px
  md: "max-w-2xl", // 672px
  lg: "max-w-4xl", // 896px
  xl: "max-w-6xl", // 1152px
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "px-4",
  md: "px-5",
  lg: "px-8",
};

/**
 * 반응형 컨테이너 컴포넌트
 * 모바일, 태블릿, 데스크톱에 맞는 레이아웃 제공
 * 
 * @example
 * <ResponsiveContainer maxWidth="lg" padding="md">
 *   <Content />
 * </ResponsiveContainer>
 */
export function ResponsiveContainer({
  children,
  maxWidth = "sm",
  padding = "md",
  centered = true,
  className = "",
}: ResponsiveContainerProps) {
  return (
    <div
      className={`
        w-full
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        ${centered ? "mx-auto" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * 반응형 그리드 컴포넌트
 * 화면 크기에 따라 컬럼 수 자동 조절
 */
interface ResponsiveGridProps {
  children: ReactNode;
  /** 모바일 컬럼 수 (기본: 1) */
  cols?: 1 | 2 | 3 | 4;
  /** 태블릿 컬럼 수 */
  mdCols?: 1 | 2 | 3 | 4;
  /** 데스크톱 컬럼 수 */
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 갭 크기 */
  gap?: "sm" | "md" | "lg";
  /** 추가 클래스 */
  className?: string;
}

const colsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const mdColsClasses = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const lgColsClasses = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const gapClasses = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

export function ResponsiveGrid({
  children,
  cols = 1,
  mdCols,
  lgCols,
  gap = "md",
  className = "",
}: ResponsiveGridProps) {
  return (
    <div
      className={`
        grid
        ${colsClasses[cols]}
        ${mdCols ? mdColsClasses[mdCols] : ""}
        ${lgCols ? lgColsClasses[lgCols] : ""}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * 화면 크기에 따른 조건부 렌더링
 */
interface ShowOnProps {
  children: ReactNode;
  /** 표시할 화면 크기 */
  on: "mobile" | "tablet" | "desktop" | "mobile-tablet" | "tablet-desktop";
}

export function ShowOn({ children, on }: ShowOnProps) {
  const visibilityClasses = {
    mobile: "block md:hidden",
    tablet: "hidden md:block lg:hidden",
    desktop: "hidden lg:block",
    "mobile-tablet": "block lg:hidden",
    "tablet-desktop": "hidden md:block",
  };

  return <div className={visibilityClasses[on]}>{children}</div>;
}

/**
 * 사이드바가 있는 레이아웃
 * 데스크톱에서만 사이드바 표시
 */
interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  /** 사이드바 너비 */
  sidebarWidth?: "sm" | "md" | "lg";
  /** 사이드바 위치 */
  sidebarPosition?: "left" | "right";
}

const sidebarWidthClasses = {
  sm: "lg:w-64",
  md: "lg:w-80",
  lg: "lg:w-96",
};

export function SidebarLayout({
  children,
  sidebar,
  sidebarWidth = "md",
  sidebarPosition = "left",
}: SidebarLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* 사이드바 - 데스크톱에서만 */}
      <aside
        className={`
          hidden lg:block shrink-0
          ${sidebarWidthClasses[sidebarWidth]}
          ${sidebarPosition === "right" ? "lg:order-2" : "lg:order-1"}
        `}
      >
        {sidebar}
      </aside>

      {/* 메인 콘텐츠 */}
      <main
        className={`
          flex-1
          ${sidebarPosition === "right" ? "lg:order-1" : "lg:order-2"}
        `}
      >
        {children}
      </main>
    </div>
  );
}

/**
 * 스택/그리드 자동 전환 레이아웃
 * 모바일: 세로 스택, 태블릿+: 그리드
 */
interface StackToGridProps {
  children: ReactNode;
  /** 태블릿 이상에서 컬럼 수 */
  columns?: 2 | 3 | 4;
  /** 갭 크기 */
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function StackToGrid({
  children,
  columns = 2,
  gap = "md",
  className = "",
}: StackToGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div
      className={`
        flex flex-col md:grid
        ${gridCols[columns]}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { BottomNav } from "../NavLink";
import { DocumentIcon, ChatIcon, UserIcon } from "../icons";

/**
 * 사업주(Employer) 전용 레이아웃
 * - 하단 네비게이션 바 포함
 * - 모든 employer 라우트에서 공통 사용
 */
export default function EmployerLayout() {
  const navItems = [
    {
      to: "/employer",
      icon: <DocumentIcon className="w-6 h-6" />,
      label: "계약",
    },
    {
      to: "/employer/chat",
      icon: <ChatIcon className="w-6 h-6" />,
      label: "채팅",
    },
    {
      to: "/profile",
      icon: <UserIcon className="w-6 h-6" />,
      label: "설정",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 메인 콘텐츠 영역 - 시맨틱 마크업 */}
      <main id="main-content" role="main">
        <Outlet />
      </main>
      <BottomNav items={navItems} ariaLabel="사업주 메인 네비게이션" />
    </div>
  );
}

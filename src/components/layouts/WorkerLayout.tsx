import { Outlet } from "react-router-dom";
import { BottomNav } from "../NavLink";
import { DocumentIcon, ChatIcon, ChartIcon, UserIcon } from "../icons";

/**
 * 근로자(Worker) 전용 레이아웃
 * - 하단 네비게이션 바 포함
 * - 모든 worker 라우트에서 공통 사용
 */
export default function WorkerLayout() {
  const navItems = [
    {
      to: "/worker",
      icon: <DocumentIcon className="w-6 h-6" />,
      label: "계약",
    },
    {
      to: "/worker/chat",
      icon: <ChatIcon className="w-6 h-6" />,
      label: "채팅",
    },
    {
      to: "/worker/career",
      icon: <ChartIcon className="w-6 h-6" />,
      label: "경력",
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
      <BottomNav items={navItems} ariaLabel="근로자 메인 네비게이션" />
    </div>
  );
}

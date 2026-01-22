import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface MenuItem {
  icon: string;
  label: string;
  path: string;
  badge?: string | number;
}

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const location = useLocation();
  const { user, profile, signOut, isGuest } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isEmployer = profile?.role === "employer";

  const mainMenuItems: MenuItem[] = isEmployer
    ? [
        { icon: "📋", label: "계약 관리", path: "/employer" },
        { icon: "➕", label: "계약서 작성", path: "/employer/create" },
        { icon: "💬", label: "채팅", path: "/employer/chat" },
      ]
    : [
        { icon: "📋", label: "내 계약서", path: "/worker" },
        { icon: "📊", label: "경력 관리", path: "/worker/career" },
        { icon: "💬", label: "채팅", path: "/worker/chat" },
      ];

  const settingsMenuItems: MenuItem[] = [
    { icon: "👤", label: "프로필 설정", path: "/profile" },
    { icon: "💳", label: "크레딧 구매", path: "/pricing" },
    { icon: "📜", label: "결제 내역", path: "/payment-history" },
    { icon: "❓", label: "고객지원", path: "/support" },
  ];

  const legalMenuItems: MenuItem[] = [
    { icon: "📄", label: "이용약관", path: "/terms" },
    { icon: "🔒", label: "개인정보처리방침", path: "/privacy" },
  ];

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* 드로어 */}
      <div
        ref={drawerRef}
        className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[80vw] bg-background shadow-2xl animate-slide-in-left flex flex-col"
      >
        {/* 프로필 영역 */}
        <div className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          {isGuest ? (
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-body font-semibold">둘러보기 중</p>
              <p className="text-caption opacity-80 mb-3">로그인하고 더 많은 기능을 이용하세요</p>
              <Link
                to="/login"
                onClick={onClose}
                className="inline-block px-4 py-2 bg-white/20 rounded-lg text-caption font-medium hover:bg-white/30 transition-colors"
              >
                로그인 / 회원가입
              </Link>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">{isEmployer ? "👔" : "👷"}</span>
              </div>
              <p className="text-body font-semibold">{profile?.name || user?.email}</p>
              <p className="text-caption opacity-80">
                {isEmployer ? "사업자" : "근로자"}
              </p>
            </div>
          )}
        </div>

        {/* 메뉴 영역 */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* 메인 메뉴 */}
          <div className="px-4 mb-6">
            <p className="text-caption text-muted-foreground font-medium mb-2 px-2">
              메인 메뉴
            </p>
            {mainMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-body font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-destructive text-white text-caption px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* 설정 메뉴 */}
          <div className="px-4 mb-6">
            <p className="text-caption text-muted-foreground font-medium mb-2 px-2">
              설정
            </p>
            {settingsMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-body font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* 법적 문서 */}
          <div className="px-4">
            <p className="text-caption text-muted-foreground font-medium mb-2 px-2">
              약관
            </p>
            {legalMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-caption">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* 하단 영역 */}
        <div className="p-4 border-t border-border">
          {!isGuest && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span className="text-body font-medium">로그아웃</span>
            </button>
          )}
          <p className="text-caption text-muted-foreground text-center mt-4">
            싸인해주세요 v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

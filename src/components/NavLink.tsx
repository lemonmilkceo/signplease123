import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  className?: string;
}

export default function NavLink({
  to,
  icon,
  label,
  badge,
  className = "",
}: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 px-4 py-2 relative transition-colors ${
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      <div className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      <span className={`text-caption ${isActive ? "font-medium" : ""}`}>
        {label}
      </span>
    </Link>
  );
}

// 하단 네비게이션 바 컴포넌트
interface BottomNavProps {
  items: {
    to: string;
    icon: ReactNode;
    label: string;
    badge?: number;
  }[];
  className?: string;
}

export function BottomNav({ items, className = "" }: BottomNavProps) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border safe-area-pb ${className}`}
    >
      <div className="flex justify-around items-center max-w-[448px] mx-auto py-2">
        {items.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

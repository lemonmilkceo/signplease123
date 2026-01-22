import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoadingState } from "./ui/LoadingSpinner";

interface ProtectedRouteProps {
  /** 필요한 역할. 지정하지 않으면 로그인만 확인 */
  requiredRole?: "employer" | "worker";
  /** 로그인 페이지 경로 */
  loginPath?: string;
  /** 역할 선택 페이지 경로 */
  roleSelectPath?: string;
}

/**
 * 인증 및 역할 기반 라우트 보호 컴포넌트
 * 
 * @example
 * // 로그인만 필요한 경우
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/profile" element={<Profile />} />
 * </Route>
 * 
 * // 특정 역할 필요한 경우
 * <Route element={<ProtectedRoute requiredRole="employer" />}>
 *   <Route path="/employer/*" element={<EmployerDashboard />} />
 * </Route>
 */
export function ProtectedRoute({
  requiredRole,
  loginPath = "/login",
  roleSelectPath = "/select-role",
}: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // 로딩 중
  if (isLoading) {
    return <LoadingState message="인증 확인 중..." />;
  }

  // 미로그인 → 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // 로그인했지만 역할 미설정 → 역할 선택 페이지로
  if (!profile?.role && requiredRole) {
    return <Navigate to={roleSelectPath} state={{ from: location }} replace />;
  }

  // 역할 불일치 → 해당 역할 대시보드로 리다이렉트
  if (requiredRole && profile?.role !== requiredRole) {
    const redirectPath = profile?.role === "employer" ? "/employer" : "/worker";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

/**
 * 게스트 전용 라우트 (로그인하지 않은 사용자만 접근 가능)
 * 로그인, 회원가입 페이지 등에 사용
 */
export function GuestRoute() {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState message="확인 중..." />;
  }

  // 이미 로그인된 경우 → 역할에 따라 리다이렉트
  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname;
    
    if (from) {
      return <Navigate to={from} replace />;
    }

    if (profile?.role) {
      return <Navigate to={profile.role === "employer" ? "/employer" : "/worker"} replace />;
    }
    
    return <Navigate to="/select-role" replace />;
  }

  return <Outlet />;
}

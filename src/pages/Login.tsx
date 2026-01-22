import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from "../components/icons";
import { translateAuthError, logger } from "../utils";

function Login() {
  const navigate = useNavigate();
  const { signIn, profile, user, isLoading: authLoading } = useAuth();
  const { toast: _toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이미 로그인된 상태면 리다이렉트
  useEffect(() => {
    if (!authLoading && user) {
      if (profile?.role) {
        navigate(profile.role === "employer" ? "/employer" : "/worker");
      } else {
        navigate("/select-role");
      }
    }
  }, [user, profile, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 전화번호인지 이메일인지 판별
      const isPhone = /^[0-9-]+$/.test(identifier.replace(/\s/g, ""));
      const email = isPhone 
        ? `${identifier.replace(/\D/g, "")}@signplease.app`
        : identifier.trim();
      
      logger.action("login_attempt", { isPhone });
      
      const { error: authError } = await signIn(email, password);

      if (authError) {
        logger.warn("Login failed", authError.message);
        setError(translateAuthError(authError.message));
        return;
      }

      logger.action("login_success");
      // AuthContext의 onAuthStateChange가 처리하므로 여기서는 따로 리다이렉트 불필요
      // useEffect에서 자동으로 리다이렉트됨
    } catch (err) {
      logger.error("Login error", err);
      setError("로그인 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 - 뒤로가기 + 타이틀 */}
      <header className="flex items-center gap-3 p-4 border-b border-border">
        <button 
          onClick={() => navigate("/onboarding")}
          aria-label="뒤로 가기"
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeftIcon className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-heading text-foreground">로그인</h1>
      </header>

      {/* 폼 영역 */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          {/* 환영 메시지 */}
          <h2 className="text-title text-foreground mb-2">다시 만나서 반가워요!</h2>
          <p className="text-body text-muted-foreground mb-8">계정에 로그인하세요</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* 에러 메시지 */}
            {error && (
              <div 
                role="alert"
                aria-live="assertive"
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-caption"
              >
                {error}
              </div>
            )}
            
            {/* 전화번호/이메일 입력 */}
            <Input
              type="text"
              label="전화번호 또는 이메일"
              placeholder="010-1234-5678 또는 example@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            
            {/* 비밀번호 입력 + 토글 */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                aria-pressed={showPassword}
                className="absolute right-4 top-[38px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            
            {/* 비밀번호 찾기 (로그인 유지 제거) */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-caption text-primary hover:underline"
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={isLoading || !identifier || !password}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </div>
          </form>
        </div>

        {/* 하단 회원가입 링크 */}
        <div className="mt-auto pt-8 text-center animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          <p className="text-caption text-muted-foreground">
            계정이 없으신가요?{" "}
            <button 
              onClick={() => navigate("/signup")}
              className="text-primary font-medium hover:underline"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

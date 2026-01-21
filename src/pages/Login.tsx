import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Supabase 로그인 연동
    setTimeout(() => {
      setIsLoading(false);
      navigate("/select-role");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 - 뒤로가기 + 타이틀 */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button 
          onClick={() => navigate("/onboarding")}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-heading text-foreground">로그인</h1>
      </div>

      {/* 폼 영역 */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          {/* 환영 메시지 */}
          <h2 className="text-title text-foreground mb-2">다시 만나서 반가워요!</h2>
          <p className="text-body text-muted-foreground mb-8">계정에 로그인하세요</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
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
                className="absolute right-4 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* 로그인 유지 + 비밀번호 찾기 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-caption text-muted-foreground">로그인 유지</span>
              </label>
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

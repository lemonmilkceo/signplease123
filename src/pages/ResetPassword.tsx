import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (): boolean => {
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다");
      return false;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword()) return;

    setIsLoading(true);
    
    // TODO: Supabase 비밀번호 재설정
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button 
          onClick={() => navigate("/login")}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-heading text-foreground">비밀번호 재설정</h1>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 p-6 flex flex-col">
        {!isSuccess ? (
          <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            {/* 안내 메시지 */}
            <div className="mb-8">
              <h2 className="text-title text-foreground mb-2">새 비밀번호를 입력하세요</h2>
              <p className="text-body text-muted-foreground">
                보안을 위해 6자 이상의 비밀번호를 설정해주세요.
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-caption">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 새 비밀번호 */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="새 비밀번호"
                  placeholder="6자 이상 입력"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
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

              {/* 비밀번호 확인 */}
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="비밀번호 확인"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
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

              {/* 비밀번호 강도 표시 */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${password.length >= 2 ? "bg-destructive" : "bg-border"}`} />
                    <div className={`h-1 flex-1 rounded ${password.length >= 4 ? "bg-warning" : "bg-border"}`} />
                    <div className={`h-1 flex-1 rounded ${password.length >= 6 ? "bg-success" : "bg-border"}`} />
                    <div className={`h-1 flex-1 rounded ${password.length >= 8 ? "bg-success" : "bg-border"}`} />
                  </div>
                  <p className="text-caption text-muted-foreground">
                    {password.length < 6 ? "비밀번호가 너무 짧습니다" : password.length < 8 ? "적당한 강도입니다" : "강력한 비밀번호입니다"}
                  </p>
                </div>
              )}

              {/* 제출 버튼 */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  disabled={isLoading || !password || !confirmPassword}
                >
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-scale-in">
            {/* 성공 아이콘 */}
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* 성공 메시지 */}
            <h2 className="text-title text-foreground mb-2">비밀번호가 변경되었어요!</h2>
            <p className="text-body text-muted-foreground mb-8">
              새 비밀번호로 로그인해주세요.
            </p>

            {/* 로그인 버튼 */}
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => navigate("/login")}
            >
              로그인하러 가기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;

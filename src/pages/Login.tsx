import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChevronLeftIcon, GoogleIcon, KakaoIcon } from "../components/icons";
import { translateAuthError, logger } from "../utils";

/**
 * 소셜 로그인 페이지 (Google / Kakao OAuth)
 * - 이메일/비밀번호 로그인 없이 소셜 로그인만 지원
 */
function Login() {
  const navigate = useNavigate();
  const { signInWithSocial, profile, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState<"google" | "kakao" | null>(null);
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

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    setIsLoading(provider);
    setError(null);
    
    try {
      logger.action("social_login_attempt", { provider });
      
      const { error: authError } = await signInWithSocial(provider);

      if (authError) {
        logger.warn("Social login failed", authError.message);
        setError(translateAuthError(authError.message));
        setIsLoading(null);
      }
      // OAuth는 리다이렉트되므로 성공 시 여기에 도달하지 않음
    } catch (err) {
      logger.error("Social login error", err);
      setError("로그인 중 오류가 발생했습니다");
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center gap-3 p-4">
        <button 
          onClick={() => navigate("/onboarding")}
          aria-label="뒤로 가기"
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeftIcon className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          {/* 로고 및 환영 메시지 */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
              <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">싸인플리즈</h1>
            <p className="text-body text-muted-foreground">
              간편하게 로그인하고 시작하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div 
              role="alert"
              aria-live="assertive"
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center"
            >
              {error}
            </div>
          )}

          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3">
            {/* Google 로그인 */}
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isLoading === "google" ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5" />
              )}
              <span>Google로 계속하기</span>
            </button>

            {/* Kakao 로그인 */}
            <button
              onClick={() => handleSocialLogin("kakao")}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#FEE500] border border-[#FEE500] rounded-xl text-[#191919] font-medium shadow-sm hover:shadow-md hover:bg-[#FADA0A] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isLoading === "kakao" ? (
                <div className="w-5 h-5 border-2 border-[#191919]/30 border-t-[#191919] rounded-full animate-spin" />
              ) : (
                <KakaoIcon className="w-5 h-5" />
              )}
              <span>카카오로 계속하기</span>
            </button>
          </div>

          {/* 안내 문구 */}
          <p className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
            로그인 시{" "}
            <button 
              onClick={() => navigate("/terms")} 
              className="underline hover:text-primary transition-colors"
            >
              이용약관
            </button>
            {" "}및{" "}
            <button 
              onClick={() => navigate("/privacy")} 
              className="underline hover:text-primary transition-colors"
            >
              개인정보처리방침
            </button>
            에 동의합니다
          </p>
        </div>
      </div>

      {/* 하단 둘러보기 링크 */}
      <div className="p-6 text-center animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
        <button 
          onClick={() => navigate("/employer")}
          className="text-caption text-muted-foreground hover:text-primary transition-colors"
        >
          먼저 둘러볼게요 →
        </button>
      </div>
    </div>
  );
}

export default Login;

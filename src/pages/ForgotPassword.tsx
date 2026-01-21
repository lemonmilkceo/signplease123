import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";

function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    
    // TODO: Supabase 비밀번호 재설정 이메일 발송
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
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
        <h1 className="text-heading text-foreground">비밀번호 찾기</h1>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 p-6 flex flex-col">
        {!isSent ? (
          <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            {/* 안내 메시지 */}
            <div className="mb-8">
              <h2 className="text-title text-foreground mb-2">비밀번호를 잊으셨나요?</h2>
              <p className="text-body text-muted-foreground">
                가입할 때 사용한 이메일 또는 전화번호를 입력하시면<br />
                비밀번호 재설정 링크를 보내드려요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이메일/전화번호 입력 */}
              <Input
                type="text"
                label="이메일 또는 전화번호"
                placeholder="example@email.com 또는 010-1234-5678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              {/* 제출 버튼 */}
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={isLoading || !identifier.trim()}
              >
                {isLoading ? "발송 중..." : "재설정 링크 받기"}
              </Button>
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
            <h2 className="text-title text-foreground mb-2">링크를 발송했어요!</h2>
            <p className="text-body text-muted-foreground mb-8">
              <span className="text-primary font-medium">{identifier}</span>으로<br />
              비밀번호 재설정 링크를 보냈어요.<br />
              메일함을 확인해주세요.
            </p>

            {/* 안내 */}
            <div className="bg-secondary rounded-xl p-4 mb-8 w-full">
              <p className="text-caption text-muted-foreground">
                💡 메일이 안 보이면 스팸함을 확인해주세요.<br />
                5분 내로 도착하지 않으면 다시 시도해주세요.
              </p>
            </div>

            {/* 버튼 */}
            <div className="w-full space-y-3">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => setIsSent(false)}
              >
                다시 보내기
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => navigate("/login")}
              >
                로그인으로 돌아가기
              </Button>
            </div>
          </div>
        )}

        {/* 하단 링크 */}
        {!isSent && (
          <div className="mt-auto pt-8 text-center animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <p className="text-caption text-muted-foreground">
              계정이 기억나셨나요?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-primary font-medium hover:underline"
              >
                로그인
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  // 2.5초 후 자동 이동
  useEffect(() => {
    const timer = setTimeout(() => navigate("/onboarding"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* 배경 글로우 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] animate-glow" />
      </div>

      {/* 타이틀 - 페이드인 + 슬라이드업 */}
      <h1 className="text-display text-foreground mb-4 animate-slide-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
        싸인해주세요
      </h1>
      
      {/* 서브타이틀 */}
      <p className="text-body text-muted-foreground text-center mb-12 animate-slide-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
        복잡한 근로계약서, <span className="text-primary font-medium">이제 3분이면 충분해요</span>
      </p>

      {/* 로딩 인디케이터 - 3개 점 펄스 */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* 커스텀 애니메이션 스타일 */}
      <style>{`
        @keyframes glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.6; }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-pulse-dot {
          animation: pulse-dot 1s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

export default Splash;

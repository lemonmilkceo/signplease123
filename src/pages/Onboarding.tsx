import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";
import { useSwipe } from "../hooks/useSwipe";

interface OnboardingStep {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    icon: "📝",
    title: "한 화면에 하나의 질문",
    description: "복잡한 법률 용어 없이\n쉬운 질문에 답하면 끝!",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "🤖",
    title: "AI가 계약서를 작성해요",
    description: "최신 근로기준법을 반영한\n표준근로계약서를 자동 생성",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: "✍️",
    title: "모바일로 간편 서명",
    description: "어디서든 손가락으로 서명하고\n법적 효력이 있는 계약 완료",
    color: "from-purple-500 to-purple-600",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);

  const goToNext = () => {
    if (currentStep < steps.length - 1) {
      setSlideDirection("left");
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setSlideDirection(null);
      }, 150);
    } else {
      navigate("/login");
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setSlideDirection("right");
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  const { swipeState, handlers } = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    threshold: 50,
  });

  const handleSkip = () => {
    navigate("/login");
  };

  const handleExplore = () => {
    navigate("/employer");
  };

  const step = steps[currentStep];

  // 스와이프 중 변환 계산
  const getTransformStyle = () => {
    if (swipeState.isSwiping) {
      const maxDelta = 100;
      const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, swipeState.deltaX));
      return {
        transform: `translateX(${clampedDelta * 0.5}px)`,
        opacity: 1 - Math.abs(clampedDelta) / 200,
      };
    }
    if (slideDirection === "left") {
      return { transform: "translateX(-100%)", opacity: 0 };
    }
    if (slideDirection === "right") {
      return { transform: "translateX(100%)", opacity: 0 };
    }
    return { transform: "translateX(0)", opacity: 1 };
  };

  return (
    <main 
      className="mobile-container min-h-screen flex flex-col py-8 relative overflow-hidden touch-pan-y"
      {...handlers}
    >
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
      
      {/* 스킵 버튼 */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={handleSkip}
          className="text-caption text-muted-foreground hover:text-foreground transition-colors"
        >
          건너뛰기
        </button>
      </div>

      {/* 컨텐츠 - 스와이프 영역 */}
      <div 
        className="flex-1 flex flex-col items-center justify-center text-center transition-all duration-150 ease-out"
        style={getTransformStyle()}
      >
        {/* 아이콘 */}
        <div className="mb-8">
          <div className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-[2rem] flex items-center justify-center shadow-xl`}>
            <span className="text-6xl">{step.icon}</span>
          </div>
        </div>

        {/* 텍스트 */}
        <div>
          <h2 className="text-title text-foreground mb-4">
            {step.title}
          </h2>
          <p className="text-body text-muted-foreground whitespace-pre-line leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* 스와이프 힌트 */}
      <p className="text-center text-caption text-muted-foreground mb-4">
        ← 스와이프하여 이동 →
      </p>

      {/* 인디케이터 */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? "w-8 bg-primary" 
                : "w-2 bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* 버튼 영역 */}
      <div className="space-y-3">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={goToNext}
          className="shadow-lg shadow-primary/20"
        >
          {currentStep < steps.length - 1 ? "다음" : "시작하기"}
        </Button>
        
        {/* 둘러보기 버튼 - 마지막 단계에서만 표시 */}
        {currentStep === steps.length - 1 && (
          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleExplore}
          >
            먼저 둘러볼게요
          </Button>
        )}
      </div>
    </main>
  );
}

export default Onboarding;

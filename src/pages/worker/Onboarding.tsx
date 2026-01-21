import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    title: "계약서를 쉽게 확인하세요",
    description: "사장님이 보낸 계약서를 카드 형태로 한 조건씩 확인할 수 있어요.",
    icon: "📋",
    color: "bg-primary/10",
  },
  {
    title: "어려운 용어? AI가 설명해요",
    description: "이해하기 어려운 법률 용어를 터치하면 AI가 쉽게 설명해줍니다.",
    icon: "🤖",
    color: "bg-success/10",
  },
  {
    title: "간편하게 서명하세요",
    description: "모든 조건을 확인한 후, 화면에 직접 서명하면 계약 완료!",
    icon: "✍️",
    color: "bg-warning/10",
  },
  {
    title: "경력을 관리하세요",
    description: "완료된 계약은 자동으로 경력에 추가되고, 경력증명서도 발급받을 수 있어요.",
    icon: "📊",
    color: "bg-accent/10",
  },
];

export default function WorkerOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/worker");
    }
  };

  const handleSkip = () => {
    navigate("/worker");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <header className="p-4">
        <div className="max-w-[448px] mx-auto flex justify-end">
          <button 
            onClick={handleSkip}
            className="text-caption text-muted-foreground hover:text-foreground transition-colors"
          >
            건너뛰기
          </button>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center mobile-container text-center">
        <div 
          key={currentStep}
          className="animate-slide-up opacity-0"
          style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}
        >
          <div className={`w-32 h-32 ${steps[currentStep].color} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
            <span className="text-6xl">{steps[currentStep].icon}</span>
          </div>
          <h2 className="text-title text-foreground mb-4">{steps[currentStep].title}</h2>
          <p className="text-body text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {steps[currentStep].description}
          </p>
        </div>
      </main>

      {/* 하단 */}
      <div className="p-6 max-w-[448px] mx-auto w-full">
        {/* 진행 표시 */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep 
                  ? "w-6 bg-primary" 
                  : "w-2 bg-border hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <Button variant="primary" fullWidth onClick={handleNext}>
          {currentStep < steps.length - 1 ? "다음" : "시작하기"}
        </Button>
      </div>
    </div>
  );
}

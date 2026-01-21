import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";

interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  icon: string;
}

const plans: PricingPlan[] = [
  { id: "1", name: "스타터", credits: 5, price: 5000, pricePerCredit: 1000, icon: "🌱" },
  { id: "2", name: "베이직", credits: 15, price: 12000, pricePerCredit: 800, popular: true, icon: "⭐" },
  { id: "3", name: "프로", credits: 30, price: 21000, pricePerCredit: 700, icon: "🚀" },
  { id: "4", name: "비즈니스", credits: 100, price: 60000, pricePerCredit: 600, icon: "🏢" },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("2");

  const handlePurchase = () => {
    if (!selectedPlan) return;
    alert("결제 기능은 추후 연동 예정입니다.");
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="max-w-[448px] mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
            >
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-heading text-foreground">계약서 크레딧 구매</h1>
              <p className="text-caption text-muted-foreground">크레딧 1개 = 계약서 1건 작성</p>
            </div>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 현재 보유 크레딧 */}
        <div className="bg-primary/10 rounded-2xl p-6 mb-6 text-center">
          <p className="text-caption text-muted-foreground mb-1">현재 보유 크레딧</p>
          <p className="text-display text-primary font-bold">3개</p>
        </div>

        {/* 요금제 목록 */}
        <div className="space-y-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-4 bg-primary text-primary-foreground text-caption px-3 py-1 rounded-full font-semibold">
                  인기
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    selectedPlan === plan.id ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <p className="text-body font-semibold text-foreground">{plan.name}</p>
                    <p className="text-caption text-muted-foreground">{plan.credits}개 크레딧</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-body-lg font-bold text-foreground">{plan.price.toLocaleString()}원</p>
                  <p className="text-caption text-muted-foreground">개당 {plan.pricePerCredit.toLocaleString()}원</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 safe-area-pb">
        <div className="max-w-[448px] mx-auto">
          <Button
            variant="primary"
            fullWidth
            onClick={handlePurchase}
            disabled={!selectedPlan}
          >
            {selectedPlanData 
              ? `${selectedPlanData.price.toLocaleString()}원 결제하기` 
              : "요금제를 선택해주세요"}
          </Button>
        </div>
      </div>
    </div>
  );
}

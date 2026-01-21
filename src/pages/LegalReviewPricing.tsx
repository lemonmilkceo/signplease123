import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";

interface PricingPlan {
  id: string;
  name: string;
  reviews: number;
  price: number;
  pricePerReview: number;
  popular?: boolean;
  icon: string;
}

const plans: PricingPlan[] = [
  { id: "1", name: "체험", reviews: 1, price: 3000, pricePerReview: 3000, icon: "🔍" },
  { id: "2", name: "베이직", reviews: 5, price: 12000, pricePerReview: 2400, popular: true, icon: "⚖️" },
  { id: "3", name: "프로", reviews: 15, price: 30000, pricePerReview: 2000, icon: "🏛️" },
];

export default function LegalReviewPricing() {
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
              <h1 className="text-heading text-foreground">AI 법률 검토 크레딧</h1>
              <p className="text-caption text-muted-foreground">AI가 계약서의 법적 문제점을 검토해드려요</p>
            </div>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 현재 보유 크레딧 */}
        <div className="bg-success/10 rounded-2xl p-6 mb-6 text-center">
          <p className="text-caption text-muted-foreground mb-1">현재 보유 검토권</p>
          <p className="text-display text-success font-bold">1개</p>
        </div>

        {/* 기능 설명 */}
        <div className="bg-secondary rounded-2xl p-5 mb-6">
          <h3 className="text-body font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>🤖</span>
            AI 법률 검토란?
          </h3>
          <ul className="space-y-2 text-caption text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              계약서 조항의 법적 유효성 검토
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              근로기준법 위반 여부 확인
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              불리한 조항 경고 및 수정 제안
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              최신 판례 기반 분석
            </li>
          </ul>
        </div>

        {/* 요금제 목록 */}
        <div className="space-y-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${
                selectedPlan === plan.id
                  ? "border-success bg-success/5"
                  : "border-border bg-card hover:border-success/50"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-4 bg-success text-white text-caption px-3 py-1 rounded-full font-semibold">
                  추천
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    selectedPlan === plan.id ? "bg-success/10" : "bg-secondary"
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <p className="text-body font-semibold text-foreground">{plan.name}</p>
                    <p className="text-caption text-muted-foreground">{plan.reviews}회 검토</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-body-lg font-bold text-foreground">{plan.price.toLocaleString()}원</p>
                  <p className="text-caption text-muted-foreground">회당 {plan.pricePerReview.toLocaleString()}원</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 safe-area-pb">
        <div className="max-w-[448px] mx-auto">
          <button
            onClick={handlePurchase}
            disabled={!selectedPlan}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              selectedPlan
                ? "bg-success text-white hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {selectedPlanData 
              ? `${selectedPlanData.price.toLocaleString()}원 결제하기` 
              : "요금제를 선택해주세요"}
          </button>
        </div>
      </div>
    </div>
  );
}

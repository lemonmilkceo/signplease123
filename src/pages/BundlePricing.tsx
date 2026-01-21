import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui";

interface BundlePlan {
  id: string;
  name: string;
  contractCredits: number;
  legalReviews: number;
  price: number;
  originalPrice: number;
  discount: number;
  popular?: boolean;
  icon: string;
}

const bundles: BundlePlan[] = [
  { id: "1", name: "소상공인", contractCredits: 10, legalReviews: 3, price: 15000, originalPrice: 19000, discount: 21, icon: "🏪" },
  { id: "2", name: "성장기업", contractCredits: 30, legalReviews: 10, price: 40000, originalPrice: 51000, discount: 22, popular: true, icon: "📈" },
  { id: "3", name: "프랜차이즈", contractCredits: 100, legalReviews: 30, price: 110000, originalPrice: 150000, discount: 27, icon: "🏢" },
];

export default function BundlePricing() {
  const navigate = useNavigate();
  const [selectedBundle, setSelectedBundle] = useState<string | null>("2");

  const handlePurchase = () => {
    if (!selectedBundle) return;
    alert("결제 기능은 추후 연동 예정입니다.");
  };

  const selectedBundleData = bundles.find((b) => b.id === selectedBundle);

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
              <h1 className="text-heading text-foreground">묶음 상품</h1>
              <p className="text-caption text-muted-foreground">계약서 + AI 법률 검토를 함께 구매하세요</p>
            </div>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 혜택 안내 */}
        <div className="bg-gradient-to-br from-primary to-success rounded-2xl p-6 mb-6 text-white">
          <p className="text-caption opacity-90 mb-1">🎁 묶음 구매 혜택</p>
          <p className="text-title font-bold">최대 27% 할인</p>
        </div>

        {/* 번들 목록 */}
        <div className="space-y-4">
          {bundles.map((bundle) => (
            <button
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle.id)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${
                selectedBundle === bundle.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {bundle.popular && (
                <span className="absolute -top-3 right-4 bg-destructive text-white text-caption px-3 py-1 rounded-full font-semibold">
                  BEST
                </span>
              )}
              
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    selectedBundle === bundle.id ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    {bundle.icon}
                  </div>
                  <p className="text-body-lg font-bold text-foreground">{bundle.name}</p>
                </div>
                <span className="bg-warning/10 text-warning text-caption px-3 py-1 rounded-lg font-semibold">
                  {bundle.discount}% 할인
                </span>
              </div>

              {/* 포함 내용 */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-primary/10 rounded-xl p-3 text-center">
                  <span className="text-caption text-primary font-semibold">📝 계약서 {bundle.contractCredits}개</span>
                </div>
                <div className="flex-1 bg-success/10 rounded-xl p-3 text-center">
                  <span className="text-caption text-success font-semibold">🤖 법률검토 {bundle.legalReviews}회</span>
                </div>
              </div>

              {/* 가격 */}
              <div className="flex items-baseline gap-2">
                <span className="text-heading font-bold text-foreground">{bundle.price.toLocaleString()}원</span>
                <span className="text-caption text-muted-foreground line-through">{bundle.originalPrice.toLocaleString()}원</span>
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
            disabled={!selectedBundle}
          >
            {selectedBundleData 
              ? `${selectedBundleData.price.toLocaleString()}원 결제하기` 
              : "상품을 선택해주세요"}
          </Button>
        </div>
      </div>
    </div>
  );
}

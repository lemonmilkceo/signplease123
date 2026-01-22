import { useNavigate } from "react-router-dom";
import { Button } from "./ui";

interface NoCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "contract" | "legal-review";
  currentCredits?: number;
  requiredCredits?: number;
}

export default function NoCreditModal({
  isOpen,
  onClose,
  type = "contract",
  currentCredits = 0,
  requiredCredits = 1,
}: NoCreditModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isContract = type === "contract";
  const title = isContract ? "계약서 크레딧이 부족해요" : "법률검토 크레딧이 부족해요";
  const description = isContract
    ? "계약서를 생성하려면 크레딧이 필요합니다."
    : "AI 법률검토를 받으려면 검토권이 필요합니다.";
  const pricingPath = isContract ? "/pricing" : "/legal-review-pricing";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl p-6 w-full max-w-sm animate-scale-in">
        {/* 아이콘 */}
        <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">💳</span>
        </div>

        {/* 타이틀 */}
        <h3 className="text-heading text-foreground text-center mb-2">{title}</h3>
        <p className="text-body text-muted-foreground text-center mb-6">{description}</p>

        {/* 크레딧 상태 */}
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted-foreground">현재 보유</span>
            <span className="text-body font-semibold text-destructive">
              {currentCredits}
              {isContract ? "건" : "회"}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-caption text-muted-foreground">필요</span>
            <span className="text-body font-semibold text-foreground">
              {requiredCredits}
              {isContract ? "건" : "회"}
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              onClose();
              navigate(pricingPath);
            }}
          >
            크레딧 구매하기
          </Button>
          <Button variant="outline" fullWidth onClick={onClose}>
            나중에
          </Button>
        </div>

        {/* 추가 안내 */}
        <p className="text-caption text-muted-foreground text-center mt-4">
          💡 번들 상품 구매 시 최대 30% 할인!
          <button
            onClick={() => {
              onClose();
              navigate("/bundle-pricing");
            }}
            className="text-primary font-medium ml-1 hover:underline"
          >
            확인하기
          </button>
        </p>
      </div>
    </div>
  );
}

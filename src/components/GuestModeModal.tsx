import { useNavigate } from "react-router-dom";
import { Button } from "./ui";

interface GuestModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: "save" | "send" | "sign" | "download";
}

export default function GuestModeModal({
  isOpen,
  onClose,
  action = "save",
}: GuestModeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const actionText = {
    save: "저장",
    send: "발송",
    sign: "서명",
    download: "다운로드",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl p-6 w-full max-w-sm animate-scale-in">
        {/* 아이콘 */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✨</span>
        </div>

        {/* 타이틀 */}
        <h3 className="text-heading text-foreground text-center mb-2">
          무료 회원가입 후 이용하세요!
        </h3>
        <p className="text-body text-muted-foreground text-center mb-6">
          계약서를 {actionText[action]}하려면<br />
          간단한 회원가입이 필요해요.
        </p>

        {/* 혜택 */}
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <p className="text-caption font-semibold text-foreground mb-3">
            🎁 가입 시 무료 혜택
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-caption text-muted-foreground">
              <span className="text-success">✓</span>
              계약서 생성 3건 무료
            </li>
            <li className="flex items-center gap-2 text-caption text-muted-foreground">
              <span className="text-success">✓</span>
              AI 법률검토 1회 무료
            </li>
            <li className="flex items-center gap-2 text-caption text-muted-foreground">
              <span className="text-success">✓</span>
              작성 중인 계약서 자동 저장
            </li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
          >
            무료로 시작하기
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            이미 계정이 있어요
          </Button>
          <button
            onClick={onClose}
            className="w-full py-2 text-caption text-muted-foreground hover:text-foreground transition-colors"
          >
            계속 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
}

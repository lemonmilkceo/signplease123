import { useState } from "react";
import { Button } from "./ui";
import { shareContract } from "../utils";

interface ShareContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  workerName?: string;
}

export default function ShareContractModal({
  isOpen,
  onClose,
  contractId,
  workerName = "근로자",
}: ShareContractModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const contractUrl = `${window.location.origin}/worker/contract/${contractId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(contractUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // 폴백: 프롬프트로 복사
      prompt("아래 링크를 복사하세요:", contractUrl);
    }
  };

  const handleShare = () => {
    shareContract(contractId);
  };

  const handleKakaoShare = () => {
    // 카카오톡 공유 (카카오 SDK 연동 필요)
    if (typeof window !== "undefined" && (window as any).Kakao?.Share) {
      (window as any).Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "근로계약서 서명 요청",
          description: `${workerName}님, 근로계약서를 확인하고 서명해주세요.`,
          imageUrl: `${window.location.origin}/icons/icon-512x512.png`,
          link: {
            mobileWebUrl: contractUrl,
            webUrl: contractUrl,
          },
        },
        buttons: [
          {
            title: "계약서 확인하기",
            link: {
              mobileWebUrl: contractUrl,
              webUrl: contractUrl,
            },
          },
        ],
      });
    } else {
      // 카카오 SDK 없을 경우 일반 공유
      handleShare();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl p-6 w-full max-w-sm animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading text-foreground">계약서 공유</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 안내 문구 */}
        <p className="text-body text-muted-foreground mb-6">
          {workerName}님에게 계약서 링크를 공유하세요.
        </p>

        {/* 링크 미리보기 */}
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <p className="text-caption text-muted-foreground mb-2">계약서 링크</p>
          <p className="text-body text-foreground break-all font-mono text-sm">
            {contractUrl}
          </p>
        </div>

        {/* 공유 버튼들 */}
        <div className="space-y-3">
          {/* 카카오톡 */}
          <button
            onClick={handleKakaoShare}
            className="w-full py-4 bg-[#FEE500] text-black rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-5.148 0-9.316 3.406-9.316 7.609 0 2.716 1.814 5.1 4.545 6.453-.2.744-.726 2.693-.832 3.11-.131.52.191.512.401.373.165-.109 2.622-1.781 3.693-2.51.494.073 1.001.111 1.509.111 5.148 0 9.316-3.406 9.316-7.609C21.316 6.406 17.148 3 12 3z"/>
            </svg>
            카카오톡으로 공유
          </button>

          {/* 링크 복사 */}
          <button
            onClick={handleCopyLink}
            className="w-full py-4 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
          >
            {isCopied ? (
              <>
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                복사됨!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                링크 복사
              </>
            )}
          </button>

          {/* 기타 공유 */}
          <button
            onClick={handleShare}
            className="w-full py-4 border border-border text-foreground rounded-xl font-semibold hover:bg-secondary/50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            다른 방법으로 공유
          </button>
        </div>

        {/* 닫기 */}
        <div className="mt-6">
          <Button variant="outline" fullWidth onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}

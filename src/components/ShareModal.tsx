import { useState } from "react";
import { Button } from "./ui";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  shareUrl?: string;
  shareText?: string;
  onCopyLink?: () => void;
  onShareKakao?: () => void;
  onShareSMS?: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  title = "공유하기",
  shareUrl = window.location.href,
  shareText = "근로계약서를 확인해주세요",
  onCopyLink,
  onShareKakao,
  onShareSMS,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyLink?.();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareKakao = () => {
    // 카카오톡 공유 (실제 구현 시 카카오 SDK 필요)
    if (onShareKakao) {
      onShareKakao();
    } else {
      // 기본 동작: 카카오톡 링크 공유
      const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(kakaoUrl, "_blank", "width=500,height=600");
    }
  };

  const handleShareSMS = () => {
    if (onShareSMS) {
      onShareSMS();
    } else {
      // 기본 동작: SMS 링크
      const smsBody = `${shareText}\n${shareUrl}`;
      window.location.href = `sms:?body=${encodeURIComponent(smsBody)}`;
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "싸인해주세요",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div 
        className="bg-background w-full max-w-[448px] rounded-t-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-heading font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 공유 옵션 */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* 링크 복사 */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                copied ? "bg-success/10" : "bg-secondary"
              }`}>
                {copied ? (
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </div>
              <span className="text-caption text-muted-foreground">
                {copied ? "복사됨!" : "링크 복사"}
              </span>
            </button>

            {/* 카카오톡 */}
            <button
              onClick={handleShareKakao}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 bg-[#FEE500] rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#3C1E1E">
                  <path d="M12 3c-5.52 0-10 3.59-10 8 0 2.84 1.87 5.33 4.67 6.73-.15.53-.96 3.42-1 3.58 0 .08.03.16.09.21.07.05.16.07.24.05.32-.05 3.73-2.44 4.32-2.84.55.08 1.11.12 1.68.12 5.52 0 10-3.59 10-8s-4.48-8-10-8z"/>
                </svg>
              </div>
              <span className="text-caption text-muted-foreground">카카오톡</span>
            </button>

            {/* SMS */}
            <button
              onClick={handleShareSMS}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-caption text-muted-foreground">문자</span>
            </button>

            {/* 더보기 (네이티브 공유) */}
            {typeof navigator.share === "function" && (
              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <span className="text-caption text-muted-foreground">더보기</span>
              </button>
            )}
          </div>

          {/* URL 미리보기 */}
          <div className="bg-secondary rounded-xl p-4 mb-4">
            <p className="text-caption text-muted-foreground mb-1">공유 링크</p>
            <p className="text-caption text-foreground truncate">{shareUrl}</p>
          </div>

          {/* 닫기 버튼 */}
          <Button variant="outline" fullWidth onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}

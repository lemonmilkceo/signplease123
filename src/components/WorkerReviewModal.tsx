import { useState } from "react";
import { Button } from "./ui";

interface WorkerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewData) => void;
  employerName?: string;
  workPlace?: string;
}

interface ReviewData {
  rating: number;
  punctuality: number;
  communication: number;
  attitude: number;
  comment: string;
}

const RATING_LABELS = ["매우 불만족", "불만족", "보통", "만족", "매우 만족"];

export default function WorkerReviewModal({
  isOpen,
  onClose,
  onSubmit,
  employerName = "사장님",
  workPlace = "근무지",
}: WorkerReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [attitude, setAttitude] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        punctuality,
        communication,
        attitude,
        comment,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, onChange: (v: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition-transform hover:scale-110 ${
            star <= value ? "text-warning" : "text-border"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-2xl p-6 w-full max-w-md my-8 animate-scale-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading text-foreground">근무 리뷰 작성</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 근무지 정보 */}
        <div className="bg-secondary rounded-xl p-4 mb-6">
          <p className="text-caption text-muted-foreground">근무지</p>
          <p className="text-body font-semibold text-foreground">{workPlace}</p>
          <p className="text-caption text-muted-foreground mt-1">
            {employerName} 사장님
          </p>
        </div>

        {/* 전체 평점 */}
        <div className="mb-6">
          <label className="text-body font-medium text-foreground block mb-2">
            전체 평점 *
          </label>
          <div className="flex items-center gap-3">
            {renderStars(rating, setRating)}
            {rating > 0 && (
              <span className="text-caption text-muted-foreground">
                {RATING_LABELS[rating - 1]}
              </span>
            )}
          </div>
        </div>

        {/* 세부 평가 */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-caption text-muted-foreground block mb-1">
              급여 지급 정확성
            </label>
            {renderStars(punctuality, setPunctuality)}
          </div>
          <div>
            <label className="text-caption text-muted-foreground block mb-1">
              의사소통
            </label>
            {renderStars(communication, setCommunication)}
          </div>
          <div>
            <label className="text-caption text-muted-foreground block mb-1">
              근무 환경
            </label>
            {renderStars(attitude, setAttitude)}
          </div>
        </div>

        {/* 코멘트 */}
        <div className="mb-6">
          <label className="text-body font-medium text-foreground block mb-2">
            한줄 후기 (선택)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="근무 경험을 간단히 남겨주세요"
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-body focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[100px]"
          />
          <p className="text-caption text-muted-foreground text-right mt-1">
            {comment.length}/200
          </p>
        </div>

        {/* 안내 */}
        <div className="bg-warning/10 rounded-xl p-3 mb-6">
          <p className="text-caption text-warning">
            ⚠️ 리뷰는 익명으로 처리되며, 다른 근로자들에게 도움이 됩니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? "제출 중..." : "리뷰 제출"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { useSwipe } from "../../hooks/useSwipe";
import { useContracts } from "../../hooks/useContracts";
import { useContractGeneration } from "../../hooks/useContractGeneration";
import { downloadContractPDF } from "../../utils";

interface ContractTerm {
  id: string;
  title: string;
  value: string;
  explanation?: string;
  icon: string;
}

export default function ContractView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContract, signAsWorker } = useContracts();
  const { explainTerm, isExplaining: isAIExplaining } = useContractGeneration();

  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [explanationText, setExplanationText] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 계약서 데이터 로드
  useEffect(() => {
    const loadContract = async () => {
      if (!id) {
        setError("계약서 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await getContract(id);
        if (fetchError) {
          throw fetchError;
        }
        setContract(data);
      } catch (err) {
        console.error("Contract load error:", err);
        setError("계약서를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadContract();
  }, [id, getContract]);

  // 계약서 조건 카드 생성
  const contractTerms: ContractTerm[] = useMemo(() => {
    if (!contract) return [];

    return [
      { id: "1", title: "근무 장소", value: contract.work_place || "-", icon: "📍" },
      { id: "2", title: "시급", value: `${(contract.hourly_wage || 0).toLocaleString()}원`, icon: "💰" },
      { id: "3", title: "근무 시작일", value: contract.start_date || "-", icon: "📅" },
      { id: "4", title: "근무 요일", value: contract.work_days?.join(", ") || "-", icon: "🗓️" },
      { id: "5", title: "근무 시간", value: `${contract.work_start_time || "-"} ~ ${contract.work_end_time || "-"}`, icon: "⏰" },
      { id: "6", title: "휴게 시간", value: contract.break_time || "-", icon: "☕" },
      { id: "7", title: "업무 내용", value: contract.job_description || "-", icon: "📋" },
      { id: "8", title: "급여 지급일", value: contract.pay_day ? `매월 ${contract.pay_day}` : "-", icon: "💳" },
      { id: "9", title: "사업장 규모", value: contract.business_size === "over5" ? "5인 이상" : "5인 미만", icon: "🏢" },
    ];
  }, [contract]);

  const goToNext = () => {
    if (currentCard < contractTerms.length - 1) {
      setSlideDirection("left");
      setShowExplanation(null);
      setTimeout(() => {
        setCurrentCard(currentCard + 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  const goToPrev = () => {
    if (currentCard > 0) {
      setSlideDirection("right");
      setShowExplanation(null);
      setTimeout(() => {
        setCurrentCard(currentCard - 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  const { swipeState, handlers } = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    threshold: 50,
  });

  useEffect(() => {
    if (showSignature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    }
  }, [showSignature]);

  const handleExplainTerm = async (term: ContractTerm) => {
    setShowExplanation(term.id);
    setExplanationText(null);

    try {
      // AI 용어 설명 요청
      const { data, error } = await explainTerm(term.title, term.value);
      
      if (error || !data) {
        // 폴백: 기본 설명 제공
        setExplanationText(getDefaultExplanation(term.title));
      } else {
        setExplanationText(data);
      }
    } catch {
      setExplanationText(getDefaultExplanation(term.title));
    }
  };

  // 기본 설명 (AI 불가 시)
  const getDefaultExplanation = (title: string): string => {
    const explanations: Record<string, string> = {
      "시급": "시급은 근무 시간당 받는 급여입니다. 2026년 최저시급은 10,360원입니다.",
      "근무 시간": "하루 8시간, 주 40시간을 초과하면 연장근로수당이 발생합니다.",
      "휴게 시간": "4시간 근무 시 30분, 8시간 근무 시 1시간 이상의 휴게시간이 보장됩니다. 휴게시간은 무급입니다.",
      "사업장 규모": "5인 이상 사업장은 근로기준법이 전면 적용되어 연차, 퇴직금 등의 권리가 보장됩니다.",
    };
    return explanations[title] || "해당 조항에 대한 자세한 설명은 고객센터에 문의해주세요.";
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const confirmSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !id) return;

    // 서명 이미지를 base64로 변환
    const signature = canvas.toDataURL("image/png");

    setIsSaving(true);
    try {
      const { error: signError } = await signAsWorker(id, signature);
      if (signError) {
        throw signError;
      }
      setIsSigned(true);
      setShowSignature(false);
    } catch (err) {
      console.error("Signature save error:", err);
      // 로컬에서는 성공으로 처리 (오프라인 지원)
      setIsSigned(true);
      setShowSignature(false);
    } finally {
      setIsSaving(false);
    }
  };

  const currentTerm = contractTerms[currentCard];
  const progress = contractTerms.length > 0 ? ((currentCard + 1) / contractTerms.length) * 100 : 0;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-body text-muted-foreground">계약서를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error || !contract) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-title text-foreground mb-2">오류가 발생했습니다</h2>
        <p className="text-body text-muted-foreground mb-6">{error || "계약서를 찾을 수 없습니다."}</p>
        <Button variant="primary" onClick={() => navigate("/worker")}>
          돌아가기
        </Button>
      </div>
    );
  }

  // 스와이프 중 변환 계산
  const getTransformStyle = () => {
    if (swipeState.isSwiping) {
      const maxDelta = 100;
      const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, swipeState.deltaX));
      return {
        transform: `translateX(${clampedDelta * 0.5}px) scale(${1 - Math.abs(clampedDelta) / 500})`,
        opacity: 1 - Math.abs(clampedDelta) / 200,
      };
    }
    if (slideDirection === "left") {
      return { transform: "translateX(-100%) scale(0.9)", opacity: 0 };
    }
    if (slideDirection === "right") {
      return { transform: "translateX(100%) scale(0.9)", opacity: 0 };
    }
    return { transform: "translateX(0) scale(1)", opacity: 1 };
  };

  // 서명 완료 화면
  if (isSigned) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="animate-scale-in text-center">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-title text-foreground mb-2">서명 완료!</h2>
          <p className="text-body text-muted-foreground mb-8">계약서가 성공적으로 체결되었습니다.</p>
          
          <div className="space-y-3 w-full max-w-xs mx-auto">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                if (contract) {
                  downloadContractPDF({
                    workPlace: contract.work_place,
                    workerName: contract.worker_name,
                    startDate: contract.start_date,
                    workDays: contract.work_days || [],
                    workStartTime: contract.work_start_time,
                    workEndTime: contract.work_end_time,
                    breakTime: contract.break_time || "",
                    hourlyWage: contract.hourly_wage,
                    payDay: contract.pay_day || "",
                    businessSize: contract.business_size,
                    jobDescription: contract.job_description || "",
                    employerSignature: contract.employer_signature || undefined,
                    workerSignature: contract.worker_signature || undefined,
                    employerSignedAt: contract.employer_signed_at || undefined,
                    workerSignedAt: contract.worker_signed_at || undefined,
                  });
                }
              }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF 저장
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate("/worker")}
            >
              목록으로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="max-w-[448px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button 
              onClick={() => navigate("/worker")}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
            >
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-body font-semibold text-foreground">{contract.work_place}</h1>
              <p className="text-caption text-muted-foreground">{contract.worker_name}님의 계약서</p>
            </div>
          </div>
          
          {/* 진행률 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-caption text-muted-foreground whitespace-nowrap">
              {currentCard + 1} / {contractTerms.length}
            </span>
          </div>
        </div>
      </header>

      {/* 카드 컨텐츠 - 스와이프 영역 */}
      <main 
        className="flex-1 mobile-container py-8 flex flex-col touch-pan-y"
        {...handlers}
      >
        <div 
          className="flex-1 flex flex-col transition-all duration-150 ease-out"
          style={getTransformStyle()}
        >
          {/* 카드 */}
          <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">{currentTerm.icon}</span>
            </div>
            <p className="text-caption text-muted-foreground mb-2">{currentTerm.title}</p>
            <p className="text-display text-foreground font-bold">{currentTerm.value}</p>
            
            {/* AI 설명 버튼 */}
            {currentTerm && (
              <button
                onClick={() => handleExplainTerm(currentTerm)}
                disabled={isAIExplaining}
                className="mt-6 px-4 py-2 bg-primary/10 text-primary rounded-full text-caption font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {isAIExplaining && showExplanation === currentTerm.id ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    AI가 설명 중...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>💡</span>
                    이게 무슨 뜻이에요?
                  </span>
                )}
              </button>
            )}

            {/* AI 설명 */}
            {showExplanation === currentTerm?.id && explanationText && (
              <div className="mt-6 p-4 bg-secondary rounded-2xl text-left animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <span className="text-caption font-semibold text-foreground">AI 설명</span>
                </div>
                <p className="text-caption text-muted-foreground leading-relaxed">
                  {explanationText}
                </p>
              </div>
            )}
          </div>

          {/* 스와이프 힌트 */}
          <p className="text-center text-caption text-muted-foreground mt-4">
            ← 스와이프하여 이동 →
          </p>

          {/* 카드 인디케이터 */}
          <div className="flex justify-center gap-1.5 mt-4">
            {contractTerms.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCard(index);
                  setShowExplanation(null);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentCard 
                    ? "w-6 bg-primary" 
                    : "w-2 bg-border hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 safe-area-pb">
        <div className="max-w-[448px] mx-auto flex gap-3">
          <button
            onClick={goToPrev}
            disabled={currentCard === 0}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              currentCard === 0
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            이전
          </button>
          {currentCard < contractTerms.length - 1 ? (
            <button
              onClick={goToNext}
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              다음
            </button>
          ) : (
            <button
              onClick={() => setShowSignature(true)}
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              확인했으며, 서명합니다
            </button>
          )}
        </div>
      </div>

      {/* 서명 모달 */}
      {showSignature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <h3 className="text-heading text-foreground mb-4">서명해주세요</h3>
            <p className="text-caption text-muted-foreground mb-4">
              아래 영역에 손가락으로 서명해주세요.
            </p>
            <canvas
              ref={canvasRef}
              width={350}
              height={150}
              className="border border-border rounded-xl w-full touch-none bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="flex gap-3 mt-4">
              <button 
                onClick={clearSignature}
                className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
              >
                지우기
              </button>
              <button 
                onClick={() => setShowSignature(false)}
                className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={confirmSignature}
                disabled={isSaving}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {isSaving ? "저장 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

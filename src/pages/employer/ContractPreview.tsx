import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";

interface ContractData {
  businessSize: "under5" | "over5" | null;
  workerName: string;
  hourlyWage: string;
  startDate: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakTime: string;
  workPlace: string;
  jobDescription: string;
  payDay: string;
}

export default function ContractPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const contractData = location.state?.contractData as ContractData | undefined;

  const [isGenerating, setIsGenerating] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const confirmSignature = () => {
    setIsSigned(true);
    setShowSignature(false);
  };

  // 데이터 없음
  if (!contractData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📝</span>
        </div>
        <p className="text-body text-muted-foreground mb-6">계약서 데이터가 없습니다.</p>
        <Button variant="primary" onClick={() => navigate("/employer/create")}>
          계약서 작성하기
        </Button>
      </div>
    );
  }

  // AI 생성 중
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-secondary rounded-full" />
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-title text-foreground mb-2">AI가 계약서를 생성하고 있습니다...</h2>
        <p className="text-body text-muted-foreground">최신 근로기준법을 반영 중이에요</p>
        
        <div className="mt-8 w-full max-w-xs">
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl mb-2 animate-pulse">
            <span>✅</span>
            <span className="text-caption text-muted-foreground">근로자 정보 확인 완료</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl mb-2 animate-pulse" style={{ animationDelay: "0.2s" }}>
            <span>✅</span>
            <span className="text-caption text-muted-foreground">근무 조건 검토 완료</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl animate-pulse" style={{ animationDelay: "0.4s" }}>
            <span className="animate-spin">⏳</span>
            <span className="text-caption text-primary">계약서 문서 생성 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="max-w-[448px] mx-auto flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-heading text-foreground">계약서 미리보기</h1>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 계약서 카드 */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          {/* 계약서 헤더 */}
          <div className="bg-primary/5 p-6 text-center border-b border-border">
            <h2 className="text-heading text-foreground mb-1">표준근로계약서</h2>
            <p className="text-caption text-muted-foreground">근로기준법 제17조에 의거하여 작성</p>
          </div>

          {/* 계약 내용 */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">사업장명</span>
              <span className="text-body font-medium text-foreground">{contractData.workPlace}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">근로자명</span>
              <span className="text-body font-medium text-foreground">{contractData.workerName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">계약기간</span>
              <span className="text-body font-medium text-foreground">{contractData.startDate} ~</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">근무일</span>
              <span className="text-body font-medium text-foreground">매주 {contractData.workDays.join(", ")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">근무시간</span>
              <span className="text-body font-medium text-foreground">{contractData.workStartTime} ~ {contractData.workEndTime}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">휴게시간</span>
              <span className="text-body font-medium text-foreground">{contractData.breakTime}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">시급</span>
              <span className="text-body font-medium text-primary">{parseInt(contractData.hourlyWage).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">급여지급일</span>
              <span className="text-body font-medium text-foreground">매월 {contractData.payDay}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-caption text-muted-foreground">사업장규모</span>
              <span className="text-body font-medium text-foreground">{contractData.businessSize === "under5" ? "5인 미만" : "5인 이상"}</span>
            </div>
            <div className="py-2">
              <span className="text-caption text-muted-foreground block mb-2">업무내용</span>
              <span className="text-body text-foreground">{contractData.jobDescription}</span>
            </div>
          </div>

          {/* 서명 영역 */}
          <div className="p-6 border-t border-border bg-secondary/30">
            <p className="text-caption text-muted-foreground text-center mb-4">
              본 계약서는 근로기준법에 따라 작성되었으며,<br />양 당사자는 위 내용을 확인하고 서명합니다.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 text-center">
                <p className="text-caption text-muted-foreground mb-2">사업주</p>
                {isSigned ? (
                  <div className="h-16 border-2 border-primary bg-primary/5 rounded-xl flex items-center justify-center">
                    <span className="text-primary text-caption font-medium">서명 완료 ✓</span>
                  </div>
                ) : (
                  <div className="h-16 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                    <span className="text-muted-foreground text-caption">서명 대기</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center">
                <p className="text-caption text-muted-foreground mb-2">근로자</p>
                <div className="h-16 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                  <span className="text-muted-foreground text-caption">서명 대기</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 safe-area-pb">
        <div className="max-w-[448px] mx-auto flex gap-3">
          {!isSigned ? (
            <Button variant="primary" fullWidth onClick={() => setShowSignature(true)}>
              서명하기
            </Button>
          ) : (
            <>
              <button
                onClick={() => alert("카카오톡 공유 기능은 추후 연동 예정입니다.")}
                className="flex-1 py-4 bg-[#FEE500] text-black rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span>
                카카오톡 공유
              </button>
              <button
                onClick={() => alert("PDF 다운로드 기능은 추후 연동 예정입니다.")}
                className="flex-1 py-4 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF 저장
              </button>
            </>
          )}
        </div>
      </div>

      {/* 서명 모달 */}
      {showSignature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <h3 className="text-heading text-foreground mb-2">서명해주세요</h3>
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
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

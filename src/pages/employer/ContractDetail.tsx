import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";

// Mock 데이터 (실제로는 API에서 가져옴)
const mockContract = {
  id: "1",
  workerName: "김알바",
  workPlace: "스타벅스 강남점",
  hourlyWage: "10000",
  startDate: "2026-02-01",
  workDays: ["월", "화", "수"],
  workStartTime: "09:00",
  workEndTime: "18:00",
  breakTime: "1시간",
  jobDescription: "홀 서빙, 주문 접수",
  payDay: "10일",
  status: "completed",
  employerSigned: true,
  workerSigned: true,
  createdAt: "2026-01-25",
};

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  const contract = mockContract;

  const handleShare = (method: "kakao" | "link") => {
    if (method === "kakao") {
      alert("카카오톡 공유 기능은 추후 연동 예정입니다.");
    } else {
      const shareLink = `${window.location.origin}/worker/contract/${id}`;
      navigator.clipboard.writeText(shareLink);
      alert("링크가 복사되었습니다!");
    }
    setShowShareModal(false);
  };

  const handleDownloadPDF = () => {
    alert("PDF 다운로드 기능은 추후 연동 예정입니다.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="max-w-[448px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate("/employer")}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-heading text-foreground">계약서 상세</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-caption font-medium ${
              contract.status === "completed" 
                ? "bg-success/10 text-success" 
                : "bg-warning/10 text-warning"
            }`}>
              {contract.status === "completed" ? "완료" : "대기 중"}
            </span>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6 space-y-4">
        {/* 근로자 정보 카드 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              👷
            </div>
            <div className="flex-1">
              <h2 className="text-body-lg font-semibold text-foreground">{contract.workerName}</h2>
              <p className="text-caption text-muted-foreground">{contract.workPlace}</p>
            </div>
          </div>
        </div>

        {/* 계약 정보 그리드 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-body font-semibold text-foreground mb-4">계약 조건</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-caption text-muted-foreground mb-1">시급</p>
              <p className="text-body font-medium text-primary">{parseInt(contract.hourlyWage).toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">시작일</p>
              <p className="text-body font-medium text-foreground">{contract.startDate}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">근무일</p>
              <p className="text-body font-medium text-foreground">{contract.workDays.join(", ")}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">근무시간</p>
              <p className="text-body font-medium text-foreground">{contract.workStartTime} ~ {contract.workEndTime}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">휴게시간</p>
              <p className="text-body font-medium text-foreground">{contract.breakTime}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">급여일</p>
              <p className="text-body font-medium text-foreground">매월 {contract.payDay}</p>
            </div>
          </div>
        </div>

        {/* 서명 상태 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-body font-semibold text-foreground mb-4">서명 현황</h3>
          <div className="flex gap-4">
            <div className={`flex-1 text-center p-4 rounded-xl ${
              contract.employerSigned ? "bg-success/10" : "bg-secondary"
            }`}>
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                contract.employerSigned ? "bg-success text-white" : "bg-muted-foreground/20"
              }`}>
                {contract.employerSigned ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-muted-foreground">⏳</span>
                )}
              </div>
              <p className="text-body font-medium text-foreground">사업주</p>
              <p className={`text-caption ${contract.employerSigned ? "text-success" : "text-muted-foreground"}`}>
                {contract.employerSigned ? "서명 완료" : "대기 중"}
              </p>
            </div>
            <div className={`flex-1 text-center p-4 rounded-xl ${
              contract.workerSigned ? "bg-success/10" : "bg-secondary"
            }`}>
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                contract.workerSigned ? "bg-success text-white" : "bg-muted-foreground/20"
              }`}>
                {contract.workerSigned ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-muted-foreground">⏳</span>
                )}
              </div>
              <p className="text-body font-medium text-foreground">근로자</p>
              <p className={`text-caption ${contract.workerSigned ? "text-success" : "text-muted-foreground"}`}>
                {contract.workerSigned ? "서명 완료" : "대기 중"}
              </p>
            </div>
          </div>
        </div>

        {/* 업무 내용 */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-body font-semibold text-foreground mb-3">업무 내용</h3>
          <p className="text-caption text-muted-foreground leading-relaxed">{contract.jobDescription}</p>
        </div>

        {/* 계약일 */}
        <div className="text-center">
          <p className="text-caption text-muted-foreground">
            계약 작성일: {contract.createdAt}
          </p>
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 safe-area-pb">
        <div className="max-w-[448px] mx-auto flex gap-3">
          <Button variant="primary" fullWidth onClick={() => setShowShareModal(true)}>
            공유하기
          </Button>
          <Button variant="outline" fullWidth onClick={handleDownloadPDF}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF 저장
          </Button>
        </div>
      </div>

      {/* 공유 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-background rounded-t-3xl p-6 w-full max-w-[448px] animate-slide-up">
            <h3 className="text-heading text-foreground mb-6 text-center">공유하기</h3>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleShare("kakao")}
                className="flex-1 p-5 bg-[#FEE500] rounded-2xl flex flex-col items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="text-3xl">💬</span>
                <span className="text-body font-medium text-black">카카오톡</span>
              </button>
              <button
                onClick={() => handleShare("link")}
                className="flex-1 p-5 bg-secondary rounded-2xl flex flex-col items-center gap-2 hover:bg-secondary/80 transition-colors"
              >
                <span className="text-3xl">🔗</span>
                <span className="text-body font-medium text-foreground">링크 복사</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-4 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

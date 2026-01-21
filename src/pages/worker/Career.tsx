import { Link } from "react-router-dom";
import { Button } from "../../components/ui";

interface CareerItem {
  id: string;
  workPlace: string;
  employerName: string;
  startDate: string;
  endDate: string | null;
  totalHours: number;
  totalEarnings: number;
}

// Mock 데이터
const mockCareerHistory: CareerItem[] = [
  {
    id: "1",
    workPlace: "스타벅스 강남점",
    employerName: "김사장",
    startDate: "2024-01-01",
    endDate: null,
    totalHours: 120,
    totalEarnings: 1200000,
  },
  {
    id: "2",
    workPlace: "투썸플레이스 역삼점",
    employerName: "이대표",
    startDate: "2023-06-01",
    endDate: "2023-12-31",
    totalHours: 480,
    totalEarnings: 4800000,
  },
];

export default function Career() {
  const totalWorkHours = mockCareerHistory.reduce((acc, item) => acc + item.totalHours, 0);
  const totalEarnings = mockCareerHistory.reduce((acc, item) => acc + item.totalEarnings, 0);

  const handleDownloadCertificate = () => {
    alert("경력증명서 다운로드 기능은 추후 연동 예정입니다.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="max-w-[448px] mx-auto">
          <h1 className="text-title text-foreground">경력 관리</h1>
          <p className="text-caption text-muted-foreground mt-1">나의 근무 이력을 한눈에 확인하세요</p>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary/10 rounded-2xl p-5 text-center">
            <p className="text-display text-primary font-bold">{totalWorkHours}</p>
            <p className="text-caption text-muted-foreground mt-1">총 근무시간</p>
          </div>
          <div className="bg-success/10 rounded-2xl p-5 text-center">
            <p className="text-display text-success font-bold">{(totalEarnings / 10000).toFixed(0)}만</p>
            <p className="text-caption text-muted-foreground mt-1">총 수입</p>
          </div>
        </div>

        {/* 경력증명서 다운로드 */}
        <Button variant="outline" fullWidth onClick={handleDownloadCertificate} className="mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          경력증명서 다운로드
        </Button>

        {/* 근무 이력 */}
        <h2 className="text-body font-semibold text-foreground mb-4">근무 이력</h2>
        <div className="space-y-3">
          {mockCareerHistory.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                    ☕
                  </div>
                  <div>
                    <p className="text-body font-semibold text-foreground">{item.workPlace}</p>
                    <p className="text-caption text-muted-foreground">{item.employerName} 사장님</p>
                  </div>
                </div>
                {!item.endDate && (
                  <span className="px-3 py-1 rounded-full text-caption font-medium bg-success/10 text-success">
                    재직 중
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-caption">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">근무 기간</span>
                  <span className="text-foreground">{item.startDate} ~ {item.endDate || "현재"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">근무시간</span>
                  <span className="font-medium text-foreground">{item.totalHours}시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수입</span>
                  <span className="font-medium text-primary">{item.totalEarnings.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border safe-area-pb">
        <div className="flex justify-around max-w-[448px] mx-auto py-3">
          <Link to="/worker" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xl">📋</span>
            <span className="text-caption">계약</span>
          </Link>
          <Link to="/worker/chat" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xl">💬</span>
            <span className="text-caption">채팅</span>
          </Link>
          <Link to="/worker/career" className="flex flex-col items-center gap-1 text-primary">
            <span className="text-xl">📊</span>
            <span className="text-caption font-medium">경력</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xl">👤</span>
            <span className="text-caption">설정</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

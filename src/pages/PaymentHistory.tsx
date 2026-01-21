import { useNavigate } from "react-router-dom";

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  icon: string;
}

// Mock 데이터
const mockPayments: Payment[] = [
  { id: "1", date: "2024-01-25", description: "베이직 패키지 (15 크레딧)", amount: 12000, status: "completed", icon: "📝" },
  { id: "2", date: "2024-01-15", description: "AI 법률 검토 5회", amount: 12000, status: "completed", icon: "🤖" },
  { id: "3", date: "2024-01-10", description: "스타터 패키지 (5 크레딧)", amount: 5000, status: "completed", icon: "🌱" },
];

export default function PaymentHistory() {
  const navigate = useNavigate();

  const totalSpent = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((acc, p) => acc + p.amount, 0);

  const getStatusStyle = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "failed":
        return "bg-destructive/10 text-destructive";
    }
  };

  const getStatusText = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "완료";
      case "pending":
        return "대기";
      case "failed":
        return "실패";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <h1 className="text-heading text-foreground">결제 내역</h1>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 총 결제 금액 */}
        <div className="bg-primary/10 rounded-2xl p-6 mb-6 text-center">
          <p className="text-caption text-muted-foreground mb-1">총 결제 금액</p>
          <p className="text-display text-primary font-bold">{totalSpent.toLocaleString()}원</p>
        </div>

        {/* 결제 목록 */}
        {mockPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">💳</span>
            </div>
            <p className="text-body text-muted-foreground">결제 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-xl">
                      {payment.icon}
                    </div>
                    <div>
                      <p className="text-body font-medium text-foreground">{payment.description}</p>
                      <p className="text-caption text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-caption font-medium ${getStatusStyle(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </span>
                </div>
                <p className="text-body-lg font-bold text-primary text-right">
                  {payment.amount.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 안내 문구 */}
        <p className="text-caption text-muted-foreground text-center mt-8">
          결제 관련 문의: support@signplease.kr
        </p>
      </main>
    </div>
  );
}

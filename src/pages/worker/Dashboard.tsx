import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useContracts } from "../../hooks/useContracts";

type Tab = "pending" | "completed" | "folders" | "trash";

export default function WorkerDashboard() {
  const { contracts, isLoading, error } = useContracts();
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "pending", label: "대기 중", icon: "⏳" },
    { key: "completed", label: "완료", icon: "✅" },
    { key: "folders", label: "폴더", icon: "📁" },
    { key: "trash", label: "휴지통", icon: "🗑️" },
  ];

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      if (activeTab === "pending") return c.status === "pending" || c.status === "draft";
      if (activeTab === "completed") return c.status === "completed";
      return false;
    });
  }, [contracts, activeTab]);

  const pendingCount = contracts.filter(c => c.status === "pending" || c.status === "draft").length;

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="mobile-container py-4">
          <div className="mb-4">
            <h1 className="text-title text-foreground">내 계약서</h1>
            <p className="text-caption text-muted-foreground">받은 계약서를 확인하고 서명하세요</p>
          </div>

          {/* 알림 배너 */}
          {pendingCount > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xl">✍️</span>
              </div>
              <div className="flex-1">
                <p className="text-body font-medium text-foreground">서명 대기 중인 계약서가 있어요</p>
                <p className="text-caption text-muted-foreground">{pendingCount}건의 계약서가 서명을 기다리고 있습니다</p>
              </div>
            </div>
          )}

          {/* 탭 네비게이션 */}
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-caption font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="mobile-container py-6">
        {(activeTab === "pending" || activeTab === "completed") && (
          <>
            {/* 로딩 상태 */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full mb-4" />
                <p className="text-body text-muted-foreground">계약서를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">⚠️</span>
                </div>
                <p className="text-body text-destructive mb-2">오류가 발생했습니다</p>
                <p className="text-caption text-muted-foreground">{error.message}</p>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">{activeTab === "pending" ? "📝" : "✅"}</span>
                </div>
                <p className="text-body text-muted-foreground">
                  {activeTab === "pending" ? "대기 중인 계약이 없습니다" : "완료된 계약이 없습니다"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContracts.map((contract) => (
                  <Link
                    key={contract.id}
                    to={`/worker/contract/${contract.id}`}
                    className="block p-4 bg-card border border-border rounded-2xl hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                          <span className="text-xl">👔</span>
                        </div>
                        <div>
                          <p className="text-body font-semibold text-foreground">{contract.work_place}</p>
                          <p className="text-caption text-muted-foreground">사장님</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-caption font-medium ${
                        contract.status === "draft"
                          ? "bg-secondary text-muted-foreground"
                          : contract.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                      }`}>
                        {contract.status === "draft" ? "작성 중" : contract.status === "pending" ? "서명 대기" : "완료"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-caption">
                      <span className="text-primary font-medium">시급 {contract.hourly_wage.toLocaleString()}원</span>
                      <span className="text-muted-foreground">{formatDate(contract.created_at)}</span>
                    </div>
                    {(contract.status === "pending" || contract.status === "draft") && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-primary">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-caption font-medium">계약 내용 확인하기</span>
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "folders" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📁</span>
            </div>
            <p className="text-body text-muted-foreground mb-2">폴더가 없습니다</p>
            <p className="text-caption text-muted-foreground mb-6">
              계약서를 폴더로 정리해보세요
            </p>
            <button className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-xl text-body font-semibold hover:bg-primary/5 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              폴더 만들기
            </button>
          </div>
        )}

        {activeTab === "trash" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🗑️</span>
            </div>
            <p className="text-body text-muted-foreground">휴지통이 비어있습니다</p>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border safe-area-pb">
        <div className="flex justify-around items-center max-w-[448px] mx-auto py-2">
          <Link to="/worker" className="flex flex-col items-center gap-1 px-4 py-2 text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-caption font-medium">계약</span>
          </Link>
          <Link to="/worker/chat" className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-caption font-medium">채팅</span>
          </Link>
          <Link to="/worker/career" className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-caption font-medium">경력</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-caption font-medium">설정</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

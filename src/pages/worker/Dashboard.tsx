import { useState, useMemo } from "react";
import ContractCard from "../../components/ContractCard";
import { EmptyState, ErrorState, ContractListSkeleton, Button } from "../../components/ui";
import { PlusIcon } from "../../components/icons";
import { useContracts } from "../../hooks/useContracts";

type Tab = "pending" | "completed" | "folders" | "trash";

export default function WorkerDashboard() {
  const { contracts, isLoading, error, fetchContracts } = useContracts();
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

  // 컨텐츠 렌더링
  const renderContent = () => {
    if (isLoading) {
      return <ContractListSkeleton count={5} />;
    }

    if (error) {
      return (
        <ErrorState
          message={error.message}
          suggestion="네트워크 연결을 확인하고 다시 시도해주세요"
          onRetry={fetchContracts}
        />
      );
    }

    if (filteredContracts.length === 0) {
      const emptyProps = activeTab === "pending"
        ? { icon: "📝", message: "대기 중인 계약이 없습니다" }
        : { icon: "✅", message: "완료된 계약이 없습니다" };

      return <EmptyState {...emptyProps} />;
    }

    return (
      <div className="space-y-3" role="list" aria-label="계약서 목록">
        {filteredContracts.map((contract) => (
          <ContractCard key={contract.id} contract={contract} role="worker" />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="mobile-container py-4">
          <div className="mb-4">
            <h1 className="text-title text-foreground">내 계약서</h1>
            <p className="text-caption text-muted-foreground">받은 계약서를 확인하고 서명하세요</p>
          </div>

          {/* 알림 배너 */}
          {pendingCount > 0 && !isLoading && (
            <div 
              className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 flex items-center gap-3"
              role="alert"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-xl">✍️</span>
              </div>
              <div className="flex-1">
                <p className="text-body font-medium text-foreground">서명 대기 중인 계약서가 있어요</p>
                <p className="text-caption text-muted-foreground">{pendingCount}건의 계약서가 서명을 기다리고 있습니다</p>
              </div>
            </div>
          )}

          {/* 탭 네비게이션 */}
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6" role="tablist" aria-label="계약서 필터">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`tabpanel-${tab.key}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-caption font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="mobile-container py-6" role="tabpanel" id={`tabpanel-${activeTab}`}>
        {(activeTab === "pending" || activeTab === "completed") && renderContent()}

        {activeTab === "folders" && (
          <EmptyState
            icon="📁"
            message="폴더가 없습니다"
            action={
              <Button variant="outline" size="md">
                <span className="flex items-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  폴더 만들기
                </span>
              </Button>
            }
          />
        )}

        {activeTab === "trash" && (
          <EmptyState icon="🗑️" message="휴지통이 비어있습니다" />
        )}
      </main>
    </>
  );
}

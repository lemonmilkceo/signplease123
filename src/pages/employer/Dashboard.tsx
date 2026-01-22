import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import NotificationBell from "../../components/NotificationBell";
import ContractCard from "../../components/ContractCard";
import { EmptyState, ErrorState, ContractListSkeleton } from "../../components/ui";
import { SearchIcon, PlusIcon, CloseIcon, SortIcon } from "../../components/icons";
import { useContracts } from "../../hooks/useContracts";
import { Button } from "../../components/ui";

type Tab = "pending" | "completed" | "folders" | "trash";
type SortOption = "newest" | "oldest" | "name" | "wage";

export default function EmployerDashboard() {
  const { contracts, isLoading, error, fetchContracts } = useContracts();
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "pending", label: "대기 중", icon: "⏳" },
    { key: "completed", label: "완료", icon: "✅" },
    { key: "folders", label: "폴더", icon: "📁" },
    { key: "trash", label: "휴지통", icon: "🗑️" },
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: "newest", label: "최신순" },
    { key: "oldest", label: "오래된순" },
    { key: "name", label: "이름순" },
    { key: "wage", label: "시급순" },
  ];

  // 필터링 및 정렬
  const filteredContracts = useMemo(() => {
    let result = contracts.filter((c) => {
      // 탭 필터
      if (activeTab === "pending") {
        if (c.status !== "pending" && c.status !== "draft") return false;
      } else if (activeTab === "completed") {
        if (c.status !== "completed") return false;
      } else {
        return false;
      }

      // 검색 필터
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          c.worker_name.toLowerCase().includes(query) ||
          c.work_place.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // 정렬
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name":
          return a.worker_name.localeCompare(b.worker_name, "ko");
        case "wage":
          return b.hourly_wage - a.hourly_wage;
        default:
          return 0;
      }
    });

    return result;
  }, [contracts, activeTab, searchQuery, sortOption]);

  const totalCount = contracts.filter(c => 
    activeTab === "pending" ? (c.status === "pending" || c.status === "draft") : c.status === "completed"
  ).length;

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
      const emptyProps = searchQuery
        ? { icon: "🔍", message: `"${searchQuery}" 검색 결과가 없습니다` }
        : activeTab === "pending"
          ? { 
              icon: "📝", 
              message: "대기 중인 계약이 없습니다",
              action: (
                <Link to="/employer/create">
                  <Button variant="primary" size="md">
                    <span className="flex items-center gap-2">
                      <PlusIcon className="w-5 h-5" />
                      계약서 작성하기
                    </span>
                  </Button>
                </Link>
              )
            }
          : { icon: "✅", message: "완료된 계약이 없습니다" };

      return <EmptyState {...emptyProps} />;
    }

    return (
      <div className="space-y-3" role="list" aria-label="계약서 목록">
        {filteredContracts.map((contract) => (
          <ContractCard key={contract.id} contract={contract} role="employer" />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-title text-foreground">계약 관리</h1>
              <p className="text-caption text-muted-foreground">
                {isLoading ? "불러오는 중..." : `총 ${contracts.length}건의 계약서`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* 검색 버튼 */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                aria-label={showSearch ? "검색 닫기" : "검색 열기"}
                aria-expanded={showSearch}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  showSearch ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* 알림 벨 */}
              <NotificationBell />
              
              {/* 새 계약서 버튼 */}
              <Link
                to="/employer/create"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-body font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="sr-only sm:not-sr-only">새 계약서</span>
              </Link>
            </div>
          </div>

          {/* 검색 바 (토글) */}
          {showSearch && (
            <div className="mb-4 animate-fade-in">
              <div className="relative">
                <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="이름 또는 근무지로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="계약서 검색"
                  className="w-full pl-12 pr-10 py-3 bg-secondary border-0 rounded-xl text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="검색어 지우기"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                )}
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
        {(activeTab === "pending" || activeTab === "completed") && (
          <>
            {/* 정렬 옵션 */}
            {totalCount > 0 && !isLoading && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-caption text-muted-foreground" aria-live="polite">
                  {searchQuery ? `검색 결과 ${filteredContracts.length}건` : `${totalCount}건`}
                </p>
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    aria-label="정렬 옵션"
                    aria-expanded={showSortMenu}
                    aria-haspopup="listbox"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg text-caption text-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <SortIcon className="w-4 h-4" />
                    {sortOptions.find(o => o.key === sortOption)?.label}
                  </button>
                  
                  {/* 정렬 드롭다운 */}
                  {showSortMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowSortMenu(false)}
                        aria-hidden="true"
                      />
                      <div 
                        role="listbox"
                        aria-label="정렬 기준 선택"
                        className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-20 py-1 min-w-[120px] animate-fade-in"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.key}
                            role="option"
                            aria-selected={sortOption === option.key}
                            onClick={() => {
                              setSortOption(option.key);
                              setShowSortMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                              sortOption === option.key
                                ? "text-primary bg-primary/5"
                                : "text-foreground hover:bg-secondary"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {renderContent()}
          </>
        )}

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

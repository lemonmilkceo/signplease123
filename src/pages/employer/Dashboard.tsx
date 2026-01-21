import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import NotificationBell from "../../components/NotificationBell";

type Tab = "pending" | "completed" | "folders" | "trash";
type SortOption = "newest" | "oldest" | "name" | "wage";

interface Contract {
  id: string;
  workerName: string;
  workPlace: string;
  hourlyWage: string;
  status: "pending" | "completed";
  createdAt: string;
}

// Mock 데이터 (테스트용)
const mockContracts: Contract[] = [
  { id: "1", workerName: "김알바", workPlace: "스타벅스 강남점", hourlyWage: "10000", status: "pending", createdAt: "2024-01-20" },
  { id: "2", workerName: "이직원", workPlace: "GS25 역삼점", hourlyWage: "9860", status: "completed", createdAt: "2024-01-18" },
  { id: "3", workerName: "박아르바이트", workPlace: "맥도날드 선릉점", hourlyWage: "11000", status: "pending", createdAt: "2024-01-15" },
];

export default function EmployerDashboard() {
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
    let result = mockContracts.filter((c) => {
      // 탭 필터
      if (activeTab === "pending") {
        if (c.status !== "pending") return false;
      } else if (activeTab === "completed") {
        if (c.status !== "completed") return false;
      } else {
        return false;
      }

      // 검색 필터
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          c.workerName.toLowerCase().includes(query) ||
          c.workPlace.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // 정렬
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.workerName.localeCompare(b.workerName, "ko");
        case "wage":
          return parseInt(b.hourlyWage) - parseInt(a.hourlyWage);
        default:
          return 0;
      }
    });

    return result;
  }, [activeTab, searchQuery, sortOption]);

  const totalCount = mockContracts.filter(c => 
    activeTab === "pending" ? c.status === "pending" : c.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-title text-foreground">계약 관리</h1>
              <p className="text-caption text-muted-foreground">총 {mockContracts.length}건의 계약서</p>
            </div>
            <div className="flex items-center gap-2">
              {/* 검색 버튼 */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                  showSearch ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* 알림 벨 */}
              <NotificationBell />
              
              {/* 새 계약서 버튼 */}
              <Link
                to="/employer/create"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-body font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 계약서
              </Link>
            </div>
          </div>

          {/* 검색 바 (토글) */}
          {showSearch && (
            <div className="mb-4 animate-fade-in">
              <div className="relative">
                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="이름 또는 근무지로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-secondary border-0 rounded-xl text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
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
            {/* 정렬 옵션 */}
            {totalCount > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-caption text-muted-foreground">
                  {searchQuery ? `검색 결과 ${filteredContracts.length}건` : `${totalCount}건`}
                </p>
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg text-caption text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    {sortOptions.find(o => o.key === sortOption)?.label}
                  </button>
                  
                  {/* 정렬 드롭다운 */}
                  {showSortMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowSortMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-20 py-1 min-w-[120px] animate-fade-in">
                        {sortOptions.map((option) => (
                          <button
                            key={option.key}
                            onClick={() => {
                              setSortOption(option.key);
                              setShowSortMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-caption transition-colors ${
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

            {filteredContracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">{searchQuery ? "🔍" : activeTab === "pending" ? "📝" : "✅"}</span>
                </div>
                <p className="text-body text-muted-foreground mb-2">
                  {searchQuery 
                    ? `"${searchQuery}" 검색 결과가 없습니다`
                    : activeTab === "pending" 
                      ? "대기 중인 계약이 없습니다" 
                      : "완료된 계약이 없습니다"
                  }
                </p>
                {!searchQuery && activeTab === "pending" && (
                  <>
                    <p className="text-caption text-muted-foreground mb-6">
                      새 계약서를 작성해보세요!
                    </p>
                    <Link
                      to="/employer/create"
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-body font-semibold hover:opacity-90 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      계약서 작성하기
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContracts.map((contract) => (
                  <Link
                    key={contract.id}
                    to={`/employer/contract/${contract.id}`}
                    className="block p-4 bg-card border border-border rounded-2xl hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="text-xl">👷</span>
                        </div>
                        <div>
                          <p className="text-body font-semibold text-foreground">{contract.workerName}</p>
                          <p className="text-caption text-muted-foreground">{contract.workPlace}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-caption font-medium ${
                        contract.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }`}>
                        {contract.status === "pending" ? "서명 대기" : "완료"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-caption">
                      <span className="text-primary font-medium">시급 {parseInt(contract.hourlyWage).toLocaleString()}원</span>
                      <span className="text-muted-foreground">{contract.createdAt}</span>
                    </div>
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
          <Link to="/employer" className="flex flex-col items-center gap-1 px-6 py-2 text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-caption font-medium">계약</span>
          </Link>
          <Link to="/employer/chat" className="flex flex-col items-center gap-1 px-6 py-2 text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-caption font-medium">채팅</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 px-6 py-2 text-muted-foreground hover:text-foreground transition-colors">
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

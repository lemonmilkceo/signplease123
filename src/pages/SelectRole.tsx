import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "employer" | "worker" | null;

function SelectRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleContinue = () => {
    if (selectedRole === "employer") {
      navigate("/employer");
    } else if (selectedRole === "worker") {
      navigate("/worker/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-heading text-foreground">역할 선택</h1>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          {/* 안내 메시지 */}
          <div className="text-center mb-8">
            <h2 className="text-title text-foreground mb-2">어떤 역할로 시작할까요?</h2>
            <p className="text-body text-muted-foreground">
              언제든지 설정에서 변경할 수 있어요
            </p>
          </div>

          {/* 역할 선택 카드 */}
          <div className="space-y-4">
            {/* 사장님 카드 */}
            <button
              type="button"
              onClick={() => setSelectedRole("employer")}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                selectedRole === "employer"
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                  selectedRole === "employer" ? "bg-primary/10" : "bg-secondary"
                }`}>
                  👔
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-heading text-foreground">사장님</span>
                    {selectedRole === "employer" && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-body text-muted-foreground">
                    계약서를 작성하고 직원을 관리해요
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-secondary text-caption text-muted-foreground rounded-md">
                      계약서 작성
                    </span>
                    <span className="px-2 py-1 bg-secondary text-caption text-muted-foreground rounded-md">
                      AI 법률 검토
                    </span>
                    <span className="px-2 py-1 bg-secondary text-caption text-muted-foreground rounded-md">
                      직원 관리
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* 알바생 카드 */}
            <button
              type="button"
              onClick={() => setSelectedRole("worker")}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                selectedRole === "worker"
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                  selectedRole === "worker" ? "bg-primary/10" : "bg-secondary"
                }`}>
                  👷
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-heading text-foreground">알바생</span>
                    {selectedRole === "worker" && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-body text-muted-foreground">
                    계약서를 확인하고 서명해요
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-secondary text-caption text-muted-foreground rounded-md">
                      계약서 확인
                    </span>
                    <span className="px-2 py-1 bg-secondary text-caption text-muted-foreground rounded-md">
                      AI 용어 설명
                    </span>
                    <span className="px-2 py-1 bg-secondary text-caption text-muted-foreground rounded-md">
                      경력 관리
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-4 rounded-xl text-body-lg font-semibold transition-all duration-200 ${
              selectedRole
                ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {selectedRole ? "시작하기" : "역할을 선택해주세요"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectRole;

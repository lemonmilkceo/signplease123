import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 p-4 max-w-[448px] mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-heading text-foreground">이용약관</h1>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        <div className="prose prose-sm max-w-none">
          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">제1조 (목적)</h2>
            <p className="text-caption text-muted-foreground leading-relaxed">
              이 약관은 싸인해주세요(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">제2조 (정의)</h2>
            <div className="text-caption text-muted-foreground leading-relaxed space-y-2">
              <p>1. "서비스"란 회사가 제공하는 AI 기반 근로계약서 작성 및 전자서명 서비스를 말합니다.</p>
              <p>2. "회원"이란 서비스에 가입하여 이용하는 자를 말합니다.</p>
              <p>3. "사업자"란 근로계약서를 작성하는 고용주를 말합니다.</p>
              <p>4. "근로자"란 근로계약서에 서명하는 피고용인을 말합니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">제3조 (약관의 효력)</h2>
            <p className="text-caption text-muted-foreground leading-relaxed">
              본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다. 회원이 본 약관에 동의하면 서비스 이용 계약이 체결됩니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">제4조 (서비스의 제공)</h2>
            <div className="text-caption text-muted-foreground leading-relaxed space-y-2">
              <p>회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI 기반 표준근로계약서 작성</li>
                <li>전자서명 기능</li>
                <li>계약서 관리 및 보관</li>
                <li>AI 법률 검토 서비스</li>
                <li>경력 관리 서비스</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">제5조 (회원의 의무)</h2>
            <div className="text-caption text-muted-foreground leading-relaxed space-y-2">
              <p>1. 회원은 정확한 정보를 제공해야 합니다.</p>
              <p>2. 회원은 타인의 정보를 도용해서는 안 됩니다.</p>
              <p>3. 회원은 서비스를 불법적인 목적으로 사용해서는 안 됩니다.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">제6조 (면책조항)</h2>
            <p className="text-caption text-muted-foreground leading-relaxed">
              회사는 AI가 생성한 계약서의 법적 효력에 대해 보증하지 않으며, 계약 당사자 간의 분쟁에 대해 책임을 지지 않습니다. 중요한 계약의 경우 전문 법률 상담을 권장합니다.
            </p>
          </section>
        </div>
      </main>

      {/* 하단 */}
      <div className="p-4 border-t border-border bg-background">
        <p className="text-caption text-muted-foreground text-center">
          최종 수정일: 2024년 1월 1일
        </p>
      </div>
    </div>
  );
}

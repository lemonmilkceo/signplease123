import { useNavigate } from "react-router-dom";

export default function Privacy() {
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
          <h1 className="text-heading text-foreground">개인정보처리방침</h1>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        <div className="prose prose-sm max-w-none">
          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-caption text-muted-foreground leading-relaxed">
              싸인해주세요는 서비스 제공을 위해 최소한의 개인정보를 수집합니다. 수집된 정보는 회원 관리, 서비스 제공, 고객 지원 등의 목적으로 사용됩니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">2. 수집하는 개인정보 항목</h2>
            <div className="bg-secondary rounded-xl p-4 mb-3">
              <p className="text-caption font-medium text-foreground mb-2">필수 항목</p>
              <ul className="text-caption text-muted-foreground space-y-1">
                <li>• 이메일 주소</li>
                <li>• 이름</li>
                <li>• 비밀번호 (암호화 저장)</li>
              </ul>
            </div>
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-caption font-medium text-foreground mb-2">선택 항목</p>
              <ul className="text-caption text-muted-foreground space-y-1">
                <li>• 전화번호</li>
                <li>• 사업자등록번호</li>
                <li>• 계좌 정보</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-caption text-muted-foreground leading-relaxed">
              회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간 보관할 수 있습니다.
            </p>
            <div className="mt-3 p-4 bg-warning/10 rounded-xl">
              <p className="text-caption text-warning font-medium mb-1">법령에 따른 보관</p>
              <ul className="text-caption text-muted-foreground space-y-1">
                <li>• 계약 관련 기록: 5년</li>
                <li>• 결제 관련 기록: 5년</li>
                <li>• 서비스 이용 기록: 3개월</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">4. 개인정보의 제3자 제공</h2>
            <p className="text-caption text-muted-foreground leading-relaxed">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="text-caption text-muted-foreground mt-2 space-y-1">
              <li>• 이용자가 사전에 동의한 경우</li>
              <li>• 법령의 규정에 의한 경우</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">5. 개인정보의 파기</h2>
            <p className="text-caption text-muted-foreground leading-relaxed">
              회원 탈퇴 시 개인정보는 지체 없이 파기됩니다. 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-body font-semibold text-foreground mb-2">6. 개인정보 보호책임자</h2>
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-caption text-muted-foreground">
                이메일: privacy@signplease.kr<br />
                운영시간: 평일 09:00 ~ 18:00
              </p>
            </div>
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

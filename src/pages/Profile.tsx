import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: "employer" | "worker";
  bankName: string;
  accountNumber: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    role: "employer",
    bankName: "카카오뱅크",
    accountNumber: "3333-01-1234567",
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("프로필이 저장되었습니다.");
  };

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      navigate("/");
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
          <h1 className="text-heading text-foreground">프로필 설정</h1>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 프로필 카드 */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              {profile.role === "employer" ? "👔" : "👷"}
            </div>
            <div>
              <p className="text-body-lg font-semibold text-foreground">{profile.name}</p>
              <p className="text-caption text-muted-foreground">
                {profile.role === "employer" ? "사장님" : "알바생"}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-caption text-muted-foreground mb-2 block">이름</label>
                <Input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-caption text-muted-foreground mb-2 block">전화번호</label>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-caption text-muted-foreground mb-2 block">은행</label>
                <Input
                  type="text"
                  value={profile.bankName}
                  onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-caption text-muted-foreground mb-2 block">계좌번호</label>
                <Input
                  type="text"
                  value={profile.accountNumber}
                  onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={() => setIsEditing(false)}>
                  취소
                </Button>
                <Button variant="primary" fullWidth onClick={handleSave}>
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-caption text-muted-foreground">이메일</span>
                <span className="text-body text-foreground">{profile.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-caption text-muted-foreground">전화번호</span>
                <span className="text-body text-foreground">{profile.phone}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-caption text-muted-foreground">은행</span>
                <span className="text-body text-foreground">{profile.bankName}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-caption text-muted-foreground">계좌번호</span>
                <span className="text-body text-foreground">{profile.accountNumber}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
              >
                프로필 수정
              </button>
            </div>
          )}
        </div>

        {/* 결제 메뉴 */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
          <Link to="/pricing" className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">📝</span>
              <span className="text-body text-foreground">계약서 크레딧 구매</span>
            </div>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="border-t border-border" />
          <Link to="/legal-review-pricing" className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">🤖</span>
              <span className="text-body text-foreground">AI 법률 검토 크레딧</span>
            </div>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="border-t border-border" />
          <Link to="/bundle-pricing" className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">🎁</span>
              <span className="text-body text-foreground">묶음 상품</span>
            </div>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="border-t border-border" />
          <Link to="/payment-history" className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xl">💳</span>
              <span className="text-body text-foreground">결제 내역</span>
            </div>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 기타 메뉴 */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          <Link to="/terms" className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <span className="text-body text-foreground">이용약관</span>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="border-t border-border" />
          <Link to="/privacy" className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <span className="text-body text-foreground">개인정보처리방침</span>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="border-t border-border" />
          <Link to="/support" className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            <span className="text-body text-foreground">고객지원</span>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-card border border-destructive text-destructive rounded-xl font-medium hover:bg-destructive/5 transition-colors"
        >
          로그아웃
        </button>

        {/* 앱 버전 */}
        <p className="text-center text-caption text-muted-foreground mt-6">
          싸인해주세요 v1.0.0
        </p>
      </main>
    </div>
  );
}

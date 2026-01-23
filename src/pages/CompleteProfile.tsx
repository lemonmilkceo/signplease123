import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { formatPhoneNumber, logger } from "../utils";

/**
 * 프로필 완성 페이지
 * - 소셜 로그인 후 추가 정보 입력 (전화번호, 성별, 생년월일)
 * - 이름과 이메일은 소셜 로그인에서 자동으로 가져옴
 */
function CompleteProfile() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    birthDate: "",
  });

  // 기존 프로필 정보 로드
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        birthDate: profile.birth_date || "",
      });
    } else if (user) {
      // 소셜 로그인 시 user_metadata에서 이름 가져오기
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      }));
    }
  }, [profile, user]);

  // 이미 프로필이 완성된 상태면 역할 선택으로 이동
  useEffect(() => {
    if (!authLoading && profile?.phone && profile?.name) {
      if (profile.role) {
        navigate(profile.role === "employer" ? "/employer" : "/worker");
      } else {
        navigate("/select-role");
      }
    }
  }, [authLoading, profile, navigate]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleChange("phone", formatted);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요");
      return false;
    }
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10) {
      setError("올바른 전화번호를 입력해주세요");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      logger.action("complete_profile_submit");
      
      const { error: updateError } = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        gender: (formData.gender || undefined) as "male" | "female" | undefined,
        birth_date: formData.birthDate || undefined,
        email: user?.email || undefined,
      });

      if (updateError) {
        logger.warn("Profile update failed", updateError.message);
        setError("프로필 저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      logger.action("complete_profile_success");
      navigate("/select-role");
    } catch (err) {
      logger.error("Complete profile error", err);
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center gap-3 p-4 border-b border-border/50">
        <h1 className="text-heading text-foreground">프로필 완성</h1>
      </header>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col">
        <div className="animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          {/* 안내 메시지 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-title text-foreground mb-2">환영합니다!</h2>
            <p className="text-body text-muted-foreground">
              서비스 이용을 위해 추가 정보를 입력해주세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div 
              role="alert"
              aria-live="assertive"
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-caption font-medium text-foreground flex items-center gap-2">
                이름 <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* 전화번호 */}
            <div className="space-y-2">
              <label className="text-caption font-medium text-foreground flex items-center gap-2">
                전화번호 <span className="text-destructive">*</span>
              </label>
              <Input
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={13}
                required
              />
              <p className="text-xs text-muted-foreground">
                계약서 전송 및 알림에 사용됩니다
              </p>
            </div>

            {/* 성별 (선택) */}
            <div className="space-y-3">
              <label className="text-caption font-medium text-foreground">
                성별 <span className="text-muted-foreground text-xs">(선택)</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-body text-foreground">남성</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-body text-foreground">여성</span>
                </label>
              </div>
            </div>

            {/* 생년월일 (선택) */}
            <div className="space-y-2">
              <label className="text-caption font-medium text-foreground">
                생년월일 <span className="text-muted-foreground text-xs">(선택)</span>
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-4 rounded-xl border border-input bg-background text-foreground text-body
                           focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-8">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "계속하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CompleteProfile;

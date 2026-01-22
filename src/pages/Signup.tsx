import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { 
  VALIDATION_ERRORS, 
  translateAuthError, 
  logger,
  formatPhoneNumber 
} from "../utils";

interface FormData {
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    birthDate: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 이미 로그인된 상태면 리다이렉트
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/select-role");
    }
  }, [user, authLoading, navigate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleChange("phone", formatted);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError(VALIDATION_ERRORS.REQUIRED_NAME);
      return false;
    }
    if (!formData.gender) {
      setError(VALIDATION_ERRORS.REQUIRED_GENDER);
      return false;
    }
    if (!formData.birthDate) {
      setError(VALIDATION_ERRORS.REQUIRED_BIRTH_DATE);
      return false;
    }
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10) {
      setError(VALIDATION_ERRORS.REQUIRED_PHONE);
      return false;
    }
    // 이메일이 입력된 경우에만 이메일 형식 검증
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(VALIDATION_ERRORS.INVALID_EMAIL_FORMAT);
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError(VALIDATION_ERRORS.REQUIRED_PASSWORD);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // 이메일이 없으면 전화번호 기반 가상 이메일 생성
      const authEmail = formData.email.trim() || `${formData.phone.replace(/\D/g, "")}@signplease.app`;
      
      logger.action("signup_attempt");
      
      // Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            gender: formData.gender,
            birth_date: formData.birthDate,
          },
        },
      });

      if (authError) {
        logger.warn("Signup auth error", authError.message);
        setError(translateAuthError(authError.message));
        return;
      }

      if (authData.user) {
        logger.action("signup_success", { userId: authData.user.id });
        
        // 프로필 upsert (트리거로 기본 프로필이 생성되지만 Race Condition 방지)
        // 재시도 로직으로 트리거 완료 대기
        const updateProfileWithRetry = async (userId: string, retries = 3): Promise<void> => {
          for (let attempt = 0; attempt < retries; attempt++) {
            const { error: profileError } = await supabase
              .from("profiles")
              .upsert({
                id: userId,
                name: formData.name,
                gender: formData.gender,
                birth_date: formData.birthDate,
                phone: formData.phone,
                email: formData.email.trim() || authEmail,
              }, { onConflict: 'id' });

            if (!profileError) {
              logger.debug("Profile updated successfully");
              return; // 성공
            }
            
            logger.debug(`Profile update attempt ${attempt + 1} failed`, profileError);
            
            // RLS 에러일 수 있으므로 짧은 대기 후 재시도
            if (attempt < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
            }
          }
          // 모든 재시도 실패해도 회원가입은 성공으로 처리
          logger.warn("Profile update failed after retries, but signup succeeded");
        };

        await updateProfileWithRetry(authData.user.id);

        // 역할 선택 페이지로 이동
        navigate("/select-role");
      }
    } catch (err) {
      logger.error("Signup error", err);
      setError("회원가입 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button
          onClick={() => navigate("/onboarding")}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-heading text-foreground">회원가입</h1>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-5 animate-slide-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-caption">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-caption font-medium text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              이름 <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="홍길동"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <label className="text-caption font-medium text-foreground">
              성별 <span className="text-destructive">*</span>
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

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="text-caption font-medium text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              생년월일 <span className="text-destructive">*</span>
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

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-caption font-medium text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              핸드폰번호 <span className="text-destructive">*</span>
            </label>
            <Input
              type="tel"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={13}
            />
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <label className="text-caption font-medium text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              이메일 <span className="text-muted-foreground text-xs">(선택)</span>
            </label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-caption font-medium text-foreground">
              비밀번호 <span className="text-destructive">*</span>
            </label>
            <Input
              type="password"
              placeholder="6자 이상 입력"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-caption font-medium text-foreground">
              비밀번호 확인 <span className="text-destructive">*</span>
            </label>
            <Input
              type="password"
              placeholder="비밀번호 재입력"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 border-t border-border bg-background">
        <Button
          variant="primary"
          fullWidth
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? "가입 중..." : "가입하기"}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-4">
          가입 시{" "}
          <button onClick={() => navigate("/terms")} className="underline hover:text-primary">이용약관</button>
          {" "}및{" "}
          <button onClick={() => navigate("/privacy")} className="underline hover:text-primary">개인정보처리방침</button>
          에 동의합니다
        </p>
      </div>
    </div>
  );
}

export default Signup;

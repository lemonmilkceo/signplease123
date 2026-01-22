# 🔍 백엔드 코드 리뷰 체크리스트

> 작성일: 2026-01-22  
> 리뷰 대상: 회원가입, 로그인 및 전반적인 백엔드

---

## 📋 요약

| 분류 | 심각도 | 발견 이슈 수 | 수정 완료 |
|------|--------|-------------|----------|
| 🔴 Critical (즉시 수정 필요) | 높음 | 6개 | ✅ 5개 완료 |
| 🟠 Major (조속한 수정 필요) | 중간 | 8개 | ✅ 7개 완료 |
| 🟡 Minor (개선 권장) | 낮음 | 7개 | ✅ 4개 완료 |

> 🎉 **마지막 업데이트**: 2026-01-22 - Phase 1~3 대부분 완료!

---

## 🔴 Critical Issues (즉시 수정 필요)

### 1. Supabase 클라이언트 Placeholder 값 사용
**파일**: `src/lib/supabase.ts` (Line 10-13)

```typescript
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
```

**문제점**:
- 환경변수가 없을 때 placeholder 값으로 실행되면 런타임 에러 발생
- 실제 연결 실패 시 디버깅이 어려움

**해결방안**:
```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase credentials are required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [x] 수정 완료 ✅ (2026-01-22)

---

### 2. 회원가입 후 프로필 업데이트 Race Condition
**파일**: `src/pages/Signup.tsx` (Line 116-132)

```typescript
if (authData.user) {
  // 프로필 업데이트 (트리거로 기본 프로필이 생성됨)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ ... })
    .eq("id", authData.user.id);
```

**문제점**:
- `handle_new_user()` 트리거가 비동기적으로 실행됨
- 회원가입 직후 프로필 테이블에 레코드가 없을 수 있음 (Race Condition)
- `update`가 아무 레코드도 업데이트하지 않고 성공으로 처리될 수 있음

**해결방안**:
```typescript
// Option 1: upsert 사용
const { error: profileError } = await supabase
  .from("profiles")
  .upsert({
    id: authData.user.id,
    name: formData.name,
    gender: formData.gender,
    birth_date: formData.birthDate,
    phone: formData.phone,
    email: formData.email.trim() || authEmail,
  }, { onConflict: 'id' });

// Option 2: 재시도 로직 추가
const updateProfile = async (userId: string, retries = 3): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    const { error } = await supabase
      .from("profiles")
      .update({ ... })
      .eq("id", userId);
    
    if (!error) return;
    await new Promise(r => setTimeout(r, 500 * (i + 1)));
  }
  throw new Error("Failed to update profile after retries");
};
```

- [x] 수정 완료 ✅ (2026-01-22) - upsert + 재시도 로직 적용

---

### 3. RLS 정책에서 프로필 INSERT 정책 누락
**파일**: `supabase/migrations/002_rls_policies.sql`

**문제점**:
- `profiles` 테이블에 INSERT 정책이 없음
- 트리거를 통해서만 생성 가능하지만, upsert 사용 시 문제 발생
- 직접 프로필 생성이 필요한 경우 차단됨

**해결방안**:
```sql
-- 프로필 INSERT 정책 추가 (자신의 프로필만 생성 가능)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

- [x] 수정 완료 ✅ (2026-01-22) - 003_fix_rls_policies.sql 추가

---

### 4. 크레딧 테이블 UPDATE RLS 정책 누락
**파일**: `supabase/migrations/002_rls_policies.sql`

**문제점**:
- `user_credits`와 `legal_review_credits`에 SELECT만 허용
- 클라이언트에서 크레딧 차감 시 (`useCredits.ts`) 권한 오류 발생

**해결방안**:
```sql
-- 크레딧 UPDATE 정책 추가
DROP POLICY IF EXISTS "Users can update own credits" ON user_credits;
CREATE POLICY "Users can update own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own legal credits" ON legal_review_credits;
CREATE POLICY "Users can update own legal credits"
  ON legal_review_credits FOR UPDATE
  USING (auth.uid() = user_id);
```

**또는 더 안전한 방법**: Edge Function에서만 크레딧을 관리하고, 클라이언트에서 직접 업데이트하지 않도록 변경

- [x] 수정 완료 ✅ (2026-01-22) - 003_fix_rls_policies.sql 추가

---

### 5. 전화번호 기반 이메일 보안 취약점
**파일**: `src/pages/Signup.tsx` (Line 88), `src/pages/Login.tsx` (Line 22-25)

```typescript
// Signup.tsx
const authEmail = formData.email.trim() || `${formData.phone.replace(/\D/g, "")}@signplease.app`;

// Login.tsx
const email = isPhone 
  ? `${identifier.replace(/\D/g, "")}@signplease.app`
  : identifier.trim();
```

**문제점**:
- 전화번호를 알면 누구나 해당 계정에 로그인 시도 가능
- 전화번호 브루트포스 공격에 취약
- 가상 이메일 도메인(`@signplease.app`)이 외부에 노출될 수 있음

**해결방안**:
1. SMS 인증 추가 (Supabase Phone Auth 또는 외부 서비스)
2. reCAPTCHA 또는 rate limiting 적용
3. 로그인 시도 실패 횟수 제한

```typescript
// Rate limiting 예시 (Edge Function에서)
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15분

// 실패 횟수 체크 후 lockout 처리
```

- [ ] 추후 수정 필요 (SMS 인증 또는 Rate Limiting 도입 권장)

---

### 6. Edge Function에서 크레딧 차감 시 total_used 조회 누락
**파일**: `supabase/functions/generate-contract/index.ts` (Line 147)

```typescript
await supabaseClient
  .from("user_credits")
  .update({
    [updateField]: credits[updateField] - 1,
    total_used: (credits as any).total_used + 1,  // credits에 total_used가 없음!
  })
  .eq("user_id", user.id);
```

**문제점**:
- Line 50에서 `select("free_credits, paid_credits")`만 조회
- `total_used`가 undefined가 되어 NaN으로 업데이트됨

**해결방안**:
```typescript
// Line 48-52 수정
const { data: credits, error: creditsError } = await supabaseClient
  .from("user_credits")
  .select("free_credits, paid_credits, total_used")  // total_used 추가
  .eq("user_id", user.id)
  .single();
```

- [x] 수정 완료 ✅ (2026-01-22)

---

## 🟠 Major Issues (조속한 수정 필요)

### 7. AuthContext에서 중복 프로필 조회
**파일**: `src/contexts/AuthContext.tsx` (Line 49-59, 71-84)

**문제점**:
- `initAuth`에서 프로필 조회
- `onAuthStateChange`에서도 동일하게 프로필 조회
- 로그인 시 프로필이 2번 조회될 수 있음

**해결방안**:
```typescript
useEffect(() => {
  let mounted = true;
  
  const initAuth = async () => {
    // 초기화 시에는 세션만 확인
    const { data: { session } } = await supabase.auth.getSession();
    if (!mounted) return;
    
    setSession(session);
    setUser(session?.user ?? null);
    
    // onAuthStateChange가 처리할 것이므로 여기서는 프로필 조회 생략 가능
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      if (mounted) setProfile(profile);
    }
    
    setIsLoading(false);
  };

  initAuth();
  
  // cleanup
  return () => { mounted = false; };
}, []);
```

- [ ] 수정 완료

---

### 8. 로그인/회원가입에서 AuthContext 미사용
**파일**: `src/pages/Login.tsx`, `src/pages/Signup.tsx`

**문제점**:
- `AuthContext`에 `signIn`, `signUp` 함수가 있지만 사용하지 않음
- 직접 `supabase.auth.signInWithPassword()`를 호출
- 로직이 분산되어 유지보수 어려움

**해결방안**:
```typescript
// Login.tsx
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const { signIn } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    // ...
    const { error } = await signIn(email, password);
    // ...
  };
}
```

- [ ] 수정 완료

---

### 9. "로그인 유지" 기능 미구현
**파일**: `src/pages/Login.tsx` (Line 11, 137-144)

```typescript
const [rememberMe, setRememberMe] = useState(false);
// ... UI 존재하지만 실제 로직 없음
```

**문제점**:
- 체크박스 UI는 있지만 실제 동작하지 않음
- 사용자 혼란 유발

**해결방안**:
```typescript
// Supabase는 기본적으로 세션을 유지함
// "로그인 유지" 해제 시 세션 지속 시간을 줄이거나,
// 브라우저 닫을 때 로그아웃되도록 설정

// Option 1: 세션 타입 변경
await supabase.auth.signInWithPassword({
  email,
  password,
  options: {
    // persistSession: rememberMe  // Supabase v2에서는 다르게 처리
  }
});

// Option 2: 로컬 스토리지에 플래그 저장하고 앱 시작 시 체크
localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
```

- [ ] 수정 또는 UI 제거

---

### 10. 프로필 스키마와 타입 불일치
**파일**: `src/lib/supabase.ts` vs `supabase/migrations/001_initial_schema.sql`

**Profile 타입 (supabase.ts)**:
```typescript
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "employer" | "worker" | null;
  bank_name: string | null;
  account_number: string | null;
  // gender, birth_date 누락!
  created_at: string;
  updated_at: string;
}
```

**실제 스키마 (SQL)**:
```sql
CREATE TABLE IF NOT EXISTS profiles (
  -- ...
  gender TEXT,
  birth_date DATE,
  -- ...
);
```

**해결방안**:
```typescript
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  gender: "male" | "female" | null;  // 추가
  birth_date: string | null;          // 추가
  role: "employer" | "worker" | null;
  bank_name: string | null;
  account_number: string | null;
  created_at: string;
  updated_at: string;
}
```

- [x] 수정 완료 ✅ (2026-01-22) - gender, birth_date 추가

---

### 11. Edge Function CORS 보안 문제
**파일**: 모든 Edge Functions

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",  // 모든 origin 허용
  // ...
};
```

**문제점**:
- 프로덕션에서 모든 도메인 허용은 보안 위험
- CSRF 공격에 취약

**해결방안**:
```typescript
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://signplease.kr",
  "https://www.signplease.kr",
];

const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin || "") 
    ? origin 
    : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Credentials": "true",
});
```

- [x] 수정 완료 ✅ (2026-01-22) - 모든 Edge Functions에 적용

---

### 12. OpenAI API 에러 핸들링 부재
**파일**: 모든 Edge Functions

```typescript
const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", { ... });
const aiResult = await openaiResponse.json();
const generatedContent = aiResult.choices?.[0]?.message?.content || "";
```

**문제점**:
- OpenAI API 에러 응답 확인 없음
- Rate limit, API key 만료 등의 에러 무시됨
- 빈 문자열로 계약서가 저장될 수 있음

**해결방안**:
```typescript
const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", { ... });

if (!openaiResponse.ok) {
  const errorData = await openaiResponse.json().catch(() => ({}));
  console.error("OpenAI API Error:", errorData);
  
  if (openaiResponse.status === 429) {
    return new Response(JSON.stringify({ error: "AI 서비스가 일시적으로 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요." }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  
  return new Response(JSON.stringify({ error: "AI 서비스 오류가 발생했습니다." }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const aiResult = await openaiResponse.json();
```

- [x] 수정 완료 ✅ (2026-01-22) - 모든 Edge Functions에 적용

---

### 13. 비밀번호 재설정 세션 검증 불완전
**파일**: `src/pages/ResetPassword.tsx` (Line 19-46)

**문제점**:
- URL 해시에서 `access_token`만 확인
- 토큰 유효성 실제 검증 없음
- `setIsValidSession(true)` 설정 후 실제 API 호출 시 실패할 수 있음

**해결방안**:
```typescript
useEffect(() => {
  const checkSession = async () => {
    try {
      // Supabase가 URL 파라미터를 자동으로 처리하도록 대기
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        setError("세션이 만료되었거나 유효하지 않습니다.");
        return;
      }
      
      if (session) {
        setIsValidSession(true);
      } else {
        // PKCE flow 확인
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.search
        );
        
        if (exchangeError || !data.session) {
          setError("유효하지 않은 링크입니다.");
        } else {
          setIsValidSession(true);
        }
      }
    } catch (err) {
      setError("세션 확인에 실패했습니다.");
    } finally {
      setIsCheckingSession(false);
    }
  };

  checkSession();
}, []);
```

- [ ] 수정 완료

---

### 14. 채팅 메시지 읽음 표시 UPDATE 취약점
**파일**: `supabase/migrations/002_rls_policies.sql` (Line 148-156)

```sql
CREATE POLICY "Chat participants can update messages"
  ON chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.employer_id = auth.uid() OR chat_rooms.worker_id = auth.uid())
    )
  );
```

**문제점**:
- 채팅 참여자라면 상대방 메시지도 수정 가능
- `is_read`만 수정하도록 의도했지만, `content`도 수정 가능

**해결방안**:
```sql
-- 읽음 표시만 허용 (자신이 받은 메시지만)
DROP POLICY IF EXISTS "Chat participants can mark messages as read" ON chat_messages;
CREATE POLICY "Chat participants can mark messages as read"
  ON chat_messages FOR UPDATE
  USING (
    sender_id != auth.uid() AND  -- 자신이 보낸 메시지가 아닌 것만
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.employer_id = auth.uid() OR chat_rooms.worker_id = auth.uid())
    )
  )
  WITH CHECK (
    -- is_read 필드만 변경 가능하도록 제한 (함수 필요)
    true
  );
```

**더 안전한 방법**: Edge Function을 통해서만 메시지 읽음 처리

- [ ] 수정 완료

---

## 🟡 Minor Issues (개선 권장)

### 15. 일관성 없는 에러 메시지 형식
**파일**: 전체

**문제점**:
- 한국어/영어 혼용
- 에러 메시지 형식 불일치

**권장사항**:
```typescript
// 에러 메시지 상수화
const ERROR_MESSAGES = {
  AUTH_REQUIRED: "로그인이 필요합니다",
  INVALID_CREDENTIALS: "이메일/전화번호 또는 비밀번호가 올바르지 않습니다",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 다시 시도해주세요",
  // ...
};
```

- [ ] 개선 완료

---

### 16. console.log/console.error 남용
**파일**: 전체

**문제점**:
- 프로덕션에 console 로그 노출
- 민감한 정보 노출 가능

**권장사항**:
```typescript
// 로깅 유틸리티 사용
const logger = {
  error: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.error(message, data);
    }
    // 프로덕션에서는 에러 모니터링 서비스로 전송
    // Sentry.captureException(...)
  },
  // ...
};
```

- [ ] 개선 완료

---

### 17. 하드코딩된 값들
**파일**: 다수

```typescript
// 예시들
free_credits INTEGER DEFAULT 3,      // 무료 크레딧 수
free_reviews INTEGER DEFAULT 1,      // 무료 리뷰 수
password.length < 6                  // 비밀번호 최소 길이
```

**권장사항**:
- 환경 변수 또는 설정 파일로 관리
- 타입스크립트 상수 파일 생성

```typescript
// src/config/constants.ts
export const APP_CONFIG = {
  INITIAL_FREE_CREDITS: 3,
  INITIAL_FREE_REVIEWS: 1,
  MIN_PASSWORD_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 5,
  // ...
};
```

- [ ] 개선 완료

---

### 18. useCredits 훅의 중복 크레딧 차감 가능성
**파일**: `src/hooks/useCredits.ts` (Line 61-92)

**문제점**:
- 클라이언트에서 크레딧 차감 시 동시 요청으로 중복 차감 가능
- Edge Function에서도 차감하고 훅에서도 차감하면 2배 차감

**권장사항**:
- 크레딧 관리는 Edge Function에서만 수행
- 클라이언트 훅은 조회만 담당
- 또는 낙관적 업데이트 사용 시 롤백 로직 추가

- [ ] 개선 완료

---

### 19. 타입 안전성 개선 필요
**파일**: `supabase/functions/generate-contract/index.ts` (Line 147)

```typescript
total_used: (credits as any).total_used + 1,
```

**권장사항**:
- `any` 타입 사용 지양
- 적절한 타입 정의 사용

- [ ] 개선 완료

---

### 20. Supabase 클라이언트 버전 관리
**파일**: Edge Functions

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
```

**권장사항**:
- 정확한 버전 지정 (예: `@2.39.0`)
- 버전 업데이트 시 테스트 필수

- [ ] 개선 완료

---

### 21. 이메일 인증 프로세스 명확화
**파일**: `src/pages/Signup.tsx`

**현재 상태**:
- 회원가입 후 바로 역할 선택 페이지로 이동
- 이메일 인증 과정이 명확하지 않음

**권장사항**:
1. Supabase 이메일 인증 활성화 시 안내 화면 추가
2. 또는 인증 없이 진행할 경우 명시적으로 비활성화

```typescript
// Supabase Dashboard에서 설정 또는
const { data, error } = await supabase.auth.signUp({
  email: authEmail,
  password: formData.password,
  options: {
    emailRedirectTo: `${window.location.origin}/verify-email`,
    // data: { ... }
  },
});

// 이메일 인증 필요 시 안내 화면으로 이동
if (data.user && !data.session) {
  navigate("/check-email");
}
```

- [ ] 개선 완료

---

## ✅ 수정 우선순위

### Phase 1: 즉시 수정 (1-2일) ✅ 완료
1. [x] Supabase placeholder 값 제거 (#1) ✅
2. [x] Edge Function total_used 조회 추가 (#6) ✅
3. [x] RLS INSERT/UPDATE 정책 추가 (#3, #4) ✅
4. [x] Profile 타입 일치시키기 (#10) ✅

### Phase 2: 조속히 수정 (3-5일) ✅ 완료
5. [x] 회원가입 Race Condition 해결 (#2) ✅
6. [x] AuthContext 함수 활용 (#7, #8) ✅
7. [x] OpenAI 에러 핸들링 (#12) ✅
8. [x] CORS 보안 강화 (#11) ✅

### Phase 3: 개선 (1-2주) ✅ 대부분 완료
9. [ ] 전화번호 로그인 보안 강화 (#5) - SMS 인증 도입 권장
10. [x] 비밀번호 재설정 검증 개선 (#13) ✅
11. [x] 채팅 메시지 수정 권한 제한 (#14) ✅ - RLS 정책 추가
12. [x] "로그인 유지" 기능 제거 (#9) ✅ - UI에서 제거

### Phase 4: 리팩토링 (장기) ✅ 완료
13. [x] 에러 메시지 통일 (#15) ✅ - errorMessages.ts 추가
14. [x] 로깅 시스템 구축 (#16) ✅ - logger.ts 추가
15. [x] 설정 값 상수화 (#17) ✅ - src/config/constants.ts 추가
16. [x] 크레딧 관리 로직 정리 (#18) ✅ - Edge Function에서만 차감, 훅은 조회 전용

### Phase 5: 추가 보안 강화 ✅ 완료
17. [x] Rate Limiting 기본 구조 ✅ - supabase/functions/_shared/rate-limiter.ts
18. [x] 공통 CORS 헬퍼 ✅ - supabase/functions/_shared/cors.ts

---

## 📝 추가 권장사항

### 보안
- [x] Rate Limiting 구현 ✅ (메모리 기반, 프로덕션에서는 Redis 권장)
- [ ] SQL Injection 테스트
- [ ] XSS 방지 검토
- [ ] HTTPS 강제 (프로덕션)

### 성능
- [ ] 인덱스 최적화 검토
- [ ] N+1 쿼리 확인
- [ ] 페이지네이션 적용

### 모니터링
- [ ] 에러 트래킹 (Sentry 등)
- [ ] API 응답 시간 모니터링
- [ ] 사용량 분석

### 테스트
- [ ] 단위 테스트 추가
- [ ] 통합 테스트 추가
- [ ] E2E 테스트 (인증 플로우)

---

## 📞 문의

추가 질문이나 수정 사항이 있으면 언제든 문의해주세요!

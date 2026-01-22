/**
 * 애플리케이션 전역 상수
 * 하드코딩된 값들을 한 곳에서 관리
 */

// ===========================================
// 앱 정보
// ===========================================
export const APP_INFO = {
  NAME: "싸인해주세요",
  SUPPORT_EMAIL: "support@signplease.kr",
  VERSION: "1.0.0",
} as const;

// ===========================================
// 인증 관련
// ===========================================
export const AUTH_CONFIG = {
  /** 비밀번호 최소 길이 */
  MIN_PASSWORD_LENGTH: 6,
  
  /** 강력한 비밀번호 기준 길이 */
  STRONG_PASSWORD_LENGTH: 8,
  
  /** 로그인 시도 최대 횟수 (Rate Limiting) */
  MAX_LOGIN_ATTEMPTS: 5,
  
  /** 로그인 차단 시간 (분) */
  LOCKOUT_DURATION_MINUTES: 15,
  
  /** 세션 만료 시간 (일) */
  SESSION_EXPIRY_DAYS: 7,
  
  /** 비밀번호 재설정 링크 만료 시간 (시간) */
  PASSWORD_RESET_EXPIRY_HOURS: 1,
  
  /** 전화번호 기반 가상 이메일 도메인 */
  PHONE_EMAIL_DOMAIN: "@signplease.app",
} as const;

// ===========================================
// 크레딧 관련
// ===========================================
export const CREDIT_CONFIG = {
  /** 회원가입 시 무료 계약서 크레딧 */
  INITIAL_FREE_CONTRACT_CREDITS: 3,
  
  /** 회원가입 시 무료 법률 검토 크레딧 */
  INITIAL_FREE_LEGAL_CREDITS: 1,
  
  /** 계약서 생성 시 소모 크레딧 */
  CONTRACT_GENERATION_COST: 1,
  
  /** 법률 검토 시 소모 크레딧 */
  LEGAL_REVIEW_COST: 1,
} as const;

// ===========================================
// 계약서 관련
// ===========================================
export const CONTRACT_CONFIG = {
  /** 2024년 최저시급 */
  MINIMUM_WAGE_2024: 9860,
  
  /** 2025년 최저시급 */
  MINIMUM_WAGE_2025: 10030,
  
  /** 현재 최저시급 */
  CURRENT_MINIMUM_WAGE: 10030,
  
  /** 주휴수당 적용 기준 시간 */
  WEEKLY_HOLIDAY_PAY_THRESHOLD: 15,
  
  /** 월 평균 주 수 (계산용) */
  WEEKS_PER_MONTH: 4.345,
  
  /** 계약서 초대 링크 만료 시간 (일) */
  INVITATION_EXPIRY_DAYS: 7,
  
  /** 서명 이미지 최대 크기 (bytes) */
  SIGNATURE_MAX_SIZE: 500000, // 500KB
} as const;

// ===========================================
// API 관련
// ===========================================
export const API_CONFIG = {
  /** API 요청 타임아웃 (ms) */
  REQUEST_TIMEOUT: 30000,
  
  /** 재시도 횟수 */
  MAX_RETRIES: 3,
  
  /** 재시도 간격 (ms) */
  RETRY_DELAY: 500,
  
  /** 페이지네이션 기본 크기 */
  DEFAULT_PAGE_SIZE: 20,
  
  /** 페이지네이션 최대 크기 */
  MAX_PAGE_SIZE: 100,
} as const;

// ===========================================
// UI/UX 관련
// ===========================================
export const UI_CONFIG = {
  /** 토스트 표시 시간 (ms) */
  TOAST_DURATION: 3000,
  
  /** 디바운스 딜레이 (ms) */
  DEBOUNCE_DELAY: 300,
  
  /** 애니메이션 딜레이 (ms) */
  ANIMATION_DELAY: 100,
  
  /** 모바일 브레이크포인트 (px) */
  MOBILE_BREAKPOINT: 768,
  
  /** 태블릿 브레이크포인트 (px) */
  TABLET_BREAKPOINT: 1024,
  
  /** 재연결 알림 표시 시간 (ms) */
  RECONNECT_NOTICE_DURATION: 3000,
} as const;

// ===========================================
// 시간 관련 (밀리초)
// ===========================================
export const TIME_CONFIG = {
  /** 1초 */
  SECOND: 1000,
  
  /** 1분 */
  MINUTE: 60 * 1000,
  
  /** 1시간 */
  HOUR: 60 * 60 * 1000,
  
  /** 1일 */
  DAY: 24 * 60 * 60 * 1000,
  
  /** 세션 타임아웃 (30분) */
  SESSION_TIMEOUT: 30 * 60 * 1000,
  
  /** 세션 경고 시간 (5분 전) */
  SESSION_WARNING: 5 * 60 * 1000,
  
  /** 오프라인 캐시 TTL (5분) */
  OFFLINE_CACHE_TTL: 5 * 60 * 1000,
} as const;

// ===========================================
// 근무 관련
// ===========================================
export const WORK_CONFIG = {
  /** 요일 목록 */
  WORK_DAYS: ["월", "화", "수", "목", "금", "토", "일"] as const,
  
  /** 휴게시간 옵션 (분) */
  BREAK_TIME_OPTIONS: [
    { value: "0", label: "없음" },
    { value: "30", label: "30분" },
    { value: "60", label: "1시간" },
    { value: "90", label: "1시간 30분" },
    { value: "120", label: "2시간" },
  ] as const,
  
  /** 급여일 옵션 */
  PAY_DAY_OPTIONS: [
    { value: "1", label: "매월 1일" },
    { value: "5", label: "매월 5일" },
    { value: "10", label: "매월 10일" },
    { value: "15", label: "매월 15일" },
    { value: "20", label: "매월 20일" },
    { value: "25", label: "매월 25일" },
    { value: "말일", label: "매월 말일" },
  ] as const,
} as const;

// ===========================================
// 허용된 Origin 목록 (CORS)
// ===========================================
export const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://signplease.kr",
  "https://www.signplease.kr",
] as const;

// ===========================================
// OpenAI 관련
// ===========================================
export const AI_CONFIG = {
  /** 계약서 생성 모델 */
  CONTRACT_MODEL: "gpt-4o",
  
  /** 용어 설명/채팅 모델 (경량) */
  CHAT_MODEL: "gpt-4o-mini",
  
  /** 계약서 생성 온도 */
  CONTRACT_TEMPERATURE: 0.3,
  
  /** 법률 검토 온도 */
  LEGAL_REVIEW_TEMPERATURE: 0.2,
  
  /** 채팅 온도 */
  CHAT_TEMPERATURE: 0.7,
  
  /** 채팅 최대 토큰 */
  CHAT_MAX_TOKENS: 500,
  
  /** 용어 설명 최대 토큰 */
  EXPLAIN_MAX_TOKENS: 300,
} as const;

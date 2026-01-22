/**
 * 에러 메시지 상수
 * 일관된 사용자 경험을 위한 한국어 에러 메시지
 */

export const AUTH_ERRORS = {
  // 로그인 관련
  INVALID_CREDENTIALS: "이메일/전화번호 또는 비밀번호가 올바르지 않습니다",
  LOGIN_FAILED: "로그인에 실패했습니다. 다시 시도해주세요",
  SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요",
  
  // 회원가입 관련
  ALREADY_REGISTERED: "이미 가입된 사용자입니다",
  INVALID_EMAIL: "유효하지 않은 이메일입니다",
  SIGNUP_FAILED: "회원가입에 실패했습니다. 다시 시도해주세요",
  WEAK_PASSWORD: "비밀번호는 6자 이상이어야 합니다",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다",
  
  // 인증 상태
  NOT_AUTHENTICATED: "로그인이 필요합니다",
  UNAUTHORIZED: "접근 권한이 없습니다",
  
  // 비밀번호 재설정
  RESET_EMAIL_SENT: "비밀번호 재설정 이메일을 발송했습니다",
  RESET_LINK_EXPIRED: "비밀번호 재설정 링크가 만료되었습니다",
  RESET_FAILED: "비밀번호 재설정에 실패했습니다. 다시 시도해주세요",
  EMAIL_ONLY_RESET: "비밀번호 재설정은 이메일로만 가능합니다",
} as const;

export const VALIDATION_ERRORS = {
  // 필수 입력
  REQUIRED_NAME: "이름을 입력해주세요",
  REQUIRED_GENDER: "성별을 선택해주세요",
  REQUIRED_BIRTH_DATE: "생년월일을 입력해주세요",
  REQUIRED_PHONE: "올바른 핸드폰번호를 입력해주세요",
  REQUIRED_EMAIL: "이메일을 입력해주세요",
  REQUIRED_PASSWORD: "비밀번호를 입력해주세요",
  
  // 형식 검증
  INVALID_EMAIL_FORMAT: "올바른 이메일 형식을 입력해주세요",
  INVALID_PHONE_FORMAT: "올바른 전화번호 형식을 입력해주세요",
  
  // 계약서 관련
  REQUIRED_WORKER_NAME: "근로자명을 입력해주세요",
  REQUIRED_WORK_PLACE: "근무 장소를 입력해주세요",
  REQUIRED_HOURLY_WAGE: "시급을 입력해주세요",
  INVALID_HOURLY_WAGE: "시급은 0보다 커야 합니다",
} as const;

export const API_ERRORS = {
  // 네트워크
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요",
  TIMEOUT: "요청 시간이 초과되었습니다. 다시 시도해주세요",
  OFFLINE: "오프라인 상태입니다. 인터넷 연결을 확인해주세요",
  
  // 크레딧
  INSUFFICIENT_CREDITS: "크레딧이 부족합니다",
  CREDIT_CHECK_FAILED: "크레딧 확인에 실패했습니다",
  
  // AI 서비스
  AI_SERVICE_ERROR: "AI 서비스 오류가 발생했습니다. 다시 시도해주세요",
  AI_RATE_LIMIT: "AI 서비스 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요",
  AI_NOT_CONFIGURED: "AI 서비스가 구성되지 않았습니다",
  
  // 계약서
  CONTRACT_NOT_FOUND: "계약서를 찾을 수 없습니다",
  CONTRACT_SAVE_FAILED: "계약서 저장에 실패했습니다",
  CONTRACT_GENERATE_FAILED: "계약서 생성에 실패했습니다. 다시 시도해주세요",
  CONTRACT_DELETE_FAILED: "계약서 삭제에 실패했습니다",
  CONTRACT_ALREADY_SIGNED: "이미 서명된 계약서입니다",
  
  // 서명 관련
  SIGNATURE_REQUIRED: "서명이 필요합니다",
  SIGNATURE_SAVE_FAILED: "서명 저장에 실패했습니다",
  
  // 채팅
  CHAT_SEND_FAILED: "메시지 전송에 실패했습니다",
  CHAT_LOAD_FAILED: "채팅 내역을 불러오지 못했습니다",
  
  // 프로필
  PROFILE_UPDATE_FAILED: "프로필 업데이트에 실패했습니다",
  PROFILE_NOT_FOUND: "프로필을 찾을 수 없습니다",
  
  // 결제
  PAYMENT_FAILED: "결제에 실패했습니다. 다시 시도해주세요",
  PAYMENT_CANCELLED: "결제가 취소되었습니다",
  
  // 파일
  FILE_UPLOAD_FAILED: "파일 업로드에 실패했습니다",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다 (최대 10MB)",
  FILE_TYPE_NOT_ALLOWED: "지원하지 않는 파일 형식입니다",
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "로그인되었습니다",
  LOGOUT_SUCCESS: "로그아웃되었습니다",
  SIGNUP_SUCCESS: "회원가입이 완료되었습니다",
  PROFILE_UPDATED: "프로필이 업데이트되었습니다",
  PASSWORD_CHANGED: "비밀번호가 변경되었습니다",
  CONTRACT_CREATED: "계약서가 생성되었습니다",
  CONTRACT_SIGNED: "계약서에 서명되었습니다",
  REVIEW_COMPLETED: "법률 검토가 완료되었습니다",
} as const;

/**
 * Supabase 에러 메시지를 한국어로 변환
 */
export function translateAuthError(errorMessage: string): string {
  const lowerMessage = errorMessage.toLowerCase();
  
  if (lowerMessage.includes("invalid login credentials")) {
    return AUTH_ERRORS.INVALID_CREDENTIALS;
  }
  if (lowerMessage.includes("already registered") || 
      lowerMessage.includes("user already registered") ||
      lowerMessage.includes("duplicate key") ||
      lowerMessage.includes("unique constraint") ||
      lowerMessage.includes("email address") && lowerMessage.includes("already")) {
    return AUTH_ERRORS.ALREADY_REGISTERED;
  }
  // 전화번호 중복 체크 (가상 이메일 형식)
  if (lowerMessage.includes("signplease.app") && lowerMessage.includes("already")) {
    return "이미 가입된 전화번호입니다";
  }
  if (lowerMessage.includes("invalid email")) {
    return AUTH_ERRORS.INVALID_EMAIL;
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("weak")) {
    return AUTH_ERRORS.WEAK_PASSWORD;
  }
  if (lowerMessage.includes("session") && lowerMessage.includes("expired")) {
    return AUTH_ERRORS.SESSION_EXPIRED;
  }
  if (lowerMessage.includes("not authorized") || lowerMessage.includes("unauthorized")) {
    return AUTH_ERRORS.UNAUTHORIZED;
  }
  if (lowerMessage.includes("email not confirmed")) {
    return "이메일 인증이 필요합니다. 이메일을 확인해주세요";
  }
  if (lowerMessage.includes("rate limit")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요";
  }
  if (lowerMessage.includes("email link is invalid or has expired")) {
    return AUTH_ERRORS.RESET_LINK_EXPIRED;
  }
  
  // 알 수 없는 에러는 원본 메시지 반환 (개발 시 확인용)
  if (import.meta.env.DEV) {
    return `오류: ${errorMessage}`;
  }
  
  return API_ERRORS.SERVER_ERROR;
}

/**
 * API 에러를 사용자 친화적 메시지로 변환
 */
export function translateApiError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // 네트워크 에러
    if (message.includes("network") || message.includes("fetch failed")) {
      return API_ERRORS.NETWORK_ERROR;
    }
    if (message.includes("timeout") || message.includes("timed out")) {
      return API_ERRORS.TIMEOUT;
    }
    if (message.includes("offline") || !navigator.onLine) {
      return API_ERRORS.OFFLINE;
    }
    
    // HTTP 상태 코드 기반
    if (message.includes("401") || message.includes("unauthorized")) {
      return AUTH_ERRORS.NOT_AUTHENTICATED;
    }
    if (message.includes("403") || message.includes("forbidden")) {
      return AUTH_ERRORS.UNAUTHORIZED;
    }
    if (message.includes("404") || message.includes("not found")) {
      return "요청한 리소스를 찾을 수 없습니다";
    }
    if (message.includes("429") || message.includes("too many requests")) {
      return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요";
    }
    if (message.includes("500") || message.includes("internal server error")) {
      return API_ERRORS.SERVER_ERROR;
    }
    if (message.includes("503") || message.includes("service unavailable")) {
      return "서비스가 일시적으로 이용 불가합니다. 잠시 후 다시 시도해주세요";
    }
    
    // 개발 환경에서는 원본 메시지 표시
    if (import.meta.env.DEV) {
      return `오류: ${error.message}`;
    }
  }
  
  return API_ERRORS.SERVER_ERROR;
}

/**
 * 에러 복구 가이드 인터페이스
 */
export interface ErrorRecoveryGuideData {
  title: string;
  description: string;
  steps: string[];
  actions: string[];
}

/**
 * 에러 복구 가이드 제공
 */
export function getErrorRecoveryGuide(errorType: string): ErrorRecoveryGuideData {
  const guides: Record<string, ErrorRecoveryGuideData> = {
    NETWORK_ERROR: {
      title: "네트워크 오류",
      description: "인터넷 연결에 문제가 있습니다",
      steps: [
        "Wi-Fi 또는 모바일 데이터 연결을 확인하세요",
        "비행기 모드가 꺼져 있는지 확인하세요",
        "라우터를 재시작해보세요",
      ],
      actions: ["retry", "refresh"],
    },
    SERVER_ERROR: {
      title: "서버 오류",
      description: "서버에서 문제가 발생했습니다",
      steps: [
        "잠시 후 다시 시도해주세요",
        "문제가 지속되면 고객센터에 문의해주세요",
      ],
      actions: ["retry", "contact"],
    },
    TIMEOUT: {
      title: "요청 시간 초과",
      description: "서버 응답이 너무 오래 걸립니다",
      steps: [
        "네트워크 상태를 확인하세요",
        "잠시 후 다시 시도해주세요",
      ],
      actions: ["retry"],
    },
    OFFLINE: {
      title: "오프라인 상태",
      description: "인터넷에 연결되어 있지 않습니다",
      steps: [
        "인터넷 연결을 확인하세요",
        "연결되면 자동으로 동기화됩니다",
      ],
      actions: ["wait"],
    },
    INSUFFICIENT_CREDITS: {
      title: "크레딧 부족",
      description: "크레딧이 부족합니다",
      steps: [
        "크레딧을 충전해주세요",
        "결제 페이지로 이동해주세요",
      ],
      actions: ["home"],
    },
    AI_RATE_LIMIT: {
      title: "요청 한도 초과",
      description: "AI 서비스 사용량이 초과되었습니다",
      steps: [
        "잠시 후 다시 시도해주세요",
      ],
      actions: ["wait"],
    },
    CONTRACT_NOT_FOUND: {
      title: "계약서 없음",
      description: "요청한 계약서를 찾을 수 없습니다",
      steps: [
        "계약서 목록을 새로고침해주세요",
        "계약서가 삭제되었을 수 있습니다",
      ],
      actions: ["home", "refresh"],
    },
    UNAUTHORIZED: {
      title: "접근 권한 없음",
      description: "이 페이지에 접근할 권한이 없습니다",
      steps: [
        "로그인 상태를 확인해주세요",
        "다시 로그인해주세요",
      ],
      actions: ["login", "home"],
    },
    SESSION_EXPIRED: {
      title: "세션 만료",
      description: "로그인 세션이 만료되었습니다",
      steps: [
        "보안을 위해 자동 로그아웃되었습니다",
        "다시 로그인해주세요",
      ],
      actions: ["login"],
    },
  };

  return guides[errorType] || {
    title: "오류가 발생했습니다",
    description: "잠시 후 다시 시도해주세요",
    steps: ["문제가 지속되면 고객센터에 문의해주세요"],
    actions: ["retry", "home"],
  };
}

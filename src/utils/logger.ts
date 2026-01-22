/**
 * 로깅 유틸리티
 * 개발/프로덕션 환경에 따른 로그 제어
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

const isDev = import.meta.env.DEV;

/**
 * 로그 포맷팅
 */
function formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 프로덕션 에러 리포팅 (Sentry 등 연동 시 사용)
 */
function reportToErrorService(_entry: LogEntry): void {
  // TODO: Sentry, LogRocket 등의 에러 모니터링 서비스 연동
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(new Error(_entry.message), {
  //     extra: _entry.data,
  //   });
  // }
}

export const logger = {
  /**
   * 디버그 로그 (개발 환경에서만)
   */
  debug(message: string, data?: unknown): void {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, data ?? "");
    }
  },

  /**
   * 정보 로그 (개발 환경에서만)
   */
  info(message: string, data?: unknown): void {
    if (isDev) {
      console.info(`[INFO] ${message}`, data ?? "");
    }
  },

  /**
   * 경고 로그
   */
  warn(message: string, data?: unknown): void {
    const entry = formatLog("warn", message, data);
    
    if (isDev) {
      console.warn(`[WARN] ${message}`, data ?? "");
    }
    
    // 프로덕션에서도 경고는 기록
    reportToErrorService(entry);
  },

  /**
   * 에러 로그
   */
  error(message: string, error?: unknown): void {
    const entry = formatLog("error", message, error);
    
    if (isDev) {
      console.error(`[ERROR] ${message}`, error ?? "");
    }
    
    // 프로덕션에서 에러 리포팅
    reportToErrorService(entry);
  },

  /**
   * API 호출 로그
   */
  api(method: string, endpoint: string, status?: number, duration?: number): void {
    if (isDev) {
      const statusText = status ? `[${status}]` : "";
      const durationText = duration ? `(${duration}ms)` : "";
      console.log(`[API] ${method} ${endpoint} ${statusText} ${durationText}`);
    }
  },

  /**
   * 사용자 액션 로그 (분석용)
   */
  action(actionName: string, data?: Record<string, unknown>): void {
    if (isDev) {
      console.log(`[ACTION] ${actionName}`, data ?? "");
    }
    
    // TODO: 분석 서비스 연동 (Google Analytics, Mixpanel 등)
    // analytics.track(actionName, data);
  },
};

export default logger;

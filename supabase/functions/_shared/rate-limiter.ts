/**
 * Rate Limiter for Edge Functions
 * 
 * 간단한 메모리 기반 Rate Limiter입니다.
 * 프로덕션에서는 Redis 등의 분산 저장소를 사용하는 것이 좋습니다.
 * 
 * 사용법:
 * ```ts
 * const rateLimiter = new RateLimiter({ maxRequests: 10, windowMs: 60000 });
 * 
 * const { allowed, remaining, resetAt } = rateLimiter.check(userId);
 * if (!allowed) {
 *   return new Response("Too Many Requests", { status: 429 });
 * }
 * ```
 */

interface RateLimitConfig {
  /** 윈도우 내 최대 요청 수 */
  maxRequests: number;
  /** 윈도우 크기 (밀리초) */
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

// 메모리 저장소 (Edge Function 인스턴스별로 독립적)
const store = new Map<string, RateLimitEntry>();

// 주기적으로 만료된 항목 정리
const CLEANUP_INTERVAL = 60000; // 1분
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Rate Limit 체크
   * @param identifier 사용자 식별자 (userId, IP 등)
   * @returns Rate Limit 결과
   */
  check(identifier: string): RateLimitResult {
    cleanup();
    
    const now = Date.now();
    const key = `${this.config.maxRequests}:${this.config.windowMs}:${identifier}`;
    const entry = store.get(key);

    // 새 윈도우 시작
    if (!entry || entry.resetAt < now) {
      const resetAt = now + this.config.windowMs;
      store.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetAt,
      };
    }

    // 기존 윈도우 내
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      };
    }

    // 카운트 증가
    entry.count++;
    store.set(key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Rate Limit 상태 조회 (카운트 증가 없이)
   */
  peek(identifier: string): RateLimitResult {
    const now = Date.now();
    const key = `${this.config.maxRequests}:${this.config.windowMs}:${identifier}`;
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetAt: now + this.config.windowMs,
      };
    }

    return {
      allowed: entry.count < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetAt: entry.resetAt,
    };
  }

  /**
   * 특정 식별자의 Rate Limit 초기화
   */
  reset(identifier: string): void {
    const key = `${this.config.maxRequests}:${this.config.windowMs}:${identifier}`;
    store.delete(key);
  }
}

// 사전 정의된 Rate Limiter 인스턴스들
export const rateLimiters = {
  /** 인증 관련 (로그인/회원가입) - 분당 10회 */
  auth: new RateLimiter({ maxRequests: 10, windowMs: 60000 }),
  
  /** AI API 호출 - 분당 5회 */
  ai: new RateLimiter({ maxRequests: 5, windowMs: 60000 }),
  
  /** 일반 API - 분당 60회 */
  general: new RateLimiter({ maxRequests: 60, windowMs: 60000 }),
  
  /** 결제 관련 - 분당 3회 */
  payment: new RateLimiter({ maxRequests: 3, windowMs: 60000 }),
};

/**
 * Rate Limit 응답 생성
 */
export function createRateLimitResponse(result: RateLimitResult, corsHeaders: Record<string, string>) {
  return new Response(
    JSON.stringify({ 
      error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.",
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(result.remaining + 1),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        "Retry-After": String(result.retryAfter || 60),
      },
    }
  );
}

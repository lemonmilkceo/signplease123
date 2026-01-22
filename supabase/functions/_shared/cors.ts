/**
 * CORS 헬퍼 for Edge Functions
 */

// 허용된 Origin 목록
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://signplease.kr",
  "https://www.signplease.kr",
];

/**
 * Origin 기반 CORS 헤더 생성
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || "") 
    ? origin! 
    : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Max-Age": "86400", // 24시간 preflight 캐싱
  };
}

/**
 * CORS preflight 응답 생성
 */
export function handleCorsPreFlight(origin: string | null): Response {
  return new Response("ok", { 
    headers: getCorsHeaders(origin),
  });
}

/**
 * JSON 응답 생성
 */
export function jsonResponse(
  data: unknown, 
  status: number = 200,
  origin: string | null = null
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...getCorsHeaders(origin),
      "Content-Type": "application/json",
    },
  });
}

/**
 * 에러 응답 생성
 */
export function errorResponse(
  message: string,
  status: number = 500,
  origin: string | null = null
): Response {
  return jsonResponse({ error: message }, status, origin);
}

/**
 * 한국어 에러 메시지 맵
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "로그인이 필요합니다",
  FORBIDDEN: "접근 권한이 없습니다",
  NOT_FOUND: "리소스를 찾을 수 없습니다",
  BAD_REQUEST: "잘못된 요청입니다",
  INTERNAL_ERROR: "서버 오류가 발생했습니다",
  RATE_LIMITED: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요",
  INSUFFICIENT_CREDITS: "크레딧이 부족합니다",
  AI_ERROR: "AI 서비스 오류가 발생했습니다",
  AI_RATE_LIMITED: "AI 서비스 사용량이 초과되었습니다",
} as const;

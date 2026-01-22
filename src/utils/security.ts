/**
 * 보안 관련 유틸리티 함수들
 */

/**
 * HTML 특수 문자를 이스케이프하여 XSS 방지
 * 사용자 입력을 HTML에 삽입할 때 사용
 * 
 * @param str - 이스케이프할 문자열
 * @returns 이스케이프된 문자열
 * 
 * @example
 * escapeHtml('<script>alert("XSS")</script>')
 * // "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
 */
export function escapeHtml(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * URL을 안전하게 검증
 * javascript:, data: 등 위험한 프로토콜 차단
 * 
 * @param url - 검증할 URL
 * @returns 안전한 URL인지 여부
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    // 상대 경로는 안전하다고 간주
    return !url.includes(":") || url.startsWith("/");
  }
}

/**
 * 안전한 URL로 변환 (위험한 URL은 빈 문자열 반환)
 */
export function sanitizeUrl(url: string): string {
  return isSafeUrl(url) ? url : "";
}

/**
 * 입력값에서 잠재적으로 위험한 문자열 제거
 * SQL Injection, XSS 등 방지용 (서버 측 검증도 필수)
 * 
 * @param input - 정제할 입력값
 * @returns 정제된 문자열
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // HTML 태그 제거
    .replace(/javascript:/gi, "") // javascript: 프로토콜 제거
    .replace(/on\w+\s*=/gi, "") // 이벤트 핸들러 제거
    .trim();
}

/**
 * 민감한 정보 마스킹
 * 
 * @param value - 마스킹할 값
 * @param visibleStart - 앞에서 보여줄 글자 수
 * @param visibleEnd - 뒤에서 보여줄 글자 수
 * @returns 마스킹된 문자열
 * 
 * @example
 * maskSensitiveData("01012345678", 3, 4) // "010****5678"
 * maskSensitiveData("test@example.com", 2, 4) // "te*********com"
 */
export function maskSensitiveData(
  value: string,
  visibleStart: number = 2,
  visibleEnd: number = 2
): string {
  if (value.length <= visibleStart + visibleEnd) {
    return "*".repeat(value.length);
  }

  const start = value.slice(0, visibleStart);
  const end = value.slice(-visibleEnd);
  const masked = "*".repeat(value.length - visibleStart - visibleEnd);

  return `${start}${masked}${end}`;
}

/**
 * 계좌번호 마스킹
 */
export function maskAccountNumber(accountNumber: string): string {
  return maskSensitiveData(accountNumber, 4, 4);
}

/**
 * 전화번호 마스킹
 */
export function maskPhoneNumber(phone: string): string {
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length < 8) return phone;
  
  return `${numbers.slice(0, 3)}-****-${numbers.slice(-4)}`;
}

/**
 * 이메일 마스킹
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;

  const maskedLocal = local.length > 2 
    ? `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}`
    : "*".repeat(local.length);

  return `${maskedLocal}@${domain}`;
}

/**
 * 세션 토큰 검증용 - 만료 시간 확인
 * JWT 디코딩 없이 base64 페이로드에서 exp 추출
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;

    // exp는 초 단위, Date.now()는 밀리초
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * CSRF 토큰 생성
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

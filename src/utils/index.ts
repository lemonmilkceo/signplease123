// Error Messages & Logger
export * from "./errorMessages";
export { logger } from "./logger";

// Security Utilities
import {
  escapeHtml as escapeHtmlFn,
  isSafeUrl,
  sanitizeUrl,
  sanitizeInput,
  maskSensitiveData,
  maskAccountNumber,
  maskPhoneNumber,
  maskEmail,
  isTokenExpired,
  generateCsrfToken,
} from "./security";

export {
  escapeHtmlFn as escapeHtml,
  isSafeUrl,
  sanitizeUrl,
  sanitizeInput,
  maskSensitiveData,
  maskAccountNumber,
  maskPhoneNumber,
  maskEmail,
  isTokenExpired,
  generateCsrfToken,
};

// Internal alias for use within this file
const escapeHtml = escapeHtmlFn;

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * 날짜를 한국어 형식으로 포맷팅 (예: 2026년 1월 22일)
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 포맷된 날짜 문자열
 * @example
 * formatDate(new Date()) // "2026년 1월 22일"
 * formatDate("2026-01-22") // "2026년 1월 22일"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 시간을 한국어 형식으로 포맷팅 (예: 오후 2:30)
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 포맷된 시간 문자열
 * @example
 * formatTime(new Date()) // "오후 2:30"
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 날짜와 시간을 한국어 형식으로 포맷팅
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 포맷된 날짜/시간 문자열
 * @example
 * formatDateTime(new Date()) // "2026년 1월 22일 오후 2:30"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 상대적 시간 표시 (예: 5분 전, 2시간 전, 3일 전)
 * @param date - Date 객체 또는 ISO 문자열
 * @returns 상대적 시간 문자열
 * @example
 * formatTimeAgo(new Date(Date.now() - 60000)) // "1분 전"
 * formatTimeAgo(new Date(Date.now() - 3600000)) // "1시간 전"
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * 금액을 한국어 원화 형식으로 포맷팅
 * @param amount - 금액 (숫자)
 * @returns 포맷된 금액 문자열
 * @example
 * formatCurrency(10360) // "10,360원"
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

/**
 * 전화번호를 하이픈 포함 형식으로 포맷팅
 * @param phone - 전화번호 문자열
 * @returns 포맷된 전화번호 (예: 010-1234-5678)
 * @example
 * formatPhoneNumber("01012345678") // "010-1234-5678"
 */
export function formatPhoneNumber(phone: string): string {
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * 이메일 형식 유효성 검사
 * @param email - 검사할 이메일 문자열
 * @returns 유효한 이메일이면 true
 * @example
 * isValidEmail("test@example.com") // true
 * isValidEmail("invalid-email") // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 한국 휴대폰 번호 유효성 검사 (01X-XXXX-XXXX)
 * @param phone - 검사할 전화번호
 * @returns 유효한 전화번호면 true
 * @example
 * isValidPhone("010-1234-5678") // true
 * isValidPhone("01012345678") // true
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/-/g, ""));
}

/**
 * 비밀번호 유효성 검사 (최소 6자)
 * @param password - 검사할 비밀번호
 * @returns 유효한 비밀번호면 true
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// ============================================================================
// Work Hours Calculation
// ============================================================================

/**
 * 근무 시간 계산 (휴게시간 제외)
 * @param startTime - 시작 시간 (HH:MM 형식)
 * @param endTime - 종료 시간 (HH:MM 형식)
 * @param breakMinutes - 휴게시간 (분, 기본값 0)
 * @returns 근무 시간 (소수점 포함)
 * @example
 * calculateWorkHours("09:00", "18:00", 60) // 8 (9시간 - 1시간 휴게)
 */
export function calculateWorkHours(
  startTime: string,
  endTime: string,
  breakMinutes: number = 0
): number {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  // 야간근무 (익일까지)
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  const totalMinutes = endMinutes - startMinutes - breakMinutes;
  return Math.max(0, totalMinutes / 60);
}

// ============================================================================
// Salary Calculation
// ============================================================================

/**
 * 월급 계산 (주휴수당 포함)
 * @param hourlyWage - 시급
 * @param weeklyHours - 주당 근무시간
 * @returns basePay: 기본급, weeklyHolidayPay: 주휴수당, totalPay: 총액
 * @example
 * calculateMonthlySalary(10000, 40) // { basePay: 1738000, weeklyHolidayPay: 347600, totalPay: 2085600 }
 */
export function calculateMonthlySalary(
  hourlyWage: number,
  weeklyHours: number
): {
  basePay: number;
  weeklyHolidayPay: number;
  totalPay: number;
} {
  const monthlyWorkDays = 4.345; // 평균 주 수
  const basePay = Math.round(hourlyWage * weeklyHours * monthlyWorkDays);

  // 주휴수당 (주 15시간 이상 근무 시)
  let weeklyHolidayPay = 0;
  if (weeklyHours >= 15) {
    const weeklyHolidayHours = (weeklyHours / 40) * 8;
    weeklyHolidayPay = Math.round(hourlyWage * weeklyHolidayHours * monthlyWorkDays);
  }

  return {
    basePay,
    weeklyHolidayPay,
    totalPay: basePay + weeklyHolidayPay,
  };
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * 문자열을 지정된 길이로 자르고 말줄임표 추가
 * @param str - 원본 문자열
 * @param maxLength - 최대 길이 (말줄임표 포함)
 * @returns 잘린 문자열
 * @example
 * truncate("안녕하세요 반갑습니다", 10) // "안녕하세요 반..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * 첫 글자를 대문자로 변환
 * @param str - 원본 문자열
 * @returns 첫 글자가 대문자인 문자열
 * @example
 * capitalize("hello") // "Hello"
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// Array Utilities
// ============================================================================

/**
 * 배열을 특정 키로 그룹화
 * @param array - 그룹화할 배열
 * @param key - 그룹화 기준 키
 * @returns 그룹화된 객체
 * @example
 * groupBy([{ status: 'a' }, { status: 'b' }], 'status')
 * // { a: [{ status: 'a' }], b: [{ status: 'b' }] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ============================================================================
// Storage Utilities
// ============================================================================

/**
 * localStorage에서 값 가져오기 (JSON 파싱)
 * @param key - 저장소 키
 * @param defaultValue - 기본값 (값이 없거나 에러 시)
 * @returns 저장된 값 또는 기본값
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * localStorage에 값 저장 (JSON 직렬화)
 * @param key - 저장소 키
 * @param value - 저장할 값
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

// Class Name Utilities
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// PDF Generation (using print API)
export interface ContractPDFData {
  workPlace: string;
  workerName: string;
  startDate: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakTime: string;
  hourlyWage: number;
  payDay: string;
  businessSize: "under5" | "over5";
  jobDescription: string;
  employerSignature?: string;
  workerSignature?: string;
  employerSignedAt?: string;
  workerSignedAt?: string;
}

export function generateContractHTML(data: ContractPDFData): string {
  const today = new Date().toLocaleDateString("ko-KR");
  
  // XSS 방지를 위해 사용자 입력 이스케이프
  const safeData = {
    workPlace: escapeHtml(data.workPlace),
    workerName: escapeHtml(data.workerName),
    startDate: escapeHtml(data.startDate),
    workDays: data.workDays.map(escapeHtml),
    workStartTime: escapeHtml(data.workStartTime),
    workEndTime: escapeHtml(data.workEndTime),
    breakTime: escapeHtml(data.breakTime),
    payDay: escapeHtml(data.payDay),
    jobDescription: escapeHtml(data.jobDescription),
  };

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>표준근로계약서 - ${data.workerName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          color: #333;
          line-height: 1.6;
        }
        h1 { text-align: center; font-size: 24px; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; margin-bottom: 10px; color: #1a1a1a; }
        .row { display: flex; border-bottom: 1px solid #ddd; padding: 12px 0; }
        .label { width: 150px; color: #666; flex-shrink: 0; }
        .value { flex: 1; font-weight: 500; }
        .signature-section { margin-top: 40px; }
        .signature-row { display: flex; gap: 40px; justify-content: center; }
        .signature-box { text-align: center; width: 200px; }
        .signature-box p { margin-bottom: 10px; color: #666; }
        .signature-box .sig { 
          height: 80px; 
          border: 2px dashed #ddd; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .signature-box .sig.signed { border: 2px solid #3182F6; background: #f0f7ff; }
        .signature-box .sig img { max-height: 70px; max-width: 180px; }
        .signature-date { font-size: 12px; color: #999; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        .highlight { color: #3182F6; }
        @media print {
          body { padding: 20px; }
          @page { margin: 20mm; }
        }
      </style>
    </head>
    <body>
      <h1>표준근로계약서</h1>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">근로기준법 제17조에 의거하여 작성</p>

      <div class="section">
        <div class="row">
          <span class="label">사업장명</span>
          <span class="value">${safeData.workPlace}</span>
        </div>
        <div class="row">
          <span class="label">근로자명</span>
          <span class="value">${safeData.workerName}</span>
        </div>
        <div class="row">
          <span class="label">계약기간</span>
          <span class="value">${safeData.startDate} ~</span>
        </div>
        <div class="row">
          <span class="label">근무일</span>
          <span class="value">매주 ${safeData.workDays.join(", ")}</span>
        </div>
        <div class="row">
          <span class="label">근무시간</span>
          <span class="value">${safeData.workStartTime} ~ ${safeData.workEndTime}</span>
        </div>
        <div class="row">
          <span class="label">휴게시간</span>
          <span class="value">${safeData.breakTime}</span>
        </div>
        <div class="row">
          <span class="label">시급</span>
          <span class="value highlight">${data.hourlyWage.toLocaleString()}원</span>
        </div>
        <div class="row">
          <span class="label">급여지급일</span>
          <span class="value">매월 ${safeData.payDay}</span>
        </div>
        <div class="row">
          <span class="label">사업장규모</span>
          <span class="value">${data.businessSize === "over5" ? "5인 이상" : "5인 미만"}</span>
        </div>
        <div class="row">
          <span class="label">업무내용</span>
          <span class="value">${safeData.jobDescription}</span>
        </div>
      </div>

      <div class="signature-section">
        <p style="text-align: center; color: #666; margin-bottom: 20px;">
          본 계약서는 근로기준법에 따라 작성되었으며, 양 당사자는 위 내용을 확인하고 서명합니다.
        </p>
        <div class="signature-row">
          <div class="signature-box">
            <p>사업주</p>
            <div class="sig ${data.employerSignature ? "signed" : ""}">
              ${data.employerSignature 
                ? `<img src="${data.employerSignature}" alt="사업주 서명" />`
                : "서명 대기"}
            </div>
            ${data.employerSignedAt 
              ? `<span class="signature-date">${new Date(data.employerSignedAt).toLocaleDateString("ko-KR")}</span>`
              : ""}
          </div>
          <div class="signature-box">
            <p>근로자</p>
            <div class="sig ${data.workerSignature ? "signed" : ""}">
              ${data.workerSignature 
                ? `<img src="${data.workerSignature}" alt="근로자 서명" />`
                : "서명 대기"}
            </div>
            ${data.workerSignedAt 
              ? `<span class="signature-date">${new Date(data.workerSignedAt).toLocaleDateString("ko-KR")}</span>`
              : ""}
          </div>
        </div>
      </div>

      <div class="footer">
        <p>생성일: ${today} | 싸인해주세요 서비스</p>
      </div>
    </body>
    </html>
  `;
}

export function downloadContractPDF(data: ContractPDFData): void {
  const html = generateContractHTML(data);
  const printWindow = window.open("", "_blank");
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // 이미지 로딩 대기 후 프린트
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    alert("팝업 차단을 해제해주세요.");
  }
}

export function shareContract(contractId: string): void {
  const url = `${window.location.origin}/worker/contract/${contractId}`;
  
  if (navigator.share) {
    navigator.share({
      title: "근로계약서 서명 요청",
      text: "계약서를 확인하고 서명해주세요.",
      url,
    }).catch(console.error);
  } else {
    // 클립보드에 복사
    navigator.clipboard.writeText(url).then(() => {
      alert("링크가 클립보드에 복사되었습니다.");
    }).catch(() => {
      prompt("아래 링크를 복사하세요:", url);
    });
  }
}

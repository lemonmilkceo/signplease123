/// <reference types="vite/client" />

/**
 * 환경 변수 타입 정의
 * .env 파일에 정의된 변수들의 타입 안정성 보장
 */
interface ImportMetaEnv {
  /** Supabase 프로젝트 URL */
  readonly VITE_SUPABASE_URL: string;
  /** Supabase Anonymous Key */
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** 앱 이름 (옵션) */
  readonly VITE_APP_NAME?: string;
  /** 앱 버전 (옵션) */
  readonly VITE_APP_VERSION?: string;
  /** API 기본 URL (옵션) */
  readonly VITE_API_BASE_URL?: string;
  /** 환경 모드 */
  readonly MODE: "development" | "production" | "test";
  /** 개발 환경 여부 */
  readonly DEV: boolean;
  /** 프로덕션 환경 여부 */
  readonly PROD: boolean;
  /** SSR 여부 */
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

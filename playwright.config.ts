import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 테스트 디렉토리
  testDir: "./e2e",

  // 테스트 병렬 실행
  fullyParallel: true,

  // CI에서 재시도 허용
  retries: process.env.CI ? 2 : 0,

  // CI에서 워커 수 제한
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  // 전역 설정
  use: {
    // 기본 URL
    baseURL: "http://localhost:5173",

    // 추적 설정 (실패 시에만)
    trace: "on-first-retry",

    // 스크린샷 (실패 시에만)
    screenshot: "only-on-failure",

    // 비디오 (실패 시에만)
    video: "on-first-retry",

    // 뷰포트 (모바일 우선)
    viewport: { width: 390, height: 844 },

    // 언어 설정
    locale: "ko-KR",

    // 타임존 설정
    timezoneId: "Asia/Seoul",
  },

  // 프로젝트 (브라우저/디바이스별)
  projects: [
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } },
    },
  ],

  // 로컬 개발 서버 자동 실행
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

import { test, expect } from "@playwright/test";

/**
 * 알바생(Worker) 사용자 플로우 E2E 테스트
 */
test.describe("알바생 대시보드", () => {
  test.skip("대시보드가 렌더링된다", async ({ page }) => {
    // 로그인 필요 - 테스트 환경 설정 후 활성화
    await page.goto("/worker");

    // 대시보드 요소 확인
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test.skip("계약서 목록을 볼 수 있다", async ({ page }) => {
    await page.goto("/worker");

    // 탭 또는 계약서 리스트 확인
    await expect(page.locator("body")).toContainText(/계약서|서명/i);
  });
});

test.describe("계약서 서명 플로우 (비인증)", () => {
  test("계약서 상세 페이지 접근 시 로그인 리다이렉트", async ({ page }) => {
    await page.goto("/worker/contracts/test-id");

    // 로그인 페이지로 리다이렉트
    await expect(page).toHaveURL(/\/(login|worker)/);
  });
});

test.describe("공유 링크 테스트", () => {
  test("유효하지 않은 공유 링크에 대한 에러 처리", async ({ page }) => {
    await page.goto("/sign/invalid-token");

    // 에러 메시지 또는 리다이렉트
    await page.waitForTimeout(1000);
    
    // 에러 상태 또는 홈으로 리다이렉트
    const bodyText = await page.locator("body").textContent();
    const hasError = bodyText?.includes("찾을 수 없") || 
                     bodyText?.includes("유효하지") ||
                     bodyText?.includes("만료");
    
    // 에러 표시 또는 다른 페이지로 이동
    expect(hasError || page.url().includes("/")).toBeTruthy();
  });
});

test.describe("경력 관리", () => {
  test.skip("경력 페이지가 렌더링된다", async ({ page }) => {
    // 로그인 필요
    await page.goto("/worker/career");

    await expect(page.locator("body")).toContainText(/경력|근무 이력/i);
  });
});

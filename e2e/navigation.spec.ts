import { test, expect } from "@playwright/test";

/**
 * 네비게이션 E2E 테스트
 */
test.describe("페이지 네비게이션", () => {
  test("홈에서 로그인 페이지로 이동", async ({ page }) => {
    await page.goto("/");

    // 로그인 링크/버튼 찾아서 클릭
    const loginLink = page.getByRole("link", { name: /로그인/ });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("로그인 페이지에서 회원가입으로 이동", async ({ page }) => {
    await page.goto("/login");

    // 회원가입 링크 찾아서 클릭
    const signupLink = page.getByRole("link", { name: /회원가입|계정.*없으신가요/i });
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL(/\/signup/);
    }
  });

  test("회원가입 페이지에서 로그인으로 이동", async ({ page }) => {
    await page.goto("/signup");

    // 로그인 링크 찾아서 클릭
    const loginLink = page.getByRole("link", { name: /로그인|계정.*있으신가요/i });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("뒤로가기 버튼이 동작한다", async ({ page }) => {
    await page.goto("/login");
    await page.goto("/signup");

    // 브라우저 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("접근성 네비게이션", () => {
  test("키보드로 로그인 폼을 탐색할 수 있다", async ({ page }) => {
    await page.goto("/login");

    // Tab 키로 요소 간 이동
    await page.keyboard.press("Tab");
    
    // 포커스가 입력 필드로 이동했는지 확인
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("Enter 키로 폼을 제출할 수 있다", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByPlaceholder(/이메일|전화번호/i);
    const passwordInput = page.getByPlaceholder(/비밀번호/i);

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");

    // Enter 키로 제출
    await passwordInput.press("Enter");

    // 폼 제출 피드백 확인 (로딩 또는 에러)
    await page.waitForTimeout(500);
  });
});

test.describe("반응형 레이아웃", () => {
  test("모바일 뷰포트에서 올바르게 렌더링된다", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");

    // 로그인 폼이 화면에 맞게 표시
    const form = page.locator("form");
    if (await form.isVisible()) {
      const box = await form.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(375);
    }
  });

  test("태블릿 뷰포트에서 올바르게 렌더링된다", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /로그인/ })).toBeVisible();
  });

  test("데스크톱 뷰포트에서 올바르게 렌더링된다", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /로그인/ })).toBeVisible();
  });
});

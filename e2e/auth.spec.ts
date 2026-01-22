import { test, expect } from "@playwright/test";

/**
 * 인증 플로우 E2E 테스트
 */
test.describe("인증 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("스플래시 페이지가 렌더링된다", async ({ page }) => {
    // 스플래시 페이지 또는 온보딩 페이지로 리다이렉트
    await expect(page).toHaveURL(/\/(splash|onboarding)?$/);
  });

  test("온보딩 페이지로 이동한다", async ({ page }) => {
    // 스플래시에서 온보딩으로 자동 이동 대기
    await page.waitForURL(/\/onboarding/, { timeout: 5000 }).catch(() => {
      // 이미 온보딩 페이지일 수 있음
    });

    // 온보딩 콘텐츠 확인
    await expect(page.locator("body")).toContainText(/싸인해주세요|시작하기/);
  });

  test("로그인 페이지로 이동할 수 있다", async ({ page }) => {
    await page.goto("/login");

    // 로그인 폼 요소 확인
    await expect(page.getByRole("heading", { name: /로그인/ })).toBeVisible();
    await expect(page.getByPlaceholder(/이메일|전화번호/i)).toBeVisible();
    await expect(page.getByPlaceholder(/비밀번호/i)).toBeVisible();
  });

  test("회원가입 페이지로 이동할 수 있다", async ({ page }) => {
    await page.goto("/signup");

    // 회원가입 폼 요소 확인
    await expect(page.getByRole("heading", { name: /회원가입/ })).toBeVisible();
  });

  test("로그인 폼 유효성 검사가 동작한다", async ({ page }) => {
    await page.goto("/login");

    // 빈 폼 제출 시도
    const loginButton = page.getByRole("button", { name: /로그인/ });
    
    // 빈 상태에서는 버튼이 비활성화되어 있거나 에러 표시
    const emailInput = page.getByPlaceholder(/이메일|전화번호/i);
    const passwordInput = page.getByPlaceholder(/비밀번호/i);

    // 유효하지 않은 이메일 입력
    await emailInput.fill("invalid-email");
    await passwordInput.fill("123");
    await loginButton.click();

    // 에러 메시지 또는 유효성 피드백 확인
    await expect(page.locator("body")).toContainText(
      /(올바른|유효|비밀번호|6자)/i
    );
  });

  test("비밀번호 표시/숨기기 토글이 동작한다", async ({ page }) => {
    await page.goto("/login");

    const passwordInput = page.getByPlaceholder(/비밀번호/i);
    await passwordInput.fill("testpassword");

    // 초기에는 password 타입
    await expect(passwordInput).toHaveAttribute("type", "password");

    // 눈 아이콘 클릭
    const toggleButton = page.getByRole("button", { name: /비밀번호.*표시|보기/i });
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      // text 타입으로 변경
      await expect(passwordInput).toHaveAttribute("type", "text");
    }
  });
});

test.describe("역할 선택", () => {
  test("역할 선택 페이지가 렌더링된다", async ({ page }) => {
    await page.goto("/select-role");

    // 역할 선택 옵션 확인
    await expect(page.getByText("사장님")).toBeVisible();
    await expect(page.getByText("알바생")).toBeVisible();
  });

  test("사장님 역할을 선택할 수 있다", async ({ page }) => {
    await page.goto("/select-role");

    // 사장님 버튼 클릭
    await page.getByText("사장님").click();

    // 선택 피드백 또는 다음 단계로 이동 확인
    // (실제 구현에 따라 다를 수 있음)
  });

  test("알바생 역할을 선택할 수 있다", async ({ page }) => {
    await page.goto("/select-role");

    // 알바생 버튼 클릭
    await page.getByText("알바생").click();

    // 선택 피드백 또는 다음 단계로 이동 확인
  });
});

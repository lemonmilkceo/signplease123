import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// AuthContext mock
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    signInWithSocial: vi.fn().mockResolvedValue({ error: null }),
    user: null,
    profile: null,
    isLoading: false,
  }),
}));

describe("Login (소셜 로그인)", () => {
  const renderLogin = () => {
    return render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );
  };

  it("로그인 페이지가 렌더링된다", () => {
    renderLogin();

    expect(screen.getByText("싸인플리즈")).toBeInTheDocument();
    expect(screen.getByText("간편하게 로그인하고 시작하세요")).toBeInTheDocument();
  });

  it("Google 로그인 버튼이 있다", () => {
    renderLogin();

    expect(screen.getByText("Google로 계속하기")).toBeInTheDocument();
  });

  it("카카오 로그인 버튼이 있다", () => {
    renderLogin();

    expect(screen.getByText("카카오로 계속하기")).toBeInTheDocument();
  });

  it("이용약관 및 개인정보처리방침 링크가 있다", () => {
    renderLogin();

    expect(screen.getByText("이용약관")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
  });

  it("둘러보기 링크가 있다", () => {
    renderLogin();

    expect(screen.getByText(/먼저 둘러볼게요/)).toBeInTheDocument();
  });

  it("뒤로 가기 버튼이 있다", () => {
    renderLogin();

    expect(screen.getByLabelText("뒤로 가기")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// AuthContext mock
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    signIn: vi.fn().mockResolvedValue({ error: null }),
    user: null,
    isLoading: false,
  }),
}));

// Toast mock
vi.mock("../components/Toast", () => ({
  useToast: () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
  }),
}));

describe("Login", () => {
  const renderLogin = () => {
    return render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );
  };

  it("로그인 폼이 렌더링된다", () => {
    renderLogin();

    expect(screen.getByRole("heading", { name: "로그인" })).toBeInTheDocument();
    expect(screen.getByText("다시 만나서 반가워요!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/010-1234-5678/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호를 입력하세요")).toBeInTheDocument();
  });

  it("전화번호/이메일과 비밀번호 입력 필드가 있다", () => {
    renderLogin();

    const identifierInput = screen.getByPlaceholderText(/010-1234-5678/);
    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요");

    expect(identifierInput).toHaveAttribute("type", "text");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("비밀번호 보기/숨기기 토글 버튼이 있다", () => {
    renderLogin();

    const toggleButton = screen.getByLabelText(/비밀번호 보기|비밀번호 숨기기/);
    expect(toggleButton).toBeInTheDocument();
  });

  it("로그인 버튼이 있다", () => {
    renderLogin();

    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("회원가입 링크가 있다", () => {
    renderLogin();

    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("비밀번호 찾기 링크가 있다", () => {
    renderLogin();

    expect(screen.getByText("비밀번호 찾기")).toBeInTheDocument();
  });

  it("전화번호/이메일 입력 시 값이 변경된다", () => {
    renderLogin();

    const identifierInput = screen.getByPlaceholderText(/010-1234-5678/) as HTMLInputElement;
    fireEvent.change(identifierInput, { target: { value: "test@example.com" } });

    expect(identifierInput.value).toBe("test@example.com");
  });

  it("비밀번호 입력 시 값이 변경된다", () => {
    renderLogin();

    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력하세요") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });
});

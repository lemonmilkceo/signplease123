import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";

// AuthContext mock
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    signUp: vi.fn().mockResolvedValue({ error: null }),
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

describe("Signup", () => {
  const renderSignup = () => {
    return render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Signup />
      </MemoryRouter>
    );
  };

  it("회원가입 폼이 렌더링된다", () => {
    renderSignup();

    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("이름, 전화번호, 이메일, 비밀번호 입력 필드가 있다", () => {
    renderSignup();

    expect(screen.getByPlaceholderText("홍길동")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("010-1234-5678")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("6자 이상 입력")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호 재입력")).toBeInTheDocument();
  });

  it("가입하기 버튼이 있다", () => {
    renderSignup();

    expect(screen.getByRole("button", { name: "가입하기" })).toBeInTheDocument();
  });

  it("페이지 타이틀이 있다", () => {
    renderSignup();

    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("이름 입력 시 값이 변경된다", () => {
    renderSignup();

    const nameInput = screen.getByPlaceholderText("홍길동") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "김철수" } });

    expect(nameInput.value).toBe("김철수");
  });

  it("비밀번호 입력 시 값이 변경된다", () => {
    renderSignup();

    const passwordInput = screen.getByPlaceholderText("6자 이상 입력") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });

  it("비밀번호 확인 입력 시 값이 변경된다", () => {
    renderSignup();

    const confirmInput = screen.getByPlaceholderText("비밀번호 재입력") as HTMLInputElement;
    fireEvent.change(confirmInput, { target: { value: "password123" } });

    expect(confirmInput.value).toBe("password123");
  });
});

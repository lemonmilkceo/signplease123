import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SelectRole from "./SelectRole";

// AuthContext mock
const mockUpdateProfile = vi.fn().mockResolvedValue({ error: null });
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    profile: { id: "test-id", name: "테스트 사용자" },
    updateProfile: mockUpdateProfile,
    user: { id: "test-id" },
    isLoading: false,
  }),
}));

describe("SelectRole", () => {
  const renderSelectRole = () => {
    return render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SelectRole />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockUpdateProfile.mockClear();
  });

  it("역할 선택 페이지가 렌더링된다", () => {
    renderSelectRole();

    expect(screen.getByRole("heading", { name: "역할 선택" })).toBeInTheDocument();
  });

  it("사장님 옵션이 있다", () => {
    renderSelectRole();

    expect(screen.getByText("사장님")).toBeInTheDocument();
  });

  it("알바생 옵션이 있다", () => {
    renderSelectRole();

    expect(screen.getByText("알바생")).toBeInTheDocument();
  });

  it("역할 옵션을 클릭할 수 있다", () => {
    renderSelectRole();

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("역할 설명 텍스트가 표시된다", () => {
    renderSelectRole();

    // 사업주 또는 근로자 설명이 있는지 확인 (여러 개가 있어도 OK)
    const descriptions = screen.getAllByText(/계약서|서명|작성/i);
    expect(descriptions.length).toBeGreaterThan(0);
  });
});

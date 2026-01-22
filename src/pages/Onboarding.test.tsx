import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Onboarding from "./Onboarding";

describe("Onboarding", () => {
  it("첫 번째 온보딩 단계와 네비게이션 버튼이 보인다", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Onboarding />
      </MemoryRouter>
    );

    // 첫 번째 단계 제목 확인
    expect(screen.getByText("한 화면에 하나의 질문")).toBeInTheDocument();
    expect(screen.getByText(/복잡한 법률 용어 없이/)).toBeInTheDocument();
    
    // 네비게이션 버튼 확인
    expect(screen.getByRole("button", { name: "다음" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "건너뛰기" })).toBeInTheDocument();
  });

  it("스텝 인디케이터가 3개 표시된다", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Onboarding />
      </MemoryRouter>
    );

    // 3개의 스텝 인디케이터 버튼이 있어야 함
    const buttons = screen.getAllByRole("button");
    // 건너뛰기, 3개의 인디케이터, 다음 버튼 = 5개
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });
});

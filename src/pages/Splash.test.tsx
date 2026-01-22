import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Splash from "./Splash";

describe("Splash", () => {
  it("기본 타이틀이 보인다", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Splash />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "싸인해주세요" })).toBeInTheDocument();
    expect(screen.getByText(/복잡한 근로계약서/)).toBeInTheDocument();
    expect(screen.getByText(/3분이면 충분해요/)).toBeInTheDocument();
  });

  it("로딩 인디케이터가 표시된다", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Splash />
      </MemoryRouter>
    );

    // 3개의 로딩 점이 있어야 함
    const dots = document.querySelectorAll(".animate-pulse-dot");
    expect(dots).toHaveLength(3);
  });
});

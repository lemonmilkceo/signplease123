import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Splash from "./Splash";

describe("Splash", () => {
  it("기본 타이틀과 CTA 버튼이 보인다", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Splash />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "싸인해주세요" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "구글로 시작하기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "둘러보기" })).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Onboarding from "./Onboarding";

describe("Onboarding", () => {
  it("온보딩 설명과 다음 버튼이 보인다", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Onboarding />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "사장님과 알바생 모두를 위한 간편 계약" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음" })).toBeInTheDocument();
  });
});

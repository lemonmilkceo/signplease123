import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("기본 입력 필드가 렌더링된다", () => {
    render(<Input placeholder="이메일 입력" />);
    
    expect(screen.getByPlaceholderText("이메일 입력")).toBeInTheDocument();
  });

  it("label이 표시된다", () => {
    render(<Input label="이메일" />);
    
    expect(screen.getByText("이메일")).toBeInTheDocument();
  });

  it("label과 input이 연결되어 있다", () => {
    render(<Input label="이메일" id="email" />);
    
    const label = screen.getByText("이메일");
    expect(label).toHaveAttribute("for", "email");
  });

  it("error 메시지가 표시된다", () => {
    render(<Input error="올바른 이메일을 입력해주세요" />);
    
    expect(screen.getByText("올바른 이메일을 입력해주세요")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("error 상태에서 aria-describedby가 설정된다", () => {
    render(<Input id="email" error="에러 메시지" />);
    
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
  });

  it("disabled 상태가 적용된다", () => {
    render(<Input disabled />);
    
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("값 변경이 감지된다", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it("type 속성이 올바르게 전달된다", () => {
    render(<Input type="email" />);
    
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("추가 className이 적용된다", () => {
    render(<Input className="custom-class" />);
    
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

});

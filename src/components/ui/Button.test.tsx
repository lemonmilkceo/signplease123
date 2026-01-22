import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("기본 버튼이 렌더링된다", () => {
    render(<Button>클릭</Button>);
    
    expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
  });

  it("variant에 따라 스타일이 적용된다", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-secondary");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-primary");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-secondary");

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });

  it("size에 따라 스타일이 적용된다", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-4");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-5");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6");
  });

  it("fullWidth가 적용되면 w-full 클래스가 추가된다", () => {
    render(<Button fullWidth>Full Width</Button>);
    
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("disabled 상태에서 클릭되지 않는다", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it("onClick 핸들러가 호출된다", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole("button"));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("type 속성이 올바르게 전달된다", () => {
    render(<Button type="submit">Submit</Button>);
    
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("추가 className이 적용된다", () => {
    render(<Button className="custom-class">Custom</Button>);
    
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("focus-visible 스타일이 적용된다", () => {
    render(<Button>Focus Test</Button>);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass("focus-visible:outline-none");
    expect(button).toHaveClass("focus-visible:ring-2");
  });
});

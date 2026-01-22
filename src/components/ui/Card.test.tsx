import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card, CardHeader, CardContent, CardFooter } from "./Card";

describe("Card", () => {
  it("기본 카드가 렌더링된다", () => {
    render(<Card>카드 내용</Card>);
    
    expect(screen.getByText("카드 내용")).toBeInTheDocument();
  });

  it("variant에 따라 스타일이 적용된다", () => {
    const { rerender } = render(<Card variant="default" data-testid="card">Default</Card>);
    expect(screen.getByTestId("card")).toHaveClass("bg-card");

    rerender(<Card variant="outlined" data-testid="card">Outlined</Card>);
    expect(screen.getByTestId("card")).toHaveClass("border-border");
  });

  it("interactive가 true이면 호버 효과가 적용된다", () => {
    render(<Card interactive data-testid="card">Interactive</Card>);
    
    expect(screen.getByTestId("card")).toHaveClass("hover:shadow-md");
  });

  it("onClick이 호출된다", () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Click Me</Card>);
    
    fireEvent.click(screen.getByText("Click Me"));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("추가 className이 적용된다", () => {
    render(<Card className="custom-class" data-testid="card">Custom</Card>);
    
    expect(screen.getByTestId("card")).toHaveClass("custom-class");
  });
});

describe("CardHeader", () => {
  it("헤더가 렌더링된다", () => {
    render(<CardHeader>헤더 내용</CardHeader>);
    
    expect(screen.getByText("헤더 내용")).toBeInTheDocument();
  });

  it("추가 className이 적용된다", () => {
    render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>);
    
    expect(screen.getByTestId("header")).toHaveClass("custom-header");
  });
});

describe("CardContent", () => {
  it("콘텐츠가 렌더링된다", () => {
    render(<CardContent>콘텐츠 내용</CardContent>);
    
    expect(screen.getByText("콘텐츠 내용")).toBeInTheDocument();
  });

  it("추가 className이 적용된다", () => {
    render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);
    
    expect(screen.getByTestId("content")).toHaveClass("custom-content");
  });
});

describe("CardFooter", () => {
  it("푸터가 렌더링된다", () => {
    render(<CardFooter>푸터 내용</CardFooter>);
    
    expect(screen.getByText("푸터 내용")).toBeInTheDocument();
  });

  it("추가 className이 적용된다", () => {
    render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);
    
    expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
  });
});

describe("Card Composition", () => {
  it("Card, CardHeader, CardContent, CardFooter가 함께 렌더링된다", () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">제목</CardHeader>
        <CardContent data-testid="content">본문</CardContent>
        <CardFooter data-testid="footer">액션</CardFooter>
      </Card>
    );

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 경계 컴포넌트
 * 하위 컴포넌트에서 발생한 에러를 캐치하여 앱 전체 크래시 방지
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 로깅 서비스에 전송 가능
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl" aria-hidden="true">😵</span>
            </div>
            <h1 className="text-title text-foreground mb-3">
              앗! 문제가 발생했어요
            </h1>
            <p className="text-body text-muted-foreground mb-6">
              예상치 못한 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-secondary rounded-xl text-left">
                <p className="text-caption text-destructive font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={this.handleGoHome}>
                홈으로
              </Button>
              <Button variant="primary" onClick={this.handleRetry}>
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 페이지 레벨 에러 경계
 * 개별 페이지의 에러를 격리
 */
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl" aria-hidden="true">⚠️</span>
          </div>
          <h2 className="text-heading text-foreground mb-2">
            페이지를 불러올 수 없습니다
          </h2>
          <p className="text-caption text-muted-foreground mb-4">
            일시적인 오류가 발생했습니다.
          </p>
          <Button 
            variant="outline" 
            size="md"
            onClick={() => window.location.reload()}
          >
            새로고침
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

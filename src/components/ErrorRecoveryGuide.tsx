import { getErrorRecoveryGuide } from "../utils/errorMessages";
import { Button } from "./ui";

interface ErrorRecoveryGuideProps {
  /** 에러 코드 */
  errorCode: string;
  /** 재시도 함수 */
  onRetry?: () => void;
  /** 홈으로 이동 함수 */
  onGoHome?: () => void;
  /** 로그인으로 이동 함수 */
  onGoLogin?: () => void;
  /** 지원 문의 함수 */
  onContactSupport?: () => void;
}

/**
 * 에러 복구 가이드 컴포넌트
 * 에러 코드에 따라 적절한 복구 방법 안내
 * 
 * @example
 * <ErrorRecoveryGuide 
 *   errorCode="NETWORK_ERROR"
 *   onRetry={() => refetch()}
 *   onGoHome={() => navigate("/")}
 * />
 */
export function ErrorRecoveryGuide({
  errorCode,
  onRetry,
  onGoHome,
  onGoLogin,
  onContactSupport,
}: ErrorRecoveryGuideProps) {
  const guide = getErrorRecoveryGuide(errorCode);

  // 액션 버튼 렌더링
  const renderActionButton = (action: string) => {
    switch (action) {
      case "retry":
        return onRetry ? (
          <Button variant="primary" onClick={onRetry} key="retry">
            다시 시도
          </Button>
        ) : null;

      case "refresh":
        return (
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            key="refresh"
          >
            페이지 새로고침
          </Button>
        );

      case "login":
        return onGoLogin ? (
          <Button variant="primary" onClick={onGoLogin} key="login">
            로그인하기
          </Button>
        ) : null;

      case "contact":
        return onContactSupport ? (
          <Button variant="outline" onClick={onContactSupport} key="contact">
            고객센터 문의
          </Button>
        ) : null;

      case "home":
        return onGoHome ? (
          <Button variant="secondary" onClick={onGoHome} key="home">
            홈으로 이동
          </Button>
        ) : null;

      case "wait":
        return (
          <div
            key="wait"
            className="text-caption text-muted-foreground text-center"
          >
            잠시 후 다시 시도해주세요
          </div>
        );

      default:
        return null;
    }
  };

  // 아이콘 선택
  const getIcon = () => {
    if (errorCode.includes("NETWORK") || errorCode.includes("OFFLINE")) {
      return "📡";
    }
    if (errorCode.includes("AUTH") || errorCode.includes("UNAUTHORIZED")) {
      return "🔐";
    }
    if (errorCode.includes("NOT_FOUND")) {
      return "🔍";
    }
    if (errorCode.includes("LIMIT") || errorCode.includes("RATE")) {
      return "⏳";
    }
    if (errorCode.includes("PAYMENT") || errorCode.includes("CREDIT")) {
      return "💳";
    }
    return "⚠️";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 text-center">
      {/* 아이콘 */}
      <div className="text-4xl mb-4" aria-hidden="true">
        {getIcon()}
      </div>

      {/* 제목 */}
      <h3 className="text-title font-semibold text-foreground mb-2">
        {guide.title || "오류가 발생했습니다"}
      </h3>

      {/* 설명 */}
      <p className="text-body text-muted-foreground mb-4">
        {guide.description || "잠시 후 다시 시도해주세요."}
      </p>

      {/* 복구 단계 */}
      {guide.steps && guide.steps.length > 0 && (
        <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
          <p className="text-caption font-medium text-foreground mb-2">
            해결 방법:
          </p>
          <ol className="list-decimal list-inside space-y-1">
            {guide.steps.map((step, index) => (
              <li key={index} className="text-caption text-muted-foreground">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 액션 버튼 */}
      {guide.actions && guide.actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {guide.actions.map(renderActionButton)}
        </div>
      )}
    </div>
  );
}

/**
 * 인라인 에러 힌트 컴포넌트
 * 폼 필드 아래 등에 사용
 */
interface InlineErrorHintProps {
  errorCode: string;
  className?: string;
}

export function InlineErrorHint({ errorCode, className = "" }: InlineErrorHintProps) {
  const guide = getErrorRecoveryGuide(errorCode);

  if (!guide.steps || guide.steps.length === 0) {
    return null;
  }

  return (
    <div className={`text-caption text-muted-foreground mt-1 ${className}`}>
      💡 {guide.steps[0]}
    </div>
  );
}

/**
 * 네트워크 에러 전용 컴포넌트
 */
interface NetworkErrorProps {
  onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4" aria-hidden="true">
        📡
      </div>
      <h3 className="text-title font-semibold text-foreground mb-2">
        인터넷 연결을 확인해주세요
      </h3>
      <p className="text-body text-muted-foreground mb-4">
        네트워크 연결이 불안정합니다.
        <br />
        Wi-Fi 또는 모바일 데이터 연결을 확인해주세요.
      </p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}

/**
 * 세션 만료 에러 컴포넌트
 */
interface SessionExpiredProps {
  onLogin?: () => void;
}

export function SessionExpired({ onLogin }: SessionExpiredProps) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4" aria-hidden="true">
        🔐
      </div>
      <h3 className="text-title font-semibold text-foreground mb-2">
        로그인이 필요합니다
      </h3>
      <p className="text-body text-muted-foreground mb-4">
        보안을 위해 세션이 만료되었습니다.
        <br />
        다시 로그인해주세요.
      </p>
      {onLogin && (
        <Button variant="primary" onClick={onLogin}>
          로그인하기
        </Button>
      )}
    </div>
  );
}

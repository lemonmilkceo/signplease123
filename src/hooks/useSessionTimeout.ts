import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

interface UseSessionTimeoutOptions {
  /** 세션 타임아웃 시간 (밀리초, 기본값: 30분) */
  timeout?: number;
  /** 경고 표시 시간 (타임아웃 전 밀리초, 기본값: 5분) */
  warningTime?: number;
  /** 세션 만료 시 콜백 */
  onTimeout?: () => void;
  /** 경고 표시 시 콜백 */
  onWarning?: (remainingTime: number) => void;
}

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30분
const DEFAULT_WARNING_TIME = 5 * 60 * 1000; // 5분

/**
 * 세션 타임아웃 처리 훅
 * 사용자 활동이 없을 경우 자동 로그아웃
 * 
 * @example
 * useSessionTimeout({
 *   timeout: 30 * 60 * 1000, // 30분
 *   warningTime: 5 * 60 * 1000, // 5분 전 경고
 *   onWarning: (remaining) => showToast(`${remaining / 1000}초 후 로그아웃됩니다`),
 *   onTimeout: () => showToast("세션이 만료되었습니다"),
 * });
 */
export function useSessionTimeout({
  timeout = DEFAULT_TIMEOUT,
  warningTime = DEFAULT_WARNING_TIME,
  onTimeout,
  onWarning,
}: UseSessionTimeoutOptions = {}) {
  const { user, signOut } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // 타이머 정리
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  // 타이머 재설정
  const resetTimers = useCallback(() => {
    clearTimers();
    lastActivityRef.current = Date.now();

    // 경고 타이머
    if (onWarning && warningTime < timeout) {
      warningRef.current = setTimeout(() => {
        const remaining = timeout - (Date.now() - lastActivityRef.current);
        onWarning(remaining);
      }, timeout - warningTime);
    }

    // 타임아웃 타이머
    timeoutRef.current = setTimeout(async () => {
      onTimeout?.();
      await signOut();
    }, timeout);
  }, [clearTimers, timeout, warningTime, onTimeout, onWarning, signOut]);

  // 사용자 활동 감지
  useEffect(() => {
    if (!user) {
      clearTimers();
      return;
    }

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    
    const handleActivity = () => {
      resetTimers();
    };

    // 초기 타이머 설정
    resetTimers();

    // 이벤트 리스너 등록
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // 탭 포커스 시 타이머 재설정
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        resetTimers();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimers();
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, resetTimers, clearTimers]);

  return {
    /** 수동으로 타이머 리셋 */
    resetTimer: resetTimers,
    /** 마지막 활동 시간 */
    lastActivity: lastActivityRef.current,
  };
}

import { useState, useRef, TouchEvent } from "react";

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // 스와이프로 인식할 최소 거리 (px)
}

interface SwipeState {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
}

export function useSwipe(config: SwipeConfig = {}) {
  const { 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown, 
    threshold = 50 
  } = config;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    isSwiping: false,
  });

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      isSwiping: true,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    setSwipeState((prev) => ({
      ...prev,
      deltaX,
      deltaY,
    }));
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;

    const { deltaX, deltaY } = swipeState;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // 수평 스와이프가 더 강한 경우
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
    // 수직 스와이프가 더 강한 경우
    else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    // 상태 초기화
    touchStartRef.current = null;
    setSwipeState({
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      isSwiping: false,
    });
  };

  return {
    swipeState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

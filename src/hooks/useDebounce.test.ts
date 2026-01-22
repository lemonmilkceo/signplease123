import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("초기값이 즉시 반환된다", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("딜레이 후에 값이 업데이트된다", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // 값 변경
    rerender({ value: "updated", delay: 500 });

    // 아직 업데이트되지 않음
    expect(result.current).toBe("initial");

    // 500ms 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 이제 업데이트됨
    expect(result.current).toBe("updated");
  });

  it("딜레이 전에 값이 변경되면 타이머가 리셋된다", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // 첫 번째 변경
    rerender({ value: "first", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("initial");

    // 두 번째 변경 (타이머 리셋)
    rerender({ value: "second", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("initial");

    // 500ms 더 경과
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("second");
  });

  it("딜레이가 0이면 즉시 업데이트된다", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 0 } }
    );

    rerender({ value: "updated", delay: 0 });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe("updated");
  });

  it("컴포넌트 언마운트 시 타이머가 클리어된다", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("다양한 타입의 값을 처리한다", () => {
    // 숫자
    const { result: numResult } = renderHook(() => useDebounce(42, 500));
    expect(numResult.current).toBe(42);

    // 객체
    const obj = { name: "test" };
    const { result: objResult } = renderHook(() => useDebounce(obj, 500));
    expect(objResult.current).toEqual({ name: "test" });

    // 배열
    const arr = [1, 2, 3];
    const { result: arrResult } = renderHook(() => useDebounce(arr, 500));
    expect(arrResult.current).toEqual([1, 2, 3]);
  });
});

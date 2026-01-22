import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnlineStatus } from "./useOnlineStatus";

describe("useOnlineStatus", () => {
  const originalNavigator = global.navigator;
  let onlineValue = true;

  beforeEach(() => {
    onlineValue = true;
    Object.defineProperty(global, "navigator", {
      value: {
        ...originalNavigator,
        get onLine() {
          return onlineValue;
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
  });

  it("초기 온라인 상태를 반환한다", () => {
    const { result } = renderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);
  });

  it("오프라인 이벤트를 감지한다", () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      onlineValue = false;
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("온라인 이벤트를 감지한다", () => {
    onlineValue = false;
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      onlineValue = true;
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });

  it("언마운트 시 이벤트 리스너가 제거된다", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useOnlineStatus());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("offline", expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});

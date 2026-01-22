import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("초기값이 반환된다", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "defaultValue"));

    expect(result.current[0]).toBe("defaultValue");
  });

  it("localStorage에 저장된 값이 있으면 그 값이 반환된다", () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify("storedValue"));

    const { result } = renderHook(() => useLocalStorage("testKey", "defaultValue"));

    expect(result.current[0]).toBe("storedValue");
  });

  it("setValue로 값을 업데이트할 수 있다", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    act(() => {
      result.current[1]("newValue");
    });

    expect(result.current[0]).toBe("newValue");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("testKey", JSON.stringify("newValue"));
  });

  it("함수를 사용하여 값을 업데이트할 수 있다", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("객체를 저장하고 불러올 수 있다", () => {
    const initialValue = { name: "test", count: 0 };
    const { result } = renderHook(() => useLocalStorage("objKey", initialValue));

    expect(result.current[0]).toEqual(initialValue);

    act(() => {
      result.current[1]({ name: "updated", count: 1 });
    });

    expect(result.current[0]).toEqual({ name: "updated", count: 1 });
  });

  it("배열을 저장하고 불러올 수 있다", () => {
    const { result } = renderHook(() => useLocalStorage("arrKey", [1, 2, 3]));

    expect(result.current[0]).toEqual([1, 2, 3]);

    act(() => {
      result.current[1]([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
  });

  it("잘못된 JSON이 저장되어 있으면 초기값을 반환한다", () => {
    localStorageMock.getItem.mockReturnValueOnce("invalid json");

    const { result } = renderHook(() => useLocalStorage("testKey", "default"));

    expect(result.current[0]).toBe("default");
  });

  it("removeValue로 값을 제거할 수 있다", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    act(() => {
      result.current[2]();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("testKey");
  });
});

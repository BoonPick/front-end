import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpiredFilter } from "@/hooks/useExpiredFilter";

const STORAGE_KEY = "boonpick_show_expired";

describe("useExpiredFilter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes showExpired as false when storage is empty", () => {
    const { result } = renderHook(() => useExpiredFilter());
    expect(result.current.showExpired).toBe(false);
  });

  it("initializes showExpired as true when storage has '1'", () => {
    localStorage.setItem(STORAGE_KEY, "1");
    const { result } = renderHook(() => useExpiredFilter());
    expect(result.current.showExpired).toBe(true);
  });

  it("setShowExpired(true) updates state and sets localStorage", () => {
    const { result } = renderHook(() => useExpiredFilter());
    act(() => {
      result.current.setShowExpired(true);
    });
    expect(result.current.showExpired).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("1");
  });

  it("setShowExpired(false) updates state and removes from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "1");
    const { result } = renderHook(() => useExpiredFilter());
    act(() => {
      result.current.setShowExpired(false);
    });
    expect(result.current.showExpired).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("toggles state correctly", () => {
    const { result } = renderHook(() => useExpiredFilter());
    act(() => result.current.setShowExpired(true));
    expect(result.current.showExpired).toBe(true);
    act(() => result.current.setShowExpired(false));
    expect(result.current.showExpired).toBe(false);
  });

  it("responds to storage events from other tabs", () => {
    const { result } = renderHook(() => useExpiredFilter());
    act(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: "1" }),
      );
    });
    expect(result.current.showExpired).toBe(true);
  });

  it("ignores storage events for other keys", () => {
    const { result } = renderHook(() => useExpiredFilter());
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "other_key", newValue: "1" }),
      );
    });
    expect(result.current.showExpired).toBe(false);
  });
});

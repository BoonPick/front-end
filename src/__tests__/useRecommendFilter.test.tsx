import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecommendFilter } from "@/hooks/useRecommendFilter";

const STORAGE_KEY = "boonpick_recommend_filter";

describe("useRecommendFilter", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns default filter when localStorage is empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("reads initial value from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: "react", duties: ["개발"], workTypes: ["정규직"] }));
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter.search).toBe("react");
    expect(result.current.filter.duties).toEqual(["개발"]);
    expect(result.current.filter.workTypes).toEqual(["정규직"]);
  });

  it("returns default filter on malformed localStorage value", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("hasFilter is false when all fields are empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(false);
  });

  it("hasFilter is true when search is set", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "react", duties: [], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when duties are set", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: ["개발"], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when workTypes are set", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: [], workTypes: ["정규직"] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("setFilter updates state and persists to localStorage", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "ts", duties: ["QA"], workTypes: ["계약직"] });
    });
    expect(result.current.filter.search).toBe("ts");
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.search).toBe("ts");
    expect(stored.duties).toEqual(["QA"]);
  });

  it("responds to storage events from other tabs", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: "vue", duties: [], workTypes: [] }));
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
    });
    expect(result.current.filter.search).toBe("vue");
  });

  it("ignores storage events for unrelated keys", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "other_key" }));
    });
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });
});

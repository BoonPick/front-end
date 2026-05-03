import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecommendFilter } from "@/hooks/useRecommendFilter";

const STORAGE_KEY = "boonpick_recommend_filter";

describe("useRecommendFilter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default filter when localStorage is empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("initializes from localStorage when stored value is valid", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ search: "AI", duties: ["개발"], workTypes: ["정규직"] })
    );
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter.search).toBe("AI");
    expect(result.current.filter.duties).toEqual(["개발"]);
    expect(result.current.filter.workTypes).toEqual(["정규직"]);
  });

  it("falls back to default when localStorage contains invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("setFilter updates the filter state", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "test", duties: ["기획"], workTypes: [] });
    });
    expect(result.current.filter.search).toBe("test");
  });

  it("setFilter persists to localStorage", () => {
    const { result } = renderHook(() => useRecommendFilter());
    const next = { search: "saved", duties: [], workTypes: ["계약직"] };
    act(() => {
      result.current.setFilter(next);
    });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(stored.search).toBe("saved");
    expect(stored.workTypes).toEqual(["계약직"]);
  });

  it("hasFilter is false when all fields are empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(false);
  });

  it("hasFilter is true when search is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "keyword", duties: [], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when duties is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: ["개발"], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when workTypes is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: [], workTypes: ["인턴"] });
    });
    expect(result.current.hasFilter).toBe(true);
  });
});

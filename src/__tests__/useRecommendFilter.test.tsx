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

  it("initializes from valid localStorage data", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ search: "개발자", duties: ["IT"], workTypes: ["정규직"] })
    );
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter.search).toBe("개발자");
    expect(result.current.filter.duties).toEqual(["IT"]);
    expect(result.current.filter.workTypes).toEqual(["정규직"]);
  });

  it("falls back to default on invalid JSON in localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json");
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("setFilter updates filter state", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "AI", duties: ["ML"], workTypes: [] });
    });
    expect(result.current.filter.search).toBe("AI");
    expect(result.current.filter.duties).toEqual(["ML"]);
  });

  it("setFilter persists to localStorage", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "backend", duties: [], workTypes: ["계약직"] });
    });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.search).toBe("backend");
    expect(stored.workTypes).toEqual(["계약직"]);
  });

  it("hasFilter is false when all fields are empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(false);
  });

  it("hasFilter is true when search is non-empty", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: "x", duties: [], workTypes: [] }));
    const { result } = renderHook(() => useRecommendFilter());
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

  it("exposes setFilter as a function", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(typeof result.current.setFilter).toBe("function");
  });
});

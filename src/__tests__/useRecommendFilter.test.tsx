import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecommendFilter, type RecommendFilter } from "@/hooks/useRecommendFilter";

const STORAGE_KEY = "boonpick_recommend_filter";

const DEFAULT: RecommendFilter = { search: "", duties: [], workTypes: [] };
const SAMPLE: RecommendFilter = { search: "개발자", duties: ["개발(IT)"], workTypes: ["정규직"] };

describe("useRecommendFilter", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("defaults to empty filter when localStorage is empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual(DEFAULT);
  });

  it("initializes from localStorage when valid JSON is stored", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual(SAMPLE);
  });

  it("falls back to default when localStorage contains invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json{{{");
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual(DEFAULT);
  });

  it("setFilter updates state", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter(SAMPLE);
    });
    expect(result.current.filter).toEqual(SAMPLE);
  });

  it("setFilter persists to localStorage", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter(SAMPLE);
    });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toEqual(SAMPLE);
  });

  it("hasFilter is false for default filter", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(false);
  });

  it("hasFilter is true when search is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "test", duties: [], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when duties is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: ["개발(IT)"], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when workTypes is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: [], workTypes: ["정규직"] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("responds to storage events from other tabs", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(SAMPLE) }),
      );
    });
    expect(result.current.filter).toEqual(SAMPLE);
  });

  it("ignores storage events for other keys", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "other_key", newValue: "something" }),
      );
    });
    expect(result.current.filter).toEqual(DEFAULT);
  });
});

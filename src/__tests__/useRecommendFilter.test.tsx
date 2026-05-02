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

  it("reads persisted filter from localStorage on mount", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ search: "python", duties: ["개발(IT)"], workTypes: ["정규직"] }),
    );
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter.search).toBe("python");
    expect(result.current.filter.duties).toEqual(["개발(IT)"]);
    expect(result.current.filter.workTypes).toEqual(["정규직"]);
  });

  it("returns default filter when localStorage contains invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("setFilter updates state and persists to localStorage", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "ML", duties: [], workTypes: [] });
    });
    expect(result.current.filter.search).toBe("ML");
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.search).toBe("ML");
  });

  it("hasFilter is false when all fields are empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(false);
  });

  it("hasFilter is true when search is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "react", duties: [], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when duties is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: ["기획"], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when workTypes is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: [], workTypes: ["계약직"] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("responds to storage events with matching key", () => {
    const { result } = renderHook(() => useRecommendFilter());
    const newFilter = { search: "event", duties: [], workTypes: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilter));
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY }),
      );
    });
    expect(result.current.filter.search).toBe("event");
  });

  it("ignores storage events for other keys", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "initial", duties: [], workTypes: [] });
    });
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "other_key" }));
    });
    expect(result.current.filter.search).toBe("initial");
  });
});

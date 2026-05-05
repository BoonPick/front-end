import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
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

  it("initializes from stored value in localStorage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ search: "React", duties: ["개발"], workTypes: ["정규직"] })
    );
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter.search).toBe("React");
    expect(result.current.filter.duties).toEqual(["개발"]);
    expect(result.current.filter.workTypes).toEqual(["정규직"]);
  });

  it("returns default filter on malformed localStorage value", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("setFilter updates state", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "AI", duties: ["기획"], workTypes: [] });
    });
    expect(result.current.filter.search).toBe("AI");
    expect(result.current.filter.duties).toEqual(["기획"]);
  });

  it("setFilter persists to localStorage", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "ML", duties: [], workTypes: ["인턴"] });
    });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.search).toBe("ML");
    expect(stored.workTypes).toEqual(["인턴"]);
  });

  it("hasFilter is false when all fields are empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(false);
  });

  it("hasFilter is true when search is set", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: "Java", duties: [], workTypes: [] }));
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when duties are set", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: "", duties: ["개발"], workTypes: [] }));
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when workTypes are set", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: "", duties: [], workTypes: ["계약직"] }));
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(true);
  });

  it("responds to storage events for the correct key", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: "event", duties: [], workTypes: [] }));
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify({ search: "event", duties: [], workTypes: [] }) })
      );
    });
    expect(result.current.filter.search).toBe("event");
  });

  it("ignores storage events for other keys", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "some_other_key", newValue: "anything" })
      );
    });
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });
});

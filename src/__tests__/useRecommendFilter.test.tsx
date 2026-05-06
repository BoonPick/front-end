import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useRecommendFilter } from "@/hooks/useRecommendFilter";

const STORAGE_KEY = "boonpick_recommend_filter";

describe("useRecommendFilter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns default filter when localStorage is empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("reads existing filter from localStorage", () => {
    const stored = { search: "개발", duties: ["frontend"], workTypes: ["full-time"] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual(stored);
  });

  it("falls back to default on malformed JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });

  it("setFilter updates state and localStorage", () => {
    const { result } = renderHook(() => useRecommendFilter());
    const next = { search: "백엔드", duties: ["backend"], workTypes: [] };
    act(() => {
      result.current.setFilter(next);
    });
    expect(result.current.filter).toEqual(next);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(next);
  });

  it("hasFilter is false when filter is default", () => {
    const { result } = renderHook(() => useRecommendFilter());
    expect(result.current.hasFilter).toBe(false);
  });

  it("hasFilter is true when search is set", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "AI", duties: [], workTypes: [] });
    });
    expect(result.current.hasFilter).toBe(true);
  });

  it("hasFilter is true when duties is non-empty", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      result.current.setFilter({ search: "", duties: ["frontend"], workTypes: [] });
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

  it("reacts to storage events from other tabs", () => {
    const { result } = renderHook(() => useRecommendFilter());
    const newFilter = { search: "데이터", duties: [], workTypes: [] };
    act(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilter));
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(newFilter) }),
      );
    });
    expect(result.current.filter).toEqual(newFilter);
  });

  it("ignores storage events for different keys", () => {
    const { result } = renderHook(() => useRecommendFilter());
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "other_key", newValue: '{"search":"x","duties":[],"workTypes":[]}' }),
      );
    });
    expect(result.current.filter).toEqual({ search: "", duties: [], workTypes: [] });
  });
});

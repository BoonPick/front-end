import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecommendCategory } from "@/hooks/useRecommendCategory";

describe("useRecommendCategory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to 'all' when localStorage is empty", () => {
    const { result } = renderHook(() => useRecommendCategory());
    expect(result.current.category).toBe("all");
  });

  it("initializes from localStorage if value is stored", () => {
    localStorage.setItem("recommendCategory", "job");
    const { result } = renderHook(() => useRecommendCategory());
    expect(result.current.category).toBe("job");
  });

  it("updateCategory changes the current category", () => {
    const { result } = renderHook(() => useRecommendCategory());
    act(() => {
      result.current.updateCategory("scholarship");
    });
    expect(result.current.category).toBe("scholarship");
  });

  it("updateCategory persists to localStorage", () => {
    const { result } = renderHook(() => useRecommendCategory());
    act(() => {
      result.current.updateCategory("announcement");
    });
    expect(localStorage.getItem("recommendCategory")).toBe("announcement");
  });

  it("updateCategory can set back to 'all'", () => {
    localStorage.setItem("recommendCategory", "job");
    const { result } = renderHook(() => useRecommendCategory());
    act(() => {
      result.current.updateCategory("all");
    });
    expect(result.current.category).toBe("all");
    expect(localStorage.getItem("recommendCategory")).toBe("all");
  });

  it("exposes updateCategory function", () => {
    const { result } = renderHook(() => useRecommendCategory());
    expect(typeof result.current.updateCategory).toBe("function");
  });
});

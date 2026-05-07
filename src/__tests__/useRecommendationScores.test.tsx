import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRecommendationScores } from "@/hooks/useRecommendationScores";
import * as recApi from "@/api/recommendations";

vi.mock("@/api/recommendations");

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe("useRecommendationScores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty scoreById when itemIds is empty", () => {
    const { result } = renderHook(() => useRecommendationScores([], true), {
      wrapper: createWrapper(),
    });
    expect(result.current.scoreById).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("returns scoreById populated after data loads", async () => {
    vi.mocked(recApi.getRecommendation).mockImplementation(async (id) => ({
      id,
      matchScore: 85,
    } as any));
    const { result } = renderHook(() => useRecommendationScores(["a", "b"], true), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["a"]).toBe(85);
    expect(result.current.scoreById["b"]).toBe(85);
  });

  it("scoreById value is undefined when API returns no matchScore", async () => {
    vi.mocked(recApi.getRecommendation).mockResolvedValue({ id: "x" } as any);
    const { result } = renderHook(() => useRecommendationScores(["x"], true), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["x"]).toBeUndefined();
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(() => useRecommendationScores(["a"], false), {
      wrapper: createWrapper(),
    });
    expect(recApi.getRecommendation).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("isLoading is false when enabled is false even with itemIds", () => {
    const { result } = renderHook(() => useRecommendationScores(["a", "b"], false), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(false);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useRecommendationScores } from "@/hooks/useRecommendationScores";
import * as recApi from "@/api/recommendations";

vi.mock("@/api/recommendations");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockRec = (id: string, score: number) => ({
  itemId: id,
  matchScore: score,
  matchReason: "test",
  preparationTips: [],
});

describe("useRecommendationScores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty scoreById for empty itemIds", () => {
    const { result } = renderHook(() => useRecommendationScores([]), {
      wrapper: createWrapper(),
    });
    expect(result.current.scoreById).toEqual({});
  });

  it("maps scores to item ids after fetching", async () => {
    vi.mocked(recApi.getRecommendation).mockResolvedValue(mockRec("1", 85) as any);
    const { result } = renderHook(() => useRecommendationScores(["1"]), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["1"]).toBe(85);
  });

  it("maps multiple item scores correctly", async () => {
    vi.mocked(recApi.getRecommendation)
      .mockResolvedValueOnce(mockRec("a", 70) as any)
      .mockResolvedValueOnce(mockRec("b", 90) as any);
    const { result } = renderHook(() => useRecommendationScores(["a", "b"]), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["a"]).toBe(70);
    expect(result.current.scoreById["b"]).toBe(90);
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(() => useRecommendationScores(["1"], false), {
      wrapper: createWrapper(),
    });
    expect(recApi.getRecommendation).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("scoreById has undefined for items with no data yet", () => {
    vi.mocked(recApi.getRecommendation).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useRecommendationScores(["x"]), {
      wrapper: createWrapper(),
    });
    expect(result.current.scoreById["x"]).toBeUndefined();
  });

  it("isLoading is true while queries are in-flight when enabled", () => {
    vi.mocked(recApi.getRecommendation).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useRecommendationScores(["z"], true), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });
});

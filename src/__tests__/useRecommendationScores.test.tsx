import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
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

describe("useRecommendationScores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty scoreById and isLoading=false when itemIds is empty", () => {
    const { result } = renderHook(
      () => useRecommendationScores([], true),
      { wrapper: createWrapper() }
    );
    expect(result.current.scoreById).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("does not fetch when enabled=false", () => {
    const { result } = renderHook(
      () => useRecommendationScores(["item1", "item2"], false),
      { wrapper: createWrapper() }
    );
    expect(recApi.getRecommendation).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches recommendation scores for each itemId", async () => {
    vi.mocked(recApi.getRecommendation).mockImplementation(async (id: string) => ({
      itemId: id,
      matchScore: id === "a" ? 80 : 60,
      matchReason: "good",
      preparationTips: [],
    } as any));

    const { result } = renderHook(
      () => useRecommendationScores(["a", "b"], true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["a"]).toBe(80);
    expect(result.current.scoreById["b"]).toBe(60);
  });

  it("sets matchScore to undefined when API returns no data", async () => {
    vi.mocked(recApi.getRecommendation).mockResolvedValue(undefined as any);

    const { result } = renderHook(
      () => useRecommendationScores(["x"], true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["x"]).toBeUndefined();
  });

  it("isLoading is true while queries are in flight", () => {
    vi.mocked(recApi.getRecommendation).mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    const { result } = renderHook(
      () => useRecommendationScores(["loading-item"], true),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
  });
});

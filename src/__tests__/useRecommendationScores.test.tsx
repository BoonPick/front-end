import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRecommendationScores } from "@/hooks/useRecommendationScores";
import * as recApi from "@/api/recommendations";

vi.mock("@/api/recommendations");

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useRecommendationScores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty scoreById and false isLoading when itemIds is empty", () => {
    const { result } = renderHook(
      () => useRecommendationScores([], true),
      { wrapper: makeWrapper() }
    );
    expect(result.current.scoreById).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("returns isLoading=false when enabled=false regardless of itemIds", () => {
    const { result } = renderHook(
      () => useRecommendationScores(["id1", "id2"], false),
      { wrapper: makeWrapper() }
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("populates scoreById keys for each itemId", async () => {
    vi.mocked(recApi.getRecommendation).mockResolvedValue({
      itemId: "id1",
      matchScore: 85,
      matchReason: "good",
      preparationTips: [],
    });

    const { result } = renderHook(
      () => useRecommendationScores(["id1"], true),
      { wrapper: makeWrapper() }
    );
    expect("id1" in result.current.scoreById).toBe(true);
  });

  it("sets undefined score for items whose query has not resolved", () => {
    vi.mocked(recApi.getRecommendation).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(
      () => useRecommendationScores(["pending"], true),
      { wrapper: makeWrapper() }
    );
    expect(result.current.scoreById["pending"]).toBeUndefined();
  });

  it("does not call getRecommendation when enabled=false", () => {
    renderHook(
      () => useRecommendationScores(["id1"], false),
      { wrapper: makeWrapper() }
    );
    expect(recApi.getRecommendation).not.toHaveBeenCalled();
  });
});

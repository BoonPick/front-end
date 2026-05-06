import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useRecommendationScores } from "@/hooks/useRecommendationScores";
import * as recApi from "@/api/recommendations";

vi.mock("@/api/recommendations");

function makeWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useRecommendationScores", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  it("returns empty scoreById and not loading when itemIds is empty", () => {
    const { result } = renderHook(
      () => useRecommendationScores([], true),
      { wrapper: makeWrapper(queryClient) },
    );
    expect(result.current.scoreById).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("returns scores for each itemId after fetch", async () => {
    vi.mocked(recApi.getRecommendation).mockImplementation(async (id) => ({
      itemId: id,
      matchScore: id === "item1" ? 80 : 60,
      matchReason: "matched",
    }));

    const { result } = renderHook(
      () => useRecommendationScores(["item1", "item2"], true),
      { wrapper: makeWrapper(queryClient) },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["item1"]).toBe(80);
    expect(result.current.scoreById["item2"]).toBe(60);
  });

  it("scoreById entry is undefined when fetch fails", async () => {
    vi.mocked(recApi.getRecommendation).mockRejectedValue(new Error("network error"));

    const { result } = renderHook(
      () => useRecommendationScores(["item1"], true),
      { wrapper: makeWrapper(queryClient) },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["item1"]).toBeUndefined();
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(
      () => useRecommendationScores(["item1"], false),
      { wrapper: makeWrapper(queryClient) },
    );
    expect(recApi.getRecommendation).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("isLoading is true while queries are in flight", () => {
    vi.mocked(recApi.getRecommendation).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(
      () => useRecommendationScores(["item1"], true),
      { wrapper: makeWrapper(queryClient) },
    );

    expect(result.current.isLoading).toBe(true);
  });
});

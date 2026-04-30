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

describe("useRecommendationScores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty scoreById when itemIds is empty", () => {
    const { result } = renderHook(
      () => useRecommendationScores([], true),
      { wrapper: createWrapper() }
    );
    expect(result.current.scoreById).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("populates scoreById after fetch resolves", async () => {
    vi.mocked(recApi.getRecommendation).mockResolvedValue({
      itemId: "a1",
      matchScore: 85,
      matchReason: "good",
      preparationTips: [],
    });

    const { result } = renderHook(
      () => useRecommendationScores(["a1"], true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["a1"]).toBe(85);
  });

  it("scoreById value is undefined while query is loading", () => {
    vi.mocked(recApi.getRecommendation).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(
      () => useRecommendationScores(["x1"], true),
      { wrapper: createWrapper() }
    );

    expect(result.current.scoreById["x1"]).toBeUndefined();
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(
      () => useRecommendationScores(["id1", "id2"], false),
      { wrapper: createWrapper() }
    );

    expect(recApi.getRecommendation).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.scoreById).toEqual({ id1: undefined, id2: undefined });
  });

  it("calls getRecommendation for each itemId", async () => {
    vi.mocked(recApi.getRecommendation).mockResolvedValue({
      itemId: "any",
      matchScore: 50,
      matchReason: "",
      preparationTips: [],
    });

    const { result } = renderHook(
      () => useRecommendationScores(["id1", "id2"], true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(recApi.getRecommendation).toHaveBeenCalledWith("id1");
    expect(recApi.getRecommendation).toHaveBeenCalledWith("id2");
  });

  it("maps multiple items to their respective scores", async () => {
    vi.mocked(recApi.getRecommendation).mockImplementation(async (id) => ({
      itemId: id,
      matchScore: id === "a" ? 70 : 90,
      matchReason: "",
      preparationTips: [],
    }));

    const { result } = renderHook(
      () => useRecommendationScores(["a", "b"], true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["a"]).toBe(70);
    expect(result.current.scoreById["b"]).toBe(90);
  });
});

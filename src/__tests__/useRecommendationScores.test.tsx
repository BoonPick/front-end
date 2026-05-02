import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useRecommendationScores } from "@/hooks/useRecommendationScores";
import * as recApi from "@/api/recommendations";

vi.mock("@/api/recommendations");

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe("useRecommendationScores", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty scoreById when itemIds is empty", () => {
    const { result } = renderHook(() => useRecommendationScores([]), {
      wrapper: createWrapper(),
    });
    expect(result.current.scoreById).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("maps matchScore for each item id", async () => {
    vi.mocked(recApi.getRecommendation)
      .mockResolvedValueOnce({ matchScore: 80 } as any)
      .mockResolvedValueOnce({ matchScore: 45 } as any);

    const { result } = renderHook(
      () => useRecommendationScores(["a", "b"]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["a"]).toBe(80);
    expect(result.current.scoreById["b"]).toBe(45);
  });

  it("isLoading is true while queries are pending with enabled=true", () => {
    vi.mocked(recApi.getRecommendation).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(
      () => useRecommendationScores(["x"], true),
      { wrapper: createWrapper() },
    );
    expect(result.current.isLoading).toBe(true);
  });

  it("isLoading is false when enabled=false", () => {
    vi.mocked(recApi.getRecommendation).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(
      () => useRecommendationScores(["x"], false),
      { wrapper: createWrapper() },
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("scoreById contains undefined for failed queries", async () => {
    vi.mocked(recApi.getRecommendation).mockRejectedValue(new Error("fail"));
    const { result } = renderHook(
      () => useRecommendationScores(["z"]),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scoreById["z"]).toBeUndefined();
  });

  it("calls getRecommendation once per item id", async () => {
    vi.mocked(recApi.getRecommendation).mockResolvedValue({ matchScore: 50 } as any);
    const { result } = renderHook(
      () => useRecommendationScores(["id1", "id2", "id3"]),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(recApi.getRecommendation).toHaveBeenCalledTimes(3);
  });
});

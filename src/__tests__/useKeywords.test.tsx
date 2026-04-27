import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useKeywords } from "@/hooks/useKeywords";
import * as keywordsApi from "@/api/keywords";

vi.mock("@/api/keywords");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useKeywords", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns keywords from API", async () => {
    vi.mocked(keywordsApi.getKeywords).mockResolvedValue(["AI", "Python"] as any);

    const { result } = renderHook(() => useKeywords(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.keywords).toEqual(["AI", "Python"]);
  });

  it("defaults keywords to empty array while loading", () => {
    vi.mocked(keywordsApi.getKeywords).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useKeywords(), { wrapper: createWrapper() });

    expect(result.current.keywords).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("updateKeywords calls keywordsApi.updateKeywords", async () => {
    vi.mocked(keywordsApi.getKeywords).mockResolvedValue([]);
    vi.mocked(keywordsApi.updateKeywords).mockResolvedValue(["Java"] as any);

    const { result } = renderHook(() => useKeywords(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateKeywords(["Java"]);
    });

    expect(keywordsApi.updateKeywords).toHaveBeenCalledWith(["Java"], expect.any(Object));
  });

  it("exposes isLoading boolean", () => {
    vi.mocked(keywordsApi.getKeywords).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useKeywords(), { wrapper: createWrapper() });

    expect(typeof result.current.isLoading).toBe("boolean");
  });

  it("exposes updateKeywords function", async () => {
    vi.mocked(keywordsApi.getKeywords).mockResolvedValue([]);

    const { result } = renderHook(() => useKeywords(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.updateKeywords).toBe("function");
  });
});

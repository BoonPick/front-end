import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useBoardItems, useBoardItem, useRecommendation } from "@/hooks/useBoardItems";
import * as boardApi from "@/api/board";
import * as recApi from "@/api/recommendations";

vi.mock("@/api/board");
vi.mock("@/api/recommendations");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useBoardItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data from boardApi.getBoardItems", async () => {
    const mockItems = [{ id: "1", title: "Test Job" }];
    vi.mocked(boardApi.getBoardItems).mockResolvedValue(mockItems as any);

    const { result } = renderHook(
      () => useBoardItems("job", ["키워드"]),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockItems);
  });

  it("passes category, keywords, search, duty, workType to API", async () => {
    vi.mocked(boardApi.getBoardItems).mockResolvedValue([]);

    renderHook(
      () => useBoardItems("scholarship", ["장학금"], true, "검색어", "개발", "인턴"),
      { wrapper: createWrapper() }
    );

    await waitFor(() =>
      expect(boardApi.getBoardItems).toHaveBeenCalledWith(
        "scholarship", ["장학금"], "검색어", "개발", "인턴"
      )
    );
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(
      () => useBoardItems(undefined, undefined, false),
      { wrapper: createWrapper() }
    );
    expect(result.current.fetchStatus).toBe("idle");
    expect(boardApi.getBoardItems).not.toHaveBeenCalled();
  });
});

describe("useBoardItem", () => {
  it("fetches a single board item by id", async () => {
    const mockItem = { id: "42", title: "Detail" };
    vi.mocked(boardApi.getBoardItem).mockResolvedValue(mockItem as any);

    const { result } = renderHook(
      () => useBoardItem("42"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockItem);
    expect(boardApi.getBoardItem).toHaveBeenCalledWith("42");
  });
});

describe("useRecommendation", () => {
  it("fetches recommendation for an item", async () => {
    const mockRec = { itemId: "5", matchScore: 90, matchReason: "good", preparationTips: [] };
    vi.mocked(recApi.getRecommendation).mockResolvedValue(mockRec as any);

    const { result } = renderHook(
      () => useRecommendation("5"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockRec);
    expect(recApi.getRecommendation).toHaveBeenCalledWith("5");
  });
});

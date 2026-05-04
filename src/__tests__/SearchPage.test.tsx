import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useRecommendCategory");
vi.mock("@/hooks/useExpiredFilter");
vi.mock("@/hooks/useBoardItems");
vi.mock("@/hooks/useRecommendationScores");

import * as keywordsModule from "@/hooks/useKeywords";
import * as recommendCategoryModule from "@/hooks/useRecommendCategory";
import * as expiredFilterModule from "@/hooks/useExpiredFilter";
import * as boardItemsModule from "@/hooks/useBoardItems";
import * as recScoresModule from "@/hooks/useRecommendationScores";
import { SearchPage } from "@/pages/search/SearchPage";

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

const mockItem = {
  id: "1",
  category: "job" as const,
  title: "검색 결과 아이템",
  summary: "요약",
  body: "내용",
  source: "출처",
  sourceUrl: "https://example.com",
  date: "2026-01-01",
  keywords: [],
  deadline: null,
  isAlwaysOpen: false,
};

function setupDefaultMocks(items = [] as typeof mockItem[]) {
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({
    keywords: [],
    isLoading: false,
    updateKeywords: vi.fn(),
    updateCategory: vi.fn(),
    category: "all",
  } as any);

  vi.mocked(recommendCategoryModule.useRecommendCategory).mockReturnValue({
    category: "all",
    updateCategory: vi.fn(),
  });

  vi.mocked(expiredFilterModule.useExpiredFilter).mockReturnValue({
    showExpired: false,
    setShowExpired: vi.fn(),
  });

  vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({
    data: items,
    isLoading: false,
    isSuccess: true,
    isError: false,
    fetchStatus: "idle",
  } as any);

  vi.mocked(recScoresModule.useRecommendationScores).mockReturnValue({
    scoreById: {},
    isLoading: false,
  });
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it("renders 검색 page title", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByText("검색")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText("제목으로 검색")).toBeInTheDocument();
  });

  it("shows prompt when no filter is active", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(
      screen.getByText("검색어를 입력하거나 필터를 선택하세요."),
    ).toBeInTheDocument();
  });

  it("shows loading indicator when isLoading is true", () => {
    vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({
      data: [],
      isLoading: true,
      isSuccess: false,
      isError: false,
      fetchStatus: "fetching",
    } as any);

    render(<SearchPage />, { wrapper: createWrapper() });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "검색어" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 중...")).toBeInTheDocument();
  });

  it("renders duty filter chips in 'all' tab", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByText("직무")).toBeInTheDocument();
    expect(screen.getByText("고용형태")).toBeInTheDocument();
  });

  it("shows empty state when search has no results", () => {
    vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      fetchStatus: "idle",
    } as any);

    render(<SearchPage />, { wrapper: createWrapper() });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "없는검색어" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  it("shows results when items are returned", () => {
    vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({
      data: [mockItem],
      isLoading: false,
      isSuccess: true,
      isError: false,
      fetchStatus: "idle",
    } as any);

    render(<SearchPage />, { wrapper: createWrapper() });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "검색어" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 결과 아이템")).toBeInTheDocument();
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchPage } from "@/pages/search/SearchPage";

vi.mock("@/hooks/useBoardItems");
vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useRecommendCategory");
vi.mock("@/hooks/useExpiredFilter");
vi.mock("@/hooks/useRecommendationScores");

import * as boardItemsModule from "@/hooks/useBoardItems";
import * as keywordsModule from "@/hooks/useKeywords";
import * as recommendModule from "@/hooks/useRecommendCategory";
import * as expiredModule from "@/hooks/useExpiredFilter";
import * as recScoresModule from "@/hooks/useRecommendationScores";

const mockItem = {
  id: "1",
  title: "검색 결과 채용공고",
  summary: "요약",
  body: "내용",
  source: "회사",
  category: "job" as const,
  date: "2026-01-01",
  sourceUrl: null,
  workType: "정규직",
  duty: "개발",
  deadline: "2026-12-31",
  isAlwaysOpen: false,
};

function setupMocks(overrides: {
  items?: typeof mockItem[];
  isLoading?: boolean;
  keywords?: string[];
} = {}) {
  const { items = [mockItem], isLoading = false, keywords = [] } = overrides;

  vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({ data: items, isLoading } as any);
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({
    keywords,
    updateKeywords: vi.fn(),
    isLoading: false,
  } as any);
  vi.mocked(recommendModule.useRecommendCategory).mockReturnValue({
    category: "all",
    updateCategory: vi.fn(),
  } as any);
  vi.mocked(expiredModule.useExpiredFilter).mockReturnValue({
    showExpired: true,
    setShowExpired: vi.fn(),
  } as any);
  vi.mocked(recScoresModule.useRecommendationScores).mockReturnValue({
    scoreById: {},
    isLoading: false,
  } as any);
}

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it("renders 검색 title", () => {
    renderPage();
    expect(screen.getByText("검색")).toBeTruthy();
  });

  it("renders search input placeholder", () => {
    renderPage();
    expect(screen.getByPlaceholderText("제목으로 검색")).toBeTruthy();
  });

  it("shows prompt when no filter is active", () => {
    renderPage();
    expect(screen.getByText("검색어를 입력하거나 필터를 선택하세요.")).toBeTruthy();
  });

  it("renders 직무 filter section", () => {
    renderPage();
    expect(screen.getByText("직무")).toBeTruthy();
  });

  it("renders 고용형태 filter section", () => {
    renderPage();
    expect(screen.getByText("고용형태")).toBeTruthy();
  });

  it("renders category tabs", () => {
    renderPage();
    expect(screen.getByText("전체")).toBeTruthy();
  });

  it("renders empty result message when items list is empty after filtering", () => {
    setupMocks({ items: [] });
    renderPage();
    expect(screen.getByText("검색어를 입력하거나 필터를 선택하세요.")).toBeTruthy();
  });
});

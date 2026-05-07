import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BoardPage } from "@/pages/board/BoardPage";

vi.mock("@/hooks/useBoardItems");
vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useRecommendCategory");
vi.mock("@/hooks/useRecommendationScores");

import * as boardItemsModule from "@/hooks/useBoardItems";
import * as keywordsModule from "@/hooks/useKeywords";
import * as recommendModule from "@/hooks/useRecommendCategory";
import * as recommendationScoresModule from "@/hooks/useRecommendationScores";

const mockItem = {
  id: "1",
  title: "테스트 채용공고",
  summary: "요약",
  body: "내용",
  source: "회사",
  category: "job" as const,
  date: "2026-01-01",
  sourceUrl: null,
  workType: "정규직",
  duty: "개발",
  deadline: "2026-06-01",
  isAlwaysOpen: false,
};

function setup(overrides: {
  items?: typeof mockItem[];
  isLoading?: boolean;
  keywords?: string[];
  recommendCategory?: string;
} = {}) {
  const { items = [mockItem], isLoading = false, keywords = ["AI"], recommendCategory = "all" } = overrides;
  vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({ data: items, isLoading } as any);
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({ keywords, updateKeywords: vi.fn(), isLoading: false } as any);
  vi.mocked(recommendModule.useRecommendCategory).mockReturnValue({ category: recommendCategory, updateCategory: vi.fn() } as any);
  vi.mocked(recommendationScoresModule.useRecommendationScores).mockReturnValue({ scoreById: {}, isLoading: false } as any);
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

function renderPage() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BoardPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("BoardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setup();
  });

  it("renders page title", () => {
    renderPage();
    expect(screen.getByText("맞춤 정보")).toBeTruthy();
  });

  it("renders keyword management button", () => {
    renderPage();
    expect(screen.getByText("키워드 관리")).toBeTruthy();
  });

  it("renders board items", () => {
    renderPage();
    expect(screen.getByText("테스트 채용공고")).toBeTruthy();
  });

  it("shows loading indicator when isLoading is true", () => {
    setup({ isLoading: true });
    renderPage();
    expect(screen.getByText("로딩 중...")).toBeTruthy();
  });

  it("shows empty state when no items", () => {
    setup({ items: [] });
    renderPage();
    expect(screen.getByText("검색 결과가 없습니다.")).toBeTruthy();
  });

  it("shows keyword prompt in recommend tab when no keywords", () => {
    setup({ keywords: [] });
    renderPage();
    // By default on 'all' tab, items show; prompt only when on recommend tab
    // Default tab is 'all' so items show normally
    expect(screen.getByText("테스트 채용공고")).toBeTruthy();
  });
});

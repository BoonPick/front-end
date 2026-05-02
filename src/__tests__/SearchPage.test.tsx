import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchPage } from "@/pages/search/SearchPage";

vi.mock("@/hooks/useBoardItems");
vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useRecommendCategory");
vi.mock("@/hooks/useRecommendationScores");
vi.mock("@/hooks/useExpiredFilter");

import * as boardItemsModule from "@/hooks/useBoardItems";
import * as keywordsModule from "@/hooks/useKeywords";
import * as recommendModule from "@/hooks/useRecommendCategory";
import * as scoresModule from "@/hooks/useRecommendationScores";
import * as expiredModule from "@/hooks/useExpiredFilter";

const mockItem = {
  id: "1",
  title: "검색 결과 항목",
  summary: "요약",
  body: "내용",
  source: "회사",
  category: "job" as const,
  date: "2026-01-01",
  sourceUrl: null,
  workType: "정규직",
  duty: "개발",
  deadline: "2099-06-01",
  isAlwaysOpen: false,
};

function setupMocks(overrides: { items?: typeof mockItem[]; isLoading?: boolean } = {}) {
  const { items = [], isLoading = false } = overrides;
  vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({ data: items, isLoading } as any);
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({ keywords: [], updateKeywords: vi.fn(), isLoading: false } as any);
  vi.mocked(recommendModule.useRecommendCategory).mockReturnValue({ category: "all", updateCategory: vi.fn() } as any);
  vi.mocked(scoresModule.useRecommendationScores).mockReturnValue({ scoreById: {}, isLoading: false } as any);
  vi.mocked(expiredModule.useExpiredFilter).mockReturnValue({ showExpired: true, setShowExpired: vi.fn() } as any);
}

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

function renderPage() {
  return render(<SearchPage />, { wrapper: createWrapper() });
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it("renders page heading 검색", () => {
    renderPage();
    expect(screen.getByText("검색")).toBeTruthy();
  });

  it("renders search input placeholder", () => {
    renderPage();
    expect(screen.getByPlaceholderText("제목으로 검색")).toBeTruthy();
  });

  it("shows prompt to enter search criteria before filtering", () => {
    renderPage();
    expect(screen.getByText("검색어를 입력하거나 필터를 선택하세요.")).toBeTruthy();
  });

  it("shows loading text while fetching", () => {
    setupMocks({ items: [], isLoading: true });
    renderPage();
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 중...")).toBeTruthy();
  });

  it("shows 검색 결과가 없습니다 when no items match", () => {
    setupMocks({ items: [] });
    renderPage();
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "nomatch" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 결과가 없습니다.")).toBeTruthy();
  });

  it("renders job filter sections by default (all tab)", () => {
    renderPage();
    expect(screen.getByText("직무")).toBeTruthy();
    expect(screen.getByText("고용형태")).toBeTruthy();
  });

  it("renders search results when items are present", () => {
    setupMocks({ items: [mockItem] });
    renderPage();
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "검색" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 결과 항목")).toBeTruthy();
  });
});

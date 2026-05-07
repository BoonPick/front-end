import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
  title: "검색 결과 채용",
  summary: "요약",
  body: "내용",
  source: "회사A",
  category: "job" as const,
  date: "2026-01-01",
  sourceUrl: null,
  workType: "정규직",
  duty: "개발",
  deadline: "2099-12-31",
  isAlwaysOpen: false,
};

function setup(overrides: {
  items?: typeof mockItem[];
  isLoading?: boolean;
  keywords?: string[];
  showExpired?: boolean;
} = {}) {
  const { items = [], isLoading = false, keywords = ["AI"], showExpired = true } = overrides;
  const setShowExpired = vi.fn();
  vi.mocked(boardItemsModule.useBoardItems).mockReturnValue({ data: items, isLoading } as any);
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({ keywords, updateKeywords: vi.fn(), isLoading: false } as any);
  vi.mocked(recommendModule.useRecommendCategory).mockReturnValue({ category: "all", updateCategory: vi.fn() } as any);
  vi.mocked(scoresModule.useRecommendationScores).mockReturnValue({ scoreById: {}, isLoading: false } as any);
  vi.mocked(expiredModule.useExpiredFilter).mockReturnValue({ showExpired, setShowExpired } as any);
  return { setShowExpired };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setup();
  });

  it("renders search page title", () => {
    renderPage();
    expect(screen.getByText("검색")).toBeTruthy();
  });

  it("shows placeholder prompt when no search/filter applied", () => {
    renderPage();
    expect(screen.getByText("검색어를 입력하거나 필터를 선택하세요.")).toBeTruthy();
  });

  it("shows search input field", () => {
    renderPage();
    expect(screen.getByPlaceholderText("제목으로 검색")).toBeTruthy();
  });

  it("shows loading state after search is submitted", () => {
    setup({ items: [], isLoading: true });
    renderPage();
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 중...")).toBeTruthy();
  });

  it("shows no results message when search returns empty", () => {
    setup({ items: [] });
    renderPage();
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "없는것" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 결과가 없습니다.")).toBeTruthy();
  });

  it("renders search results when items are returned", () => {
    setup({ items: [mockItem] });
    renderPage();
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "채용" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("검색 결과 채용")).toBeTruthy();
  });

  it("renders category tabs", () => {
    renderPage();
    expect(screen.getByText("전체")).toBeTruthy();
  });

  it("renders job filters for 'all' tab by default", () => {
    renderPage();
    expect(screen.getByText("직무")).toBeTruthy();
    expect(screen.getByText("고용형태")).toBeTruthy();
  });
});

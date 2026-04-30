import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchPage } from "@/pages/search/SearchPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/useKeywords", () => ({
  useKeywords: () => ({ keywords: [] }),
}));
vi.mock("@/hooks/useRecommendCategory", () => ({
  useRecommendCategory: () => ({ category: "all", updateCategory: vi.fn() }),
}));
vi.mock("@/hooks/useExpiredFilter", () => ({
  useExpiredFilter: () => ({ showExpired: false, setShowExpired: vi.fn() }),
}));
vi.mock("@/hooks/useBoardItems", () => ({
  useBoardItems: () => ({ data: [], isLoading: false }),
}));
vi.mock("@/hooks/useRecommendationScores", () => ({
  useRecommendationScores: () => ({ scoreById: {}, isLoading: false }),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title 검색", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByText("검색")).toBeTruthy();
  });

  it("renders search input placeholder", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText("제목으로 검색")).toBeTruthy();
  });

  it("shows prompt to enter search when no filter is set", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByText("검색어를 입력하거나 필터를 선택하세요.")).toBeTruthy();
  });

  it("renders CategoryTabs", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByText("전체")).toBeTruthy();
  });

  it("renders job filter chips in all tab", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByText("직무")).toBeTruthy();
    expect(screen.getByText("고용형태")).toBeTruthy();
  });

  it("renders ExpiredFilterToggle", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByRole("checkbox")).toBeTruthy();
  });
});

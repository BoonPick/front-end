import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { SearchPage } from "@/pages/search/SearchPage";

vi.mock("@/hooks/useBoardItems", () => ({
  useBoardItems: vi.fn(() => ({ data: [], isLoading: false })),
}));
vi.mock("@/hooks/useKeywords", () => ({
  useKeywords: vi.fn(() => ({ keywords: [] })),
}));
vi.mock("@/hooks/useRecommendCategory", () => ({
  useRecommendCategory: vi.fn(() => ({ category: "all" })),
}));
vi.mock("@/hooks/useRecommendationScores", () => ({
  useRecommendationScores: vi.fn(() => ({ scoreById: {}, isLoading: false })),
}));
vi.mock("@/hooks/useExpiredFilter", () => ({
  useExpiredFilter: vi.fn(() => ({ showExpired: false, setShowExpired: vi.fn() })),
}));

import { useBoardItems } from "@/hooks/useBoardItems";

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(
    QueryClientProvider,
    { client: qc },
    React.createElement(MemoryRouter, null, children),
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search heading", () => {
    render(<SearchPage />, { wrapper: Wrapper });
    expect(screen.getByText("검색")).toBeInTheDocument();
  });

  it("renders the search input placeholder", () => {
    render(<SearchPage />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText("제목으로 검색")).toBeInTheDocument();
  });

  it("shows prompt when no filter applied", () => {
    render(<SearchPage />, { wrapper: Wrapper });
    expect(
      screen.getByText("검색어를 입력하거나 필터를 선택하세요."),
    ).toBeInTheDocument();
  });

  it("shows loading text when isLoading is true and search is applied", async () => {
    vi.mocked(useBoardItems).mockReturnValue({ data: [], isLoading: true } as any);
    render(<SearchPage />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "테스트" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => {
      expect(screen.getByText("검색 중...")).toBeInTheDocument();
    });
  });

  it("shows empty results text when search yields no items", async () => {
    vi.mocked(useBoardItems).mockReturnValue({ data: [], isLoading: false } as any);
    render(<SearchPage />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "없는검색어" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => {
      expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
    });
  });

  it("shows job filter chips by default (all category)", () => {
    render(<SearchPage />, { wrapper: Wrapper });
    expect(screen.getByText("직무")).toBeInTheDocument();
    expect(screen.getByText("고용형태")).toBeInTheDocument();
  });

  it("category tabs are rendered", () => {
    render(<SearchPage />, { wrapper: Wrapper });
    expect(screen.getByRole("tab", { name: "전체" })).toBeInTheDocument();
  });

  it("clicking search button triggers search", async () => {
    vi.mocked(useBoardItems).mockReturnValue({ data: [], isLoading: false } as any);
    render(<SearchPage />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "AI" } });
    const buttons = screen.getAllByRole("button");
    const searchBtn = buttons.find((b) => b.querySelector("svg"));
    if (searchBtn) fireEvent.click(searchBtn);
    await waitFor(() => {
      expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
    });
  });
});

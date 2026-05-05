import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchPage } from "@/pages/search/SearchPage";

vi.mock("@/hooks/useKeywords", () => ({
  useKeywords: () => ({ keywords: [] }),
}));

vi.mock("@/hooks/useRecommendCategory", () => ({
  useRecommendCategory: () => ({ category: "all" }),
}));

vi.mock("@/hooks/useExpiredFilter", () => ({
  useExpiredFilter: () => ({ showExpired: false, setShowExpired: vi.fn() }),
}));

vi.mock("@/hooks/useBoardItems", () => ({
  useBoardItems: vi.fn().mockReturnValue({ data: [], isLoading: false }),
}));

vi.mock("@/hooks/useRecommendationScores", () => ({
  useRecommendationScores: () => ({ scoreById: {}, isLoading: false }),
}));

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the 검색 heading", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByText("검색")).toBeInTheDocument();
  });

  it("renders search input placeholder", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText("제목으로 검색")).toBeInTheDocument();
  });

  it("shows prompt when no filter is active", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    expect(
      screen.getByText("검색어를 입력하거나 필터를 선택하세요.")
    ).toBeInTheDocument();
  });

  it("renders job filter chips for default 'all' tab", () => {
    render(<SearchPage />, { wrapper: createWrapper() });
    // MultiChipFilter renders chip buttons from DUTY_OPTIONS
    // At least one chip should be visible
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1);
  });

  it("shows 검색 결과가 없습니다 when search is active but items are empty", async () => {
    const { useBoardItems } = await import("@/hooks/useBoardItems");
    vi.mocked(useBoardItems).mockReturnValue({ data: [], isLoading: false } as any);

    render(<SearchPage />, { wrapper: createWrapper() });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
    });
  });

  it("shows 검색 중 when loading", async () => {
    const { useBoardItems } = await import("@/hooks/useBoardItems");
    vi.mocked(useBoardItems).mockReturnValue({ data: [], isLoading: true } as any);

    render(<SearchPage />, { wrapper: createWrapper() });
    const input = screen.getByPlaceholderText("제목으로 검색");
    fireEvent.change(input, { target: { value: "Vue" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("검색 중...")).toBeInTheDocument();
    });
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { KeywordEditPage } from "@/pages/keywords/KeywordEditPage";

vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useRecommendCategory");
vi.mock("@/api/keywords");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import * as keywordsModule from "@/hooks/useKeywords";
import * as recommendModule from "@/hooks/useRecommendCategory";
import * as keywordsApi from "@/api/keywords";

const mockNavigate = vi.fn();

function setup(overrides: { keywords?: string[]; isLoading?: boolean; recommendCategory?: string } = {}) {
  const { keywords = ["React", "TypeScript"], isLoading = false, recommendCategory = "all" } = overrides;
  const updateKeywords = vi.fn().mockResolvedValue(undefined);
  const updateCategory = vi.fn();
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({ keywords, updateKeywords, isLoading } as any);
  vi.mocked(recommendModule.useRecommendCategory).mockReturnValue({ category: recommendCategory, updateCategory } as any);
  vi.mocked(keywordsApi.getSuggestedKeywords).mockResolvedValue([]);
  return { updateKeywords, updateCategory };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <KeywordEditPage />
    </MemoryRouter>
  );
}

describe("KeywordEditPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setup();
  });

  it("renders 키워드 수정 title", () => {
    renderPage();
    expect(screen.getByText("키워드 수정")).toBeTruthy();
  });

  it("shows existing keywords from hook", () => {
    renderPage();
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
  });

  it("shows loading state when isLoading is true", () => {
    setup({ isLoading: true });
    renderPage();
    expect(screen.getByText("로딩 중...")).toBeTruthy();
  });

  it("renders 저장 button", () => {
    renderPage();
    expect(screen.getByText("저장")).toBeTruthy();
  });

  it("calls updateKeywords and navigates to /board on submit", async () => {
    const { updateKeywords } = setup();
    renderPage();
    fireEvent.click(screen.getByText("저장"));
    await waitFor(() => expect(updateKeywords).toHaveBeenCalledWith(["React", "TypeScript"]));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/board"));
  });

  it("navigates to /board on cancel", () => {
    renderPage();
    fireEvent.click(screen.getByText("취소"));
    expect(mockNavigate).toHaveBeenCalledWith("/board");
  });

  it("renders category buttons", () => {
    renderPage();
    expect(screen.getByText("전체")).toBeTruthy();
    expect(screen.getByText("채용")).toBeTruthy();
    expect(screen.getByText("공지")).toBeTruthy();
    expect(screen.getByText("장학금")).toBeTruthy();
  });

  it("calls updateCategory when category button is clicked", () => {
    const { updateCategory } = setup();
    renderPage();
    fireEvent.click(screen.getByText("채용"));
    expect(updateCategory).toHaveBeenCalledWith("job");
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DetailPage } from "@/pages/detail/DetailPage";

vi.mock("@/hooks/useBoardItems");

import * as boardItemsModule from "@/hooks/useBoardItems";

const mockItem = {
  id: "42",
  title: "백엔드 개발자 채용",
  summary: "Python 개발자 모집",
  body: "자세한 내용입니다.",
  source: "카카오",
  category: "job" as const,
  date: "2026-01-15",
  sourceUrl: "https://example.com/job/42",
  workType: "정규직",
  duty: "서버개발",
  deadline: "2026-06-30",
  isAlwaysOpen: false,
};

const mockRecommendation = {
  itemId: "42",
  matchScore: 85,
  matchReason: "AI 관련 키워드 매칭",
  preparationTips: ["포트폴리오 준비", "알고리즘 공부"],
};

function setupMocks(overrides: { item?: typeof mockItem | null; recData?: typeof mockRecommendation | null; itemLoading?: boolean; recLoading?: boolean } = {}) {
  const { item = mockItem, recData = mockRecommendation, itemLoading = false, recLoading = false } = overrides;
  vi.mocked(boardItemsModule.useBoardItem).mockReturnValue({ data: item, isLoading: itemLoading } as any);
  vi.mocked(boardItemsModule.useRecommendation).mockReturnValue({ data: recData, isLoading: recLoading } as any);
}

function renderPage(id = "42") {
  return render(
    <MemoryRouter initialEntries={[`/detail/${id}`]}>
      <Routes>
        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it("renders item title", () => {
    renderPage();
    expect(screen.getByText("백엔드 개발자 채용")).toBeTruthy();
  });

  it("renders item summary", () => {
    renderPage();
    expect(screen.getByText("Python 개발자 모집")).toBeTruthy();
  });

  it("renders item body", () => {
    renderPage();
    expect(screen.getByText("자세한 내용입니다.")).toBeTruthy();
  });

  it("renders source URL button when sourceUrl exists", () => {
    renderPage();
    expect(screen.getByText("원문 보기")).toBeTruthy();
  });

  it("renders loading state when item is loading", () => {
    setupMocks({ itemLoading: true, item: null });
    renderPage();
    expect(screen.getByText("로딩 중...")).toBeTruthy();
  });

  it("renders not found when item is null", () => {
    setupMocks({ item: null });
    renderPage();
    expect(screen.getByText("게시글을 찾을 수 없습니다.")).toBeTruthy();
  });

  it("renders AI recommendation section", () => {
    renderPage();
    expect(screen.getByText("AI 추천 & 준비 가이드")).toBeTruthy();
  });

  it("renders match score", () => {
    renderPage();
    expect(screen.getByText("85%")).toBeTruthy();
  });

  it("renders preparation tips", () => {
    renderPage();
    expect(screen.getByText("포트폴리오 준비")).toBeTruthy();
    expect(screen.getByText("알고리즘 공부")).toBeTruthy();
  });

  it("shows analyzing text when recommendation is loading", () => {
    setupMocks({ recLoading: true, recData: null });
    renderPage();
    expect(screen.getByText("분석 중...")).toBeTruthy();
  });

  it("renders 뒤로가기 button", () => {
    renderPage();
    expect(screen.getByText("뒤로가기")).toBeTruthy();
  });
});

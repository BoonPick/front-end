import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BoardCard } from "@/components/common/BoardCard";
import type { BoardItem } from "@/types";

function renderCard(item: BoardItem) {
  return render(
    <MemoryRouter>
      <BoardCard item={item} />
    </MemoryRouter>
  );
}

const baseItem: BoardItem = {
  id: "1",
  category: "job",
  title: "네이버 신입 개발자 채용",
  summary: "프론트엔드, 백엔드 모집",
  body: "상세내용",
  source: "네이버",
  sourceUrl: "https://example.com",
  date: "2026-04-01",
  keywords: ["개발자"],
};

describe("BoardCard", () => {
  it("renders the item title", () => {
    renderCard(baseItem);
    expect(screen.getByText("네이버 신입 개발자 채용")).toBeTruthy();
  });

  it("renders the item summary", () => {
    renderCard(baseItem);
    expect(screen.getByText("프론트엔드, 백엔드 모집")).toBeTruthy();
  });

  it("renders the source name", () => {
    renderCard(baseItem);
    expect(screen.getByText("네이버")).toBeTruthy();
  });

  it("links to the correct board item URL", () => {
    renderCard(baseItem);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/board/1");
  });

  it("shows '상시채용' when isAlwaysOpen is true", () => {
    renderCard({ ...baseItem, isAlwaysOpen: true });
    expect(screen.getByText("상시채용")).toBeTruthy();
  });

  it("shows deadline when provided and not always open", () => {
    renderCard({ ...baseItem, deadline: "2026-05-31", isAlwaysOpen: false });
    expect(screen.getByText(/2026-05-31/)).toBeTruthy();
  });

  it("shows date for non-job categories", () => {
    renderCard({ ...baseItem, category: "announcement", date: "2026-03-15" });
    expect(screen.getByText("2026-03-15")).toBeTruthy();
  });

  it("shows workType badge for job items with workType", () => {
    renderCard({ ...baseItem, workType: "인턴" });
    expect(screen.getByText("인턴")).toBeTruthy();
  });

  it("shows '장학금' badge for scholarship category", () => {
    renderCard({ ...baseItem, category: "scholarship" });
    expect(screen.getByText("장학금")).toBeTruthy();
  });

  it("shows '공지' badge for announcement category", () => {
    renderCard({ ...baseItem, category: "announcement" });
    expect(screen.getByText("공지")).toBeTruthy();
  });
});

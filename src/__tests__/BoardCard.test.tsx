import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BoardCard } from "@/components/common/BoardCard";
import type { BoardItem } from "@/types";

const mockItem: BoardItem = {
  id: "1",
  category: "job",
  title: "Software Engineer",
  summary: "We are hiring.",
  body: "Full description here.",
  source: "Kakao",
  sourceUrl: "https://kakao.com",
  date: "2026-04-26",
  keywords: ["react", "typescript"],
};

function renderCard(item: BoardItem) {
  return render(
    <MemoryRouter>
      <BoardCard item={item} />
    </MemoryRouter>,
  );
}

describe("BoardCard", () => {
  it("renders the title", () => {
    renderCard(mockItem);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders the summary", () => {
    renderCard(mockItem);
    expect(screen.getByText("We are hiring.")).toBeInTheDocument();
  });

  it("renders the source", () => {
    renderCard(mockItem);
    expect(screen.getByText("Kakao")).toBeInTheDocument();
  });

  it("renders the date", () => {
    renderCard(mockItem);
    expect(screen.getByText("2026-04-26")).toBeInTheDocument();
  });

  it('renders 채용 badge for job category', () => {
    renderCard(mockItem);
    expect(screen.getByText("채용")).toBeInTheDocument();
  });

  it('renders 공지 badge for announcement category', () => {
    const item = { ...mockItem, category: "announcement" as const };
    renderCard(item);
    expect(screen.getByText("공지")).toBeInTheDocument();
  });

  it('renders 장학금 badge for scholarship category', () => {
    const item = { ...mockItem, category: "scholarship" as const };
    renderCard(item);
    expect(screen.getByText("장학금")).toBeInTheDocument();
  });

  it("links to correct board item URL", () => {
    renderCard(mockItem);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/board/1");
  });
});

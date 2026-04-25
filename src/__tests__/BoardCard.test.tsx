import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BoardCard } from "@/components/common/BoardCard";
import type { BoardItem } from "@/types";

const mockItem: BoardItem = {
  id: "1",
  category: "job",
  title: "백엔드 개발자 채용",
  summary: "FastAPI 경험자 우대",
  body: "상세 내용...",
  source: "카카오",
  sourceUrl: "https://kakao.com/jobs/1",
  date: "2026-04-25",
  keywords: ["Python", "FastAPI"],
};

function renderCard(item: BoardItem) {
  return render(
    <MemoryRouter>
      <BoardCard item={item} />
    </MemoryRouter>
  );
}

describe("BoardCard", () => {
  it("renders the item title", () => {
    renderCard(mockItem);
    expect(screen.getByText("백엔드 개발자 채용")).toBeInTheDocument();
  });

  it("renders the item summary", () => {
    renderCard(mockItem);
    expect(screen.getByText("FastAPI 경험자 우대")).toBeInTheDocument();
  });

  it("renders the source name", () => {
    renderCard(mockItem);
    expect(screen.getByText("카카오")).toBeInTheDocument();
  });

  it("renders the date", () => {
    renderCard(mockItem);
    expect(screen.getByText("2026-04-25")).toBeInTheDocument();
  });

  it("renders the 채용 badge for job category", () => {
    renderCard(mockItem);
    expect(screen.getByText("채용")).toBeInTheDocument();
  });

  it("renders 공지 badge for announcement category", () => {
    renderCard({ ...mockItem, category: "announcement" });
    expect(screen.getByText("공지")).toBeInTheDocument();
  });

  it("renders 장학금 badge for scholarship category", () => {
    renderCard({ ...mockItem, category: "scholarship" });
    expect(screen.getByText("장학금")).toBeInTheDocument();
  });

  it("wraps card in a link to /board/:id", () => {
    renderCard(mockItem);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/board/1");
  });
});

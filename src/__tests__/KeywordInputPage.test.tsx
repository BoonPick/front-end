import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { KeywordInputPage } from "@/pages/keywords/KeywordInputPage";

vi.mock("@/hooks/useKeywords");
vi.mock("@/api/keywords");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import * as keywordsModule from "@/hooks/useKeywords";
import * as keywordsApi from "@/api/keywords";

const mockNavigate = vi.fn();

function setup() {
  const updateKeywords = vi.fn().mockResolvedValue(undefined);
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({ keywords: [], updateKeywords, isLoading: false } as any);
  vi.mocked(keywordsApi.getSuggestedKeywords).mockResolvedValue(["AI", "Python"]);
  return { updateKeywords };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <KeywordInputPage />
    </MemoryRouter>
  );
}

describe("KeywordInputPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setup();
  });

  it("renders the page with correct title", () => {
    renderPage();
    expect(screen.getByText("어떤 정보에 관심이 있으신가요?")).toBeTruthy();
  });

  it("renders submit button with label 시작하기", () => {
    renderPage();
    expect(screen.getByText("시작하기")).toBeTruthy();
  });

  it("shows keyword input field", () => {
    renderPage();
    expect(screen.getByPlaceholderText("관심 키워드를 입력하세요")).toBeTruthy();
  });

  it("calls updateKeywords and navigates to /board on submit", async () => {
    const { updateKeywords } = setup();
    renderPage();

    const input = screen.getByPlaceholderText("관심 키워드를 입력하세요");
    fireEvent.change(input, { target: { value: "FastAPI" } });
    fireEvent.click(screen.getByText("추가"));
    fireEvent.click(screen.getByText("시작하기"));

    await waitFor(() => expect(updateKeywords).toHaveBeenCalledWith(["FastAPI"]));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/board"));
  });

  it("shows suggested keywords from API", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText("AI")).toBeTruthy());
    expect(screen.getByText("Python")).toBeTruthy();
  });

  it("does not show cancel button", () => {
    renderPage();
    expect(screen.queryByText("취소")).toBeNull();
  });
});

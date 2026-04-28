import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { KeywordForm } from "@/components/common/KeywordForm";
import * as keywordsApi from "@/api/keywords";

vi.mock("@/api/keywords");

function renderForm(props: Partial<React.ComponentProps<typeof KeywordForm>> = {}) {
  const defaults = {
    title: "키워드 입력",
    submitLabel: "저장",
    onSubmit: vi.fn(),
  };
  return render(
    <MemoryRouter>
      <KeywordForm {...defaults} {...props} />
    </MemoryRouter>
  );
}

describe("KeywordForm", () => {
  beforeEach(() => {
    vi.mocked(keywordsApi.getSuggestedKeywords).mockResolvedValue(["AI", "개발", "데이터"]);
  });

  it("renders title and submit button", () => {
    renderForm({ title: "테스트 제목", submitLabel: "완료" });
    expect(screen.getByText("테스트 제목")).toBeTruthy();
    expect(screen.getByText("완료")).toBeTruthy();
  });

  it("renders initialKeywords as chips", () => {
    renderForm({ initialKeywords: ["React", "TypeScript"] });
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
  });

  it("adds keyword via button click", async () => {
    renderForm();
    const input = screen.getByPlaceholderText("관심 키워드를 입력하세요");
    fireEvent.change(input, { target: { value: "Python" } });
    fireEvent.click(screen.getByText("추가"));
    expect(screen.getByText("Python")).toBeTruthy();
  });

  it("adds keyword via Enter key", async () => {
    renderForm();
    const input = screen.getByPlaceholderText("관심 키워드를 입력하세요");
    fireEvent.change(input, { target: { value: "Django" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Django")).toBeTruthy();
  });

  it("does not add duplicate keywords", () => {
    renderForm({ initialKeywords: ["React"] });
    const input = screen.getByPlaceholderText("관심 키워드를 입력하세요");
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.click(screen.getByText("추가"));
    const chips = screen.getAllByText("React");
    expect(chips.length).toBe(1);
  });

  it("calls onSubmit with current keywords", () => {
    const onSubmit = vi.fn();
    renderForm({ initialKeywords: ["Vue"], onSubmit, submitLabel: "저장" });
    fireEvent.click(screen.getByText("저장"));
    expect(onSubmit).toHaveBeenCalledWith(["Vue"]);
  });

  it("renders cancel button when onCancel is provided", () => {
    const onCancel = vi.fn();
    renderForm({ onCancel });
    const cancelBtn = screen.getByText("취소");
    expect(cancelBtn).toBeTruthy();
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not render cancel button when onCancel is omitted", () => {
    renderForm();
    expect(screen.queryByText("취소")).toBeNull();
  });

  it("shows suggested keywords from API", async () => {
    renderForm();
    await waitFor(() => expect(screen.getByText("AI")).toBeTruthy());
    expect(screen.getByText("개발")).toBeTruthy();
  });

  it("adding suggested keyword removes it from suggestions", async () => {
    renderForm();
    await waitFor(() => expect(screen.getByText("AI")).toBeTruthy());
    fireEvent.click(screen.getByText("AI"));
    await waitFor(() => {
      const chips = screen.getAllByText("AI");
      expect(chips.length).toBe(1);
    });
  });
});

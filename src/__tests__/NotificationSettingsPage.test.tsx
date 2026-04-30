import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockNavigate = vi.fn();
const mockSave = vi.fn().mockResolvedValue(undefined);

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "u1", email: "test@test.com" } }),
}));
vi.mock("@/hooks/useKeywords", () => ({
  useKeywords: () => ({ keywords: [] }),
}));
vi.mock("@/hooks/useNotificationSettings", () => ({
  useNotificationSettings: () => ({
    settings: null,
    isLoading: false,
    save: mockSave,
    isSaving: false,
  }),
}));
vi.mock("@/hooks/useRecommendFilter", () => ({
  useRecommendFilter: () => ({
    filter: { search: "", duties: [], workTypes: [] },
  }),
}));
vi.mock("@/api/notifications", () => ({
  notifyNow: vi.fn().mockResolvedValue({ items_sent: 0 }),
}));

let NotificationSettingsPage: React.ComponentType;

beforeEach(async () => {
  vi.clearAllMocks();
  if (!NotificationSettingsPage) {
    const mod = await import("@/pages/notifications/NotificationSettingsPage");
    NotificationSettingsPage = mod.NotificationSettingsPage;
  }
});

describe("NotificationSettingsPage", () => {
  it("renders page title", () => {
    render(<NotificationSettingsPage />);
    expect(screen.getByText("이메일 알림 설정")).toBeTruthy();
  });

  it("renders category buttons", () => {
    render(<NotificationSettingsPage />);
    expect(screen.getByText("학사공지")).toBeTruthy();
    expect(screen.getByText("장학금공지")).toBeTruthy();
    expect(screen.getByText("채용공고")).toBeTruthy();
  });

  it("renders 저장 button", () => {
    render(<NotificationSettingsPage />);
    expect(screen.getByText("저장")).toBeTruthy();
  });

  it("renders 취소 button", () => {
    render(<NotificationSettingsPage />);
    expect(screen.getByText("취소")).toBeTruthy();
  });

  it("navigates to /board on 취소 click", () => {
    render(<NotificationSettingsPage />);
    fireEvent.click(screen.getByText("취소"));
    expect(mockNavigate).toHaveBeenCalledWith("/board");
  });

  it("renders keyword input placeholder", () => {
    render(<NotificationSettingsPage />);
    expect(screen.getByPlaceholderText("키워드를 입력하고 Enter")).toBeTruthy();
  });

  it("renders 바로 추천받아보기 button", () => {
    render(<NotificationSettingsPage />);
    expect(screen.getByText("바로 추천받아보기")).toBeTruthy();
  });

  it("shows error when saving with no category", () => {
    render(<NotificationSettingsPage />);
    fireEvent.click(screen.getByText("저장"));
    expect(screen.getByText("최소 1개 카테고리를 선택해주세요.")).toBeTruthy();
  });

  it("추가 button is disabled when keyword input is empty", () => {
    render(<NotificationSettingsPage />);
    const addButton = screen.getByText("추가").closest("button");
    expect(addButton!.hasAttribute("disabled")).toBe(true);
  });
});

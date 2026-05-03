import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotificationSettingsPage } from "@/pages/notifications/NotificationSettingsPage";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useNotificationSettings");
vi.mock("@/hooks/useRecommendFilter");
vi.mock("@/api/notifications");

import * as authModule from "@/hooks/useAuth";
import * as keywordsModule from "@/hooks/useKeywords";
import * as notifSettingsModule from "@/hooks/useNotificationSettings";
import * as recommendFilterModule from "@/hooks/useRecommendFilter";

const mockSettings = {
  categories: ["announcement" as const],
  duties: [],
  work_types: [],
  search: "",
  keywords: [],
};

function setupMocks(overrides: {
  settings?: typeof mockSettings | null;
  isLoading?: boolean;
}) {
  const { settings = mockSettings, isLoading = false } = overrides;

  vi.mocked(authModule.useAuth).mockReturnValue({
    user: { id: "user1", email: "test@test.com", name: "테스터", keywords: [] },
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
  } as any);

  vi.mocked(keywordsModule.useKeywords).mockReturnValue({
    keywords: [],
    updateKeywords: vi.fn(),
    isLoading: false,
  } as any);

  vi.mocked(notifSettingsModule.useNotificationSettings).mockReturnValue({
    settings,
    isLoading,
    save: vi.fn(),
    isSaving: false,
  } as any);

  vi.mocked(recommendFilterModule.useRecommendFilter).mockReturnValue({
    filter: { search: "", duties: [], workTypes: [] },
    setFilter: vi.fn(),
    hasFilter: false,
  } as any);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <NotificationSettingsPage />
    </MemoryRouter>
  );
}

describe("NotificationSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks({});
  });

  it("renders the page title", () => {
    renderPage();
    expect(screen.getByText("이메일 알림 설정")).toBeTruthy();
  });

  it("shows loading state when isLoading is true", () => {
    setupMocks({ isLoading: true });
    renderPage();
    expect(screen.getByText("로딩 중...")).toBeTruthy();
  });

  it("renders category option buttons", () => {
    renderPage();
    expect(screen.getByText("학사공지")).toBeTruthy();
    expect(screen.getByText("장학금공지")).toBeTruthy();
    expect(screen.getByText("채용공고")).toBeTruthy();
  });

  it("renders 저장 button", () => {
    renderPage();
    expect(screen.getByText("저장")).toBeTruthy();
  });

  it("renders 취소 button", () => {
    renderPage();
    expect(screen.getByText("취소")).toBeTruthy();
  });

  it("renders 바로 추천받아보기 button", () => {
    renderPage();
    expect(screen.getByText("바로 추천받아보기")).toBeTruthy();
  });

  it("바로 추천받아보기 button is disabled when no saved filters", () => {
    setupMocks({ settings: mockSettings });
    renderPage();
    const btn = screen.getByText("바로 추천받아보기").closest("button");
    expect(btn?.hasAttribute("disabled")).toBe(true);
  });

  it("renders keyword input placeholder text", () => {
    renderPage();
    expect(screen.getByPlaceholderText("키워드를 입력하고 Enter")).toBeTruthy();
  });
});

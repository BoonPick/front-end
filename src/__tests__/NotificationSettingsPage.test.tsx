import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotificationSettingsPage } from "@/pages/notifications/NotificationSettingsPage";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useNotificationSettings");
vi.mock("@/hooks/useRecommendFilter");
vi.mock("@/api/notifications");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

import * as authModule from "@/hooks/useAuth";
import * as keywordsModule from "@/hooks/useKeywords";
import * as notifSettingsModule from "@/hooks/useNotificationSettings";
import * as recommendFilterModule from "@/hooks/useRecommendFilter";
import type { NotificationSettings } from "@/types";

const mockSettings: NotificationSettings = {
  categories: ["job"],
  duties: [],
  work_types: [],
  search: "",
  keywords: [],
};

function setupMocks(overrides: { settings?: NotificationSettings | null; isLoading?: boolean } = {}) {
  const { settings = mockSettings, isLoading = false } = overrides;
  vi.mocked(authModule.useAuth).mockReturnValue({ user: { id: "1", email: "a@b.com" } } as any);
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({ keywords: [], updateKeywords: vi.fn(), isLoading: false } as any);
  vi.mocked(notifSettingsModule.useNotificationSettings).mockReturnValue({
    settings,
    isLoading,
    save: vi.fn(),
    isSaving: false,
    saveError: null,
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
    </MemoryRouter>,
  );
}

describe("NotificationSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it("renders page title", () => {
    renderPage();
    expect(screen.getByText("이메일 알림 설정")).toBeTruthy();
  });

  it("shows loading indicator when isLoading is true", () => {
    setupMocks({ isLoading: true });
    renderPage();
    expect(screen.getByText("로딩 중...")).toBeTruthy();
  });

  it("renders category buttons", () => {
    renderPage();
    expect(screen.getByText("학사공지")).toBeTruthy();
    expect(screen.getByText("장학금공지")).toBeTruthy();
    expect(screen.getByText("채용공고")).toBeTruthy();
  });

  it("renders 저장 and 취소 buttons", () => {
    renderPage();
    expect(screen.getByText("저장")).toBeTruthy();
    expect(screen.getByText("취소")).toBeTruthy();
  });

  it("shows error when saving without a category selected", async () => {
    setupMocks({ settings: { ...mockSettings, categories: [] } });
    renderPage();
    fireEvent.click(screen.getByText("저장"));
    expect(await screen.findByText("최소 1개 카테고리를 선택해주세요.")).toBeTruthy();
  });

  it("renders 바로 추천받아보기 button", () => {
    renderPage();
    expect(screen.getByText("바로 추천받아보기")).toBeTruthy();
  });

  it("바로 추천받아보기 is disabled when no saved filter", () => {
    setupMocks({ settings: { ...mockSettings, keywords: [], duties: [], work_types: [], search: "" } });
    renderPage();
    const btn = screen.getByText("바로 추천받아보기").closest("button")!;
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  it("keyword input renders placeholder text", () => {
    renderPage();
    expect(screen.getByPlaceholderText("키워드를 입력하고 Enter")).toBeTruthy();
  });
});

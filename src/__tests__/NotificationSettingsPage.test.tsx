import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useRecommendFilter");
vi.mock("@/hooks/useNotificationSettings");
vi.mock("@/api/notifications");

import * as authModule from "@/hooks/useAuth";
import * as keywordsModule from "@/hooks/useKeywords";
import * as recommendFilterModule from "@/hooks/useRecommendFilter";
import * as notifSettingsModule from "@/hooks/useNotificationSettings";
import * as notificationsApi from "@/api/notifications";
import { NotificationSettingsPage } from "@/pages/notifications/NotificationSettingsPage";

const mockUser = { id: "1", email: "a@b.com", name: "Alice", keywords: [] };

const defaultSettings = {
  categories: ["job"] as any[],
  duties: [],
  work_types: [],
  search: "",
  keywords: [],
};

function setup(overrides: Partial<{
  settings: typeof defaultSettings | null;
  isLoading: boolean;
}> = {}) {
  vi.mocked(authModule.useAuth).mockReturnValue({
    user: mockUser,
    isAuthenticated: true,
    loading: false,
    error: null,
    login: vi.fn(),
    signup: vi.fn(),
    sendVerificationCode: vi.fn(),
    logout: vi.fn(),
  });

  vi.mocked(keywordsModule.useKeywords).mockReturnValue({
    keywords: [],
    isLoading: false,
    updateKeywords: vi.fn(),
    updateCategory: vi.fn(),
    category: "all",
  } as any);

  vi.mocked(recommendFilterModule.useRecommendFilter).mockReturnValue({
    filter: { search: "", duties: [], workTypes: [] },
    setFilter: vi.fn(),
    hasFilter: false,
  });

  vi.mocked(notifSettingsModule.useNotificationSettings).mockReturnValue({
    settings: overrides.settings !== undefined ? overrides.settings : defaultSettings,
    isLoading: overrides.isLoading ?? false,
    save: vi.fn().mockResolvedValue(undefined),
    isSaving: false,
    saveError: null,
  } as any);

  return render(
    <MemoryRouter>
      <NotificationSettingsPage />
    </MemoryRouter>,
  );
}

describe("NotificationSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when isLoading is true", () => {
    setup({ settings: null, isLoading: true });
    expect(screen.getByText("로딩 중...")).toBeInTheDocument();
  });

  it("renders page title", () => {
    setup();
    expect(screen.getByText("이메일 알림 설정")).toBeInTheDocument();
  });

  it("renders category buttons", () => {
    setup();
    expect(screen.getByText("학사공지")).toBeInTheDocument();
    expect(screen.getByText("장학금공지")).toBeInTheDocument();
    expect(screen.getByText("채용공고")).toBeInTheDocument();
  });

  it("renders 저장 button", () => {
    setup();
    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  it("renders 취소 button", () => {
    setup();
    expect(screen.getByText("취소")).toBeInTheDocument();
  });

  it("shows error when saving with no categories selected", async () => {
    vi.mocked(notifSettingsModule.useNotificationSettings).mockReturnValue({
      settings: { ...defaultSettings, categories: [] },
      isLoading: false,
      save: vi.fn(),
      isSaving: false,
      saveError: null,
    } as any);

    render(
      <MemoryRouter>
        <NotificationSettingsPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("저장"));
    await waitFor(() => {
      expect(
        screen.getByText("최소 1개 카테고리를 선택해주세요."),
      ).toBeInTheDocument();
    });
  });

  it("shows keyword input field", () => {
    setup();
    expect(screen.getByPlaceholderText("키워드를 입력하고 Enter")).toBeInTheDocument();
  });

  it("shows 바로 추천받아보기 button disabled when no saved filter", () => {
    setup({ settings: defaultSettings });
    const btn = screen.getByText("바로 추천받아보기");
    expect(btn).toBeDisabled();
  });

  it("renders 현재 추천 설정으로 덮어쓰기 button", () => {
    setup();
    expect(screen.getByText("현재 추천 설정으로 덮어쓰기")).toBeInTheDocument();
  });
});

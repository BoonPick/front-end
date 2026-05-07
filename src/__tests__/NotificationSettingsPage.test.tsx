import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotificationSettingsPage } from "@/pages/notifications/NotificationSettingsPage";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useKeywords");
vi.mock("@/hooks/useNotificationSettings");
vi.mock("@/hooks/useRecommendFilter");
vi.mock("@/api/notifications");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import * as authModule from "@/hooks/useAuth";
import * as keywordsModule from "@/hooks/useKeywords";
import * as notifSettingsModule from "@/hooks/useNotificationSettings";
import * as recommendFilterModule from "@/hooks/useRecommendFilter";
import * as notificationsApi from "@/api/notifications";

const mockNavigate = vi.fn();

const mockSettings = {
  categories: ["job" as const],
  duties: [],
  work_types: [],
  search: "",
  keywords: [],
};

function setup(overrides: Partial<{
  settings: typeof mockSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  keywords: string[];
}> = {}) {
  const { settings = mockSettings, isLoading = false, isSaving = false, keywords = [] } = overrides;
  const save = vi.fn().mockResolvedValue(undefined);
  vi.mocked(authModule.useAuth).mockReturnValue({ user: { id: "u1" } } as any);
  vi.mocked(keywordsModule.useKeywords).mockReturnValue({ keywords, updateKeywords: vi.fn(), isLoading: false } as any);
  vi.mocked(notifSettingsModule.useNotificationSettings).mockReturnValue({
    settings,
    isLoading,
    save,
    isSaving,
    saveError: null,
  } as any);
  vi.mocked(recommendFilterModule.useRecommendFilter).mockReturnValue({
    filter: { search: "", duties: [], workTypes: [] },
    setFilter: vi.fn(),
    hasFilter: false,
  } as any);
  vi.mocked(notificationsApi.notifyNow).mockResolvedValue({ items_sent: 3 } as any);
  return { save };
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
    setup();
  });

  it("renders page title", () => {
    renderPage();
    expect(screen.getByText("이메일 알림 설정")).toBeTruthy();
  });

  it("shows loading state when isLoading is true", () => {
    setup({ isLoading: true });
    renderPage();
    expect(screen.getByText("로딩 중...")).toBeTruthy();
  });

  it("renders category buttons", () => {
    renderPage();
    expect(screen.getByText("학사공지")).toBeTruthy();
    expect(screen.getByText("장학금공지")).toBeTruthy();
    expect(screen.getByText("채용공고")).toBeTruthy();
  });

  it("renders save and cancel buttons", () => {
    renderPage();
    expect(screen.getByText("저장")).toBeTruthy();
    expect(screen.getByText("취소")).toBeTruthy();
  });

  it("navigates to /board on cancel", () => {
    renderPage();
    fireEvent.click(screen.getByText("취소"));
    expect(mockNavigate).toHaveBeenCalledWith("/board");
  });

  it("shows error when saving with no categories selected", async () => {
    setup({ settings: { ...mockSettings, categories: [] } });
    renderPage();
    fireEvent.click(screen.getByText("채용공고"));
    fireEvent.click(screen.getByText("채용공고"));
    fireEvent.click(screen.getByText("저장"));
    await waitFor(() => {
      expect(screen.getByText("최소 1개 카테고리를 선택해주세요.")).toBeTruthy();
    });
  });

  it("calls save and navigates on successful submit", async () => {
    const { save } = setup();
    renderPage();
    fireEvent.click(screen.getByText("저장"));
    await waitFor(() => expect(save).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/board"));
  });

  it("renders 바로 추천받아보기 button", () => {
    renderPage();
    expect(screen.getByText("바로 추천받아보기")).toBeTruthy();
  });

  it("바로 추천받아보기 button is disabled when no saved filter", () => {
    setup({ settings: mockSettings });
    renderPage();
    const btn = screen.getByText("바로 추천받아보기").closest("button");
    expect(btn?.disabled).toBe(true);
  });
});

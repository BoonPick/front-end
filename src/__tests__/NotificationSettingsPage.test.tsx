import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { NotificationSettingsPage } from "@/pages/notifications/NotificationSettingsPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...mod, useNavigate: () => mockNavigate };
});
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user1", email: "test@example.com", name: "Test", keywords: [] } }),
}));
vi.mock("@/hooks/useKeywords", () => ({
  useKeywords: () => ({ keywords: ["AI"] }),
}));
vi.mock("@/hooks/useRecommendFilter", () => ({
  useRecommendFilter: () => ({ filter: { search: "", duties: [], workTypes: [] } }),
}));
vi.mock("@/api/notifications", () => ({
  notifyNow: vi.fn().mockResolvedValue({ items_sent: 3 }),
}));

const mockSave = vi.fn().mockResolvedValue(undefined);
const mockSettingsReturn = {
  settings: { categories: ["job"] as const, duties: [], work_types: [], search: "", keywords: [] },
  isLoading: false,
  save: mockSave,
  isSaving: false,
};

vi.mock("@/hooks/useNotificationSettings", () => ({
  useNotificationSettings: () => mockSettingsReturn,
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(
    QueryClientProvider,
    { client: qc },
    React.createElement(MemoryRouter, null, children),
  );
}

describe("NotificationSettingsPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSave.mockClear();
  });

  it("renders page heading", () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    expect(screen.getByText("이메일 알림 설정")).toBeInTheDocument();
  });

  it("renders category buttons", () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    expect(screen.getByText("학사공지")).toBeInTheDocument();
    expect(screen.getByText("장학금공지")).toBeInTheDocument();
    expect(screen.getByText("채용공고")).toBeInTheDocument();
  });

  it("renders save and cancel buttons", () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("navigates to /board on cancel", () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(mockNavigate).toHaveBeenCalledWith("/board");
  });

  it("shows error when saving with no category selected", async () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    const jobButton = screen.getByText("채용공고");
    fireEvent.click(jobButton);
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() => {
      expect(screen.getByText("최소 1개 카테고리를 선택해주세요.")).toBeInTheDocument();
    });
  });

  it("calls save on submit with valid category", async () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });

  it("renders keyword input section", () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText("키워드를 입력하고 Enter")).toBeInTheDocument();
  });

  it("can add a keyword by clicking 추가 button", () => {
    render(<NotificationSettingsPage />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("키워드를 입력하고 Enter");
    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthPage } from "@/pages/auth/AuthPage";

vi.mock("@/hooks/useAuth");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import * as authModule from "@/hooks/useAuth";

const mockNavigate = vi.fn();

const mockUseAuth = (overrides = {}) => {
  vi.mocked(authModule.useAuth).mockReturnValue({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    login: vi.fn(),
    signup: vi.fn(),
    sendVerificationCode: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  });
};

function renderPage() {
  return render(
    <MemoryRouter>
      <AuthPage />
    </MemoryRouter>
  );
}

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth();
  });

  it("renders BoonPick title", () => {
    renderPage();
    expect(screen.getByText("BoonPick")).toBeTruthy();
  });

  it("renders login and signup tabs", () => {
    renderPage();
    expect(screen.getAllByText("로그인").length).toBeGreaterThan(0);
    expect(screen.getByText("회원가입")).toBeTruthy();
  });

  it("renders email and password fields in login tab", () => {
    renderPage();
    expect(screen.getByLabelText("이메일")).toBeTruthy();
    expect(screen.getByLabelText("비밀번호")).toBeTruthy();
  });

  it("redirects to /board when already authenticated with keywords", () => {
    mockUseAuth({
      isAuthenticated: true,
      user: { id: "1", email: "a@b.com", name: "Alice", keywords: ["AI"] },
    });
    renderPage();
    expect(mockNavigate).toHaveBeenCalledWith("/board", { replace: true });
  });

  it("calls login on form submit and navigates to /board when user has keywords", async () => {
    const mockLogin = vi.fn().mockResolvedValue({ id: "1", email: "a@b.com", name: "A", keywords: ["AI"] });
    mockUseAuth({ login: mockLogin });
    renderPage();

    fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "pass" } });
    fireEvent.submit(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("test@test.com", "pass"));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/board"));
  });

  it("navigates to /keywords when login returns user without keywords", async () => {
    const mockLogin = vi.fn().mockResolvedValue({ id: "1", email: "a@b.com", name: "A", keywords: [] });
    mockUseAuth({ login: mockLogin });
    renderPage();

    fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "pass" } });
    fireEvent.submit(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/keywords"));
  });

  it("displays error message when error is set", () => {
    mockUseAuth({ error: "로그인 실패" });
    renderPage();
    expect(screen.getByText("로그인 실패")).toBeTruthy();
  });

  it("shows loading state on login button", () => {
    mockUseAuth({ loading: true });
    renderPage();
    expect(screen.getByText("로그인 중...")).toBeTruthy();
  });
});

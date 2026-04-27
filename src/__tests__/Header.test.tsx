import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "@/components/layout/Header";

vi.mock("@/hooks/useAuth");

import * as authModule from "@/hooks/useAuth";

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

const mockLogout = vi.fn();

describe("Header", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it("renders the BoonPick brand link", () => {
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: mockLogout,
    });

    renderHeader();
    expect(screen.getByText("BoonPick")).toBeTruthy();
  });

  it("does not render nav links when user is null", () => {
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: mockLogout,
    });

    renderHeader();
    expect(screen.queryByText("로그아웃")).toBeNull();
    expect(screen.queryByText("홈")).toBeNull();
  });

  it("renders nav links when user is logged in", () => {
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: { id: "1", email: "a@b.com", name: "Alice", keywords: [] },
      isAuthenticated: true,
      loading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: mockLogout,
    });

    renderHeader();
    expect(screen.getByText("홈")).toBeTruthy();
    expect(screen.getByText("검색")).toBeTruthy();
    expect(screen.getByText("키워드 관리")).toBeTruthy();
    expect(screen.getByText("로그아웃")).toBeTruthy();
  });

  it("calls logout when 로그아웃 button is clicked", () => {
    vi.mocked(authModule.useAuth).mockReturnValue({
      user: { id: "1", email: "a@b.com", name: "Alice", keywords: [] },
      isAuthenticated: true,
      loading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: mockLogout,
    });

    renderHeader();
    fireEvent.click(screen.getByText("로그아웃"));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

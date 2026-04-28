import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthGuard } from "@/components/layout/AuthGuard";

vi.mock("@/hooks/useAuth");

import * as authModule from "@/hooks/useAuth";

function renderWithRouter(ui: React.ReactNode, initialEntries = ["/"]) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

describe("AuthGuard", () => {
  it("renders children when authenticated", () => {
    vi.mocked(authModule.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", email: "a@b.com", name: "Alice", keywords: [] },
      loading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      sendVerificationCode: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Protected Content")).toBeTruthy();
  });

  it("does not render children when not authenticated", () => {
    vi.mocked(authModule.useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      sendVerificationCode: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter(
      <AuthGuard>
        <span data-testid="secret">secret</span>
      </AuthGuard>
    );

    expect(screen.queryByTestId("secret")).toBeNull();
  });

  it("redirects away from protected content when not authenticated", () => {
    vi.mocked(authModule.useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      sendVerificationCode: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = renderWithRouter(
      <AuthGuard>
        <div>Secret Page</div>
      </AuthGuard>
    );

    expect(container.textContent).toBe("");
  });
});

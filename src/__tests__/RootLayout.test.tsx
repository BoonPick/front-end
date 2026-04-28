import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";

vi.mock("@/hooks/useAuth");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-content">Outlet Content</div>,
  };
});

import * as authModule from "@/hooks/useAuth";

describe("RootLayout", () => {
  it("renders Header and Outlet", () => {
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

    render(
      <MemoryRouter>
        <RootLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("outlet-content")).toBeTruthy();
  });

  it("has a min-h-screen wrapper", () => {
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

    const { container } = render(
      <MemoryRouter>
        <RootLayout />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeTruthy();
    expect((container.firstChild as HTMLElement).className).toContain("min-h-screen");
  });
});

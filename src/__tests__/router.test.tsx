import React from "react";
import { describe, it, expect, vi } from "vitest";

// Mock all page/layout components so they don't try to render real UI or fetch data
vi.mock("@/components/layout/RootLayout", () => ({
  RootLayout: () => <div data-testid="root-layout" />,
}));

vi.mock("@/components/layout/AuthGuard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/pages/auth/AuthPage", () => ({
  AuthPage: () => <div data-testid="auth-page" />,
}));

vi.mock("@/pages/keywords/KeywordInputPage", () => ({
  KeywordInputPage: () => <div data-testid="keyword-input-page" />,
}));

vi.mock("@/pages/keywords/KeywordEditPage", () => ({
  KeywordEditPage: () => <div data-testid="keyword-edit-page" />,
}));

vi.mock("@/pages/board/BoardPage", () => ({
  BoardPage: () => <div data-testid="board-page" />,
}));

vi.mock("@/pages/detail/DetailPage", () => ({
  DetailPage: () => <div data-testid="detail-page" />,
}));

vi.mock("@/pages/search/SearchPage", () => ({
  SearchPage: () => <div data-testid="search-page" />,
}));

vi.mock("@/pages/admin/AdminKeywordPage", () => ({
  AdminKeywordPage: () => <div data-testid="admin-keyword-page" />,
}));

vi.mock("@/pages/notifications/NotificationSettingsPage", () => ({
  NotificationSettingsPage: () => <div data-testid="notification-settings-page" />,
}));

// Import the router AFTER mocks are set up
import { router } from "@/app/router";

// Helper: collect all paths from a router route tree (top-level + nested children)
function collectPaths(routes: { path?: string; children?: typeof routes }[]): string[] {
  const paths: string[] = [];
  for (const route of routes) {
    if (route.path !== undefined) {
      paths.push(route.path);
    }
    if (route.children && route.children.length > 0) {
      paths.push(...collectPaths(route.children));
    }
  }
  return paths;
}

describe("router", () => {
  it("is defined", () => {
    expect(router).toBeDefined();
  });

  it("has routes", () => {
    expect(router.routes).toBeDefined();
    expect(router.routes.length).toBeGreaterThan(0);
  });

  it("includes the /auth path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/auth");
  });

  it("includes the /admin path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/admin");
  });

  it("includes the /keywords path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/keywords");
  });

  it("includes the /keywords/edit path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/keywords/edit");
  });

  it("includes the /notifications path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/notifications");
  });

  it("includes the /board path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/board");
  });

  it("includes the /board/:id path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/board/:id");
  });

  it("includes the /search path", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/search");
  });

  it("includes the / (root) path as a redirect", () => {
    const paths = collectPaths(router.routes as { path?: string; children?: { path?: string }[] }[]);
    expect(paths).toContain("/");
  });

  it("has a layout route with children (AuthGuard + RootLayout wrapper)", () => {
    // The layout/guard route has no path of its own but does have children
    const layoutRoute = (router.routes as { path?: string; children?: unknown[] }[]).find(
      (r) => r.path === undefined && Array.isArray(r.children) && r.children.length > 0
    );
    expect(layoutRoute).toBeDefined();
    expect((layoutRoute as { children: unknown[] }).children.length).toBeGreaterThan(0);
  });

  it("has exactly 3 top-level route entries", () => {
    // /auth, /admin, and one layout wrapper = 3 top-level entries
    expect(router.routes.length).toBe(3);
  });
});

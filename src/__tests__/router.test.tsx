import { describe, it, expect, vi } from "vitest";

vi.mock("react-router-dom", () => ({
  createBrowserRouter: vi.fn((routes) => ({ routes })),
  Navigate: () => null,
}));

vi.mock("@/components/layout/RootLayout", () => ({
  RootLayout: () => null,
}));

vi.mock("@/components/layout/AuthGuard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/pages/auth/AuthPage", () => ({
  AuthPage: () => null,
}));

vi.mock("@/pages/keywords/KeywordInputPage", () => ({
  KeywordInputPage: () => null,
}));

vi.mock("@/pages/keywords/KeywordEditPage", () => ({
  KeywordEditPage: () => null,
}));

vi.mock("@/pages/board/BoardPage", () => ({
  BoardPage: () => null,
}));

vi.mock("@/pages/detail/DetailPage", () => ({
  DetailPage: () => null,
}));

vi.mock("@/pages/search/SearchPage", () => ({
  SearchPage: () => null,
}));

vi.mock("@/pages/admin/AdminKeywordPage", () => ({
  AdminKeywordPage: () => null,
}));

vi.mock("@/pages/notifications/NotificationSettingsPage", () => ({
  NotificationSettingsPage: () => null,
}));

import { router } from "@/app/router";

describe("router", () => {
  it("is defined", () => {
    expect(router).toBeDefined();
  });

  it("has routes", () => {
    expect(router.routes).toBeDefined();
    expect(Array.isArray(router.routes)).toBe(true);
    expect(router.routes.length).toBeGreaterThan(0);
  });

  it("has a top-level /auth route", () => {
    const authRoute = router.routes.find((r: { path?: string }) => r.path === "/auth");
    expect(authRoute).toBeDefined();
  });

  it("has a top-level /admin route", () => {
    const adminRoute = router.routes.find((r: { path?: string }) => r.path === "/admin");
    expect(adminRoute).toBeDefined();
  });

  it("has a layout route with protected children", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: unknown[] }) => !r.path && Array.isArray(r.children)
    );
    expect(layoutRoute).toBeDefined();
  });

  it("has /keywords child route under the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: Array<{ path?: string }> }) =>
        !r.path && Array.isArray(r.children)
    );
    const keywordsRoute = layoutRoute?.children?.find(
      (c: { path?: string }) => c.path === "/keywords"
    );
    expect(keywordsRoute).toBeDefined();
  });

  it("has /keywords/edit child route under the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: Array<{ path?: string }> }) =>
        !r.path && Array.isArray(r.children)
    );
    const editRoute = layoutRoute?.children?.find(
      (c: { path?: string }) => c.path === "/keywords/edit"
    );
    expect(editRoute).toBeDefined();
  });

  it("has /board child route under the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: Array<{ path?: string }> }) =>
        !r.path && Array.isArray(r.children)
    );
    const boardRoute = layoutRoute?.children?.find(
      (c: { path?: string }) => c.path === "/board"
    );
    expect(boardRoute).toBeDefined();
  });

  it("has /board/:id child route under the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: Array<{ path?: string }> }) =>
        !r.path && Array.isArray(r.children)
    );
    const detailRoute = layoutRoute?.children?.find(
      (c: { path?: string }) => c.path === "/board/:id"
    );
    expect(detailRoute).toBeDefined();
  });

  it("has /search child route under the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: Array<{ path?: string }> }) =>
        !r.path && Array.isArray(r.children)
    );
    const searchRoute = layoutRoute?.children?.find(
      (c: { path?: string }) => c.path === "/search"
    );
    expect(searchRoute).toBeDefined();
  });

  it("has /notifications child route under the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: Array<{ path?: string }> }) =>
        !r.path && Array.isArray(r.children)
    );
    const notifRoute = layoutRoute?.children?.find(
      (c: { path?: string }) => c.path === "/notifications"
    );
    expect(notifRoute).toBeDefined();
  });

  it("has / root redirect child route under the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: Array<{ path?: string }> }) =>
        !r.path && Array.isArray(r.children)
    );
    const rootRoute = layoutRoute?.children?.find(
      (c: { path?: string }) => c.path === "/"
    );
    expect(rootRoute).toBeDefined();
  });
});

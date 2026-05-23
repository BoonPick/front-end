import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all page components to avoid deep dependency chains
vi.mock("@/pages/auth/AuthPage", () => ({
  AuthPage: () => <div>AuthPage</div>,
}));

vi.mock("@/pages/admin/AdminKeywordPage", () => ({
  AdminKeywordPage: () => <div>AdminKeywordPage</div>,
}));

vi.mock("@/pages/keywords/KeywordInputPage", () => ({
  KeywordInputPage: () => <div>KeywordInputPage</div>,
}));

vi.mock("@/pages/keywords/KeywordEditPage", () => ({
  KeywordEditPage: () => <div>KeywordEditPage</div>,
}));

vi.mock("@/pages/notifications/NotificationSettingsPage", () => ({
  NotificationSettingsPage: () => <div>NotificationSettingsPage</div>,
}));

vi.mock("@/pages/board/BoardPage", () => ({
  BoardPage: () => <div>BoardPage</div>,
}));

vi.mock("@/pages/detail/DetailPage", () => ({
  DetailPage: () => <div>DetailPage</div>,
}));

vi.mock("@/pages/search/SearchPage", () => ({
  SearchPage: () => <div>SearchPage</div>,
}));

vi.mock("@/components/layout/RootLayout", () => ({
  RootLayout: () => <div>RootLayout</div>,
}));

vi.mock("@/components/layout/AuthGuard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import React from "react";
import { router } from "@/app/router";

describe("router", () => {
  it("is exported and defined", () => {
    expect(router).toBeDefined();
  });

  it("is an object with a routes array", () => {
    expect(router).toHaveProperty("routes");
    expect(Array.isArray(router.routes)).toBe(true);
  });

  it("exposes a navigate function", () => {
    expect(typeof router.navigate).toBe("function");
  });

  it("has a /auth route at the top level", () => {
    const authRoute = router.routes.find((r: { path?: string }) => r.path === "/auth");
    expect(authRoute).toBeDefined();
  });

  it("has an /admin route at the top level", () => {
    const adminRoute = router.routes.find((r: { path?: string }) => r.path === "/admin");
    expect(adminRoute).toBeDefined();
  });

  it("has a layout route with child routes", () => {
    // The layout route has no path itself but carries children
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: unknown[] }) => !r.path && Array.isArray(r.children),
    );
    expect(layoutRoute).toBeDefined();
  });

  it("contains a /board child route inside the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: { path?: string }[] }) =>
        !r.path && Array.isArray(r.children),
    ) as { children: { path?: string }[] } | undefined;

    expect(layoutRoute).toBeDefined();
    const boardRoute = layoutRoute!.children.find((c) => c.path === "/board");
    expect(boardRoute).toBeDefined();
  });

  it("contains a /board/:id child route inside the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: { path?: string }[] }) =>
        !r.path && Array.isArray(r.children),
    ) as { children: { path?: string }[] } | undefined;

    expect(layoutRoute).toBeDefined();
    const detailRoute = layoutRoute!.children.find((c) => c.path === "/board/:id");
    expect(detailRoute).toBeDefined();
  });

  it("contains a /keywords child route inside the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: { path?: string }[] }) =>
        !r.path && Array.isArray(r.children),
    ) as { children: { path?: string }[] } | undefined;

    expect(layoutRoute).toBeDefined();
    const keywordsRoute = layoutRoute!.children.find((c) => c.path === "/keywords");
    expect(keywordsRoute).toBeDefined();
  });

  it("contains a /keywords/edit child route inside the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: { path?: string }[] }) =>
        !r.path && Array.isArray(r.children),
    ) as { children: { path?: string }[] } | undefined;

    expect(layoutRoute).toBeDefined();
    const editRoute = layoutRoute!.children.find((c) => c.path === "/keywords/edit");
    expect(editRoute).toBeDefined();
  });

  it("contains a /notifications child route inside the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: { path?: string }[] }) =>
        !r.path && Array.isArray(r.children),
    ) as { children: { path?: string }[] } | undefined;

    expect(layoutRoute).toBeDefined();
    const notifRoute = layoutRoute!.children.find((c) => c.path === "/notifications");
    expect(notifRoute).toBeDefined();
  });

  it("contains a /search child route inside the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: { path?: string }[] }) =>
        !r.path && Array.isArray(r.children),
    ) as { children: { path?: string }[] } | undefined;

    expect(layoutRoute).toBeDefined();
    const searchRoute = layoutRoute!.children.find((c) => c.path === "/search");
    expect(searchRoute).toBeDefined();
  });

  it("contains a / root redirect inside the layout", () => {
    const layoutRoute = router.routes.find(
      (r: { path?: string; children?: { path?: string }[] }) =>
        !r.path && Array.isArray(r.children),
    ) as { children: { path?: string }[] } | undefined;

    expect(layoutRoute).toBeDefined();
    const rootRoute = layoutRoute!.children.find((c) => c.path === "/");
    expect(rootRoute).toBeDefined();
  });
});

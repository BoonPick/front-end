import React from "react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/pages/auth/AuthPage", () => ({ AuthPage: () => <div>AuthPage</div> }));
vi.mock("@/pages/keywords/KeywordInputPage", () => ({ KeywordInputPage: () => <div>KeywordInputPage</div> }));
vi.mock("@/pages/keywords/KeywordEditPage", () => ({ KeywordEditPage: () => <div>KeywordEditPage</div> }));
vi.mock("@/pages/board/BoardPage", () => ({ BoardPage: () => <div>BoardPage</div> }));
vi.mock("@/pages/detail/DetailPage", () => ({ DetailPage: () => <div>DetailPage</div> }));
vi.mock("@/pages/search/SearchPage", () => ({ SearchPage: () => <div>SearchPage</div> }));
vi.mock("@/pages/admin/AdminKeywordPage", () => ({ AdminKeywordPage: () => <div>AdminKeywordPage</div> }));
vi.mock("@/pages/notifications/NotificationSettingsPage", () => ({ NotificationSettingsPage: () => <div>NotificationSettingsPage</div> }));
vi.mock("@/components/layout/RootLayout", () => ({ RootLayout: () => <div>RootLayout</div> }));
vi.mock("@/components/layout/AuthGuard", () => ({ AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

import { router } from "@/app/router";

describe("router", () => {
  it("is defined", () => {
    expect(router).toBeDefined();
    expect(router).not.toBeNull();
  });

  it("has routes array", () => {
    expect(Array.isArray(router.routes)).toBe(true);
    expect(router.routes.length).toBeGreaterThan(0);
  });

  it("contains top-level /auth route", () => {
    const paths = router.routes.map((r) => r.path);
    expect(paths).toContain("/auth");
  });

  it("contains top-level /admin route", () => {
    const paths = router.routes.map((r) => r.path);
    expect(paths).toContain("/admin");
  });

  it("contains a layout route with children", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    expect(layoutRoute).toBeDefined();
    expect(layoutRoute!.children!.length).toBeGreaterThan(0);
  });

  it("contains /board child route under layout", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    const childPaths = layoutRoute!.children!.map((c) => c.path);
    expect(childPaths).toContain("/board");
  });

  it("contains /board/:id child route under layout", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    const childPaths = layoutRoute!.children!.map((c) => c.path);
    expect(childPaths).toContain("/board/:id");
  });

  it("contains /keywords child route under layout", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    const childPaths = layoutRoute!.children!.map((c) => c.path);
    expect(childPaths).toContain("/keywords");
  });

  it("contains /keywords/edit child route under layout", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    const childPaths = layoutRoute!.children!.map((c) => c.path);
    expect(childPaths).toContain("/keywords/edit");
  });

  it("contains /notifications child route under layout", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    const childPaths = layoutRoute!.children!.map((c) => c.path);
    expect(childPaths).toContain("/notifications");
  });

  it("contains /search child route under layout", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    const childPaths = layoutRoute!.children!.map((c) => c.path);
    expect(childPaths).toContain("/search");
  });

  it("contains / root redirect child route under layout", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    const childPaths = layoutRoute!.children!.map((c) => c.path);
    expect(childPaths).toContain("/");
  });

  it("has exactly 2 top-level routes (auth and admin plus layout)", () => {
    // /auth, /admin, and the layout wrapper = 3 total entries
    expect(router.routes.length).toBe(3);
  });

  it("layout route has exactly 7 children", () => {
    const layoutRoute = router.routes.find(
      (r) => r.path === undefined && Array.isArray(r.children)
    );
    expect(layoutRoute!.children!.length).toBe(7);
  });
});

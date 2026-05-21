import { describe, it, expect, vi } from "vitest";

// Mock all page/layout components before importing the router so that
// createBrowserRouter never attempts to render real JSX trees.
vi.mock("@/components/layout/RootLayout", () => ({ RootLayout: () => null }));
vi.mock("@/components/layout/AuthGuard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("@/pages/auth/AuthPage", () => ({ AuthPage: () => null }));
vi.mock("@/pages/keywords/KeywordInputPage", () => ({
  KeywordInputPage: () => null,
}));
vi.mock("@/pages/keywords/KeywordEditPage", () => ({
  KeywordEditPage: () => null,
}));
vi.mock("@/pages/board/BoardPage", () => ({ BoardPage: () => null }));
vi.mock("@/pages/detail/DetailPage", () => ({ DetailPage: () => null }));
vi.mock("@/pages/search/SearchPage", () => ({ SearchPage: () => null }));
vi.mock("@/pages/admin/AdminKeywordPage", () => ({
  AdminKeywordPage: () => null,
}));
vi.mock("@/pages/notifications/NotificationSettingsPage", () => ({
  NotificationSettingsPage: () => null,
}));

import React from "react";
import { router } from "@/app/router";

// Helper: collect every path string from a nested route tree.
function collectPaths(
  routes: Array<{ path?: string; children?: Array<unknown> }>
): string[] {
  const paths: string[] = [];
  for (const route of routes) {
    if (route.path !== undefined) {
      paths.push(route.path);
    }
    if (Array.isArray(route.children)) {
      paths.push(
        ...collectPaths(
          route.children as Array<{ path?: string; children?: Array<unknown> }>
        )
      );
    }
  }
  return paths;
}

describe("router", () => {
  it("exists and is an object", () => {
    expect(router).toBeDefined();
    expect(typeof router).toBe("object");
  });

  it("exposes a routes array", () => {
    expect(Array.isArray(router.routes)).toBe(true);
    expect(router.routes.length).toBeGreaterThan(0);
  });

  it("has exactly 3 top-level route entries", () => {
    expect(router.routes.length).toBe(3);
  });

  it("defines the /auth route at the top level", () => {
    const topLevelPaths = (
      router.routes as Array<{ path?: string }>
    ).map((r) => r.path);
    expect(topLevelPaths).toContain("/auth");
  });

  it("defines the /admin route at the top level", () => {
    const topLevelPaths = (
      router.routes as Array<{ path?: string }>
    ).map((r) => r.path);
    expect(topLevelPaths).toContain("/admin");
  });

  it("third top-level entry has no path but has a children array", () => {
    const thirdRoute = router.routes[2] as {
      path?: string;
      children?: Array<unknown>;
    };
    expect(thirdRoute.path).toBeUndefined();
    expect(Array.isArray(thirdRoute.children)).toBe(true);
    expect((thirdRoute.children as Array<unknown>).length).toBeGreaterThan(0);
  });

  it("defines the /keywords route in children", () => {
    const paths = collectPaths(
      router.routes as Array<{ path?: string; children?: Array<unknown> }>
    );
    expect(paths).toContain("/keywords");
  });

  it("defines the /keywords/edit route in children", () => {
    const paths = collectPaths(
      router.routes as Array<{ path?: string; children?: Array<unknown> }>
    );
    expect(paths).toContain("/keywords/edit");
  });

  it("defines the /notifications route in children", () => {
    const paths = collectPaths(
      router.routes as Array<{ path?: string; children?: Array<unknown> }>
    );
    expect(paths).toContain("/notifications");
  });

  it("defines the /board route in children", () => {
    const paths = collectPaths(
      router.routes as Array<{ path?: string; children?: Array<unknown> }>
    );
    expect(paths).toContain("/board");
  });

  it("defines the /board/:id route in children", () => {
    const paths = collectPaths(
      router.routes as Array<{ path?: string; children?: Array<unknown> }>
    );
    expect(paths).toContain("/board/:id");
  });

  it("defines the /search route in children", () => {
    const paths = collectPaths(
      router.routes as Array<{ path?: string; children?: Array<unknown> }>
    );
    expect(paths).toContain("/search");
  });

  it("defines the root / route in children", () => {
    const paths = collectPaths(
      router.routes as Array<{ path?: string; children?: Array<unknown> }>
    );
    expect(paths).toContain("/");
  });
});

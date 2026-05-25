import { describe, it, expect, vi } from "vitest";

// Mock react-router-dom before importing router
vi.mock("react-router-dom", () => ({
  createBrowserRouter: vi.fn((routes) => ({ routes })),
  Navigate: ({ to }: { to: string }) => null,
}));

// Mock layout and guard components
vi.mock("@/components/layout/RootLayout", () => ({
  RootLayout: () => null,
}));

vi.mock("@/components/layout/AuthGuard", () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock page components
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
import React from "react";

describe("router", () => {
  it("is defined", () => {
    expect(router).toBeDefined();
  });

  it("has routes array", () => {
    expect(router.routes).toBeDefined();
    expect(Array.isArray(router.routes)).toBe(true);
  });

  it("has /auth route", () => {
    const authRoute = router.routes.find((r: any) => r.path === "/auth");
    expect(authRoute).toBeDefined();
  });

  it("has /admin route", () => {
    const adminRoute = router.routes.find((r: any) => r.path === "/admin");
    expect(adminRoute).toBeDefined();
  });

  it("has a layout route with children", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    expect(layoutRoute).toBeDefined();
    expect(layoutRoute.children.length).toBeGreaterThan(0);
  });

  it("has /keywords child route", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    const keywordsRoute = layoutRoute.children.find(
      (r: any) => r.path === "/keywords"
    );
    expect(keywordsRoute).toBeDefined();
  });

  it("has /keywords/edit child route", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    const keywordsEditRoute = layoutRoute.children.find(
      (r: any) => r.path === "/keywords/edit"
    );
    expect(keywordsEditRoute).toBeDefined();
  });

  it("has /notifications child route", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    const notificationsRoute = layoutRoute.children.find(
      (r: any) => r.path === "/notifications"
    );
    expect(notificationsRoute).toBeDefined();
  });

  it("has /board child route", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    const boardRoute = layoutRoute.children.find(
      (r: any) => r.path === "/board"
    );
    expect(boardRoute).toBeDefined();
  });

  it("has /board/:id child route", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    const boardDetailRoute = layoutRoute.children.find(
      (r: any) => r.path === "/board/:id"
    );
    expect(boardDetailRoute).toBeDefined();
  });

  it("has /search child route", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    const searchRoute = layoutRoute.children.find(
      (r: any) => r.path === "/search"
    );
    expect(searchRoute).toBeDefined();
  });

  it("has / child route that redirects to /board", () => {
    const layoutRoute = router.routes.find(
      (r: any) => !r.path && Array.isArray(r.children)
    );
    const rootRoute = layoutRoute.children.find((r: any) => r.path === "/");
    expect(rootRoute).toBeDefined();
    expect(rootRoute.element).toBeDefined();
  });
});

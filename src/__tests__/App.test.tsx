import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "@/app/App";

vi.mock("@/app/router", () => ({
  router: {
    subscribe: vi.fn(() => vi.fn()),
    navigate: vi.fn(),
    state: { location: { pathname: "/", search: "", hash: "", state: null, key: "default" }, matches: [], initialized: true, historyAction: "POP", navigation: { state: "idle" }, revalidation: "idle", loaderData: {}, actionData: null, errors: null, fetchers: new Map(), blockers: new Map() },
    routes: [],
    window: undefined,
    get basename() { return "/"; },
  },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    RouterProvider: () => <div data-testid="router-root">app</div>,
  };
});

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("router-root")).toBeTruthy();
  });

  it("renders the RouterProvider content", () => {
    render(<App />);
    expect(screen.getByText("app")).toBeTruthy();
  });
});

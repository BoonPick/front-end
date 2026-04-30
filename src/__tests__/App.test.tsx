import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { App } from "@/app/App";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    RouterProvider: ({ router }: { router: unknown }) => (
      <div data-testid="router-provider">RouterProvider</div>
    ),
    createBrowserRouter: vi.fn(() => ({})),
  };
});

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="query-client-provider">{children}</div>
    ),
  };
});

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("wraps content in QueryClientProvider", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("query-client-provider")).toBeTruthy();
  });

  it("renders RouterProvider inside QueryClientProvider", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("router-provider")).toBeTruthy();
  });
});

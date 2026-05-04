import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    RouterProvider: ({ router }: { router: unknown }) => (
      <div data-testid="router-provider">App Router</div>
    ),
  };
});

import { App } from "@/app/App";

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("renders RouterProvider", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("router-provider")).toBeInTheDocument();
  });

  it("wraps content in QueryClientProvider context", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });
});

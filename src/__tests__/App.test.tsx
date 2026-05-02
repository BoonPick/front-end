import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { App } from "@/app/App";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    RouterProvider: ({ router: _r }: any) => <div data-testid="router-provider" />,
  };
});

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("mounts a RouterProvider", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("router-provider")).toBeTruthy();
  });
});

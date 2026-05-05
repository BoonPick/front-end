import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  it("renders label text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("renders a label element", () => {
    const { container } = render(<Label>Name</Label>);
    expect(container.querySelector("label")).toBeTruthy();
  });

  it("sets data-slot='label'", () => {
    const { container } = render(<Label>Field</Label>);
    expect(container.querySelector("[data-slot='label']")).toBeTruthy();
  });

  it("associates with an input via htmlFor", () => {
    const { container } = render(
      <>
        <Label htmlFor="my-input">Username</Label>
        <input id="my-input" />
      </>
    );
    const label = container.querySelector("label") as HTMLLabelElement;
    expect(label.htmlFor).toBe("my-input");
  });

  it("applies custom className", () => {
    const { container } = render(<Label className="my-label">Label</Label>);
    const label = container.querySelector("label") as Element;
    expect(label.className).toContain("my-label");
  });

  it("renders with base classes including text-sm", () => {
    const { container } = render(<Label>Test</Label>);
    const label = container.querySelector("label") as Element;
    expect(label.className).toContain("text-sm");
  });
});

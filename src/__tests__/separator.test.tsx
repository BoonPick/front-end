import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
  it("renders a separator element", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toBeTruthy();
  });

  it("sets data-slot='separator'", () => {
    const { container } = render(<Separator />);
    expect(container.querySelector("[data-slot='separator']")).toBeTruthy();
  });

  it("has horizontal orientation by default", () => {
    const { container } = render(<Separator />);
    const sep = container.querySelector("[data-slot='separator']") as Element;
    expect(sep.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("applies vertical orientation when specified", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const sep = container.querySelector("[data-slot='separator']") as Element;
    expect(sep.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("applies custom className", () => {
    const { container } = render(<Separator className="my-separator" />);
    const sep = container.querySelector("[data-slot='separator']") as Element;
    expect(sep.className).toContain("my-separator");
  });

  it("applies shrink-0 base class", () => {
    const { container } = render(<Separator />);
    const sep = container.querySelector("[data-slot='separator']") as Element;
    expect(sep.className).toContain("shrink-0");
  });
});

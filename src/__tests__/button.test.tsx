import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeTruthy();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    fireEvent.click(screen.getByText("Press"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies default variant classes", () => {
    const { container } = render(<Button>Default</Button>);
    const btn = container.querySelector("[data-slot='button']") as Element;
    expect(btn.className).toContain("bg-primary");
  });

  it("applies outline variant classes", () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const btn = container.querySelector("[data-slot='button']") as Element;
    expect(btn.className).toContain("border-border");
  });

  it("applies secondary variant classes", () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const btn = container.querySelector("[data-slot='button']") as Element;
    expect(btn.className).toContain("bg-secondary");
  });

  it("applies destructive variant classes", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const btn = container.querySelector("[data-slot='button']") as Element;
    expect(btn.className).toContain("text-destructive");
  });

  it("applies custom className", () => {
    const { container } = render(<Button className="extra-class">Button</Button>);
    const btn = container.querySelector("[data-slot='button']") as Element;
    expect(btn.className).toContain("extra-class");
  });

  it("sets data-slot='button'", () => {
    const { container } = render(<Button>Test</Button>);
    expect(container.querySelector("[data-slot='button']")).toBeTruthy();
  });
});

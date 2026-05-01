import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeTruthy();
  });

  it("renders as a span by default", () => {
    const { container } = render(<Badge>Label</Badge>);
    expect(container.querySelector("span")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(<Badge className="my-custom-class">Tag</Badge>);
    expect(container.firstChild?.toString()).toBeTruthy();
    expect((container.firstChild as Element).className).toContain("my-custom-class");
  });

  it("renders with default variant classes", () => {
    const { container } = render(<Badge>Default</Badge>);
    const el = container.firstChild as Element;
    expect(el.className).toContain("bg-primary");
  });

  it("renders with secondary variant classes", () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const el = container.firstChild as Element;
    expect(el.className).toContain("bg-secondary");
  });

  it("renders with destructive variant classes", () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    const el = container.firstChild as Element;
    expect(el.className).toContain("text-destructive");
  });

  it("renders with outline variant classes", () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const el = container.firstChild as Element;
    expect(el.className).toContain("border-border");
  });

  it("renders with link variant", () => {
    const { container } = render(<Badge variant="link">Link</Badge>);
    const el = container.firstChild as Element;
    expect(el.className).toContain("text-primary");
    expect(el.className).toContain("underline-offset-4");
  });
});

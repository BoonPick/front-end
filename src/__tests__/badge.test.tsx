import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge, badgeVariants } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders as a span by default", () => {
    const { container } = render(<Badge>Label</Badge>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Badge className="my-badge">Tag</Badge>);
    const el = screen.getByText("Tag");
    expect(el.className).toContain("my-badge");
  });

  it("renders with default variant classes", () => {
    const { container } = render(<Badge>Default</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBeTruthy();
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const el = screen.getByText("Secondary");
    expect(el.className).toContain("bg-secondary");
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const el = screen.getByText("Outline");
    expect(el.className).toContain("border-border");
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Error</Badge>);
    const el = screen.getByText("Error");
    expect(el.className).toContain("destructive");
  });
});

describe("badgeVariants", () => {
  it("returns a non-empty string of classes", () => {
    const classes = badgeVariants({ variant: "default" });
    expect(typeof classes).toBe("string");
    expect(classes.length).toBeGreaterThan(0);
  });

  it("default and secondary variants produce different classes", () => {
    expect(badgeVariants({ variant: "default" })).not.toBe(
      badgeVariants({ variant: "secondary" })
    );
  });
});

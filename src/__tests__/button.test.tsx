import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button, buttonVariants } from "@/components/ui/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    fireEvent.click(screen.getByText("Press"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByText("Disabled").closest("[data-slot='button']")!;
    expect(btn).toHaveAttribute("disabled");
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Disabled</Button>);
    const btn = screen.getByText("Disabled").closest("[data-slot='button']")!;
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<Button className="my-class">Styled</Button>);
    const btn = screen.getByText("Styled").closest("[data-slot='button']")!;
    expect(btn.className).toContain("my-class");
  });

  it("has data-slot='button' attribute", () => {
    render(<Button>Slot</Button>);
    const btn = screen.getByText("Slot").closest("[data-slot='button']");
    expect(btn).toBeInTheDocument();
  });
});

describe("buttonVariants", () => {
  it("returns a string of class names", () => {
    const classes = buttonVariants({ variant: "default", size: "default" });
    expect(typeof classes).toBe("string");
    expect(classes.length).toBeGreaterThan(0);
  });

  it("returns different classes for different variants", () => {
    const defaultClasses = buttonVariants({ variant: "default" });
    const outlineClasses = buttonVariants({ variant: "outline" });
    expect(defaultClasses).not.toBe(outlineClasses);
  });

  it("returns different classes for different sizes", () => {
    const defaultClasses = buttonVariants({ size: "default" });
    const smClasses = buttonVariants({ size: "sm" });
    expect(defaultClasses).not.toBe(smClasses);
  });
});

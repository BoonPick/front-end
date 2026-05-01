import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders an input element", () => {
    const { container } = render(<Input />);
    expect(container.querySelector("input")).toBeTruthy();
  });

  it("sets data-slot='input'", () => {
    const { container } = render(<Input />);
    expect(container.querySelector("[data-slot='input']")).toBeTruthy();
  });

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeTruthy();
  });

  it("renders with type='password'", () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  it("renders with type='text' by default", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("text");
  });

  it("calls onChange when user types", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = render(<Input className="custom-input" />);
    const input = container.querySelector("input") as Element;
    expect(input.className).toContain("custom-input");
  });

  it("respects disabled prop", () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});

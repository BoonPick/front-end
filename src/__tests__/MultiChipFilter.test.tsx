import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";

const OPTIONS = ["정규직", "계약직", "인턴"];

describe("MultiChipFilter", () => {
  it("renders all options as buttons", () => {
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={vi.fn()} />);
    OPTIONS.forEach((opt) => {
      expect(screen.getByText(opt)).toBeTruthy();
    });
  });

  it("selected option has aria-pressed=true", () => {
    render(
      <MultiChipFilter options={OPTIONS} value={["정규직"]} onChange={vi.fn()} />,
    );
    const btn = screen.getByText("정규직").closest("button")!;
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  it("unselected option has aria-pressed=false", () => {
    render(
      <MultiChipFilter options={OPTIONS} value={["정규직"]} onChange={vi.fn()} />,
    );
    const btn = screen.getByText("계약직").closest("button")!;
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });

  it("clicking an unselected option calls onChange with it added", () => {
    const onChange = vi.fn();
    render(
      <MultiChipFilter options={OPTIONS} value={["정규직"]} onChange={onChange} />,
    );
    fireEvent.click(screen.getByText("계약직"));
    expect(onChange).toHaveBeenCalledWith(["정규직", "계약직"]);
  });

  it("clicking a selected option calls onChange with it removed", () => {
    const onChange = vi.fn();
    render(
      <MultiChipFilter options={OPTIONS} value={["정규직"]} onChange={onChange} />,
    );
    fireEvent.click(screen.getByText("정규직"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("renders nothing when options array is empty", () => {
    const { container } = render(
      <MultiChipFilter options={[]} value={[]} onChange={vi.fn()} />,
    );
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  it("all options are aria-pressed=false when value is empty", () => {
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={vi.fn()} />);
    OPTIONS.forEach((opt) => {
      const btn = screen.getByText(opt).closest("button")!;
      expect(btn.getAttribute("aria-pressed")).toBe("false");
    });
  });
});

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";

describe("MultiChipFilter", () => {
  const options = ["정규직", "계약직", "인턴"];

  it("renders all options as buttons", () => {
    render(<MultiChipFilter options={options} value={[]} onChange={vi.fn()} />);
    expect(screen.getByText("정규직")).toBeTruthy();
    expect(screen.getByText("계약직")).toBeTruthy();
    expect(screen.getByText("인턴")).toBeTruthy();
  });

  it("renders nothing when options is empty", () => {
    const { container } = render(
      <MultiChipFilter options={[]} value={[]} onChange={vi.fn()} />
    );
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  it("marks selected option with aria-pressed=true", () => {
    render(
      <MultiChipFilter options={options} value={["정규직"]} onChange={vi.fn()} />
    );
    const btn = screen.getByText("정규직").closest("button");
    expect(btn?.getAttribute("aria-pressed")).toBe("true");
  });

  it("marks unselected option with aria-pressed=false", () => {
    render(
      <MultiChipFilter options={options} value={["정규직"]} onChange={vi.fn()} />
    );
    const btn = screen.getByText("계약직").closest("button");
    expect(btn?.getAttribute("aria-pressed")).toBe("false");
  });

  it("calls onChange with option added when unselected option is clicked", () => {
    const onChange = vi.fn();
    render(
      <MultiChipFilter options={options} value={["정규직"]} onChange={onChange} />
    );
    fireEvent.click(screen.getByText("계약직"));
    expect(onChange).toHaveBeenCalledWith(["정규직", "계약직"]);
  });

  it("calls onChange with option removed when selected option is clicked", () => {
    const onChange = vi.fn();
    render(
      <MultiChipFilter options={options} value={["정규직", "계약직"]} onChange={onChange} />
    );
    fireEvent.click(screen.getByText("정규직"));
    expect(onChange).toHaveBeenCalledWith(["계약직"]);
  });

  it("calls onChange with empty array when only selected option is deselected", () => {
    const onChange = vi.fn();
    render(
      <MultiChipFilter options={options} value={["인턴"]} onChange={onChange} />
    );
    fireEvent.click(screen.getByText("인턴"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("does not call onChange on render", () => {
    const onChange = vi.fn();
    render(<MultiChipFilter options={options} value={[]} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });
});

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";

const OPTIONS = ["개발(IT)", "마케팅", "디자인"];

describe("MultiChipFilter", () => {
  it("renders all options", () => {
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={vi.fn()} />);
    OPTIONS.forEach((opt) => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it("sets aria-pressed=false for unselected options", () => {
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={vi.fn()} />);
    const btn = screen.getByText("개발(IT)").closest("button")!;
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("sets aria-pressed=true for selected options", () => {
    render(<MultiChipFilter options={OPTIONS} value={["마케팅"]} onChange={vi.fn()} />);
    const btn = screen.getByText("마케팅").closest("button")!;
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onChange with added option when unselected chip is clicked", () => {
    const onChange = vi.fn();
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("개발(IT)"));
    expect(onChange).toHaveBeenCalledWith(["개발(IT)"]);
  });

  it("calls onChange without option when selected chip is clicked", () => {
    const onChange = vi.fn();
    render(<MultiChipFilter options={OPTIONS} value={["개발(IT)", "디자인"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("개발(IT)"));
    expect(onChange).toHaveBeenCalledWith(["디자인"]);
  });

  it("does not call onChange when not clicked", () => {
    const onChange = vi.fn();
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders no buttons when options is empty", () => {
    render(<MultiChipFilter options={[]} value={[]} onChange={vi.fn()} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders correct number of buttons", () => {
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(OPTIONS.length);
  });
});

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";

const OPTIONS = ["개발", "기획", "디자인", "마케팅"];

describe("MultiChipFilter", () => {
  it("renders all option buttons", () => {
    render(<MultiChipFilter options={OPTIONS} value={[]} onChange={vi.fn()} />);
    OPTIONS.forEach((opt) => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it("marks selected options with aria-pressed=true", () => {
    render(<MultiChipFilter options={OPTIONS} value={["개발"]} onChange={vi.fn()} />);
    const devBtn = screen.getByText("개발").closest("button")!;
    expect(devBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("marks unselected options with aria-pressed=false", () => {
    render(<MultiChipFilter options={OPTIONS} value={["개발"]} onChange={vi.fn()} />);
    const planBtn = screen.getByText("기획").closest("button")!;
    expect(planBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with new value when unselected option is clicked", () => {
    const onChange = vi.fn();
    render(<MultiChipFilter options={OPTIONS} value={["개발"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("기획"));
    expect(onChange).toHaveBeenCalledWith(["개발", "기획"]);
  });

  it("calls onChange removing item when selected option is clicked", () => {
    const onChange = vi.fn();
    render(<MultiChipFilter options={OPTIONS} value={["개발", "기획"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("개발"));
    expect(onChange).toHaveBeenCalledWith(["기획"]);
  });

  it("renders nothing when options array is empty", () => {
    const { container } = render(<MultiChipFilter options={[]} value={[]} onChange={vi.fn()} />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("renders single option correctly", () => {
    render(<MultiChipFilter options={["개발"]} value={[]} onChange={vi.fn()} />);
    expect(screen.getByText("개발")).toBeInTheDocument();
  });

  it("all options selected shows all as aria-pressed=true", () => {
    render(<MultiChipFilter options={["A", "B"]} value={["A", "B"]} onChange={vi.fn()} />);
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toHaveAttribute("aria-pressed", "true");
    });
  });
});

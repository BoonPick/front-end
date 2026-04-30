import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";

describe("MultiChipFilter", () => {
  const options = ["IT", "마케팅", "디자인"];
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it("renders all option buttons", () => {
    render(<MultiChipFilter options={options} value={[]} onChange={onChange} />);
    options.forEach((opt) => {
      expect(screen.getByText(opt)).toBeTruthy();
    });
  });

  it("renders correct number of buttons", () => {
    render(<MultiChipFilter options={options} value={[]} onChange={onChange} />);
    expect(screen.getAllByRole("button")).toHaveLength(options.length);
  });

  it("sets aria-pressed=true for selected options", () => {
    render(<MultiChipFilter options={options} value={["IT"]} onChange={onChange} />);
    const itButton = screen.getByText("IT").closest("button");
    expect(itButton!.getAttribute("aria-pressed")).toBe("true");
  });

  it("sets aria-pressed=false for unselected options", () => {
    render(<MultiChipFilter options={options} value={[]} onChange={onChange} />);
    const itButton = screen.getByText("IT").closest("button");
    expect(itButton!.getAttribute("aria-pressed")).toBe("false");
  });

  it("calls onChange with added item when unselected option is clicked", () => {
    render(<MultiChipFilter options={options} value={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("IT"));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toContain("IT");
  });

  it("calls onChange without item when selected option is clicked", () => {
    render(<MultiChipFilter options={options} value={["IT"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("IT"));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).not.toContain("IT");
  });

  it("preserves other selected values when toggling one on", () => {
    render(<MultiChipFilter options={options} value={["마케팅"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("IT"));
    const newValue: string[] = onChange.mock.calls[0][0];
    expect(newValue).toContain("마케팅");
    expect(newValue).toContain("IT");
  });

  it("preserves other selected values when toggling one off", () => {
    render(<MultiChipFilter options={options} value={["IT", "디자인"]} onChange={onChange} />);
    fireEvent.click(screen.getByText("IT"));
    const newValue: string[] = onChange.mock.calls[0][0];
    expect(newValue).toContain("디자인");
    expect(newValue).not.toContain("IT");
  });

  it("renders nothing when options array is empty", () => {
    render(<MultiChipFilter options={[]} value={[]} onChange={onChange} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";

describe("MultiChipFilter", () => {
  const options = ["React", "TypeScript", "Vue"];

  it("renders all options as buttons", () => {
    render(<MultiChipFilter options={options} value={[]} onChange={vi.fn()} />);
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
    expect(screen.getByText("Vue")).toBeTruthy();
  });

  it("marks selected options with aria-pressed=true", () => {
    render(
      <MultiChipFilter options={options} value={["React"]} onChange={vi.fn()} />
    );
    const reactBtn = screen.getByText("React").closest("button");
    expect(reactBtn?.getAttribute("aria-pressed")).toBe("true");
  });

  it("marks unselected options with aria-pressed=false", () => {
    render(
      <MultiChipFilter options={options} value={["React"]} onChange={vi.fn()} />
    );
    const tsBtn = screen.getByText("TypeScript").closest("button");
    expect(tsBtn?.getAttribute("aria-pressed")).toBe("false");
  });

  it("calls onChange with option added when unselected option is clicked", () => {
    const onChange = vi.fn();
    render(
      <MultiChipFilter options={options} value={["React"]} onChange={onChange} />
    );
    fireEvent.click(screen.getByText("TypeScript"));
    expect(onChange).toHaveBeenCalledWith(["React", "TypeScript"]);
  });

  it("calls onChange with option removed when selected option is clicked", () => {
    const onChange = vi.fn();
    render(
      <MultiChipFilter options={options} value={["React", "Vue"]} onChange={onChange} />
    );
    fireEvent.click(screen.getByText("React"));
    expect(onChange).toHaveBeenCalledWith(["Vue"]);
  });

  it("renders empty when options array is empty", () => {
    const { container } = render(
      <MultiChipFilter options={[]} value={[]} onChange={vi.fn()} />
    );
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  it("all options are aria-pressed=false when value is empty", () => {
    render(<MultiChipFilter options={options} value={[]} onChange={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn.getAttribute("aria-pressed")).toBe("false");
    });
  });

  it("all options are aria-pressed=true when all are selected", () => {
    render(
      <MultiChipFilter options={options} value={options} onChange={vi.fn()} />
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn.getAttribute("aria-pressed")).toBe("true");
    });
  });
});

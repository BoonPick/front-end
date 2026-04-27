import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KeywordChip } from "@/components/common/KeywordChip";

describe("KeywordChip", () => {
  it("renders the keyword text", () => {
    render(<KeywordChip keyword="React" />);
    expect(screen.getByText("React")).toBeTruthy();
  });

  it("calls onClick when badge is clicked", () => {
    const onClick = vi.fn();
    render(<KeywordChip keyword="TypeScript" onClick={onClick} />);
    fireEvent.click(screen.getByText("TypeScript"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders remove button when onRemove is provided", () => {
    const onRemove = vi.fn();
    render(<KeywordChip keyword="Vue" onRemove={onRemove} />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("does not render remove button when onRemove is absent", () => {
    render(<KeywordChip keyword="Angular" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("calls onRemove when remove button is clicked", () => {
    const onRemove = vi.fn();
    render(<KeywordChip keyword="Svelte" onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("remove button click does not propagate to badge onClick", () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(<KeywordChip keyword="Next.js" onClick={onClick} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders the chip with outline variant without errors", () => {
    const { container } = render(<KeywordChip keyword="Python" variant="outline" />);
    expect(container.firstChild).toBeTruthy();
  });
});

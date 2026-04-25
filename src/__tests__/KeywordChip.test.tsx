import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KeywordChip } from "@/components/common/KeywordChip";

describe("KeywordChip", () => {
  it("renders the keyword text", () => {
    render(<KeywordChip keyword="AI" />);
    expect(screen.getByText("AI")).toBeInTheDocument();
  });

  it("shows remove button when onRemove is provided", () => {
    render(<KeywordChip keyword="ML" onRemove={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not show remove button when onRemove is not provided", () => {
    render(<KeywordChip keyword="ML" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("calls onRemove when X button is clicked", () => {
    const onRemove = vi.fn();
    render(<KeywordChip keyword="React" onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when the chip is clicked", () => {
    const onClick = vi.fn();
    render(<KeywordChip keyword="TypeScript" onClick={onClick} />);
    fireEvent.click(screen.getByText("TypeScript"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("X button click does not bubble to onClick", () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(<KeywordChip keyword="Node" onClick={onClick} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses default variant when none specified", () => {
    const { container } = render(<KeywordChip keyword="Go" />);
    expect(container.firstChild).toBeTruthy();
  });
});

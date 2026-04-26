import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KeywordChip } from "@/components/common/KeywordChip";

describe("KeywordChip", () => {
  it("renders the keyword text", () => {
    render(<KeywordChip keyword="React" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("shows remove button when onRemove is provided", () => {
    render(<KeywordChip keyword="Node" onRemove={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not show remove button when onRemove is not provided", () => {
    render(<KeywordChip keyword="Python" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRemove when X button is clicked", () => {
    const onRemove = vi.fn();
    render(<KeywordChip keyword="Vue" onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("does not bubble click to onClick when X is clicked", () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(<KeywordChip keyword="Angular" onClick={onClick} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onClick when badge is clicked", () => {
    const onClick = vi.fn();
    render(<KeywordChip keyword="TypeScript" onClick={onClick} />);
    fireEvent.click(screen.getByText("TypeScript"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

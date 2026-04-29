import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ExpiredFilterToggle } from "@/components/common/ExpiredFilterToggle";

describe("ExpiredFilterToggle", () => {
  it("renders checkbox and label text", () => {
    render(<ExpiredFilterToggle checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("마감·오래된 게시물 포함")).toBeInTheDocument();
  });

  it("checkbox reflects checked=false", () => {
    render(<ExpiredFilterToggle checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("checkbox reflects checked=true", () => {
    render(<ExpiredFilterToggle checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange with true when checked", () => {
    const onChange = vi.fn();
    render(<ExpiredFilterToggle checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when unchecked", () => {
    const onChange = vi.fn();
    render(<ExpiredFilterToggle checked={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not call onChange when not interacted with", () => {
    const onChange = vi.fn();
    render(<ExpiredFilterToggle checked={false} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });
});

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Pagination } from "@/components/common/Pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = render(
      <Pagination page={1} totalPages={0} onChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders page buttons for small totalPages", () => {
    render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onChange with previous page on prev button click", () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("이전 페이지"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("calls onChange with next page on next button click", () => {
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("다음 페이지"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("disables prev button on first page", () => {
    render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText("이전 페이지")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<Pagination page={5} totalPages={5} onChange={vi.fn()} />);
    expect(screen.getByLabelText("다음 페이지")).toBeDisabled();
  });

  it("calls onChange with the correct page number when clicking a page button", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByText("3"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("shows ellipsis for large page counts", () => {
    render(<Pagination page={5} totalPages={20} onChange={vi.fn()} />);
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });

  it("always shows first and last page for large page counts", () => {
    render(<Pagination page={10} totalPages={20} onChange={vi.fn()} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("marks current page with aria-current", () => {
    render(<Pagination page={3} totalPages={5} onChange={vi.fn()} />);
    const currentBtn = screen.getByText("3").closest("button");
    expect(currentBtn).toHaveAttribute("aria-current", "page");
  });
});

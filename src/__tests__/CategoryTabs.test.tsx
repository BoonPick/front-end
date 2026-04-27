import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryTabs } from "@/components/common/CategoryTabs";

describe("CategoryTabs", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it("renders all category tab options", () => {
    render(<CategoryTabs value="all" onChange={onChange} />);
    expect(screen.getByText("전체")).toBeTruthy();
    expect(screen.getByText("추천")).toBeTruthy();
    expect(screen.getByText("채용")).toBeTruthy();
    expect(screen.getByText("공지")).toBeTruthy();
    expect(screen.getByText("장학금")).toBeTruthy();
  });

  it("renders 5 tab triggers", () => {
    render(<CategoryTabs value="all" onChange={onChange} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(5);
  });

  it("marks the active value tab with data-active attribute", () => {
    render(<CategoryTabs value="job" onChange={onChange} />);
    const jobTab = screen.getByText("채용").closest("[role='tab']");
    expect(jobTab).toBeTruthy();
    expect(jobTab!.getAttribute("data-active")).not.toBeNull();
  });

  it("calls onChange with the tab value when a tab is clicked", () => {
    render(<CategoryTabs value="all" onChange={onChange} />);
    fireEvent.click(screen.getByText("추천"));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toBe("recommendation");
  });

  it("calls onChange with 'job' when 채용 tab is clicked", () => {
    render(<CategoryTabs value="all" onChange={onChange} />);
    fireEvent.click(screen.getByText("채용"));
    expect(onChange.mock.calls[0][0]).toBe("job");
  });

  it("calls onChange with 'scholarship' when 장학금 tab is clicked", () => {
    render(<CategoryTabs value="all" onChange={onChange} />);
    fireEvent.click(screen.getByText("장학금"));
    expect(onChange.mock.calls[0][0]).toBe("scholarship");
  });
});

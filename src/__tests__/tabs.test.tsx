import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function renderTabs() {
  return render(
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders tab triggers", () => {
    renderTabs();
    expect(screen.getByText("Tab 1")).toBeTruthy();
    expect(screen.getByText("Tab 2")).toBeTruthy();
  });

  it("renders active tab content", () => {
    renderTabs();
    expect(screen.getByText("Content 1")).toBeTruthy();
  });

  it("sets data-slot='tabs' on root", () => {
    const { container } = renderTabs();
    expect(container.querySelector("[data-slot='tabs']")).toBeTruthy();
  });

  it("sets data-slot='tabs-list' on list", () => {
    const { container } = renderTabs();
    expect(container.querySelector("[data-slot='tabs-list']")).toBeTruthy();
  });

  it("sets data-slot='tabs-trigger' on triggers", () => {
    const { container } = renderTabs();
    const triggers = container.querySelectorAll("[data-slot='tabs-trigger']");
    expect(triggers.length).toBe(2);
  });

  it("sets data-slot='tabs-content' on panels", () => {
    const { container } = renderTabs();
    const panels = container.querySelectorAll("[data-slot='tabs-content']");
    expect(panels.length).toBeGreaterThan(0);
  });

  it("applies horizontal orientation by default", () => {
    const { container } = renderTabs();
    const tabs = container.querySelector("[data-slot='tabs']") as Element;
    expect(tabs.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("applies default variant class on TabsList", () => {
    const { container } = renderTabs();
    const list = container.querySelector("[data-slot='tabs-list']") as Element;
    expect(list.getAttribute("data-variant")).toBe("default");
  });
});

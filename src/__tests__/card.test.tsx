import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card Body</Card>);
    expect(screen.getByText("Card Body")).toBeTruthy();
  });

  it("sets data-slot='card'", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector("[data-slot='card']")).toBeTruthy();
  });

  it("applies default size", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector("[data-slot='card']") as Element;
    expect(card.getAttribute("data-size")).toBe("default");
  });

  it("applies sm size", () => {
    const { container } = render(<Card size="sm">Content</Card>);
    const card = container.querySelector("[data-slot='card']") as Element;
    expect(card.getAttribute("data-size")).toBe("sm");
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="my-card">Content</Card>);
    const card = container.querySelector("[data-slot='card']") as Element;
    expect(card.className).toContain("my-card");
  });
});

describe("CardHeader", () => {
  it("renders children and sets data-slot", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toBeTruthy();
    const { container } = render(<CardHeader />);
    expect(container.querySelector("[data-slot='card-header']")).toBeTruthy();
  });
});

describe("CardTitle", () => {
  it("renders title text", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title")).toBeTruthy();
  });

  it("sets data-slot='card-title'", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector("[data-slot='card-title']")).toBeTruthy();
  });
});

describe("CardDescription", () => {
  it("renders description text", () => {
    render(<CardDescription>Some description</CardDescription>);
    expect(screen.getByText("Some description")).toBeTruthy();
  });

  it("sets data-slot='card-description'", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    expect(container.querySelector("[data-slot='card-description']")).toBeTruthy();
  });
});

describe("CardContent", () => {
  it("renders content", () => {
    render(<CardContent>Body content</CardContent>);
    expect(screen.getByText("Body content")).toBeTruthy();
  });

  it("sets data-slot='card-content'", () => {
    const { container } = render(<CardContent />);
    expect(container.querySelector("[data-slot='card-content']")).toBeTruthy();
  });
});

describe("CardFooter", () => {
  it("renders footer", () => {
    render(<CardFooter>Footer text</CardFooter>);
    expect(screen.getByText("Footer text")).toBeTruthy();
  });

  it("sets data-slot='card-footer'", () => {
    const { container } = render(<CardFooter />);
    expect(container.querySelector("[data-slot='card-footer']")).toBeTruthy();
  });
});

describe("CardAction", () => {
  it("renders action content", () => {
    render(<CardAction>Action</CardAction>);
    expect(screen.getByText("Action")).toBeTruthy();
  });

  it("sets data-slot='card-action'", () => {
    const { container } = render(<CardAction />);
    expect(container.querySelector("[data-slot='card-action']")).toBeTruthy();
  });
});

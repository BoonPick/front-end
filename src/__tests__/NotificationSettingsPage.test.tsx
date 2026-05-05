import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
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
  it("renders children inside a div with data-slot=card", () => {
    const { container } = render(<Card>Content</Card>);
    const el = container.querySelector("[data-slot='card']");
    expect(el).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="my-card">Test</Card>);
    const el = container.querySelector("[data-slot='card']")!;
    expect(el.className).toContain("my-card");
  });

  it("renders with default size by default", () => {
    const { container } = render(<Card>Default</Card>);
    const el = container.querySelector("[data-slot='card']")!;
    expect(el).toHaveAttribute("data-size", "default");
  });

  it("renders with sm size when size=sm is passed", () => {
    const { container } = render(<Card size="sm">Small</Card>);
    const el = container.querySelector("[data-slot='card']")!;
    expect(el).toHaveAttribute("data-size", "sm");
  });
});

describe("CardHeader", () => {
  it("renders with data-slot=card-header", () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(container.querySelector("[data-slot='card-header']")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<CardHeader className="h-custom">H</CardHeader>);
    const el = container.querySelector("[data-slot='card-header']")!;
    expect(el.className).toContain("h-custom");
  });
});

describe("CardTitle", () => {
  it("renders children with data-slot=card-title", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("uses a div element", () => {
    const { container } = render(<CardTitle>T</CardTitle>);
    expect(container.querySelector("div[data-slot='card-title']")).toBeInTheDocument();
  });
});

describe("CardDescription", () => {
  it("renders children", () => {
    render(<CardDescription>Some description</CardDescription>);
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("has data-slot=card-description", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    expect(container.querySelector("[data-slot='card-description']")).toBeInTheDocument();
  });
});

describe("CardContent", () => {
  it("renders children with data-slot=card-content", () => {
    render(<CardContent>Body</CardContent>);
    expect(screen.getByText("Body")).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders with data-slot=card-footer", () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    expect(container.querySelector("[data-slot='card-footer']")).toBeInTheDocument();
  });
});

describe("CardAction", () => {
  it("renders with data-slot=card-action", () => {
    const { container } = render(<CardAction>Action</CardAction>);
    expect(container.querySelector("[data-slot='card-action']")).toBeInTheDocument();
  });
});

describe("Card composition", () => {
  it("renders full card with header, content, and footer", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (className merge utility)", () => {
  it("returns a single class name unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting tailwind classes (last wins)", () => {
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });

  it("handles conditional classes with falsy values", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toBe("base extra");
  });

  it("handles undefined and null gracefully", () => {
    const result = cn("base", undefined, null as never, "end");
    expect(result).toBe("base end");
  });

  it("handles array inputs", () => {
    const result = cn(["foo", "bar"]);
    expect(result).toContain("foo");
    expect(result).toContain("bar");
  });

  it("handles object syntax for conditional classes", () => {
    const result = cn({ active: true, inactive: false });
    expect(result).toBe("active");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("merges text color utilities correctly (last wins)", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });
});

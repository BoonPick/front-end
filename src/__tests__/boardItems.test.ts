import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";

const VALID_CATEGORIES = ["job", "announcement", "scholarship"] as const;

describe("mockBoardItems", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("has exactly 15 items", () => {
    expect(mockBoardItems).toHaveLength(15);
  });

  it("every item has a non-empty string id", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);
    }
  });

  it("all item ids are unique", () => {
    const ids = mockBoardItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item has a valid category", () => {
    for (const item of mockBoardItems) {
      expect(VALID_CATEGORIES).toContain(item.category);
    }
  });

  it("every item has a non-empty title string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty summary string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.summary).toBe("string");
      expect(item.summary.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty body string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.body).toBe("string");
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty source string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.source).toBe("string");
      expect(item.source.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty sourceUrl string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.sourceUrl).toBe("string");
      expect(item.sourceUrl.length).toBeGreaterThan(0);
    }
  });

  it("every item has a date string in YYYY-MM-DD format", () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    for (const item of mockBoardItems) {
      expect(typeof item.date).toBe("string");
      expect(item.date).toMatch(datePattern);
    }
  });

  it("every item has a keywords array with at least one string entry", () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThan(0);
      for (const kw of item.keywords) {
        expect(typeof kw).toBe("string");
      }
    }
  });

  it("optional fields are undefined, null, or a string when present", () => {
    const optionalFields = [
      "employment",
      "workType",
      "duty",
      "deadline",
    ] as const;
    for (const item of mockBoardItems) {
      for (const field of optionalFields) {
        const value = item[field];
        if (value !== undefined) {
          expect(value === null || typeof value === "string").toBe(true);
        }
      }
    }
  });

  it("optional isAlwaysOpen field is undefined, null, or boolean when present", () => {
    for (const item of mockBoardItems) {
      if (item.isAlwaysOpen !== undefined) {
        expect(
          item.isAlwaysOpen === null || typeof item.isAlwaysOpen === "boolean"
        ).toBe(true);
      }
    }
  });

  it("contains items of each valid category", () => {
    const categories = new Set(mockBoardItems.map((i) => i.category));
    expect(categories.has("job")).toBe(true);
    expect(categories.has("scholarship")).toBe(true);
    expect(categories.has("announcement")).toBe(true);
  });

  it("first item matches expected shape", () => {
    const first = mockBoardItems[0];
    expect(first.id).toBe("1");
    expect(first.category).toBe("job");
    expect(first.title).toBe("2026년 상반기 9급 공무원 공개채용");
    expect(first.source).toBe("인사혁신처");
    expect(first.sourceUrl).toBe("https://example.com/gosi");
    expect(first.date).toBe("2026-03-15");
    expect(first.keywords).toContain("공무원");
  });

  it("last item (id 15) matches expected shape", () => {
    const last = mockBoardItems[mockBoardItems.length - 1];
    expect(last.id).toBe("15");
    expect(last.category).toBe("announcement");
    expect(last.source).toBe("고용노동부");
    expect(last.date).toBe("2026-03-17");
  });
});

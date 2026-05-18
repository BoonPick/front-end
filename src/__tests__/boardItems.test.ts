import { describe, it, expect } from "vitest";
import { mockBoardItems } from "../mocks/boardItems";

describe("mockBoardItems", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("contains 15 items", () => {
    expect(mockBoardItems).toHaveLength(15);
  });

  it("every item has a non-empty string id", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);
    }
  });

  it("every item has a valid category", () => {
    const validCategories = new Set(["job", "announcement", "scholarship"]);
    for (const item of mockBoardItems) {
      expect(validCategories.has(item.category)).toBe(true);
    }
  });

  it("every item has a non-empty title", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty summary", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.summary).toBe("string");
      expect(item.summary.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty body", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.body).toBe("string");
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty source", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.source).toBe("string");
      expect(item.source.length).toBeGreaterThan(0);
    }
  });

  it("every item has a sourceUrl starting with 'https://'", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.sourceUrl).toBe("string");
      expect(item.sourceUrl.startsWith("https://")).toBe(true);
    }
  });

  it("every item has a date string in YYYY-MM-DD format", () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    for (const item of mockBoardItems) {
      expect(typeof item.date).toBe("string");
      expect(datePattern.test(item.date)).toBe(true);
    }
  });

  it("every item has a keywords array", () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
    }
  });

  it("every keyword in each item is a non-empty string", () => {
    for (const item of mockBoardItems) {
      for (const kw of item.keywords) {
        expect(typeof kw).toBe("string");
        expect(kw.length).toBeGreaterThan(0);
      }
    }
  });

  it("all item ids are unique", () => {
    const ids = mockBoardItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(mockBoardItems.length);
  });

  it("contains items from all three categories", () => {
    const categories = new Set(mockBoardItems.map((item) => item.category));
    expect(categories.has("job")).toBe(true);
    expect(categories.has("announcement")).toBe(true);
    expect(categories.has("scholarship")).toBe(true);
  });

  it("optional fields, when present, are string, boolean, or null", () => {
    for (const item of mockBoardItems) {
      if (item.employment !== undefined) {
        expect(
          typeof item.employment === "string" || item.employment === null
        ).toBe(true);
      }
      if (item.workType !== undefined) {
        expect(
          typeof item.workType === "string" || item.workType === null
        ).toBe(true);
      }
      if (item.duty !== undefined) {
        expect(typeof item.duty === "string" || item.duty === null).toBe(true);
      }
      if (item.deadline !== undefined) {
        expect(
          typeof item.deadline === "string" || item.deadline === null
        ).toBe(true);
      }
      if (item.isAlwaysOpen !== undefined) {
        expect(
          typeof item.isAlwaysOpen === "boolean" || item.isAlwaysOpen === null
        ).toBe(true);
      }
    }
  });

  it("first item has the expected shape and values", () => {
    const first = mockBoardItems[0];
    expect(first.id).toBe("1");
    expect(first.category).toBe("job");
    expect(first.source).toBe("인사혁신처");
    expect(first.date).toBe("2026-03-15");
    expect(first.keywords).toContain("공무원");
  });
});

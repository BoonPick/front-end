import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";

describe("mockBoardItems", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("each item has required BoardItem fields", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(typeof item.title).toBe("string");
      expect(typeof item.summary).toBe("string");
      expect(typeof item.body).toBe("string");
      expect(typeof item.source).toBe("string");
      expect(typeof item.sourceUrl).toBe("string");
      expect(typeof item.date).toBe("string");
      expect(Array.isArray(item.keywords)).toBe(true);
    }
  });

  it("each item has a valid category", () => {
    const valid = new Set(["job", "announcement", "scholarship"]);
    for (const item of mockBoardItems) {
      expect(valid.has(item.category)).toBe(true);
    }
  });

  it("contains items of all three categories", () => {
    const categories = new Set(mockBoardItems.map((i) => i.category));
    expect(categories.has("job")).toBe(true);
    expect(categories.has("announcement")).toBe(true);
    expect(categories.has("scholarship")).toBe(true);
  });

  it("all ids are unique", () => {
    const ids = mockBoardItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("date fields match YYYY-MM-DD format", () => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    for (const item of mockBoardItems) {
      expect(re.test(item.date)).toBe(true);
    }
  });

  it("sourceUrl fields start with http", () => {
    for (const item of mockBoardItems) {
      expect(item.sourceUrl.startsWith("http")).toBe(true);
    }
  });

  it("keywords are arrays of strings", () => {
    for (const item of mockBoardItems) {
      for (const kw of item.keywords) {
        expect(typeof kw).toBe("string");
      }
    }
  });
});

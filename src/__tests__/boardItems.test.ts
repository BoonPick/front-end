import { describe, it, expect } from "vitest";
import { mockBoardItems } from "../mocks/boardItems";

describe("mockBoardItems", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("every item has a non-empty string id", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);
    }
  });

  it("every item has a valid category", () => {
    const validCategories = ["job", "announcement", "scholarship"];
    for (const item of mockBoardItems) {
      expect(validCategories).toContain(item.category);
    }
  });

  it("every item has a non-empty string title", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty string summary", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.summary).toBe("string");
      expect(item.summary.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty string body", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.body).toBe("string");
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty string source", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.source).toBe("string");
      expect(item.source.length).toBeGreaterThan(0);
    }
  });

  it("every item has a non-empty string sourceUrl", () => {
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

  it("every item has a keywords array", () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
    }
  });

  it("every keyword in every item is a non-empty string", () => {
    for (const item of mockBoardItems) {
      for (const keyword of item.keywords) {
        expect(typeof keyword).toBe("string");
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it("all item ids are unique", () => {
    const ids = mockBoardItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("contains items of each valid category", () => {
    const categories = mockBoardItems.map((item) => item.category);
    expect(categories).toContain("job");
    expect(categories).toContain("announcement");
    expect(categories).toContain("scholarship");
  });
});

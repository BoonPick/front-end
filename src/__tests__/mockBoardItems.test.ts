import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";

describe("mockBoardItems", () => {
  it("is defined", () => {
    expect(mockBoardItems).toBeDefined();
  });

  it("is an array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
  });

  it("is non-empty", () => {
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("contains 15 items", () => {
    expect(mockBoardItems).toHaveLength(15);
  });

  it("every item has a non-empty string id", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);
    });
  });

  it("every item has a valid category", () => {
    const validCategories = ["job", "scholarship", "announcement"];
    mockBoardItems.forEach((item) => {
      expect(validCategories).toContain(item.category);
    });
  });

  it("every item has a non-empty string title", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);
    });
  });

  it("every item has a non-empty string summary", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.summary).toBe("string");
      expect(item.summary.length).toBeGreaterThan(0);
    });
  });

  it("every item has a non-empty string body", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.body).toBe("string");
      expect(item.body.length).toBeGreaterThan(0);
    });
  });

  it("every item has a non-empty string source", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.source).toBe("string");
      expect(item.source.length).toBeGreaterThan(0);
    });
  });

  it("every item has a non-empty string sourceUrl", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.sourceUrl).toBe("string");
      expect(item.sourceUrl.length).toBeGreaterThan(0);
    });
  });

  it("every item has a non-empty string date", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.date).toBe("string");
      expect(item.date.length).toBeGreaterThan(0);
    });
  });

  it("every item has a keywords array", () => {
    mockBoardItems.forEach((item) => {
      expect(Array.isArray(item.keywords)).toBe(true);
    });
  });

  it("every item's keywords array contains only strings", () => {
    mockBoardItems.forEach((item) => {
      item.keywords.forEach((keyword) => {
        expect(typeof keyword).toBe("string");
      });
    });
  });

  it("all ids are unique", () => {
    const ids = mockBoardItems.map((item) => item.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(mockBoardItems.length);
  });

  it("contains items of all three categories", () => {
    const categories = mockBoardItems.map((item) => item.category);
    expect(categories).toContain("job");
    expect(categories).toContain("scholarship");
    expect(categories).toContain("announcement");
  });

  it("first item matches expected shape", () => {
    const first = mockBoardItems[0];
    expect(first.id).toBe("1");
    expect(first.category).toBe("job");
    expect(typeof first.title).toBe("string");
    expect(typeof first.summary).toBe("string");
    expect(typeof first.body).toBe("string");
    expect(typeof first.source).toBe("string");
    expect(typeof first.sourceUrl).toBe("string");
    expect(typeof first.date).toBe("string");
    expect(Array.isArray(first.keywords)).toBe(true);
  });
});

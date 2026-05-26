import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";

const VALID_CATEGORIES = ["job", "announcement", "scholarship"] as const;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const URL_REGEX = /^https?:\/\/.+/;

describe("mockBoardItems", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("each item has an id that is a non-empty string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);
    }
  });

  it("all item ids are unique", () => {
    const ids = mockBoardItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each item has a valid category", () => {
    for (const item of mockBoardItems) {
      expect(VALID_CATEGORIES).toContain(item.category);
    }
  });

  it("each item has a title that is a non-empty string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it("each item has a summary that is a non-empty string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.summary).toBe("string");
      expect(item.summary.length).toBeGreaterThan(0);
    }
  });

  it("each item has a body that is a non-empty string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.body).toBe("string");
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("each item has a source that is a non-empty string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.source).toBe("string");
      expect(item.source.length).toBeGreaterThan(0);
    }
  });

  it("each item has a sourceUrl that is a valid URL string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.sourceUrl).toBe("string");
      expect(item.sourceUrl).toMatch(URL_REGEX);
    }
  });

  it("each item has a date in YYYY-MM-DD format", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.date).toBe("string");
      expect(item.date).toMatch(DATE_REGEX);
    }
  });

  it("each item has a keywords array", () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
    }
  });

  it("each keyword in every item is a non-empty string", () => {
    for (const item of mockBoardItems) {
      for (const keyword of item.keywords) {
        expect(typeof keyword).toBe("string");
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it("no required fields are null or undefined", () => {
    for (const item of mockBoardItems) {
      expect(item.id).not.toBeNull();
      expect(item.id).not.toBeUndefined();
      expect(item.category).not.toBeNull();
      expect(item.category).not.toBeUndefined();
      expect(item.title).not.toBeNull();
      expect(item.title).not.toBeUndefined();
      expect(item.summary).not.toBeNull();
      expect(item.summary).not.toBeUndefined();
      expect(item.body).not.toBeNull();
      expect(item.body).not.toBeUndefined();
      expect(item.source).not.toBeNull();
      expect(item.source).not.toBeUndefined();
      expect(item.sourceUrl).not.toBeNull();
      expect(item.sourceUrl).not.toBeUndefined();
      expect(item.date).not.toBeNull();
      expect(item.date).not.toBeUndefined();
      expect(item.keywords).not.toBeNull();
      expect(item.keywords).not.toBeUndefined();
    }
  });

  it("optional fields, when present, have correct types", () => {
    for (const item of mockBoardItems) {
      if (item.employment !== undefined && item.employment !== null) {
        expect(typeof item.employment).toBe("string");
      }
      if (item.workType !== undefined && item.workType !== null) {
        expect(typeof item.workType).toBe("string");
      }
      if (item.duty !== undefined && item.duty !== null) {
        expect(typeof item.duty).toBe("string");
      }
      if (item.deadline !== undefined && item.deadline !== null) {
        expect(typeof item.deadline).toBe("string");
      }
      if (item.isAlwaysOpen !== undefined && item.isAlwaysOpen !== null) {
        expect(typeof item.isAlwaysOpen).toBe("boolean");
      }
    }
  });

  it("contains at least one item from each valid category", () => {
    const categories = new Set(mockBoardItems.map((item) => item.category));
    expect(categories.has("job")).toBe(true);
    expect(categories.has("scholarship")).toBe(true);
    expect(categories.has("announcement")).toBe(true);
  });
});

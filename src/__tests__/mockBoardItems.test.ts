import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";

const VALID_CATEGORIES = ["job", "announcement", "scholarship"] as const;

describe("mockBoardItems", () => {
  it("should be a non-empty array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("every item should have required string fields", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);

      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);

      expect(typeof item.summary).toBe("string");
      expect(item.summary.length).toBeGreaterThan(0);

      expect(typeof item.body).toBe("string");
      expect(item.body.length).toBeGreaterThan(0);

      expect(typeof item.source).toBe("string");
      expect(item.source.length).toBeGreaterThan(0);

      expect(typeof item.sourceUrl).toBe("string");
      expect(item.sourceUrl.length).toBeGreaterThan(0);

      expect(typeof item.date).toBe("string");
      expect(item.date.length).toBeGreaterThan(0);
    }
  });

  it("every item should have a valid category", () => {
    for (const item of mockBoardItems) {
      expect(VALID_CATEGORIES).toContain(item.category);
    }
  });

  it("every item should have a keywords array with at least one entry", () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThan(0);
      for (const keyword of item.keywords) {
        expect(typeof keyword).toBe("string");
      }
    }
  });

  it("every item id should be unique", () => {
    const ids = mockBoardItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("optional fields, when present, should be string, boolean, or null", () => {
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
});

import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";

const VALID_CATEGORIES = ["job", "announcement", "scholarship"] as const;

describe("mockBoardItems", () => {
  it("should be an array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
  });

  it("should not be empty", () => {
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("should have no duplicate IDs", () => {
    const ids = mockBoardItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("each item should have a non-empty string id", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);
    }
  });

  it("each item should have a valid category", () => {
    for (const item of mockBoardItems) {
      expect(VALID_CATEGORIES).toContain(item.category);
    }
  });

  it("each item should have a non-empty title", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.title).toBe("string");
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it("each item should have a non-empty summary", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.summary).toBe("string");
      expect(item.summary.length).toBeGreaterThan(0);
    }
  });

  it("each item should have a non-empty body", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.body).toBe("string");
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("each item should have a non-empty source", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.source).toBe("string");
      expect(item.source.length).toBeGreaterThan(0);
    }
  });

  it("each item should have a non-empty sourceUrl", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.sourceUrl).toBe("string");
      expect(item.sourceUrl.length).toBeGreaterThan(0);
    }
  });

  it("each item should have a non-empty date string", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.date).toBe("string");
      expect(item.date.length).toBeGreaterThan(0);
    }
  });

  it("each item should have a keywords array", () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
    }
  });

  it("each item's keywords should contain only strings", () => {
    for (const item of mockBoardItems) {
      for (const keyword of item.keywords) {
        expect(typeof keyword).toBe("string");
      }
    }
  });

  it("optional fields, when present, should have the correct type", () => {
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
});

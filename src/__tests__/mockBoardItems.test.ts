import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";

const VALID_CATEGORIES = ["job", "scholarship", "announcement"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

describe("mockBoardItems", () => {
  it("is an array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
  });

  it("is non-empty", () => {
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("contains exactly 15 items", () => {
    expect(mockBoardItems).toHaveLength(15);
  });

  it("every item has a string id", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe("string");
      expect(item.id.length).toBeGreaterThan(0);
    }
  });

  it("every item has a valid category", () => {
    for (const item of mockBoardItems) {
      expect(VALID_CATEGORIES).toContain(item.category as Category);
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

  it("every item has a sourceUrl string starting with http", () => {
    for (const item of mockBoardItems) {
      expect(typeof item.sourceUrl).toBe("string");
      expect(item.sourceUrl).toMatch(/^https?:\/\//);
    }
  });

  it("every item has a date string in YYYY-MM-DD format", () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const item of mockBoardItems) {
      expect(typeof item.date).toBe("string");
      expect(item.date).toMatch(dateRegex);
    }
  });

  it("every item has a keywords array of strings", () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
      for (const kw of item.keywords) {
        expect(typeof kw).toBe("string");
      }
    }
  });

  it("every item has a non-empty keywords array", () => {
    for (const item of mockBoardItems) {
      expect(item.keywords.length).toBeGreaterThan(0);
    }
  });

  it("ids are unique", () => {
    const ids = mockBoardItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains items of all three categories", () => {
    const categories = new Set(mockBoardItems.map((item) => item.category));
    expect(categories.has("job")).toBe(true);
    expect(categories.has("scholarship")).toBe(true);
    expect(categories.has("announcement")).toBe(true);
  });

  it("first item has expected field values", () => {
    const first = mockBoardItems[0];
    expect(first.id).toBe("1");
    expect(first.category).toBe("job");
    expect(first.title).toBe("2026년 상반기 9급 공무원 공개채용");
    expect(first.source).toBe("인사혁신처");
    expect(first.sourceUrl).toBe("https://example.com/gosi");
    expect(first.date).toBe("2026-03-15");
    expect(first.keywords).toEqual(["공무원", "채용", "9급"]);
  });

  it("last item has expected field values", () => {
    const last = mockBoardItems[mockBoardItems.length - 1];
    expect(last.id).toBe("15");
    expect(last.category).toBe("announcement");
    expect(last.title).toBe("청년 취업지원금 신청 안내");
    expect(last.source).toBe("고용노동부");
    expect(last.sourceUrl).toBe("https://example.com/youth-support");
    expect(last.date).toBe("2026-03-17");
    expect(last.keywords).toEqual(["채용", "공지사항"]);
  });
});

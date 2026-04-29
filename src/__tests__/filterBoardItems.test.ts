import { describe, it, expect } from "vitest";
import { filterExpired } from "@/lib/filterBoardItems";
import type { BoardItem } from "@/types";

function makeItem(overrides: Partial<BoardItem> = {}): BoardItem {
  return {
    id: "1",
    category: "job",
    title: "Test Job",
    summary: "",
    body: "",
    source: "sogang",
    sourceUrl: "http://example.com",
    date: "2024-06-01",
    keywords: [],
    ...overrides,
  };
}

const NOW = new Date("2024-06-01T12:00:00Z");

describe("filterExpired", () => {
  describe("job category", () => {
    it("keeps always-open jobs", () => {
      const item = makeItem({ category: "job", isAlwaysOpen: true, deadline: "2020-01-01" });
      expect(filterExpired([item], NOW)).toHaveLength(1);
    });

    it("keeps jobs with no deadline", () => {
      const item = makeItem({ category: "job", isAlwaysOpen: false, deadline: null });
      expect(filterExpired([item], NOW)).toHaveLength(1);
    });

    it("keeps jobs with future deadline", () => {
      const item = makeItem({ category: "job", isAlwaysOpen: false, deadline: "2024-12-31" });
      expect(filterExpired([item], NOW)).toHaveLength(1);
    });

    it("keeps jobs with today as deadline", () => {
      const item = makeItem({ category: "job", isAlwaysOpen: false, deadline: "2024-06-01" });
      expect(filterExpired([item], NOW)).toHaveLength(1);
    });

    it("removes jobs with past deadline", () => {
      const item = makeItem({ category: "job", isAlwaysOpen: false, deadline: "2024-05-31" });
      expect(filterExpired([item], NOW)).toHaveLength(0);
    });
  });

  describe("announcement category", () => {
    it("keeps recent announcement (within 6 months)", () => {
      const item = makeItem({ category: "announcement", date: "2024-04-01" });
      expect(filterExpired([item], NOW)).toHaveLength(1);
    });

    it("removes old announcement (over 6 months)", () => {
      const item = makeItem({ category: "announcement", date: "2023-01-01" });
      expect(filterExpired([item], NOW)).toHaveLength(0);
    });

    it("keeps announcement with no date", () => {
      const item = makeItem({ category: "announcement", date: "" });
      expect(filterExpired([item], NOW)).toHaveLength(1);
    });
  });

  describe("scholarship category", () => {
    it("keeps recent scholarship", () => {
      const item = makeItem({ category: "scholarship", date: "2024-05-15" });
      expect(filterExpired([item], NOW)).toHaveLength(1);
    });

    it("removes old scholarship", () => {
      const item = makeItem({ category: "scholarship", date: "2023-01-01" });
      expect(filterExpired([item], NOW)).toHaveLength(0);
    });
  });

  it("handles empty array", () => {
    expect(filterExpired([], NOW)).toEqual([]);
  });

  it("filters multiple items correctly", () => {
    const items = [
      makeItem({ id: "1", category: "job", deadline: "2024-12-31" }),
      makeItem({ id: "2", category: "job", deadline: "2020-01-01" }),
      makeItem({ id: "3", category: "announcement", date: "2024-05-01" }),
      makeItem({ id: "4", category: "announcement", date: "2022-01-01" }),
    ];
    const result = filterExpired(items, NOW);
    expect(result.map((i) => i.id)).toEqual(["1", "3"]);
  });

  it("defaults now to current date", () => {
    const item = makeItem({ category: "job", deadline: "9999-12-31" });
    expect(filterExpired([item])).toHaveLength(1);
  });
});

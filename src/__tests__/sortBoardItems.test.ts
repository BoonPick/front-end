import { describe, it, expect } from "vitest";
import {
  sortJobItems,
  sortByDateDesc,
  sortByMatchScoreDesc,
  sortByCategoryView,
  sortAllItems,
} from "@/lib/sortBoardItems";
import type { BoardItem } from "@/types";

function makeItem(overrides: Partial<BoardItem> = {}): BoardItem {
  return {
    id: "1",
    category: "job",
    title: "Item",
    summary: "",
    body: "",
    source: "sogang",
    sourceUrl: "",
    date: "2024-06-01",
    keywords: [],
    ...overrides,
  };
}

describe("sortJobItems", () => {
  it("sorts by deadline ascending", () => {
    const items = [
      makeItem({ id: "a", deadline: "2024-12-31" }),
      makeItem({ id: "b", deadline: "2024-07-01" }),
      makeItem({ id: "c", deadline: "2024-09-15" }),
    ];
    const result = sortJobItems(items);
    expect(result.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("treats always-open jobs as far future", () => {
    const items = [
      makeItem({ id: "a", deadline: "2024-07-01", isAlwaysOpen: false }),
      makeItem({ id: "b", isAlwaysOpen: true, deadline: null }),
    ];
    const result = sortJobItems(items);
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
  });

  it("treats null deadline as far future", () => {
    const items = [
      makeItem({ id: "a", deadline: "2024-07-01" }),
      makeItem({ id: "b", deadline: null }),
    ];
    const result = sortJobItems(items);
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
  });

  it("secondary sorts by date descending when deadline equal", () => {
    const items = [
      makeItem({ id: "a", deadline: "2024-12-31", date: "2024-01-01" }),
      makeItem({ id: "b", deadline: "2024-12-31", date: "2024-06-01" }),
    ];
    const result = sortJobItems(items);
    expect(result[0].id).toBe("b");
  });

  it("does not mutate original array", () => {
    const items = [
      makeItem({ id: "a", deadline: "2024-12-31" }),
      makeItem({ id: "b", deadline: "2024-07-01" }),
    ];
    sortJobItems(items);
    expect(items[0].id).toBe("a");
  });
});

describe("sortByDateDesc", () => {
  it("sorts by date descending", () => {
    const items = [
      makeItem({ id: "a", date: "2024-01-01" }),
      makeItem({ id: "b", date: "2024-06-01" }),
      makeItem({ id: "c", date: "2024-03-15" }),
    ];
    const result = sortByDateDesc(items);
    expect(result.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("treats missing date as empty string (goes to end)", () => {
    const items = [
      makeItem({ id: "a", date: "2024-06-01" }),
      makeItem({ id: "b", date: "" }),
    ];
    const result = sortByDateDesc(items);
    expect(result[0].id).toBe("a");
  });

  it("does not mutate original array", () => {
    const items = [makeItem({ id: "b", date: "2024-01-01" }), makeItem({ id: "a", date: "2024-06-01" })];
    sortByDateDesc(items);
    expect(items[0].id).toBe("b");
  });
});

describe("sortByMatchScoreDesc", () => {
  it("sorts by score descending", () => {
    const items = [
      makeItem({ id: "a" }),
      makeItem({ id: "b" }),
      makeItem({ id: "c" }),
    ];
    const scores = { a: 50, b: 90, c: 70 };
    const result = sortByMatchScoreDesc(items, scores);
    expect(result.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("items without score go to end", () => {
    const items = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    const result = sortByMatchScoreDesc(items, { a: 80 });
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
  });

  it("handles empty scores object", () => {
    const items = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    const result = sortByMatchScoreDesc(items, {});
    expect(result).toHaveLength(2);
  });
});

describe("sortByCategoryView", () => {
  it("uses sortJobItems for job view", () => {
    const items = [
      makeItem({ id: "a", deadline: "2024-12-31" }),
      makeItem({ id: "b", deadline: "2024-07-01" }),
    ];
    const result = sortByCategoryView(items, "job");
    expect(result[0].id).toBe("b");
  });

  it("uses sortByDateDesc for announcement view", () => {
    const items = [
      makeItem({ id: "a", date: "2024-01-01", category: "announcement" }),
      makeItem({ id: "b", date: "2024-06-01", category: "announcement" }),
    ];
    const result = sortByCategoryView(items, "announcement");
    expect(result[0].id).toBe("b");
  });

  it("uses sortByDateDesc for scholarship view", () => {
    const items = [
      makeItem({ id: "a", date: "2024-01-01", category: "scholarship" }),
      makeItem({ id: "b", date: "2024-06-01", category: "scholarship" }),
    ];
    const result = sortByCategoryView(items, "scholarship");
    expect(result[0].id).toBe("b");
  });
});

describe("sortAllItems", () => {
  it("primary sorts by date descending", () => {
    const items = [
      makeItem({ id: "a", date: "2024-01-01", category: "announcement" }),
      makeItem({ id: "b", date: "2024-06-01", category: "announcement" }),
    ];
    const result = sortAllItems(items);
    expect(result[0].id).toBe("b");
  });

  it("secondary sorts jobs by deadline when date equal", () => {
    const items = [
      makeItem({ id: "a", date: "2024-06-01", category: "job", deadline: "2024-12-31" }),
      makeItem({ id: "b", date: "2024-06-01", category: "job", deadline: "2024-07-01" }),
    ];
    const result = sortAllItems(items);
    expect(result[0].id).toBe("b");
  });

  it("non-job items treated as far-future deadline in secondary sort", () => {
    const items = [
      makeItem({ id: "a", date: "2024-06-01", category: "job", deadline: "2024-08-01" }),
      makeItem({ id: "b", date: "2024-06-01", category: "announcement" }),
    ];
    const result = sortAllItems(items);
    expect(result[0].id).toBe("a");
  });

  it("does not mutate original array", () => {
    const items = [makeItem({ id: "b", date: "2024-01-01" }), makeItem({ id: "a", date: "2024-06-01" })];
    sortAllItems(items);
    expect(items[0].id).toBe("b");
  });
});

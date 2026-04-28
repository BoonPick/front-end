import type { BoardItem } from "@/types";

const FAR_FUTURE = "9999-12-31";

function deadlineKey(item: BoardItem): string {
  if (item.isAlwaysOpen) return FAR_FUTURE;
  return item.deadline ?? FAR_FUTURE;
}

export function sortJobItems(items: BoardItem[]): BoardItem[] {
  return [...items].sort((a, b) => {
    const da = deadlineKey(a);
    const db = deadlineKey(b);
    if (da !== db) return da.localeCompare(db);
    return (b.date ?? "").localeCompare(a.date ?? "");
  });
}

export function sortByDateDesc(items: BoardItem[]): BoardItem[] {
  return [...items].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
}

export function sortByMatchScoreDesc(
  items: BoardItem[],
  scoreById: Record<string, number | undefined>,
): BoardItem[] {
  return [...items].sort((a, b) => {
    const sa = scoreById[a.id] ?? -Infinity;
    const sb = scoreById[b.id] ?? -Infinity;
    return sb - sa;
  });
}

export function sortByCategoryView(
  items: BoardItem[],
  view: "job" | "announcement" | "scholarship",
): BoardItem[] {
  if (view === "job") return sortJobItems(items);
  return sortByDateDesc(items);
}

export function sortAllItems(items: BoardItem[]): BoardItem[] {
  return [...items].sort((a, b) => {
    const dateCmp = (b.date ?? "").localeCompare(a.date ?? "");
    if (dateCmp !== 0) return dateCmp;
    const dlA = a.category === "job" ? deadlineKey(a) : FAR_FUTURE;
    const dlB = b.category === "job" ? deadlineKey(b) : FAR_FUTURE;
    return dlA.localeCompare(dlB);
  });
}

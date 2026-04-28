import type { BoardItem } from "@/types";

function todayYmd(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function sixMonthsAgoYmd(now = new Date()): string {
  const past = new Date(now);
  past.setMonth(past.getMonth() - 6);
  return todayYmd(past);
}

export function filterExpired(items: BoardItem[], now = new Date()): BoardItem[] {
  const today = todayYmd(now);
  const sixMonthsAgo = sixMonthsAgoYmd(now);

  return items.filter((item) => {
    if (item.category === "job") {
      if (item.isAlwaysOpen) return true;
      if (!item.deadline) return true;
      return item.deadline >= today;
    }
    if (item.category === "announcement" || item.category === "scholarship") {
      if (!item.date) return true;
      return item.date >= sixMonthsAgo;
    }
    return true;
  });
}

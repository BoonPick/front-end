import { useEffect, useState } from "react";

const STORAGE_KEY = "boonpick_recommend_filter";

export interface RecommendFilter {
  search: string;
}

const DEFAULT: RecommendFilter = { search: "" };

function read(): RecommendFilter {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT;
    const parsed = JSON.parse(stored);
    return {
      search: typeof parsed.search === "string" ? parsed.search : "",
    };
  } catch {
    return DEFAULT;
  }
}

export function useRecommendFilter() {
  const [filter, setFilterState] = useState<RecommendFilter>(read);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFilterState(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setFilter = (next: RecommendFilter) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFilterState(next);
  };

  const hasFilter = filter.search.length > 0;

  return { filter, setFilter, hasFilter };
}

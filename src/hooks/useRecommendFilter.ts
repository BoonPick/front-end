import { useEffect, useState } from "react";

const STORAGE_KEY = "boonpick_recommend_filter";

export interface RecommendFilter {
  search: string;
  duties: string[];
  workTypes: string[];
}

const DEFAULT: RecommendFilter = { search: "", duties: [], workTypes: [] };

function read(): RecommendFilter {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT;
    const parsed = JSON.parse(stored);
    return {
      search: typeof parsed.search === "string" ? parsed.search : "",
      duties: Array.isArray(parsed.duties) ? parsed.duties : [],
      workTypes: Array.isArray(parsed.workTypes) ? parsed.workTypes : [],
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

  const hasFilter =
    filter.search.length > 0 ||
    filter.duties.length > 0 ||
    filter.workTypes.length > 0;

  return { filter, setFilter, hasFilter };
}

import type { Recommendation } from "@/types";
import { apiClient } from "./client";

export async function getRecommendation(
  itemId: string,
): Promise<Recommendation> {
  const stored = localStorage.getItem("boonpick_keywords");
  const keywords: string[] = stored ? JSON.parse(stored) : [];
  const params = new URLSearchParams();
  if (keywords.length) params.set("keywords", keywords.join(","));
  return apiClient<Recommendation>(
    `/api/recommendations/${itemId}?${params}`,
  );
}

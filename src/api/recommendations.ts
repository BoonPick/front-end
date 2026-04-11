import type { Recommendation } from "@/types";
import { apiClient } from "./client";

function getUserId(): string {
  const stored = localStorage.getItem("boonpick_user");
  if (!stored) throw new Error("로그인이 필요합니다.");
  return JSON.parse(stored).id;
}

export async function getRecommendation(
  itemId: string,
): Promise<Recommendation> {
  const userId = getUserId();
  return apiClient<Recommendation>(
    `/api/recommendations/${itemId}?user_id=${userId}`,
  );
}

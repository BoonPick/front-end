import type { Recommendation } from "@/types";
import { mockRecommendations } from "@/mocks/recommendations";

// TODO: 백엔드 완성 시 apiClient로 교체
// import { apiClient } from "./client";

export async function getRecommendation(
  itemId: string,
): Promise<Recommendation> {
  await delay(500);

  const rec = mockRecommendations.find((r) => r.itemId === itemId);
  if (!rec) {
    return {
      itemId,
      matchScore: 50,
      matchReason: "관련 정보를 분석 중입니다.",
      preparationTips: ["상세 정보를 확인해보세요."],
    };
  }
  return rec;

  // 실제 API:
  // return apiClient<Recommendation>(`/api/recommendations/${itemId}`);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

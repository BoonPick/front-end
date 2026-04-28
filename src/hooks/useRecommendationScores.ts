import { useQueries } from "@tanstack/react-query";
import * as recApi from "@/api/recommendations";

export function useRecommendationScores(itemIds: string[], enabled = true) {
  const results = useQueries({
    queries: itemIds.map((id) => ({
      queryKey: ["recommendation", id],
      queryFn: () => recApi.getRecommendation(id),
      enabled,
    })),
  });

  const scoreById: Record<string, number | undefined> = {};
  results.forEach((r, idx) => {
    scoreById[itemIds[idx]] = r.data?.matchScore;
  });

  const isLoading = enabled && results.some((r) => r.isLoading);
  return { scoreById, isLoading };
}

import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types";
import * as boardApi from "@/api/board";
import * as recApi from "@/api/recommendations";

export function useBoardItems(category?: Category, keywords?: string[]) {
  return useQuery({
    queryKey: ["boardItems", category, keywords],
    queryFn: () => boardApi.getBoardItems(category, keywords),
  });
}

export function useBoardItem(id: string) {
  return useQuery({
    queryKey: ["boardItem", id],
    queryFn: () => boardApi.getBoardItem(id),
  });
}

export function useRecommendation(itemId: string) {
  return useQuery({
    queryKey: ["recommendation", itemId],
    queryFn: () => recApi.getRecommendation(itemId),
  });
}

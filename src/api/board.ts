import type { BoardItem, Category } from "@/types";
import { apiClient } from "./client";

export async function getBoardItems(
  category?: Category,
  keywords?: string[],
  search?: string,
  duty?: string,
  workType?: string,
): Promise<BoardItem[]> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (keywords?.length) params.set("keywords", keywords.join(","));
  if (search) params.set("search", search);
  if (duty) params.set("duty", duty);
  if (workType) params.set("work_type", workType);
  return apiClient<BoardItem[]>(`/api/board?${params}`);
}

export async function getBoardItem(id: string): Promise<BoardItem> {
  return apiClient<BoardItem>(`/api/board/${id}`);
}

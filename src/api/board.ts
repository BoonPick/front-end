import type { BoardItem, Category } from "@/types";
import { apiClient } from "./client";

export async function getBoardItems(
  category?: Category,
  keywords?: string[],
): Promise<BoardItem[]> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (keywords?.length) params.set("keywords", keywords.join(","));
  return apiClient<BoardItem[]>(`/api/board?${params}`);
}

export async function getBoardItem(id: string): Promise<BoardItem> {
  return apiClient<BoardItem>(`/api/board/${id}`);
}

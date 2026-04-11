import { apiClient } from "./client";

const STORAGE_KEY = "boonpick_keywords";

export async function getKeywords(): Promise<string[]> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function updateKeywords(keywords: string[]): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
}

export async function getSuggestedKeywords(): Promise<string[]> {
  return apiClient<string[]>("/api/keywords");
}

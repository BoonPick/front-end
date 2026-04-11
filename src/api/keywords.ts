import { apiClient } from "./client";

function getUserId(): string {
  const stored = localStorage.getItem("boonpick_user");
  if (!stored) throw new Error("로그인이 필요합니다.");
  return JSON.parse(stored).id;
}

export async function getKeywords(): Promise<string[]> {
  const userId = getUserId();
  return apiClient<string[]>(`/api/users/${userId}/keywords`);
}

export async function updateKeywords(keywords: string[]): Promise<void> {
  const userId = getUserId();
  await apiClient(`/api/users/${userId}/keywords`, {
    method: "PUT",
    body: JSON.stringify({ keywords }),
  });
}

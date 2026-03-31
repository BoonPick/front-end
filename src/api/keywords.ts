// TODO: 백엔드 완성 시 apiClient로 교체
// import { apiClient } from "./client";

const STORAGE_KEY = "boonpick_keywords";

export async function getKeywords(): Promise<string[]> {
  await delay(100);
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];

  // 실제 API:
  // return apiClient<string[]>("/api/users/me/keywords");
}

export async function updateKeywords(keywords: string[]): Promise<void> {
  await delay(100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));

  // 실제 API:
  // await apiClient("/api/users/me/keywords", {
  //   method: "PUT",
  //   body: JSON.stringify({ keywords }),
  // });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

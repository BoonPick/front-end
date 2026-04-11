import { apiClient } from "./client";

export interface AdminKeyword {
  id: number;
  keyword_name: string;
}

export async function getAdminKeywords(): Promise<AdminKeyword[]> {
  return apiClient<AdminKeyword[]>("/api/admin/keywords");
}

export async function createKeyword(
  keyword_name: string,
): Promise<AdminKeyword> {
  return apiClient<AdminKeyword>("/api/admin/keywords", {
    method: "POST",
    body: JSON.stringify({ keyword_name }),
  });
}

export async function updateKeyword(
  id: number,
  keyword_name: string,
): Promise<AdminKeyword> {
  return apiClient<AdminKeyword>(`/api/admin/keywords/${id}`, {
    method: "PUT",
    body: JSON.stringify({ keyword_name }),
  });
}

export async function deleteKeyword(id: number): Promise<void> {
  await fetch(
    `${import.meta.env.VITE_API_URL || ""}/api/admin/keywords/${id}`,
    { method: "DELETE" },
  );
}

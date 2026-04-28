import type { NotificationSettings } from "@/types";
import { apiClient } from "./client";

export async function getNotificationSettings(
  userId: string,
): Promise<NotificationSettings | null> {
  return apiClient<NotificationSettings | null>(
    `/api/users/${userId}/notification-settings`,
  );
}

export async function updateNotificationSettings(
  userId: string,
  settings: NotificationSettings,
): Promise<NotificationSettings> {
  return apiClient<NotificationSettings>(
    `/api/users/${userId}/notification-settings`,
    {
      method: "PUT",
      body: JSON.stringify(settings),
    },
  );
}

export async function notifyNow(userId: string): Promise<{ items_sent: number }> {
  return apiClient<{ items_sent: number }>(
    `/api/users/${userId}/notify-now`,
    { method: "POST" },
  );
}

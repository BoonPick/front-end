import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getNotificationSettings,
  updateNotificationSettings,
  notifyNow,
} from "@/api/notifications";
import * as client from "@/api/client";
import type { NotificationSettings } from "@/types";

vi.mock("@/api/client");

const mockSettings: NotificationSettings = {
  categories: ["job", "announcement"],
  duties: ["개발(IT)"],
  work_types: ["정규직"],
  search: "",
  keywords: ["python", "AI"],
};

describe("notifications API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getNotificationSettings", () => {
    it("calls apiClient with correct URL", async () => {
      vi.mocked(client.apiClient).mockResolvedValue(mockSettings);
      const result = await getNotificationSettings("42");
      expect(client.apiClient).toHaveBeenCalledWith(
        "/api/users/42/notification-settings",
      );
      expect(result).toEqual(mockSettings);
    });

    it("returns null when no settings exist", async () => {
      vi.mocked(client.apiClient).mockResolvedValue(null);
      const result = await getNotificationSettings("99");
      expect(result).toBeNull();
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Network error"));
      await expect(getNotificationSettings("1")).rejects.toThrow("Network error");
    });
  });

  describe("updateNotificationSettings", () => {
    it("calls apiClient with PUT method and correct body", async () => {
      vi.mocked(client.apiClient).mockResolvedValue(mockSettings);
      const result = await updateNotificationSettings("42", mockSettings);
      expect(client.apiClient).toHaveBeenCalledWith(
        "/api/users/42/notification-settings",
        { method: "PUT", body: JSON.stringify(mockSettings) },
      );
      expect(result).toEqual(mockSettings);
    });

    it("propagates server errors", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("400 Bad Request"));
      await expect(
        updateNotificationSettings("42", mockSettings),
      ).rejects.toThrow("400 Bad Request");
    });
  });

  describe("notifyNow", () => {
    it("calls apiClient with POST method", async () => {
      vi.mocked(client.apiClient).mockResolvedValue({ items_sent: 3 });
      const result = await notifyNow("42");
      expect(client.apiClient).toHaveBeenCalledWith(
        "/api/users/42/notify-now",
        { method: "POST" },
      );
      expect(result).toEqual({ items_sent: 3 });
    });

    it("returns zero items_sent when nothing matched", async () => {
      vi.mocked(client.apiClient).mockResolvedValue({ items_sent: 0 });
      const result = await notifyNow("7");
      expect(result.items_sent).toBe(0);
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Server error"));
      await expect(notifyNow("1")).rejects.toThrow("Server error");
    });
  });
});

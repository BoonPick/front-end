import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminKeywords,
  createKeyword,
  updateKeyword,
  deleteKeyword,
} from "@/api/admin";
import * as client from "@/api/client";

vi.mock("@/api/client");

describe("admin API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAdminKeywords", () => {
    it("calls apiClient with /api/admin/keywords", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([{ id: 1, keyword_name: "AI" }]);
      const result = await getAdminKeywords();
      expect(client.apiClient).toHaveBeenCalledWith("/api/admin/keywords");
      expect(result).toEqual([{ id: 1, keyword_name: "AI" }]);
    });

    it("returns empty array when no keywords", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      const result = await getAdminKeywords();
      expect(result).toEqual([]);
    });
  });

  describe("createKeyword", () => {
    it("calls apiClient with POST and keyword_name", async () => {
      vi.mocked(client.apiClient).mockResolvedValue({ id: 10, keyword_name: "취업" });

      const result = await createKeyword("취업");

      expect(client.apiClient).toHaveBeenCalledWith("/api/admin/keywords", {
        method: "POST",
        body: JSON.stringify({ keyword_name: "취업" }),
      });
      expect(result).toEqual({ id: 10, keyword_name: "취업" });
    });

    it("propagates duplicate keyword errors", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("이미 존재하는 키워드입니다."));
      await expect(createKeyword("AI")).rejects.toThrow("이미 존재하는 키워드입니다.");
    });
  });

  describe("updateKeyword", () => {
    it("calls apiClient with PUT and updated keyword_name", async () => {
      vi.mocked(client.apiClient).mockResolvedValue({ id: 5, keyword_name: "신규키워드" });

      const result = await updateKeyword(5, "신규키워드");

      expect(client.apiClient).toHaveBeenCalledWith("/api/admin/keywords/5", {
        method: "PUT",
        body: JSON.stringify({ keyword_name: "신규키워드" }),
      });
      expect(result).toEqual({ id: 5, keyword_name: "신규키워드" });
    });

    it("propagates 404 errors for missing keywords", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("키워드를 찾을 수 없습니다."));
      await expect(updateKeyword(999, "test")).rejects.toThrow("키워드를 찾을 수 없습니다.");
    });
  });

  describe("deleteKeyword", () => {
    it("calls fetch with DELETE method for the keyword id", async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });

      await deleteKeyword(3);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/keywords/3",
        { method: "DELETE" },
      );
    });

    it("does not throw on successful delete", async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });
      await expect(deleteKeyword(1)).resolves.toBeUndefined();
    });
  });
});

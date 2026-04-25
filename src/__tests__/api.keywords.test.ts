import { describe, it, expect, vi, beforeEach } from "vitest";
import { getKeywords, updateKeywords, getSuggestedKeywords } from "@/api/keywords";
import * as client from "@/api/client";

vi.mock("@/api/client");

describe("keywords API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  describe("getKeywords", () => {
    it("returns empty array when localStorage has no entry", async () => {
      const result = await getKeywords();
      expect(result).toEqual([]);
    });

    it("returns parsed keywords from localStorage", async () => {
      localStorage.setItem("boonpick_keywords", JSON.stringify(["AI", "ML"]));
      const result = await getKeywords();
      expect(result).toEqual(["AI", "ML"]);
    });
  });

  describe("updateKeywords", () => {
    it("writes keywords to localStorage", async () => {
      await updateKeywords(["React", "TypeScript"]);
      const stored = localStorage.getItem("boonpick_keywords");
      expect(JSON.parse(stored!)).toEqual(["React", "TypeScript"]);
    });

    it("overwrites existing keywords in localStorage", async () => {
      localStorage.setItem("boonpick_keywords", JSON.stringify(["old"]));
      await updateKeywords(["new"]);
      const stored = localStorage.getItem("boonpick_keywords");
      expect(JSON.parse(stored!)).toEqual(["new"]);
    });

    it("stores empty array correctly", async () => {
      await updateKeywords([]);
      const stored = localStorage.getItem("boonpick_keywords");
      expect(JSON.parse(stored!)).toEqual([]);
    });
  });

  describe("getSuggestedKeywords", () => {
    it("calls apiClient at /api/keywords and returns result", async () => {
      vi.mocked(client.apiClient).mockResolvedValue(["Python", "FastAPI"]);
      const result = await getSuggestedKeywords();
      expect(client.apiClient).toHaveBeenCalledWith("/api/keywords");
      expect(result).toEqual(["Python", "FastAPI"]);
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Network error"));
      await expect(getSuggestedKeywords()).rejects.toThrow("Network error");
    });
  });
});

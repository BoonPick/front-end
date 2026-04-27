import { describe, it, expect, vi, beforeEach } from "vitest";
import { getKeywords, updateKeywords, getSuggestedKeywords } from "@/api/keywords";
import * as client from "@/api/client";

vi.mock("@/api/client");

const STORAGE_KEY = "boonpick_keywords";

describe("keywords API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("getKeywords", () => {
    it("returns empty array when localStorage is empty", async () => {
      const result = await getKeywords();
      expect(result).toEqual([]);
    });

    it("returns parsed array from localStorage", async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["AI", "취업"]));
      const result = await getKeywords();
      expect(result).toEqual(["AI", "취업"]);
    });

    it("returns empty array when stored value is null", async () => {
      localStorage.removeItem(STORAGE_KEY);
      const result = await getKeywords();
      expect(result).toEqual([]);
    });
  });

  describe("updateKeywords", () => {
    it("saves keywords array to localStorage", async () => {
      await updateKeywords(["장학금", "취업"]);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(stored!)).toEqual(["장학금", "취업"]);
    });

    it("overwrites existing keywords in localStorage", async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(["AI"]));
      await updateKeywords(["장학금"]);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(stored!)).toEqual(["장학금"]);
    });

    it("saves empty array when no keywords provided", async () => {
      await updateKeywords([]);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(JSON.parse(stored!)).toEqual([]);
    });
  });

  describe("getSuggestedKeywords", () => {
    it("calls apiClient with /api/keywords", async () => {
      vi.mocked(client.apiClient).mockResolvedValue(["AI", "취업", "장학금"]);
      const result = await getSuggestedKeywords();
      expect(client.apiClient).toHaveBeenCalledWith("/api/keywords");
      expect(result).toEqual(["AI", "취업", "장학금"]);
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Server error"));
      await expect(getSuggestedKeywords()).rejects.toThrow("Server error");
    });
  });
});

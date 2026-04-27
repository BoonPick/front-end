import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBoardItems, getBoardItem } from "@/api/board";
import * as client from "@/api/client";

vi.mock("@/api/client");

const mockBoardItem = {
  id: "1",
  category: "announcement" as const,
  title: "테스트 공지",
  summary: "요약",
  body: "본문",
  source: "sogang_notice",
  sourceUrl: "https://example.com",
  date: "2026-04-27",
  keywords: [],
};

describe("board API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBoardItems", () => {
    it("calls apiClient with /api/board when no filters", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([mockBoardItem]);
      const result = await getBoardItems();
      expect(client.apiClient).toHaveBeenCalledWith("/api/board?");
      expect(result).toEqual([mockBoardItem]);
    });

    it("appends category param when provided", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems("announcement");
      expect(client.apiClient).toHaveBeenCalledWith("/api/board?category=announcement");
    });

    it("appends keywords param when provided", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems(undefined, ["AI", "취업"]);
      expect(client.apiClient).toHaveBeenCalledWith("/api/board?keywords=AI%2C%EC%B7%A8%EC%97%85");
    });

    it("appends both category and keywords when both provided", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems("scholarship", ["장학금"]);
      const callArg = vi.mocked(client.apiClient).mock.calls[0][0] as string;
      expect(callArg).toContain("category=scholarship");
      expect(callArg).toContain("keywords=");
    });

    it("does not append keywords param when empty array", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems(undefined, []);
      expect(client.apiClient).toHaveBeenCalledWith("/api/board?");
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Network error"));
      await expect(getBoardItems()).rejects.toThrow("Network error");
    });
  });

  describe("getBoardItem", () => {
    it("calls apiClient with the correct item URL", async () => {
      vi.mocked(client.apiClient).mockResolvedValue(mockBoardItem);
      const result = await getBoardItem("42");
      expect(client.apiClient).toHaveBeenCalledWith("/api/board/42");
      expect(result).toEqual(mockBoardItem);
    });

    it("propagates 404 errors", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("API Error: 404"));
      await expect(getBoardItem("999")).rejects.toThrow("API Error: 404");
    });
  });
});

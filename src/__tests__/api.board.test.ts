import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBoardItems, getBoardItem } from "@/api/board";
import * as client from "@/api/client";

vi.mock("@/api/client");

describe("board API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getBoardItems", () => {
    it("calls apiClient with no params when no filters provided", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems();
      expect(client.apiClient).toHaveBeenCalledWith("/api/board?");
    });

    it("includes category param when provided", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems("job");
      const url = vi.mocked(client.apiClient).mock.calls[0][0] as string;
      expect(url).toContain("category=job");
    });

    it("includes keywords param when provided", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems(undefined, ["AI", "ML"]);
      const url = vi.mocked(client.apiClient).mock.calls[0][0] as string;
      expect(url).toContain("keywords=AI%2CML");
    });

    it("includes both category and keywords params", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems("scholarship", ["장학금"]);
      const url = vi.mocked(client.apiClient).mock.calls[0][0] as string;
      expect(url).toContain("category=scholarship");
      expect(url).toContain("keywords=");
    });

    it("returns board items array from apiClient", async () => {
      const items = [{ id: "1", category: "job", title: "T" }];
      vi.mocked(client.apiClient).mockResolvedValue(items);
      const result = await getBoardItems();
      expect(result).toEqual(items);
    });

    it("skips keywords param when keywords array is empty", async () => {
      vi.mocked(client.apiClient).mockResolvedValue([]);
      await getBoardItems(undefined, []);
      const url = vi.mocked(client.apiClient).mock.calls[0][0] as string;
      expect(url).not.toContain("keywords");
    });
  });

  describe("getBoardItem", () => {
    it("calls apiClient with correct item id url", async () => {
      const item = { id: "42", title: "Item 42" };
      vi.mocked(client.apiClient).mockResolvedValue(item);
      const result = await getBoardItem("42");
      expect(client.apiClient).toHaveBeenCalledWith("/api/board/42");
      expect(result).toEqual(item);
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Not found"));
      await expect(getBoardItem("999")).rejects.toThrow("Not found");
    });
  });
});

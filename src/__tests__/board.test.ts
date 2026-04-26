import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBoardItems, getBoardItem } from "@/api/board";
import * as client from "@/api/client";

vi.mock("@/api/client");

const mockApiClient = vi.mocked(client.apiClient);

beforeEach(() => {
  mockApiClient.mockReset();
});

describe("getBoardItems", () => {
  it("calls with no query params when no filters given", async () => {
    mockApiClient.mockResolvedValue([]);
    await getBoardItems();
    expect(mockApiClient).toHaveBeenCalledWith("/api/board?");
  });

  it("includes category param", async () => {
    mockApiClient.mockResolvedValue([]);
    await getBoardItems("job");
    expect(mockApiClient).toHaveBeenCalledWith("/api/board?category=job");
  });

  it("includes keywords param joined by comma", async () => {
    mockApiClient.mockResolvedValue([]);
    await getBoardItems(undefined, ["react", "node"]);
    expect(mockApiClient).toHaveBeenCalledWith("/api/board?keywords=react%2Cnode");
  });

  it("includes both category and keywords", async () => {
    mockApiClient.mockResolvedValue([]);
    await getBoardItems("scholarship", ["math"]);
    const url = mockApiClient.mock.calls[0][0] as string;
    expect(url).toContain("category=scholarship");
    expect(url).toContain("keywords=math");
  });

  it("returns array of board items", async () => {
    const items = [{ id: "1", title: "Test" }];
    mockApiClient.mockResolvedValue(items);
    const result = await getBoardItems();
    expect(result).toEqual(items);
  });
});

describe("getBoardItem", () => {
  it("calls with correct id in path", async () => {
    const item = { id: "42", title: "Detail" };
    mockApiClient.mockResolvedValue(item);
    const result = await getBoardItem("42");
    expect(mockApiClient).toHaveBeenCalledWith("/api/board/42");
    expect(result).toEqual(item);
  });

  it("propagates errors", async () => {
    mockApiClient.mockRejectedValue(new Error("Not Found"));
    await expect(getBoardItem("999")).rejects.toThrow("Not Found");
  });
});

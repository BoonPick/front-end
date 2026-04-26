import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRecommendation } from "@/api/recommendations";
import * as client from "@/api/client";

vi.mock("@/api/client");

const mockApiClient = vi.mocked(client.apiClient);

beforeEach(() => {
  localStorage.clear();
  mockApiClient.mockReset();
});

describe("getRecommendation", () => {
  it("calls without keywords param when none stored", async () => {
    const rec = { itemId: "1", matchScore: 0.9, matchReason: "good", preparationTips: [] };
    mockApiClient.mockResolvedValue(rec);

    await getRecommendation("1");

    const url = mockApiClient.mock.calls[0][0] as string;
    expect(url).toBe("/api/recommendations/1?");
  });

  it("calls with keywords param when stored", async () => {
    localStorage.setItem("boonpick_keywords", JSON.stringify(["react", "node"]));
    const rec = { itemId: "2", matchScore: 0.8, matchReason: "match", preparationTips: ["tip1"] };
    mockApiClient.mockResolvedValue(rec);

    await getRecommendation("2");

    const url = mockApiClient.mock.calls[0][0] as string;
    expect(url).toContain("keywords=react%2Cnode");
    expect(url).toContain("/api/recommendations/2");
  });

  it("returns recommendation object", async () => {
    const rec = { itemId: "3", matchScore: 0.7, matchReason: "ok", preparationTips: ["a", "b"] };
    mockApiClient.mockResolvedValue(rec);

    const result = await getRecommendation("3");
    expect(result).toEqual(rec);
  });

  it("propagates errors from apiClient", async () => {
    mockApiClient.mockRejectedValue(new Error("Not Found"));
    await expect(getRecommendation("999")).rejects.toThrow("Not Found");
  });
});

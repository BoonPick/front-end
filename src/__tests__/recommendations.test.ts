import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRecommendation } from "@/api/recommendations";
import * as client from "@/api/client";

vi.mock("@/api/client");

const STORAGE_KEY = "boonpick_keywords";

describe("recommendations API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("calls apiClient without keywords param when localStorage is empty", async () => {
    const mockRec = {
      itemId: "1",
      matchScore: 0,
      matchReason: "키워드를 설정하면 맞춤 추천을 받을 수 있습니다.",
      preparationTips: [],
    };
    vi.mocked(client.apiClient).mockResolvedValue(mockRec);

    await getRecommendation("1");

    expect(client.apiClient).toHaveBeenCalledWith("/api/recommendations/1?");
  });

  it("appends keywords from localStorage to the request", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["AI", "취업"]));
    vi.mocked(client.apiClient).mockResolvedValue({
      itemId: "5",
      matchScore: 80,
      matchReason: "관련 있음",
      preparationTips: ["팁1"],
    });

    await getRecommendation("5");

    const callArg = vi.mocked(client.apiClient).mock.calls[0][0] as string;
    expect(callArg).toContain("/api/recommendations/5");
    expect(callArg).toContain("keywords=");
  });

  it("returns the recommendation object from apiClient", async () => {
    const mockRec = {
      itemId: "3",
      matchScore: 90,
      matchReason: "매우 관련 있음",
      preparationTips: ["준비1", "준비2"],
    };
    vi.mocked(client.apiClient).mockResolvedValue(mockRec);

    const result = await getRecommendation("3");

    expect(result).toEqual(mockRec);
  });

  it("propagates errors from apiClient", async () => {
    vi.mocked(client.apiClient).mockRejectedValue(new Error("API Error: 404"));
    await expect(getRecommendation("999")).rejects.toThrow("API Error: 404");
  });

  it("uses empty keywords array when stored value is empty array", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    vi.mocked(client.apiClient).mockResolvedValue({
      itemId: "2",
      matchScore: 0,
      matchReason: "no match",
      preparationTips: [],
    });

    await getRecommendation("2");

    expect(client.apiClient).toHaveBeenCalledWith("/api/recommendations/2?");
  });
});

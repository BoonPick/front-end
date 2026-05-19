import { describe, it, expect } from "vitest";
import { mockRecommendations } from "@/mocks/recommendations";

describe("mockRecommendations", () => {
  it("is an array", () => {
    expect(Array.isArray(mockRecommendations)).toBe(true);
  });

  it("is not empty", () => {
    expect(mockRecommendations.length).toBeGreaterThan(0);
  });

  it("every item has a string itemId", () => {
    mockRecommendations.forEach((rec) => {
      expect(typeof rec.itemId).toBe("string");
      expect(rec.itemId.length).toBeGreaterThan(0);
    });
  });

  it("every item has a numeric matchScore", () => {
    mockRecommendations.forEach((rec) => {
      expect(typeof rec.matchScore).toBe("number");
    });
  });

  it("every item has a non-empty matchReason string", () => {
    mockRecommendations.forEach((rec) => {
      expect(typeof rec.matchReason).toBe("string");
      expect(rec.matchReason.length).toBeGreaterThan(0);
    });
  });

  it("every item has a preparationTips array", () => {
    mockRecommendations.forEach((rec) => {
      expect(Array.isArray(rec.preparationTips)).toBe(true);
    });
  });

  it("every preparationTip is a non-empty string", () => {
    mockRecommendations.forEach((rec) => {
      rec.preparationTips.forEach((tip) => {
        expect(typeof tip).toBe("string");
        expect(tip.length).toBeGreaterThan(0);
      });
    });
  });

  it("all itemIds are unique", () => {
    const ids = mockRecommendations.map((rec) => rec.itemId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("matchScore is between 0 and 100 for every item", () => {
    mockRecommendations.forEach((rec) => {
      expect(rec.matchScore).toBeGreaterThanOrEqual(0);
      expect(rec.matchScore).toBeLessThanOrEqual(100);
    });
  });
});

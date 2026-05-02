import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";
import { suggestedKeywords } from "@/mocks/keywords";
import { mockRecommendations } from "@/mocks/recommendations";
import { mockUsers } from "@/mocks/users";

describe("mock data", () => {
  it("mockBoardItems is a non-empty array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("each mockBoardItem has required fields", () => {
    mockBoardItems.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("category");
    });
  });

  it("suggestedKeywords is a non-empty array of strings", () => {
    expect(Array.isArray(suggestedKeywords)).toBe(true);
    expect(suggestedKeywords.length).toBeGreaterThan(0);
    suggestedKeywords.forEach((k) => expect(typeof k).toBe("string"));
  });

  it("mockRecommendations is a non-empty array", () => {
    expect(Array.isArray(mockRecommendations)).toBe(true);
    expect(mockRecommendations.length).toBeGreaterThan(0);
  });

  it("mockUsers is a non-empty array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });
});

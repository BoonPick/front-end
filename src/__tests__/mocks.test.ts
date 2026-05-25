import { describe, it, expect } from "vitest";
import { mockBoardItems } from "@/mocks/boardItems";
import { suggestedKeywords } from "@/mocks/keywords";
import { mockRecommendations } from "@/mocks/recommendations";
import { mockUsers } from "@/mocks/users";

describe("mockBoardItems", () => {
  it("is an array", () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
  });

  it("is non-empty", () => {
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it("first item has the expected shape", () => {
    const first = mockBoardItems[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("category");
    expect(first).toHaveProperty("title");
    expect(first).toHaveProperty("summary");
    expect(first).toHaveProperty("body");
    expect(first).toHaveProperty("source");
    expect(first).toHaveProperty("sourceUrl");
    expect(first).toHaveProperty("date");
    expect(first).toHaveProperty("keywords");
  });

  it("first item properties have the expected types", () => {
    const first = mockBoardItems[0];
    expect(typeof first.id).toBe("string");
    expect(typeof first.category).toBe("string");
    expect(typeof first.title).toBe("string");
    expect(typeof first.summary).toBe("string");
    expect(typeof first.body).toBe("string");
    expect(typeof first.source).toBe("string");
    expect(typeof first.sourceUrl).toBe("string");
    expect(typeof first.date).toBe("string");
    expect(Array.isArray(first.keywords)).toBe(true);
  });

  it("first item has correct values", () => {
    const first = mockBoardItems[0];
    expect(first.id).toBe("1");
    expect(first.category).toBe("job");
  });

  it("every item has a string id", () => {
    mockBoardItems.forEach((item) => {
      expect(typeof item.id).toBe("string");
    });
  });

  it("category values are one of the expected types", () => {
    const validCategories = ["job", "scholarship", "announcement"];
    mockBoardItems.forEach((item) => {
      expect(validCategories).toContain(item.category);
    });
  });

  it("keywords is an array of strings for every item", () => {
    mockBoardItems.forEach((item) => {
      expect(Array.isArray(item.keywords)).toBe(true);
      item.keywords.forEach((kw) => {
        expect(typeof kw).toBe("string");
      });
    });
  });
});

describe("suggestedKeywords", () => {
  it("is an array", () => {
    expect(Array.isArray(suggestedKeywords)).toBe(true);
  });

  it("is non-empty", () => {
    expect(suggestedKeywords.length).toBeGreaterThan(0);
  });

  it("contains only strings", () => {
    suggestedKeywords.forEach((keyword) => {
      expect(typeof keyword).toBe("string");
    });
  });

  it("contains expected keywords", () => {
    expect(suggestedKeywords).toContain("공무원");
    expect(suggestedKeywords).toContain("장학금");
    expect(suggestedKeywords).toContain("인턴십");
  });

  it("has 15 items", () => {
    expect(suggestedKeywords).toHaveLength(15);
  });
});

describe("mockRecommendations", () => {
  it("is an array", () => {
    expect(Array.isArray(mockRecommendations)).toBe(true);
  });

  it("is non-empty", () => {
    expect(mockRecommendations.length).toBeGreaterThan(0);
  });

  it("first item has the expected shape", () => {
    const first = mockRecommendations[0];
    expect(first).toHaveProperty("itemId");
    expect(first).toHaveProperty("matchScore");
    expect(first).toHaveProperty("matchReason");
    expect(first).toHaveProperty("preparationTips");
  });

  it("first item properties have the expected types", () => {
    const first = mockRecommendations[0];
    expect(typeof first.itemId).toBe("string");
    expect(typeof first.matchScore).toBe("number");
    expect(typeof first.matchReason).toBe("string");
    expect(Array.isArray(first.preparationTips)).toBe(true);
  });

  it("first item has correct values", () => {
    const first = mockRecommendations[0];
    expect(first.itemId).toBe("1");
    expect(first.matchScore).toBe(92);
  });

  it("matchScore is a number between 0 and 100 for every item", () => {
    mockRecommendations.forEach((rec) => {
      expect(rec.matchScore).toBeGreaterThanOrEqual(0);
      expect(rec.matchScore).toBeLessThanOrEqual(100);
    });
  });

  it("preparationTips is an array of strings for every item", () => {
    mockRecommendations.forEach((rec) => {
      expect(Array.isArray(rec.preparationTips)).toBe(true);
      rec.preparationTips.forEach((tip) => {
        expect(typeof tip).toBe("string");
      });
    });
  });

  it("every item has a string itemId", () => {
    mockRecommendations.forEach((rec) => {
      expect(typeof rec.itemId).toBe("string");
    });
  });
});

describe("mockUsers", () => {
  it("is an array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
  });

  it("is non-empty", () => {
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("first item has the expected shape", () => {
    const first = mockUsers[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("email");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("keywords");
  });

  it("first item properties have the expected types", () => {
    const first = mockUsers[0];
    expect(typeof first.id).toBe("string");
    expect(typeof first.email).toBe("string");
    expect(typeof first.name).toBe("string");
    expect(Array.isArray(first.keywords)).toBe(true);
  });

  it("first item has correct values", () => {
    const first = mockUsers[0];
    expect(first.id).toBe("1");
    expect(first.email).toBe("test@boonpick.com");
    expect(first.name).toBe("테스트 유저");
  });

  it("keywords is an array of strings for every user", () => {
    mockUsers.forEach((user) => {
      expect(Array.isArray(user.keywords)).toBe(true);
      user.keywords.forEach((kw) => {
        expect(typeof kw).toBe("string");
      });
    });
  });

  it("has 2 users", () => {
    expect(mockUsers).toHaveLength(2);
  });
});

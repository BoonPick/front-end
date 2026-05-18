import { describe, it, expect } from "vitest";
import type {
  Category,
  User,
  BoardItem,
  Recommendation,
  NotificationCategory,
  NotificationSettings,
} from "../types/index";

// Compile-time tests: verify that objects conforming to each type can be
// constructed and that their runtime values satisfy basic sanity checks.

describe("Category type", () => {
  it("accepts 'job' as a valid Category value", () => {
    const cat: Category = "job";
    expect(cat).toBe("job");
  });

  it("accepts 'announcement' as a valid Category value", () => {
    const cat: Category = "announcement";
    expect(cat).toBe("announcement");
  });

  it("accepts 'scholarship' as a valid Category value", () => {
    const cat: Category = "scholarship";
    expect(cat).toBe("scholarship");
  });
});

describe("User interface", () => {
  it("constructs a valid User with all required fields", () => {
    const user: User = {
      id: "u-1",
      email: "alice@example.com",
      name: "Alice",
      keywords: ["react", "typescript"],
    };

    expect(user.id).toBe("u-1");
    expect(user.email).toBe("alice@example.com");
    expect(user.name).toBe("Alice");
    expect(user.keywords).toEqual(["react", "typescript"]);
  });

  it("constructs a User with an empty keywords array", () => {
    const user: User = {
      id: "u-2",
      email: "bob@example.com",
      name: "Bob",
      keywords: [],
    };

    expect(user.keywords).toHaveLength(0);
  });
});

describe("BoardItem interface", () => {
  it("constructs a BoardItem with only required fields", () => {
    const item: BoardItem = {
      id: "b-1",
      category: "job",
      title: "Frontend Engineer",
      summary: "Build great UIs",
      body: "Detailed job description",
      source: "JobBoard",
      sourceUrl: "https://jobs.example.com/1",
      date: "2026-05-01",
      keywords: ["react"],
    };

    expect(item.id).toBe("b-1");
    expect(item.category).toBe("job");
    expect(item.title).toBe("Frontend Engineer");
    expect(item.summary).toBe("Build great UIs");
    expect(item.body).toBe("Detailed job description");
    expect(item.source).toBe("JobBoard");
    expect(item.sourceUrl).toBe("https://jobs.example.com/1");
    expect(item.date).toBe("2026-05-01");
    expect(item.keywords).toContain("react");
  });

  it("constructs a BoardItem with all optional fields as strings/boolean", () => {
    const item: BoardItem = {
      id: "b-2",
      category: "announcement",
      title: "Notice",
      summary: "A notice",
      body: "Notice body",
      source: "Admin",
      sourceUrl: "https://example.com/notice",
      date: "2026-04-15",
      keywords: [],
      employment: "Full-time",
      workType: "Remote",
      duty: "Operations",
      deadline: "2026-06-30",
      isAlwaysOpen: false,
    };

    expect(item.employment).toBe("Full-time");
    expect(item.workType).toBe("Remote");
    expect(item.duty).toBe("Operations");
    expect(item.deadline).toBe("2026-06-30");
    expect(item.isAlwaysOpen).toBe(false);
  });

  it("constructs a BoardItem with all optional fields as null", () => {
    const item: BoardItem = {
      id: "b-3",
      category: "scholarship",
      title: "Grant",
      summary: "A grant",
      body: "Grant body",
      source: "University",
      sourceUrl: "https://uni.edu/grant",
      date: "2026-03-10",
      keywords: [],
      employment: null,
      workType: null,
      duty: null,
      deadline: null,
      isAlwaysOpen: null,
    };

    expect(item.employment).toBeNull();
    expect(item.workType).toBeNull();
    expect(item.duty).toBeNull();
    expect(item.deadline).toBeNull();
    expect(item.isAlwaysOpen).toBeNull();
  });

  it("constructs a BoardItem where isAlwaysOpen is true", () => {
    const item: BoardItem = {
      id: "b-4",
      category: "job",
      title: "Open Role",
      summary: "Always hiring",
      body: "We are always looking for great people",
      source: "Corp",
      sourceUrl: "https://corp.example.com/open",
      date: "2026-01-01",
      keywords: ["hiring"],
      isAlwaysOpen: true,
    };

    expect(item.isAlwaysOpen).toBe(true);
  });
});

describe("Recommendation interface", () => {
  it("constructs a valid Recommendation with all fields", () => {
    const rec: Recommendation = {
      itemId: "b-1",
      matchScore: 0.87,
      matchReason: "Keyword overlap",
      preparationTips: ["Polish your portfolio", "Review system design"],
    };

    expect(rec.itemId).toBe("b-1");
    expect(rec.matchScore).toBeCloseTo(0.87);
    expect(rec.matchReason).toBe("Keyword overlap");
    expect(rec.preparationTips).toHaveLength(2);
  });

  it("constructs a Recommendation with an empty preparationTips array", () => {
    const rec: Recommendation = {
      itemId: "b-2",
      matchScore: 0.3,
      matchReason: "Low match",
      preparationTips: [],
    };

    expect(rec.preparationTips).toHaveLength(0);
  });

  it("matchScore can be 0 (minimum) and 1 (maximum)", () => {
    const low: Recommendation = {
      itemId: "b-low",
      matchScore: 0,
      matchReason: "No match",
      preparationTips: [],
    };
    const high: Recommendation = {
      itemId: "b-high",
      matchScore: 1,
      matchReason: "Perfect match",
      preparationTips: [],
    };

    expect(low.matchScore).toBe(0);
    expect(high.matchScore).toBe(1);
  });
});

describe("NotificationCategory type", () => {
  it("accepts 'announcement' as a valid NotificationCategory value", () => {
    const cat: NotificationCategory = "announcement";
    expect(cat).toBe("announcement");
  });

  it("accepts 'scholarship' as a valid NotificationCategory value", () => {
    const cat: NotificationCategory = "scholarship";
    expect(cat).toBe("scholarship");
  });

  it("accepts 'job' as a valid NotificationCategory value", () => {
    const cat: NotificationCategory = "job";
    expect(cat).toBe("job");
  });
});

describe("NotificationSettings interface", () => {
  it("constructs a valid NotificationSettings with all fields populated", () => {
    const settings: NotificationSettings = {
      categories: ["job", "scholarship"],
      duties: ["Backend", "Frontend"],
      work_types: ["Remote"],
      search: "developer",
      keywords: ["react"],
    };

    expect(settings.categories).toEqual(["job", "scholarship"]);
    expect(settings.duties).toEqual(["Backend", "Frontend"]);
    expect(settings.work_types).toEqual(["Remote"]);
    expect(settings.search).toBe("developer");
    expect(settings.keywords).toEqual(["react"]);
  });

  it("constructs a NotificationSettings with all empty arrays and blank search", () => {
    const settings: NotificationSettings = {
      categories: [],
      duties: [],
      work_types: [],
      search: "",
      keywords: [],
    };

    expect(settings.categories).toHaveLength(0);
    expect(settings.duties).toHaveLength(0);
    expect(settings.work_types).toHaveLength(0);
    expect(settings.search).toBe("");
    expect(settings.keywords).toHaveLength(0);
  });

  it("constructs a NotificationSettings with all three notification categories", () => {
    const settings: NotificationSettings = {
      categories: ["announcement", "scholarship", "job"],
      duties: [],
      work_types: [],
      search: "",
      keywords: [],
    };

    expect(settings.categories).toContain("announcement");
    expect(settings.categories).toContain("scholarship");
    expect(settings.categories).toContain("job");
    expect(settings.categories).toHaveLength(3);
  });
});

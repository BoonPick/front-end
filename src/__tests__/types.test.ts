import { describe, it, expect } from "vitest";
import type {
  Category,
  User,
  BoardItem,
  Recommendation,
  NotificationCategory,
  NotificationSettings,
} from "../types/index";

describe("Category type", () => {
  it("accepts 'job' as a valid Category value", () => {
    const category: Category = "job";
    expect(category).toBe("job");
  });

  it("accepts 'announcement' as a valid Category value", () => {
    const category: Category = "announcement";
    expect(category).toBe("announcement");
  });

  it("accepts 'scholarship' as a valid Category value", () => {
    const category: Category = "scholarship";
    expect(category).toBe("scholarship");
  });
});

describe("User interface", () => {
  it("constructs a valid User object and verifies all required properties", () => {
    const user: User = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      keywords: ["typescript", "react"],
    };

    expect(user.id).toBe("user-123");
    expect(user.email).toBe("test@example.com");
    expect(user.name).toBe("Test User");
    expect(user.keywords).toEqual(["typescript", "react"]);
  });

  it("constructs a User with an empty keywords array", () => {
    const user: User = {
      id: "user-456",
      email: "empty@example.com",
      name: "No Keywords",
      keywords: [],
    };

    expect(user.keywords).toHaveLength(0);
  });
});

describe("BoardItem interface", () => {
  it("constructs a valid BoardItem with only required properties", () => {
    const item: BoardItem = {
      id: "item-001",
      category: "job",
      title: "Software Engineer",
      summary: "A great job opportunity",
      body: "Full job description here",
      source: "LinkedIn",
      sourceUrl: "https://linkedin.com/jobs/1",
      date: "2026-05-07",
      keywords: ["engineer", "software"],
    };

    expect(item.id).toBe("item-001");
    expect(item.category).toBe("job");
    expect(item.title).toBe("Software Engineer");
    expect(item.summary).toBe("A great job opportunity");
    expect(item.body).toBe("Full job description here");
    expect(item.source).toBe("LinkedIn");
    expect(item.sourceUrl).toBe("https://linkedin.com/jobs/1");
    expect(item.date).toBe("2026-05-07");
    expect(item.keywords).toEqual(["engineer", "software"]);
  });

  it("constructs a valid BoardItem with all optional properties set", () => {
    const item: BoardItem = {
      id: "item-002",
      category: "job",
      title: "Full-time Developer",
      summary: "Developer role",
      body: "Details about the role",
      source: "Company Site",
      sourceUrl: "https://company.com/jobs/2",
      date: "2026-05-01",
      keywords: ["developer"],
      employment: "Full-time",
      workType: "Remote",
      duty: "Backend",
      deadline: "2026-06-01",
      isAlwaysOpen: false,
    };

    expect(item.employment).toBe("Full-time");
    expect(item.workType).toBe("Remote");
    expect(item.duty).toBe("Backend");
    expect(item.deadline).toBe("2026-06-01");
    expect(item.isAlwaysOpen).toBe(false);
  });

  it("constructs a BoardItem with optional properties set to null", () => {
    const item: BoardItem = {
      id: "item-003",
      category: "announcement",
      title: "Notice",
      summary: "Important notice",
      body: "Notice body",
      source: "Admin",
      sourceUrl: "https://example.com/notice/3",
      date: "2026-04-20",
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
      id: "item-004",
      category: "scholarship",
      title: "Scholarship Program",
      summary: "Annual scholarship",
      body: "Scholarship details",
      source: "University",
      sourceUrl: "https://uni.edu/scholarship",
      date: "2026-03-15",
      keywords: ["scholarship"],
      isAlwaysOpen: true,
    };

    expect(item.isAlwaysOpen).toBe(true);
  });
});

describe("Recommendation interface", () => {
  it("constructs a valid Recommendation object and verifies all properties", () => {
    const recommendation: Recommendation = {
      itemId: "item-001",
      matchScore: 0.95,
      matchReason: "Strong match based on keywords",
      preparationTips: ["Update your resume", "Practice coding interviews"],
    };

    expect(recommendation.itemId).toBe("item-001");
    expect(recommendation.matchScore).toBe(0.95);
    expect(recommendation.matchReason).toBe("Strong match based on keywords");
    expect(recommendation.preparationTips).toEqual([
      "Update your resume",
      "Practice coding interviews",
    ]);
  });

  it("constructs a Recommendation with an empty preparationTips array", () => {
    const recommendation: Recommendation = {
      itemId: "item-002",
      matchScore: 0.5,
      matchReason: "Partial match",
      preparationTips: [],
    };

    expect(recommendation.preparationTips).toHaveLength(0);
  });
});

describe("NotificationCategory type", () => {
  it("accepts 'announcement' as a valid NotificationCategory value", () => {
    const category: NotificationCategory = "announcement";
    expect(category).toBe("announcement");
  });

  it("accepts 'scholarship' as a valid NotificationCategory value", () => {
    const category: NotificationCategory = "scholarship";
    expect(category).toBe("scholarship");
  });

  it("accepts 'job' as a valid NotificationCategory value", () => {
    const category: NotificationCategory = "job";
    expect(category).toBe("job");
  });
});

describe("NotificationSettings interface", () => {
  it("constructs a valid NotificationSettings object with all properties", () => {
    const settings: NotificationSettings = {
      categories: ["job", "announcement"],
      duties: ["Backend", "Frontend"],
      work_types: ["Remote", "On-site"],
      search: "react developer",
      keywords: ["react", "typescript"],
    };

    expect(settings.categories).toEqual(["job", "announcement"]);
    expect(settings.duties).toEqual(["Backend", "Frontend"]);
    expect(settings.work_types).toEqual(["Remote", "On-site"]);
    expect(settings.search).toBe("react developer");
    expect(settings.keywords).toEqual(["react", "typescript"]);
  });

  it("constructs a NotificationSettings with empty arrays and blank search string", () => {
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

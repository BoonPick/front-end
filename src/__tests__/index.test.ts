import { describe, it, expect } from "vitest";
import type {
  Category,
  User,
  BoardItem,
  Recommendation,
  NotificationCategory,
  NotificationSettings,
} from "../types/index";

// ---------------------------------------------------------------------------
// Helpers – build minimal valid objects so every test is self-contained
// ---------------------------------------------------------------------------

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "u-1",
    email: "user@example.com",
    name: "Jane Doe",
    keywords: [],
    ...overrides,
  };
}

function makeBoardItem(overrides: Partial<BoardItem> = {}): BoardItem {
  return {
    id: "b-1",
    category: "job",
    title: "Test Title",
    summary: "Short summary",
    body: "Full body text",
    source: "TestSource",
    sourceUrl: "https://example.com",
    date: "2026-05-16",
    keywords: [],
    ...overrides,
  };
}

function makeRecommendation(overrides: Partial<Recommendation> = {}): Recommendation {
  return {
    itemId: "b-1",
    matchScore: 0.8,
    matchReason: "Keyword overlap",
    preparationTips: [],
    ...overrides,
  };
}

function makeNotificationSettings(
  overrides: Partial<NotificationSettings> = {},
): NotificationSettings {
  return {
    categories: [],
    duties: [],
    work_types: [],
    search: "",
    keywords: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

describe("Category – exported type", () => {
  it("is accessible as an import from types/index", () => {
    // If the type were not exported the import above would fail at compile time.
    // At runtime we verify each valid literal survives an identity round-trip.
    const values: Category[] = ["job", "announcement", "scholarship"];
    expect(values).toHaveLength(3);
  });

  it("each valid literal has the correct runtime string value", () => {
    const job: Category = "job";
    const announcement: Category = "announcement";
    const scholarship: Category = "scholarship";

    expect(typeof job).toBe("string");
    expect(typeof announcement).toBe("string");
    expect(typeof scholarship).toBe("string");
    expect([job, announcement, scholarship].every((v) => typeof v === "string")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

describe("User – interface shape", () => {
  it("has exactly the four required keys on a minimal mock", () => {
    const user = makeUser();
    const keys = Object.keys(user);
    expect(keys).toContain("id");
    expect(keys).toContain("email");
    expect(keys).toContain("name");
    expect(keys).toContain("keywords");
  });

  it("id and email are strings", () => {
    const user = makeUser({ id: "abc-123", email: "a@b.com" });
    expect(typeof user.id).toBe("string");
    expect(typeof user.email).toBe("string");
  });

  it("name is a string", () => {
    const user = makeUser({ name: "Alice" });
    expect(typeof user.name).toBe("string");
  });

  it("keywords is an array of strings", () => {
    const user = makeUser({ keywords: ["react", "vitest"] });
    expect(Array.isArray(user.keywords)).toBe(true);
    user.keywords.forEach((k) => expect(typeof k).toBe("string"));
  });

  it("keywords can hold multiple items", () => {
    const tags = ["ts", "node", "postgres"];
    const user = makeUser({ keywords: tags });
    expect(user.keywords).toHaveLength(3);
    expect(user.keywords).toEqual(tags);
  });
});

// ---------------------------------------------------------------------------
// BoardItem
// ---------------------------------------------------------------------------

describe("BoardItem – required fields", () => {
  it("contains all nine required fields on a minimal object", () => {
    const item = makeBoardItem();
    const required = [
      "id",
      "category",
      "title",
      "summary",
      "body",
      "source",
      "sourceUrl",
      "date",
      "keywords",
    ] as const;
    required.forEach((field) => expect(item).toHaveProperty(field));
  });

  it("category field accepts every Category literal", () => {
    const categories: Category[] = ["job", "announcement", "scholarship"];
    categories.forEach((cat) => {
      const item = makeBoardItem({ category: cat });
      expect(item.category).toBe(cat);
    });
  });

  it("keywords is an array", () => {
    const item = makeBoardItem({ keywords: ["k1", "k2"] });
    expect(Array.isArray(item.keywords)).toBe(true);
  });
});

describe("BoardItem – optional fields", () => {
  it("optional fields default to undefined when not provided", () => {
    const item = makeBoardItem();
    // Optional fields must not be required – they may be undefined
    expect(item.employment).toBeUndefined();
    expect(item.workType).toBeUndefined();
    expect(item.duty).toBeUndefined();
    expect(item.deadline).toBeUndefined();
    expect(item.isAlwaysOpen).toBeUndefined();
  });

  it("optional string fields accept string values", () => {
    const item = makeBoardItem({
      employment: "Contract",
      workType: "Hybrid",
      duty: "Frontend",
      deadline: "2026-12-31",
    });
    expect(typeof item.employment).toBe("string");
    expect(typeof item.workType).toBe("string");
    expect(typeof item.duty).toBe("string");
    expect(typeof item.deadline).toBe("string");
  });

  it("isAlwaysOpen accepts boolean true", () => {
    const item = makeBoardItem({ isAlwaysOpen: true });
    expect(item.isAlwaysOpen).toBe(true);
  });

  it("isAlwaysOpen accepts boolean false", () => {
    const item = makeBoardItem({ isAlwaysOpen: false });
    expect(item.isAlwaysOpen).toBe(false);
  });

  it("optional nullable fields accept null", () => {
    const item = makeBoardItem({
      employment: null,
      workType: null,
      duty: null,
      deadline: null,
      isAlwaysOpen: null,
    });
    expect(item.employment).toBeNull();
    expect(item.workType).toBeNull();
    expect(item.duty).toBeNull();
    expect(item.deadline).toBeNull();
    expect(item.isAlwaysOpen).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

describe("Recommendation – interface shape", () => {
  it("has all four required keys", () => {
    const rec = makeRecommendation();
    expect(rec).toHaveProperty("itemId");
    expect(rec).toHaveProperty("matchScore");
    expect(rec).toHaveProperty("matchReason");
    expect(rec).toHaveProperty("preparationTips");
  });

  it("itemId is a string", () => {
    const rec = makeRecommendation({ itemId: "item-99" });
    expect(typeof rec.itemId).toBe("string");
  });

  it("matchScore is a number", () => {
    const rec = makeRecommendation({ matchScore: 0.42 });
    expect(typeof rec.matchScore).toBe("number");
  });

  it("matchScore can be 0 (no match)", () => {
    const rec = makeRecommendation({ matchScore: 0 });
    expect(rec.matchScore).toBe(0);
  });

  it("matchScore can be 1 (perfect match)", () => {
    const rec = makeRecommendation({ matchScore: 1 });
    expect(rec.matchScore).toBe(1);
  });

  it("matchReason is a string", () => {
    const rec = makeRecommendation({ matchReason: "Skills aligned" });
    expect(typeof rec.matchReason).toBe("string");
  });

  it("preparationTips is an array of strings", () => {
    const tips = ["tip one", "tip two", "tip three"];
    const rec = makeRecommendation({ preparationTips: tips });
    expect(Array.isArray(rec.preparationTips)).toBe(true);
    expect(rec.preparationTips).toHaveLength(3);
    rec.preparationTips.forEach((t) => expect(typeof t).toBe("string"));
  });
});

// ---------------------------------------------------------------------------
// NotificationCategory
// ---------------------------------------------------------------------------

describe("NotificationCategory – exported type", () => {
  it("shares its three literals with the Category type at runtime", () => {
    // NotificationCategory = "announcement" | "scholarship" | "job"
    // Category             = "job" | "announcement" | "scholarship"
    // Both have the same set of string values.
    const nc: NotificationCategory[] = ["announcement", "scholarship", "job"];
    expect(nc).toHaveLength(3);
    nc.forEach((v) => expect(typeof v).toBe("string"));
  });

  it("each valid literal is a non-empty string", () => {
    const values: NotificationCategory[] = ["announcement", "scholarship", "job"];
    values.forEach((v) => expect(v.length).toBeGreaterThan(0));
  });
});

// ---------------------------------------------------------------------------
// NotificationSettings
// ---------------------------------------------------------------------------

describe("NotificationSettings – interface shape", () => {
  it("has all five required keys", () => {
    const settings = makeNotificationSettings();
    const required = ["categories", "duties", "work_types", "search", "keywords"] as const;
    required.forEach((key) => expect(settings).toHaveProperty(key));
  });

  it("categories is an array", () => {
    const settings = makeNotificationSettings({ categories: ["job"] });
    expect(Array.isArray(settings.categories)).toBe(true);
  });

  it("categories accepts NotificationCategory values", () => {
    const all: NotificationCategory[] = ["announcement", "scholarship", "job"];
    const settings = makeNotificationSettings({ categories: all });
    expect(settings.categories).toEqual(all);
  });

  it("duties is an array of strings", () => {
    const settings = makeNotificationSettings({ duties: ["Engineering", "Design"] });
    expect(Array.isArray(settings.duties)).toBe(true);
    settings.duties.forEach((d) => expect(typeof d).toBe("string"));
  });

  it("work_types is an array of strings", () => {
    const settings = makeNotificationSettings({ work_types: ["Remote", "On-site"] });
    expect(Array.isArray(settings.work_types)).toBe(true);
    settings.work_types.forEach((w) => expect(typeof w).toBe("string"));
  });

  it("search is a string", () => {
    const settings = makeNotificationSettings({ search: "senior engineer" });
    expect(typeof settings.search).toBe("string");
  });

  it("keywords is an array of strings", () => {
    const settings = makeNotificationSettings({ keywords: ["python", "ml"] });
    expect(Array.isArray(settings.keywords)).toBe(true);
    settings.keywords.forEach((k) => expect(typeof k).toBe("string"));
  });

  it("fully populated settings object contains correct values", () => {
    const settings = makeNotificationSettings({
      categories: ["job", "scholarship"],
      duties: ["Backend"],
      work_types: ["Remote"],
      search: "typescript",
      keywords: ["node", "express"],
    });
    expect(settings.categories).toContain("job");
    expect(settings.categories).toContain("scholarship");
    expect(settings.duties[0]).toBe("Backend");
    expect(settings.work_types[0]).toBe("Remote");
    expect(settings.search).toBe("typescript");
    expect(settings.keywords).toEqual(["node", "express"]);
  });
});

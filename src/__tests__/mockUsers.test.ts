import { describe, it, expect } from "vitest";
import { mockUsers } from "@/mocks/users";

describe("mockUsers", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("each user has required fields", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(typeof user.email).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(Array.isArray(user.keywords)).toBe(true);
    }
  });

  it("all user ids are unique", () => {
    const ids = mockUsers.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("email fields contain @", () => {
    for (const user of mockUsers) {
      expect(user.email).toContain("@");
    }
  });

  it("name fields are non-empty strings", () => {
    for (const user of mockUsers) {
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it("keywords are arrays of strings", () => {
    for (const user of mockUsers) {
      for (const kw of user.keywords) {
        expect(typeof kw).toBe("string");
      }
    }
  });

  it("each user has at least one keyword", () => {
    for (const user of mockUsers) {
      expect(user.keywords.length).toBeGreaterThan(0);
    }
  });
});

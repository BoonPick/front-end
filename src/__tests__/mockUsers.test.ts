import { describe, it, expect } from "vitest";
import { mockUsers } from "@/mocks/users";

describe("mockUsers", () => {
  it("should be a non-empty array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("every user should have required string fields", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);

      expect(typeof user.email).toBe("string");
      expect(user.email.length).toBeGreaterThan(0);

      expect(typeof user.name).toBe("string");
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it("every user email should contain an '@' symbol", () => {
    for (const user of mockUsers) {
      expect(user.email).toContain("@");
    }
  });

  it("every user should have a keywords array", () => {
    for (const user of mockUsers) {
      expect(Array.isArray(user.keywords)).toBe(true);
      for (const keyword of user.keywords) {
        expect(typeof keyword).toBe("string");
      }
    }
  });

  it("every user id should be unique", () => {
    const ids = mockUsers.map((user) => user.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

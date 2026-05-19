import { describe, it, expect } from "vitest";
import { mockUsers } from "@/mocks/users";

describe("mockUsers", () => {
  it("should be an array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
  });

  it("should not be empty", () => {
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("should have the expected number of users", () => {
    expect(mockUsers).toHaveLength(2);
  });

  it("each user should have a non-empty string id", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);
    }
  });

  it("each user should have a non-empty string email", () => {
    for (const user of mockUsers) {
      expect(typeof user.email).toBe("string");
      expect(user.email.length).toBeGreaterThan(0);
    }
  });

  it("each user should have a non-empty string name", () => {
    for (const user of mockUsers) {
      expect(typeof user.name).toBe("string");
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it("each user should have a keywords array", () => {
    for (const user of mockUsers) {
      expect(Array.isArray(user.keywords)).toBe(true);
    }
  });

  it("each keyword should be a non-empty string", () => {
    for (const user of mockUsers) {
      for (const keyword of user.keywords) {
        expect(typeof keyword).toBe("string");
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it("should have no duplicate user ids", () => {
    const ids = mockUsers.map((user) => user.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have no duplicate user emails", () => {
    const emails = mockUsers.map((user) => user.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(emails.length);
  });
});

import { describe, it, expect } from "vitest";
import { mockUsers } from "@/mocks/users";

describe("mockUsers", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("each user has an id that is a non-empty string", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);
    }
  });

  it("each user has an email that is a non-empty string", () => {
    for (const user of mockUsers) {
      expect(typeof user.email).toBe("string");
      expect(user.email.length).toBeGreaterThan(0);
    }
  });

  it("each user has a name that is a non-empty string", () => {
    for (const user of mockUsers) {
      expect(typeof user.name).toBe("string");
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it("each user has a keywords array", () => {
    for (const user of mockUsers) {
      expect(Array.isArray(user.keywords)).toBe(true);
    }
  });

  it("each keyword in every user is a non-empty string", () => {
    for (const user of mockUsers) {
      for (const keyword of user.keywords) {
        expect(typeof keyword).toBe("string");
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it("all user ids are unique", () => {
    const ids = mockUsers.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each user email contains an @ symbol", () => {
    for (const user of mockUsers) {
      expect(user.email).toContain("@");
    }
  });

  it("no required fields are null or undefined", () => {
    for (const user of mockUsers) {
      expect(user.id).not.toBeNull();
      expect(user.id).not.toBeUndefined();
      expect(user.email).not.toBeNull();
      expect(user.email).not.toBeUndefined();
      expect(user.name).not.toBeNull();
      expect(user.name).not.toBeUndefined();
      expect(user.keywords).not.toBeNull();
      expect(user.keywords).not.toBeUndefined();
    }
  });
});

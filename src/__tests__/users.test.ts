import { describe, it, expect } from "vitest";
import { mockUsers } from "../mocks/users";

describe("mockUsers", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("every user has a non-empty string id", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);
    }
  });

  it("every user has a non-empty string email", () => {
    for (const user of mockUsers) {
      expect(typeof user.email).toBe("string");
      expect(user.email.length).toBeGreaterThan(0);
    }
  });

  it("every user email contains an @ character", () => {
    for (const user of mockUsers) {
      expect(user.email).toContain("@");
    }
  });

  it("every user has a non-empty string name", () => {
    for (const user of mockUsers) {
      expect(typeof user.name).toBe("string");
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it("every user has a keywords array", () => {
    for (const user of mockUsers) {
      expect(Array.isArray(user.keywords)).toBe(true);
    }
  });

  it("every keyword in every user is a non-empty string", () => {
    for (const user of mockUsers) {
      for (const keyword of user.keywords) {
        expect(typeof keyword).toBe("string");
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it("all user ids are unique", () => {
    const ids = mockUsers.map((user) => user.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all user emails are unique", () => {
    const emails = mockUsers.map((user) => user.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(emails.length);
  });
});

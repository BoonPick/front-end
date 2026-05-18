import { describe, it, expect } from "vitest";
import { mockUsers } from "../mocks/users";

describe("mockUsers", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("contains 2 users", () => {
    expect(mockUsers).toHaveLength(2);
  });

  it("every user has a non-empty string id", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);
    }
  });

  it("every user has a non-empty email", () => {
    for (const user of mockUsers) {
      expect(typeof user.email).toBe("string");
      expect(user.email.length).toBeGreaterThan(0);
    }
  });

  it("every user email contains '@'", () => {
    for (const user of mockUsers) {
      expect(user.email).toContain("@");
    }
  });

  it("every user has a non-empty name", () => {
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

  it("every keyword in each user is a non-empty string", () => {
    for (const user of mockUsers) {
      for (const kw of user.keywords) {
        expect(typeof kw).toBe("string");
        expect(kw.length).toBeGreaterThan(0);
      }
    }
  });

  it("all user ids are unique", () => {
    const ids = mockUsers.map((user) => user.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(mockUsers.length);
  });

  it("all user emails are unique", () => {
    const emails = mockUsers.map((user) => user.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(mockUsers.length);
  });

  it("first user has the expected shape and values", () => {
    const first = mockUsers[0];
    expect(first.id).toBe("1");
    expect(first.email).toBe("test@boonpick.com");
    expect(first.name).toBe("테스트 유저");
    expect(first.keywords).toContain("공무원");
    expect(first.keywords).toContain("IT");
  });

  it("second user has the expected shape and values", () => {
    const second = mockUsers[1];
    expect(second.id).toBe("2");
    expect(second.email).toBe("student@boonpick.com");
    expect(second.name).toBe("대학생");
    expect(second.keywords).toContain("장학금");
    expect(second.keywords).toContain("인턴");
  });
});

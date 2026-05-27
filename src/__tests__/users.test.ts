import { describe, it, expect } from "vitest";
import { mockUsers } from "@/mocks/users";

describe("mockUsers", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("has exactly 2 users", () => {
    expect(mockUsers).toHaveLength(2);
  });

  it("every user has a string id", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);
    }
  });

  it("every user has a string email", () => {
    for (const user of mockUsers) {
      expect(typeof user.email).toBe("string");
      expect(user.email.length).toBeGreaterThan(0);
    }
  });

  it("every user has a string name", () => {
    for (const user of mockUsers) {
      expect(typeof user.name).toBe("string");
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it("every user has a keywords array with at least one string entry", () => {
    for (const user of mockUsers) {
      expect(Array.isArray(user.keywords)).toBe(true);
      expect(user.keywords.length).toBeGreaterThan(0);
      for (const kw of user.keywords) {
        expect(typeof kw).toBe("string");
      }
    }
  });

  it("all user ids are unique", () => {
    const ids = mockUsers.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("first user matches expected shape", () => {
    const first = mockUsers[0];
    expect(first.id).toBe("1");
    expect(first.email).toBe("test@boonpick.com");
    expect(first.name).toBe("테스트 유저");
    expect(first.keywords).toContain("공무원");
    expect(first.keywords).toContain("IT");
  });

  it("second user matches expected shape", () => {
    const second = mockUsers[1];
    expect(second.id).toBe("2");
    expect(second.email).toBe("student@boonpick.com");
    expect(second.name).toBe("대학생");
    expect(second.keywords).toContain("장학금");
    expect(second.keywords).toContain("인턴");
  });
});

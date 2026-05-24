import { describe, it, expect } from "vitest";
import { mockUsers } from "@/mocks/users";

describe("mockUsers", () => {
  it("is an array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
  });

  it("is non-empty", () => {
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("contains exactly 2 users", () => {
    expect(mockUsers).toHaveLength(2);
  });

  it("every item has a string id", () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);
    }
  });

  it("every item has a valid email string", () => {
    for (const user of mockUsers) {
      expect(typeof user.email).toBe("string");
      expect(user.email).toMatch(/@/);
    }
  });

  it("every item has a non-empty name string", () => {
    for (const user of mockUsers) {
      expect(typeof user.name).toBe("string");
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it("every item has a keywords array of strings", () => {
    for (const user of mockUsers) {
      expect(Array.isArray(user.keywords)).toBe(true);
      for (const kw of user.keywords) {
        expect(typeof kw).toBe("string");
      }
    }
  });

  it("every item has a non-empty keywords array", () => {
    for (const user of mockUsers) {
      expect(user.keywords.length).toBeGreaterThan(0);
    }
  });

  it("ids are unique", () => {
    const ids = mockUsers.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("first user has expected field values", () => {
    const first = mockUsers[0];
    expect(first.id).toBe("1");
    expect(first.email).toBe("test@boonpick.com");
    expect(first.name).toBe("테스트 유저");
    expect(first.keywords).toEqual(["공무원", "IT"]);
  });

  it("second user has expected field values", () => {
    const second = mockUsers[1];
    expect(second.id).toBe("2");
    expect(second.email).toBe("student@boonpick.com");
    expect(second.name).toBe("대학생");
    expect(second.keywords).toEqual(["장학금", "인턴"]);
  });
});

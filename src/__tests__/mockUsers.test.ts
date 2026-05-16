import { describe, it, expect } from "vitest";
import { mockUsers } from "@/mocks/users";

describe("mockUsers", () => {
  it("is defined", () => {
    expect(mockUsers).toBeDefined();
  });

  it("is an array", () => {
    expect(Array.isArray(mockUsers)).toBe(true);
  });

  it("is non-empty", () => {
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("contains 2 users", () => {
    expect(mockUsers).toHaveLength(2);
  });

  it("every user has a non-empty string id", () => {
    mockUsers.forEach((user) => {
      expect(typeof user.id).toBe("string");
      expect(user.id.length).toBeGreaterThan(0);
    });
  });

  it("every user has a non-empty string email", () => {
    mockUsers.forEach((user) => {
      expect(typeof user.email).toBe("string");
      expect(user.email.length).toBeGreaterThan(0);
    });
  });

  it("every user has a non-empty string name", () => {
    mockUsers.forEach((user) => {
      expect(typeof user.name).toBe("string");
      expect(user.name.length).toBeGreaterThan(0);
    });
  });

  it("every user has a keywords array", () => {
    mockUsers.forEach((user) => {
      expect(Array.isArray(user.keywords)).toBe(true);
    });
  });

  it("every user's keywords array contains only strings", () => {
    mockUsers.forEach((user) => {
      user.keywords.forEach((keyword) => {
        expect(typeof keyword).toBe("string");
      });
    });
  });

  it("all ids are unique", () => {
    const ids = mockUsers.map((user) => user.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(mockUsers.length);
  });

  it("all emails are unique", () => {
    const emails = mockUsers.map((user) => user.email);
    const unique = new Set(emails);
    expect(unique.size).toBe(mockUsers.length);
  });

  it("first user matches expected shape", () => {
    const first = mockUsers[0];
    expect(first.id).toBe("1");
    expect(first.email).toBe("test@boonpick.com");
    expect(first.name).toBe("테스트 유저");
    expect(Array.isArray(first.keywords)).toBe(true);
    expect(first.keywords.length).toBeGreaterThan(0);
  });

  it("second user matches expected shape", () => {
    const second = mockUsers[1];
    expect(second.id).toBe("2");
    expect(second.email).toBe("student@boonpick.com");
    expect(second.name).toBe("대학생");
    expect(Array.isArray(second.keywords)).toBe(true);
    expect(second.keywords.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import { mockUsers } from '../mocks/users';

describe('mockUsers', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(mockUsers)).toBe(true);
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it('has exactly 2 items', () => {
    expect(mockUsers).toHaveLength(2);
  });

  it('every user has required fields', () => {
    for (const user of mockUsers) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('keywords');
    }
  });

  it('every user has non-empty string fields', () => {
    for (const user of mockUsers) {
      expect(typeof user.id).toBe('string');
      expect(user.id.length).toBeGreaterThan(0);
      expect(typeof user.email).toBe('string');
      expect(user.email.length).toBeGreaterThan(0);
      expect(typeof user.name).toBe('string');
      expect(user.name.length).toBeGreaterThan(0);
    }
  });

  it('every user has a valid email address', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const user of mockUsers) {
      expect(user.email).toMatch(emailRegex);
    }
  });

  it('every user has a keywords array', () => {
    for (const user of mockUsers) {
      expect(Array.isArray(user.keywords)).toBe(true);
      expect(user.keywords.length).toBeGreaterThan(0);
      for (const keyword of user.keywords) {
        expect(typeof keyword).toBe('string');
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it('every user has a unique id', () => {
    const ids = mockUsers.map((user) => user.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(mockUsers.length);
  });

  it('every user has a unique email', () => {
    const emails = mockUsers.map((user) => user.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(mockUsers.length);
  });

  it('first user has the expected shape', () => {
    const first = mockUsers[0];
    expect(first.id).toBe('1');
    expect(first.email).toBe('test@boonpick.com');
    expect(first.name).toBe('테스트 유저');
    expect(Array.isArray(first.keywords)).toBe(true);
    expect(first.keywords).toContain('공무원');
    expect(first.keywords).toContain('IT');
  });

  it('second user has the expected shape', () => {
    const second = mockUsers[1];
    expect(second.id).toBe('2');
    expect(second.email).toBe('student@boonpick.com');
    expect(second.name).toBe('대학생');
    expect(Array.isArray(second.keywords)).toBe(true);
    expect(second.keywords).toContain('장학금');
    expect(second.keywords).toContain('인턴');
  });
});

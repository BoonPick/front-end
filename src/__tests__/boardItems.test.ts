import { describe, it, expect } from 'vitest';
import { mockBoardItems } from '../mocks/boardItems';

describe('mockBoardItems', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(mockBoardItems)).toBe(true);
    expect(mockBoardItems.length).toBeGreaterThan(0);
  });

  it('has exactly 15 items', () => {
    expect(mockBoardItems).toHaveLength(15);
  });

  it('every item has required fields', () => {
    for (const item of mockBoardItems) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('summary');
      expect(item).toHaveProperty('body');
      expect(item).toHaveProperty('source');
      expect(item).toHaveProperty('sourceUrl');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('keywords');
    }
  });

  it('every item has non-empty string fields', () => {
    for (const item of mockBoardItems) {
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(typeof item.title).toBe('string');
      expect(item.title.length).toBeGreaterThan(0);
      expect(typeof item.summary).toBe('string');
      expect(item.summary.length).toBeGreaterThan(0);
      expect(typeof item.body).toBe('string');
      expect(item.body.length).toBeGreaterThan(0);
      expect(typeof item.source).toBe('string');
      expect(item.source.length).toBeGreaterThan(0);
      expect(typeof item.sourceUrl).toBe('string');
      expect(item.sourceUrl.length).toBeGreaterThan(0);
      expect(typeof item.date).toBe('string');
      expect(item.date.length).toBeGreaterThan(0);
    }
  });

  it('every item has a valid category', () => {
    const validCategories = ['job', 'scholarship', 'announcement'];
    for (const item of mockBoardItems) {
      expect(validCategories).toContain(item.category);
    }
  });

  it('every item has a keywords array', () => {
    for (const item of mockBoardItems) {
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThan(0);
      for (const keyword of item.keywords) {
        expect(typeof keyword).toBe('string');
        expect(keyword.length).toBeGreaterThan(0);
      }
    }
  });

  it('every item has a unique id', () => {
    const ids = mockBoardItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(mockBoardItems.length);
  });

  it('date fields follow YYYY-MM-DD format', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    for (const item of mockBoardItems) {
      expect(item.date).toMatch(dateRegex);
    }
  });

  it('sourceUrl fields are valid URLs', () => {
    for (const item of mockBoardItems) {
      expect(() => new URL(item.sourceUrl)).not.toThrow();
    }
  });

  it('contains items of all three categories', () => {
    const categories = new Set(mockBoardItems.map((item) => item.category));
    expect(categories.has('job')).toBe(true);
    expect(categories.has('scholarship')).toBe(true);
    expect(categories.has('announcement')).toBe(true);
  });

  it('first item has the expected shape', () => {
    const first = mockBoardItems[0];
    expect(first.id).toBe('1');
    expect(first.category).toBe('job');
    expect(typeof first.title).toBe('string');
    expect(typeof first.summary).toBe('string');
    expect(typeof first.body).toBe('string');
    expect(Array.isArray(first.keywords)).toBe(true);
  });
});

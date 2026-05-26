import { describe, it, expect } from 'vitest';
import type {
  Category,
  User,
  BoardItem,
  Recommendation,
  NotificationCategory,
  NotificationSettings,
} from '../types/index';

describe('types/index', () => {
  describe('Category', () => {
    it('accepts valid category values', () => {
      const job: Category = 'job';
      const announcement: Category = 'announcement';
      const scholarship: Category = 'scholarship';

      expect(job).toBe('job');
      expect(announcement).toBe('announcement');
      expect(scholarship).toBe('scholarship');
    });
  });

  describe('User', () => {
    it('creates a valid User object with all required fields', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        keywords: ['software', 'developer'],
      };

      expect(user.id).toBe('user-1');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.keywords).toEqual(['software', 'developer']);
    });

    it('creates a User with an empty keywords array', () => {
      const user: User = {
        id: 'user-2',
        email: 'empty@example.com',
        name: 'Empty Keywords User',
        keywords: [],
      };

      expect(user.keywords).toHaveLength(0);
    });
  });

  describe('BoardItem', () => {
    it('creates a valid BoardItem with only required fields', () => {
      const item: BoardItem = {
        id: 'item-1',
        category: 'job',
        title: 'Software Engineer',
        summary: 'A great job opportunity',
        body: 'Full job description here',
        source: 'Company XYZ',
        sourceUrl: 'https://example.com/job/1',
        date: '2026-05-26',
        keywords: ['typescript', 'react'],
      };

      expect(item.id).toBe('item-1');
      expect(item.category).toBe('job');
      expect(item.title).toBe('Software Engineer');
      expect(item.summary).toBe('A great job opportunity');
      expect(item.body).toBe('Full job description here');
      expect(item.source).toBe('Company XYZ');
      expect(item.sourceUrl).toBe('https://example.com/job/1');
      expect(item.date).toBe('2026-05-26');
      expect(item.keywords).toEqual(['typescript', 'react']);
    });

    it('creates a valid BoardItem with all optional fields set', () => {
      const item: BoardItem = {
        id: 'item-2',
        category: 'announcement',
        title: 'Company Announcement',
        summary: 'Important news',
        body: 'Details of announcement',
        source: 'Company ABC',
        sourceUrl: 'https://example.com/announcement/1',
        date: '2026-05-26',
        keywords: ['announcement'],
        employment: 'Full-time',
        workType: 'Remote',
        duty: 'Engineering',
        deadline: '2026-06-30',
        isAlwaysOpen: false,
      };

      expect(item.employment).toBe('Full-time');
      expect(item.workType).toBe('Remote');
      expect(item.duty).toBe('Engineering');
      expect(item.deadline).toBe('2026-06-30');
      expect(item.isAlwaysOpen).toBe(false);
    });

    it('creates a valid BoardItem with optional fields set to null', () => {
      const item: BoardItem = {
        id: 'item-3',
        category: 'scholarship',
        title: 'Scholarship Opportunity',
        summary: 'Apply now',
        body: 'Scholarship details',
        source: 'University',
        sourceUrl: 'https://example.com/scholarship/1',
        date: '2026-05-26',
        keywords: [],
        employment: null,
        workType: null,
        duty: null,
        deadline: null,
        isAlwaysOpen: null,
      };

      expect(item.employment).toBeNull();
      expect(item.workType).toBeNull();
      expect(item.duty).toBeNull();
      expect(item.deadline).toBeNull();
      expect(item.isAlwaysOpen).toBeNull();
    });

    it('creates a BoardItem with isAlwaysOpen set to true', () => {
      const item: BoardItem = {
        id: 'item-4',
        category: 'job',
        title: 'Always Open Position',
        summary: 'We are always hiring',
        body: 'Details',
        source: 'Corp',
        sourceUrl: 'https://example.com/job/2',
        date: '2026-05-26',
        keywords: [],
        isAlwaysOpen: true,
      };

      expect(item.isAlwaysOpen).toBe(true);
    });

    it('accepts all three Category values for the category field', () => {
      const categories: Category[] = ['job', 'announcement', 'scholarship'];
      categories.forEach((category) => {
        const item: BoardItem = {
          id: `item-${category}`,
          category,
          title: 'Test',
          summary: 'Test summary',
          body: 'Test body',
          source: 'Test source',
          sourceUrl: 'https://example.com',
          date: '2026-05-26',
          keywords: [],
        };
        expect(item.category).toBe(category);
      });
    });
  });

  describe('Recommendation', () => {
    it('creates a valid Recommendation object', () => {
      const recommendation: Recommendation = {
        itemId: 'item-1',
        matchScore: 0.95,
        matchReason: 'Strong match with your skills',
        preparationTips: ['Learn TypeScript', 'Practice algorithms'],
      };

      expect(recommendation.itemId).toBe('item-1');
      expect(recommendation.matchScore).toBe(0.95);
      expect(recommendation.matchReason).toBe('Strong match with your skills');
      expect(recommendation.preparationTips).toEqual([
        'Learn TypeScript',
        'Practice algorithms',
      ]);
    });

    it('creates a Recommendation with an empty preparationTips array', () => {
      const recommendation: Recommendation = {
        itemId: 'item-2',
        matchScore: 0.5,
        matchReason: 'Partial match',
        preparationTips: [],
      };

      expect(recommendation.preparationTips).toHaveLength(0);
    });

    it('creates a Recommendation with a zero matchScore', () => {
      const recommendation: Recommendation = {
        itemId: 'item-3',
        matchScore: 0,
        matchReason: 'No match',
        preparationTips: [],
      };

      expect(recommendation.matchScore).toBe(0);
    });
  });

  describe('NotificationCategory', () => {
    it('accepts valid notification category values', () => {
      const announcement: NotificationCategory = 'announcement';
      const scholarship: NotificationCategory = 'scholarship';
      const job: NotificationCategory = 'job';

      expect(announcement).toBe('announcement');
      expect(scholarship).toBe('scholarship');
      expect(job).toBe('job');
    });
  });

  describe('NotificationSettings', () => {
    it('creates a valid NotificationSettings object with all fields', () => {
      const settings: NotificationSettings = {
        categories: ['job', 'announcement', 'scholarship'],
        duties: ['Engineering', 'Design'],
        work_types: ['Remote', 'On-site'],
        search: 'frontend developer',
        keywords: ['react', 'typescript'],
      };

      expect(settings.categories).toEqual(['job', 'announcement', 'scholarship']);
      expect(settings.duties).toEqual(['Engineering', 'Design']);
      expect(settings.work_types).toEqual(['Remote', 'On-site']);
      expect(settings.search).toBe('frontend developer');
      expect(settings.keywords).toEqual(['react', 'typescript']);
    });

    it('creates a NotificationSettings with empty arrays and empty search', () => {
      const settings: NotificationSettings = {
        categories: [],
        duties: [],
        work_types: [],
        search: '',
        keywords: [],
      };

      expect(settings.categories).toHaveLength(0);
      expect(settings.duties).toHaveLength(0);
      expect(settings.work_types).toHaveLength(0);
      expect(settings.search).toBe('');
      expect(settings.keywords).toHaveLength(0);
    });

    it('creates a NotificationSettings with a subset of categories', () => {
      const settings: NotificationSettings = {
        categories: ['job'],
        duties: [],
        work_types: [],
        search: '',
        keywords: [],
      };

      expect(settings.categories).toHaveLength(1);
      expect(settings.categories[0]).toBe('job');
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';

// Simple in-memory localStorage mock for node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

import { MockDataEngine } from '../MockDataEngine';
import { MockAuthEngine } from '../MockAuthEngine';

describe('MockDataEngine & MockAuthEngine Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should authenticate valid mock student credentials', () => {
    const user = MockAuthEngine.authenticateMock('student', '123');
    expect(user).not.toBeNull();
    expect(user?.role).toBe('student');
    expect(user?.name).toBe('سامي الطالب');
  });

  it('should reject invalid passwords', () => {
    const user = MockAuthEngine.authenticateMock('student', 'wrongpass');
    expect(user).toBeNull();
  });

  it('should load initial course data', () => {
    const data = MockDataEngine.loadCourses();
    expect(data).toBeDefined();
    expect(data[1]).toBeDefined();
    expect(data[1].name).toBe('مبادئ البرمجة');
  });

  it('should persist new announcement to local storage', () => {
    const initial = MockDataEngine.loadCourses();
    const updated = MockDataEngine.addAnnouncement(initial, 1, {
      title: 'إعلان تجريبي جديد',
      content: 'محتوى الإعلان التجريبي',
      date: '2026-08-04',
      author: 'المعلم',
    });

    expect(updated[1].announcements.length).toBeGreaterThan(initial[1].announcements.length);
    const reloaded = MockDataEngine.loadCourses();
    expect(reloaded[1].announcements.some((a) => a.title === 'إعلان تجريبي جديد')).toBe(true);
  });
});

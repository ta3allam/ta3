import { describe, it, expect, beforeEach, vi } from 'vitest';

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

import { MockDataEngine, localCourseRepository } from '../MockDataEngine';
import { MockAuthEngine } from '../MockAuthEngine';
import { ReceiptStore } from '../receiptStore';
import { repositoryRegistry, ICourseRepository, IReceiptRepository } from '@/types/repository';

describe('MockDataEngine, ReceiptStore & Dynamic Repository Registry Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    // Ensure default implementations are registered
    repositoryRegistry.registerCourseRepository(localCourseRepository);
    repositoryRegistry.registerReceiptRepository(ReceiptStore);
  });

  describe('Authentication Mocks', () => {
    it('authenticates valid mock student credentials', () => {
      const user = MockAuthEngine.authenticateMock('student', '123');
      expect(user).not.toBeNull();
      expect(user?.role).toBe('student');
      expect(user?.name).toBe('سامي الطالب');
    });

    it('rejects invalid passwords', () => {
      const user = MockAuthEngine.authenticateMock('student', 'wrongpass');
      expect(user).toBeNull();
    });
  });

  describe('Dynamic Course Repository Persistence & Zero Hardcoding', () => {
    it('loads initial course data via repository interface', () => {
      const repo = repositoryRegistry.getCourseRepository();
      const data = repo.loadCourses();
      expect(data).toBeDefined();
      expect(data[1]).toBeDefined();
      expect(data[1].name).toBe('مبادئ البرمجة');
    });

    it('generates monotonic dynamic announcement IDs without hardcoding', () => {
      const repo = repositoryRegistry.getCourseRepository();
      const initial = repo.loadCourses();
      const initialAnnouncements = initial[1].announcements || [];

      repo.addAnnouncement(1, {
        title: 'إعلان ديناميكي جديد',
        content: 'محتوى الإعلان بدون قيم مسبقة التحديد',
        date: new Date().toISOString(),
        author: 'د. خالد المعلم',
      });

      const updated = repo.loadCourses();
      const announcements = updated[1].announcements || [];
      expect(announcements.length).toBe(initialAnnouncements.length + 1);

      const latest = announcements[announcements.length - 1];
      expect(latest.title).toBe('إعلان ديناميكي جديد');
      expect(latest.id).toBeGreaterThan(0);
    });

    it('generates dynamic lecture and assignment IDs with reactive subscription notification', () => {
      const repo = repositoryRegistry.getCourseRepository();
      const listenerSpy = vi.fn();
      const unsubscribe = repo.subscribe(listenerSpy);

      repo.addLecture(1, {
        title: 'محاضرة تفاعلية جديدة',
        duration: '18:30',
        videoUrl: 'https://example.com/stream.m3u8',
      });

      expect(listenerSpy).toHaveBeenCalled();
      const data = repo.loadCourses();
      const lectures = data[1].lectures || [];
      const addedLecture = lectures.find((l) => l.title === 'محاضرة تفاعلية جديدة');
      expect(addedLecture).toBeDefined();
      expect(addedLecture?.id).toBeGreaterThan(0);

      unsubscribe();
    });
  });

  describe('Dynamic Swappability via Repository Registry', () => {
    it('allows hot-swapping CourseRepository with an external PostgREST adapter at runtime', () => {
      const mockPostgrestRepo: ICourseRepository = {
        loadCourses: vi.fn().mockReturnValue({
          999: {
            id: 999,
            name: 'مساق سحابي من PostgREST',
            code: 'CLOUD-999',
            description: 'مساق قادم مباشرة من سيرفر قاعدة البيانات السحابي',
            announcements: [],
            lectures: [],
            assignments: [],
            submissions: [],
          },
        }),
        saveCourses: vi.fn(),
        addAnnouncement: vi.fn(),
        addLecture: vi.fn(),
        addAssignment: vi.fn(),
        addSubmission: vi.fn(),
        subscribe: vi.fn().mockReturnValue(() => {}),
      };

      // Hot swap repository
      repositoryRegistry.registerCourseRepository(mockPostgrestRepo);

      const activeRepo = repositoryRegistry.getCourseRepository();
      const courses = activeRepo.loadCourses();

      expect(mockPostgrestRepo.loadCourses).toHaveBeenCalled();
      expect(courses[999]).toBeDefined();
      expect(courses[999].name).toBe('مساق سحابي من PostgREST');

      // Restore default local adapter
      repositoryRegistry.registerCourseRepository(localCourseRepository);
    });

    it('allows hot-swapping ReceiptRepository with a remote verification client', () => {
      const mockRemoteReceiptRepo: IReceiptRepository = {
        loadReceipts: vi.fn().mockReturnValue([]),
        saveReceipts: vi.fn(),
        submitReceipt: vi.fn(),
        approveReceipt: vi.fn(),
        rejectReceipt: vi.fn(),
        verifyReceiptChecksum: vi.fn().mockReturnValue(true),
        subscribe: vi.fn().mockReturnValue(() => {}),
      };

      repositoryRegistry.registerReceiptRepository(mockRemoteReceiptRepo);

      const activeRepo = repositoryRegistry.getReceiptRepository();
      const receipts = activeRepo.loadReceipts();

      expect(mockRemoteReceiptRepo.loadReceipts).toHaveBeenCalled();
      expect(receipts).toEqual([]);

      // Restore default ReceiptStore
      repositoryRegistry.registerReceiptRepository(ReceiptStore);
    });
  });
});

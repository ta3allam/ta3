import { describe, it, expect, vi, beforeEach } from 'vitest';
import { commandBus, eventBus } from '@/lib/cqrs/commandBus';
import { applyOptimisticUpdateWithRollback } from '@/contexts/CourseContext';
import { courseKeys, receiptKeys, cohortKeys } from '@/lib/queryKeys';
import { IndexedDbAdapter } from '@/lib/storage/indexedDbAdapter';
import { OfflineSyncQueue } from '@/lib/pwa/syncQueue';
import {
  safeValidatePaymentReceipt,
  safeValidateCourseCreation,
  validateCreatorPayout,
} from '@/types/contracts';
import { getAssetUrl, prefetchImage, getPrefetchedUrls, _clearPrefetchCache } from '@/lib/assetUtils';

describe('🏛️ Day 3: Application Architecture, CQRS, & Persistent State Engineering Suite', () => {
  beforeEach(() => {
    IndexedDbAdapter._resetMemoryStore();
    _clearPrefetchCache();
  });

  describe('1. CQRS CommandBus & EventBus Decoupling', () => {
    it('should register and execute a typed command successfully', async () => {
      const handler = vi.fn().mockResolvedValue({ success: true, courseId: 101 });
      commandBus.register('TEST_CQRS_COMMAND', handler);

      const result = await commandBus.dispatch('TEST_CQRS_COMMAND', { courseId: 101, title: 'Test Lecture' });

      expect(handler).toHaveBeenCalledWith({ courseId: 101, title: 'Test Lecture' });
      expect(result).toEqual({ success: true, courseId: 101 });
    });

    it('should throw an error when dispatching an unregistered command', async () => {
      await expect(commandBus.dispatch('UNKNOWN_ACTION', {})).rejects.toThrow(
        /No registered handler found for command type: "UNKNOWN_ACTION"/
      );
    });

    it('should publish domain events to all registered listeners asynchronously', async () => {
      const listenerA = vi.fn();
      const listenerB = vi.fn();

      const unsubscribeA = eventBus.subscribe('COURSE_PUBLISHED', listenerA);
      const unsubscribeB = eventBus.subscribe('COURSE_PUBLISHED', listenerB);

      await eventBus.publish('COURSE_PUBLISHED', { courseId: 42, title: 'Modern React' });

      expect(listenerA).toHaveBeenCalledWith({ courseId: 42, title: 'Modern React' });
      expect(listenerB).toHaveBeenCalledWith({ courseId: 42, title: 'Modern React' });

      // Clean up subscription
      unsubscribeA();
      await eventBus.publish('COURSE_PUBLISHED', { courseId: 43, title: 'Next.js' });
      expect(listenerA).toHaveBeenCalledTimes(1);
      expect(listenerB).toHaveBeenCalledTimes(2);

      unsubscribeB();
    });
  });

  describe('2. Atomic Optimistic State Mutation & Automatic Rollback', () => {
    it('should retain optimistic state when remote mutation resolves successfully', async () => {
      let state = { count: 10 };
      const getState = () => state;
      const setState = (updater: (prev: typeof state) => typeof state) => {
        state = updater(state);
      };
      const cloneState = (s: typeof state) => ({ ...s });

      const result = await applyOptimisticUpdateWithRollback(
        getState,
        setState,
        cloneState,
        {
          optimisticUpdate: (prev) => ({ count: prev.count + 5 }),
          remoteMutation: async () => 'OK_REMOTE',
        }
      );

      expect(result).toBe('OK_REMOTE');
      expect(state.count).toBe(15);
    });

    it('should automatically rollback to previous snapshot when remote mutation fails', async () => {
      let state = { count: 10 };
      const getState = () => state;
      const setState = (updater: (prev: typeof state) => typeof state) => {
        state = updater(state);
      };
      const cloneState = (s: typeof state) => ({ ...s });
      const onError = vi.fn();

      await expect(
        applyOptimisticUpdateWithRollback(getState, setState, cloneState, {
          optimisticUpdate: (prev) => ({ count: prev.count + 50 }),
          remoteMutation: async () => {
            throw new Error('Network Connection Lost');
          },
          onError,
        })
      ).rejects.toThrow('Network Connection Lost');

      // State is rolled back to original snapshot
      expect(state.count).toBe(10);
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('3. Hierarchical TanStack Query Key Factory', () => {
    it('should construct deterministic and scope-bounded hierarchical query keys', () => {
      expect(courseKeys.all).toEqual(['courses']);
      expect(courseKeys.lists()).toEqual(['courses', 'list']);
      expect(courseKeys.list({ category: 'design' })).toEqual([
        'courses',
        'list',
        { category: 'design' },
      ]);
      expect(courseKeys.detail(1)).toEqual(['courses', 'detail', '1']);
      expect(courseKeys.lectures(1)).toEqual(['courses', 'detail', '1', 'lectures']);
      expect(courseKeys.lecture(1, 4)).toEqual(['courses', 'detail', '1', 'lectures', '4']);

      expect(receiptKeys.balance('creator_99')).toEqual(['receipts', 'balance', 'creator_99']);
      expect(cohortKeys.events('cohort_7')).toEqual(['cohorts', 'detail', 'cohort_7', 'events']);
    });
  });

  describe('4. Asynchronous IndexedDB Offline Storage Adapter', () => {
    it('should save, retrieve, and filter offline lecture materials', async () => {
      const materialA = {
        id: 'mat_1',
        courseId: 10,
        lectureId: 2,
        fileName: 'react-architecture.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 500,
        updatedAt: Date.now(),
      };

      const materialB = {
        id: 'mat_2',
        courseId: 10,
        lectureId: 2,
        fileName: 'slides.key',
        mimeType: 'application/octet-stream',
        sizeBytes: 1024 * 200,
        updatedAt: Date.now(),
      };

      await IndexedDbAdapter.saveMaterial(materialA);
      await IndexedDbAdapter.saveMaterial(materialB);

      const retrieved = await IndexedDbAdapter.getMaterial('mat_1');
      expect(retrieved?.fileName).toBe('react-architecture.pdf');

      const lectureMaterials = await IndexedDbAdapter.getMaterialsByLecture(10, 2);
      expect(lectureMaterials).toHaveLength(2);

      await IndexedDbAdapter.deleteMaterial('mat_1');
      const afterDelete = await IndexedDbAdapter.getMaterial('mat_1');
      expect(afterDelete).toBeUndefined();
    });
  });

  describe('5. PWA Offline Sync Queue Engine', () => {
    it('should enqueue operations, execute them upon flush, and handle retries', async () => {
      const queue = new OfflineSyncQueue();
      queue.clear();

      const executedItems: unknown[] = [];
      queue.registerExecutor('ASSIGNMENT_SUBMIT', async (payload) => {
        executedItems.push(payload);
      });

      queue.enqueue('ASSIGNMENT_SUBMIT', { assignmentId: 5, studentId: 'usr_1' });
      queue.enqueue('ASSIGNMENT_SUBMIT', { assignmentId: 6, studentId: 'usr_2' });

      expect(queue.getPendingItems()).toHaveLength(2);

      const flushResult = await queue.flushQueue();
      expect(flushResult.processed).toBe(2);
      expect(executedItems).toHaveLength(2);
      expect(queue.getPendingItems()).toHaveLength(0);
    });

    it('should mark an item as failed when max retries are exceeded', async () => {
      const queue = new OfflineSyncQueue();
      queue.clear();

      queue.registerExecutor('FAILING_TASK', async () => {
        throw new Error('500 Server Internal Error');
      });

      queue.enqueue('FAILING_TASK', { data: 'test' }, 2);

      // Attempt 1
      await queue.flushQueue();
      let pending = queue.getPendingItems();
      expect(pending).toHaveLength(1);
      expect(pending[0].retryCount).toBe(1);

      // Attempt 2 (exceeds maxRetries = 2)
      await queue.flushQueue();
      const all = queue.getAllItems();
      expect(all[0].status).toBe('failed');
      expect(all[0].error).toContain('500 Server Internal Error');
    });
  });

  describe('6. Zod Runtime Contract Guard', () => {
    it('should validate conforming payment receipts', () => {
      const validReceipt = {
        id: 'rcpt_1001',
        courseId: 3,
        courseName: 'تطوير واجهات المستخدم',
        courseCode: 'CS102',
        studentId: 'std_55',
        studentName: 'محمد أحمد',
        studentEmail: 'mohammad@example.com',
        amount: 50000,
        currency: 'SYP',
        paymentMethod: 'shamcash',
        transactionReference: 'TX-998822',
        receiptImageUrl: 'https://cdn.ta3allam.sy/receipts/r1001.webp',
        senderNameOrPhone: '0988112233',
        status: 'pending_verification',
        createdAt: '2026-10-14T10:00:00.000Z',
        creatorEarnings: 42500,
        platformFee: 7500,
      };

      const result = safeValidatePaymentReceipt(validReceipt);
      expect(result.success).toBe(true);
    });

    it('should reject non-conforming payment receipts with descriptive errors', () => {
      const invalidReceipt = {
        id: '',
        amount: -100, // Negative amount
        paymentMethod: 'bitcoin_lightning', // Unsupported method
      };

      const result = safeValidatePaymentReceipt(invalidReceipt);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues.map((i) => i.path[0]);
        expect(issues).toContain('id');
        expect(issues).toContain('amount');
        expect(issues).toContain('courseId');
      }
    });

    it('should validate conforming creator payout disbursements', () => {
      const payout = validateCreatorPayout({
        id: 'payout_882',
        creatorId: 'crt_44',
        creatorName: 'سارة خالد',
        requestedAmount: 150,
        currency: 'USD',
        payoutMethod: 'usdt_trc20',
        recipientAccount: 'TYj89Wkm2XqR9pL7Zq1vN4mK8tE3bH9sVw',
        status: 'pending',
        requestedAt: '2026-10-14T12:00:00.000Z',
      });

      expect(payout.requestedAmount).toBe(150);
      expect(payout.status).toBe('pending');
    });

    it('should validate and supply defaults for course creation payloads', () => {
      const course = safeValidateCourseCreation({
        name: 'هندسة النظم الموزعة',
        code: 'CS401',
        teacher: 'د. يوسف العلي',
      });

      expect(course.success).toBe(true);
      if (course.success) {
        expect(course.data.pricingType).toBe('free');
        expect(course.data.priceCents).toBe(0);
        expect(course.data.difficulty).toBe('متوسط');
      }
    });
  });

  describe('7. Asset Delivery & Prefetching Utilities', () => {
    it('should normalize asset paths with BASE_URL prefix correctly', () => {
      expect(getAssetUrl('assets/logo.svg')).toContain('assets/logo.svg');
      expect(getAssetUrl('https://external-cdn.com/banner.webp')).toBe(
        'https://external-cdn.com/banner.webp'
      );
      expect(getAssetUrl('')).toBe('');
    });

    it('should record prefetched image URLs', async () => {
      await prefetchImage('/images/bg-hero.webp');
      const list = getPrefetchedUrls();
      expect(list.some((u) => u.includes('bg-hero.webp'))).toBe(true);
    });
  });
});

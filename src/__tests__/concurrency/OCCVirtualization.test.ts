import { describe, it, expect, beforeEach } from 'vitest';
import { occManager, StaleDataConflictError } from '../../lib/occ';
import { computeVirtualWindow } from '../../lib/virtualization';

describe('Optimistic Concurrency Control (OCC) Collision & Resilience Suite', () => {
  beforeEach(() => {
    // Reset specific entities
    occManager.setVersion('assignment_grading_404', 1);
    occManager.setVersion('course_curriculum_201', 1);
  });

  describe('Single-Mutation OCC Semantics', () => {
    it('initializes entity version to 1', () => {
      const version = occManager.getVersion('submission_101');
      expect(version).toBe(1);
    });

    it('successfully increments version on matching expected version', () => {
      const entityId = 'submission_102';
      const currentVersion = occManager.getVersion(entityId);
      const newVersion = occManager.validateAndIncrement(entityId, currentVersion);

      expect(newVersion).toBe(currentVersion + 1);
      expect(occManager.getVersion(entityId)).toBe(2);
    });

    it('throws StaleDataConflictError when expected version is mismatched', () => {
      const entityId = 'submission_103';
      occManager.setVersion(entityId, 5); // Background edit by another peer

      expect(() => {
        occManager.validateAndIncrement(entityId, 4); // Stale version 4 sent
      }).toThrow(StaleDataConflictError);
    });
  });

  describe('Multi-Client Concurrent Collision Simulations', () => {
    it('guarantees exactly 1 winner and N-1 collisions when 10 concurrent requests arrive with the same version', async () => {
      const entityId = 'assignment_grading_404';
      const initialVersion = occManager.getVersion(entityId); // Version 1
      const concurrentAttempts = 10;

      let successCount = 0;
      let conflictCount = 0;
      const conflictErrors: StaleDataConflictError[] = [];

      // Simulate 10 teachers grading or submitting simultaneously based on version 1
      const tasks = Array.from({ length: concurrentAttempts }, async (_, index) => {
        try {
          occManager.validateAndIncrement(entityId, initialVersion);
          successCount++;
        } catch (error) {
          if (error instanceof StaleDataConflictError) {
            conflictCount++;
            conflictErrors.push(error);
          }
        }
      });

      await Promise.all(tasks);

      // Invariant: Exactly one winner, exactly 9 conflicts
      expect(successCount).toBe(1);
      expect(conflictCount).toBe(9);
      expect(occManager.getVersion(entityId)).toBe(2);

      // All conflict errors must report expected 1 vs actual 2
      conflictErrors.forEach((err) => {
        expect(err.expectedVersion).toBe(1);
        expect(err.actualVersion).toBe(2);
      });
    });

    it('resolves all collisions via optimistic retry loops with convergence to final monotonic version', async () => {
      const entityId = 'course_curriculum_201';
      const totalClients = 8;

      const executeWithOCCRetry = async (clientId: string, maxRetries = 15): Promise<number> => {
        let retries = 0;
        while (retries < maxRetries) {
          const currentVersion = occManager.getVersion(entityId);
          try {
            // Small simulated jitter/latency
            await new Promise((r) => setTimeout(r, Math.random() * 5));
            return occManager.validateAndIncrement(entityId, currentVersion);
          } catch (err) {
            if (err instanceof StaleDataConflictError) {
              retries++;
              continue;
            }
            throw err;
          }
        }
        throw new Error(`Client ${clientId} exceeded max OCC retries`);
      };

      const clients = Array.from({ length: totalClients }, (_, i) => `client_${i + 1}`);
      const results = await Promise.all(clients.map((cid) => executeWithOCCRetry(cid)));

      // Invariant: All 8 operations completed cleanly without loss
      expect(results).toHaveLength(totalClients);
      // Final version must be initial (1) + 8 = 9
      expect(occManager.getVersion(entityId)).toBe(1 + totalClients);
    });

    it('strictly isolates version tags between independent entities', () => {
      const entityA = 'course_alpha';
      const entityB = 'course_beta';

      occManager.setVersion(entityA, 1);
      occManager.setVersion(entityB, 1);

      occManager.validateAndIncrement(entityA, 1);
      occManager.validateAndIncrement(entityA, 2);

      expect(occManager.getVersion(entityA)).toBe(3);
      expect(occManager.getVersion(entityB)).toBe(1); // Entity B unaffected
    });
  });

  describe('High-Concurrency List Virtualization Boundaries', () => {
    it('computes zero bounds for empty list', () => {
      const window = computeVirtualWindow({
        totalItems: 0,
        itemHeight: 50,
        containerHeight: 500,
        scrollTop: 0,
      });

      expect(window.startIndex).toBe(0);
      expect(window.endIndex).toBe(0);
      expect(window.totalHeight).toBe(0);
    });

    it('calculates window slice and overscan padding for 1000 items', () => {
      const window = computeVirtualWindow({
        totalItems: 1000,
        itemHeight: 50,
        containerHeight: 500,
        scrollTop: 1000, // Scrolled down 20 items (20 * 50px)
        overscan: 3,
      });

      expect(window.startIndex).toBe(17); // 20 - 3 overscan
      expect(window.endIndex).toBe(33); // 20 + 10 visible + 3 overscan
      expect(window.topPadding).toBe(17 * 50); // 850px
      expect(window.totalHeight).toBe(50000);
    });

    it('safely clamps virtual window bounds when scrolled to the end of a 10,000 item list', () => {
      const totalItems = 10000;
      const itemHeight = 40;
      const containerHeight = 600; // 15 visible items
      const maxScroll = totalItems * itemHeight - containerHeight;

      const window = computeVirtualWindow({
        totalItems,
        itemHeight,
        containerHeight,
        scrollTop: maxScroll,
        overscan: 5,
      });

      expect(window.endIndex).toBe(totalItems);
      expect(window.totalHeight).toBe(400000);
      expect(window.startIndex).toBeLessThanOrEqual(window.endIndex);
    });
  });
});

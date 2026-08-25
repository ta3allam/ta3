import { describe, it, expect } from 'vitest';
import { cqrsBus } from '../cqrs';
import '../cqrs/commands';
import { COMMAND_TYPES } from '../cqrs/commands';
import { idempotencyManager } from '../idempotency';
import { occManager, StaleDataConflictError } from '../occ';
import { computeVirtualWindow } from '../virtualization';

describe('Sprint 2 End-to-End Concurrency & Resiliency Pipeline', () => {
  it('should process CQRS command with idempotency key protection', async () => {
    const key = idempotencyManager.generateKey('SUBMIT_ASSIGNMENT', 888);
    let executionCount = 0;

    const commandAction = async () => {
      executionCount++;
      return await cqrsBus.dispatchCommand(COMMAND_TYPES.SUBMIT_ASSIGNMENT, {
        courseId: 1,
        assignmentId: 888,
        studentId: 'std_101',
        studentName: 'أحمد علي',
        fileName: 'homework.pdf'
      }, 'std_101');
    };

    // First call executes command
    const res1 = await idempotencyManager.execute(key, commandAction);
    expect(res1.success).toBe(true);
    expect(executionCount).toBe(1);

    // Rapid second call with same idempotency key returns cached result without re-dispatching
    const res2 = await idempotencyManager.execute(key, commandAction);
    expect(res2.success).toBe(true);
    expect(executionCount).toBe(1); // Still 1!
  });

  it('should enforce OCC locking on concurrent grading updates', () => {
    const entityId = 'grade_sub_99';
    const v1 = occManager.getVersion(entityId);
    expect(v1).toBe(1);

    // Teacher A updates grade with version 1 -> success, version becomes 2
    const v2 = occManager.validateAndIncrement(entityId, 1);
    expect(v2).toBe(2);

    // Teacher B tries to submit using stale version 1 -> blocked with StaleDataConflictError
    expect(() => {
      occManager.validateAndIncrement(entityId, 1);
    }).toThrow(StaleDataConflictError);
  });

  it('should maintain virtual list bounds under 5,000 items load', () => {
    const virtualWindow = computeVirtualWindow({
      totalItems: 5000,
      itemHeight: 60,
      containerHeight: 600,
      scrollTop: 3000, // Scrolled to item 50 (3000 / 60)
      overscan: 4
    });

    expect(virtualWindow.startIndex).toBe(46); // 50 - 4
    expect(virtualWindow.endIndex).toBe(64);   // 50 + 10 visible + 4 overscan
    expect(virtualWindow.totalHeight).toBe(300000);
  });
});

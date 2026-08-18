import { describe, it, expect, beforeEach } from 'vitest';
import { idempotencyManager } from '../idempotency';

describe('IdempotencyManager Engine', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should generate deterministic hashes for identical payloads', () => {
    const key1 = idempotencyManager.generateKey('TEST_SCOPE', { id: 1, name: 'Ta3' });
    const key2 = idempotencyManager.generateKey('TEST_SCOPE', { id: 1, name: 'Ta3' });
    expect(key1).toContain('TEST_SCOPE');
    expect(key2).toContain('TEST_SCOPE');
  });

  it('should execute action once and cache completed result', async () => {
    const key = 'test_key_123';
    let executionCount = 0;

    const action = async () => {
      executionCount++;
      return { success: true, count: executionCount };
    };

    const res1 = await idempotencyManager.execute(key, action);
    expect(res1).toEqual({ success: true, count: 1 });
    expect(executionCount).toBe(1);

    // Second execution with same key should return cached result without re-executing
    const res2 = await idempotencyManager.execute(key, action);
    expect(res2).toEqual({ success: true, count: 1 });
    expect(executionCount).toBe(1);
  });

  it('should reject pending concurrent execution on same key', async () => {
    const key = 'test_pending_key';
    let resolveAction: (val: any) => void;

    const slowAction = () =>
      new Promise((resolve) => {
        resolveAction = resolve;
      });

    const promise1 = idempotencyManager.execute(key, slowAction);

    // Second call while first is pending should throw pending error
    await expect(idempotencyManager.execute(key, slowAction)).rejects.toThrow(
      /is currently pending/
    );

    resolveAction!({ done: true });
    const result1 = await promise1;
    expect(result1).toEqual({ done: true });
  });

  it('should record FAILED status on exception and allow clear/retry', async () => {
    const key = 'test_failed_key';
    const failingAction = async () => {
      throw new Error('Database timeout');
    };

    await expect(idempotencyManager.execute(key, failingAction)).rejects.toThrow(
      'Database timeout'
    );

    const record = idempotencyManager.getRecord(key);
    expect(record?.status).toBe('FAILED');
    expect(record?.error).toBe('Database timeout');
  });
});

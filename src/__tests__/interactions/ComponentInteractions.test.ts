import { describe, it, expect, vi } from 'vitest';
import { idempotencyManager } from '../../lib/idempotency';
import { executeOptimistic } from '../../lib/optimistic';

describe('Idempotency Key Manager & Replay Protection', () => {
  it('should generate unique idempotency keys for actions', () => {
    const key1 = idempotencyManager.generateKey('SUBMIT', 101);
    const key2 = idempotencyManager.generateKey('SUBMIT', 101);

    expect(key1).toContain('idempotent_SUBMIT_101_');
    expect(key1).not.toEqual(key2);
  });

  it('should cache response and prevent duplicate action execution', async () => {
    const key = idempotencyManager.generateKey('GRADE', 55);
    const actionSpy = vi.fn().mockResolvedValue({ grade: 95, status: 'GRADED' });

    // First call executes action
    const firstCall = await idempotencyManager.executeIdempotent(key, actionSpy);
    expect(firstCall.cached).toBe(false);
    expect(firstCall.result).toEqual({ grade: 95, status: 'GRADED' });
    expect(actionSpy).toHaveBeenCalledTimes(1);

    // Second call with same key returns cached response without calling action again
    const secondCall = await idempotencyManager.executeIdempotent(key, actionSpy);
    expect(secondCall.cached).toBe(true);
    expect(secondCall.result).toEqual({ grade: 95, status: 'GRADED' });
    expect(actionSpy).toHaveBeenCalledTimes(1); // Action call count remains 1!
  });
});

describe('Optimistic UI Updates & Atomic Rollbacks', () => {
  it('should render optimistic state immediately on success', async () => {
    let state = ['Item 1'];
    const applyOptimistic = (newState: string[]) => { state = newState; };
    const rollback = (previousState: string[]) => { state = previousState; };

    const result = await executeOptimistic({
      currentState: state,
      optimisticState: [...state, 'Item 2 (Optimistic)'],
      applyOptimistic,
      rollback,
      action: async () => 'SERVER_SUCCESS'
    });

    expect(result.success).toBe(true);
    expect(state).toEqual(['Item 1', 'Item 2 (Optimistic)']);
  });

  it('should execute atomic rollback to previous state on server error', async () => {
    const initialState = ['Item 1'];
    let state = [...initialState];
    const applyOptimistic = (newState: string[]) => { state = newState; };
    const rollback = (previousState: string[]) => { state = previousState; };
    const onErrorSpy = vi.fn();

    const result = await executeOptimistic({
      currentState: state,
      optimisticState: [...state, 'Item 2 (Optimistic)'],
      applyOptimistic,
      rollback,
      action: async () => { throw new Error('Network Timeout'); },
      onError: onErrorSpy
    });

    expect(result.success).toBe(false);
    expect(state).toEqual(initialState); // Atomic rollback restored initialState!
    expect(onErrorSpy).toHaveBeenCalled();
  });
});

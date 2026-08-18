import { describe, it, expect } from 'vitest';
import { OptimisticRollbackEngine } from '../optimisticRollback';

describe('OptimisticRollbackEngine', () => {
  it('should apply optimistic state immediately and preserve state on success', async () => {
    let currentState = [1, 2, 3];
    const setState = (newState: number[]) => {
      currentState = newState;
    };

    const result = await OptimisticRollbackEngine.executeOptimistic<number[], number>(
      {
        currentState,
        payload: 4,
        optimisticMutator: (state, payload) => [...state, payload],
        action: async (payload) => {
          return { success: true, data: payload };
        },
      },
      setState
    );

    expect(result.success).toBe(true);
    expect(currentState).toEqual([1, 2, 3, 4]);
  });

  it('should automatically rollback to initial state if server action fails', async () => {
    let currentState = ['post1', 'post2'];
    const setState = (newState: string[]) => {
      currentState = newState;
    };

    let errorLogged = '';

    const result = await OptimisticRollbackEngine.executeOptimistic<string[], string>(
      {
        currentState,
        payload: 'post3',
        optimisticMutator: (state, payload) => [payload, ...state],
        action: async () => {
          return { success: false, error: 'Network Connection Interrupted' };
        },
        onError: (err) => {
          errorLogged = err;
        },
      },
      setState
    );

    expect(result.success).toBe(false);
    expect(errorLogged).toBe('Network Connection Interrupted');
    // Verify state was atomically rolled back to initial snapshot
    expect(currentState).toEqual(['post1', 'post2']);
  });
});

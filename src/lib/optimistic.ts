/**
 * Ta3 (تعلّم) - Optimistic UI State Handler with Atomic Rollbacks
 * Renders instant UI updates while background commands run,
 * with automatic rollback if a background command fails.
 */

export interface OptimisticUpdateOptions<TState, TData> {
  currentState: TState;
  optimisticState: TState;
  applyOptimistic: (state: TState) => void;
  rollback: (state: TState) => void;
  action: () => Promise<TData>;
  onError?: (error: any) => void;
}

export async function executeOptimistic<TState, TData>(
  options: OptimisticUpdateOptions<TState, TData>
): Promise<{ success: boolean; data?: TData; error?: any }> {
  const { currentState, optimisticState, applyOptimistic, rollback, action, onError } = options;

  // 1. Immediately render optimistic UI state
  applyOptimistic(optimisticState);

  try {
    // 2. Perform actual background server request
    const data = await action();
    return { success: true, data };
  } catch (error) {
    // 3. Perform atomic rollback if server action fails
    rollback(currentState);
    if (onError) onError(error);
    return { success: false, error };
  }
}

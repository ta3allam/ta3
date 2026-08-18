/**
 * Optimistic UI Rollback & Feedback Engine for Ta3 (تعلّم) LMS
 * Manages instant local UI updates, atomic state snapshots, and automatic rollbacks on network failure.
 */

export interface OptimisticActionOptions<TState, TPayload> {
  currentState: TState;
  payload: TPayload;
  optimisticMutator: (state: TState, payload: TPayload) => TState;
  action: (payload: TPayload) => Promise<{ success: boolean; data?: any; error?: string }>;
  onSuccess?: (data?: any) => void;
  onError?: (error: string, rolledBackState: TState) => void;
  successMessage?: string;
  errorMessage?: string;
}

export class OptimisticRollbackEngine {
  /**
   * Executes an action optimistically with snapshot recording and automatic rollback upon error.
   */
  public static async executeOptimistic<TState, TPayload>(
    options: OptimisticActionOptions<TState, TPayload>,
    setState: (newState: TState) => void
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const {
      currentState,
      payload,
      optimisticMutator,
      action,
      onSuccess,
      onError,
    } = options;

    // 1. Take atomic snapshot of current state
    const snapshot = JSON.parse(JSON.stringify(currentState)) as TState;

    // 2. Apply optimistic UI mutation instantly
    try {
      const optimisticState = optimisticMutator(currentState, payload);
      setState(optimisticState);
    } catch (e: any) {
      // Mutation failed locally before network dispatch
      setState(snapshot);
      return { success: false, error: e.message || 'Optimistic mutation failed' };
    }

    // 3. Dispatch async network/backend action
    try {
      const result = await action(payload);

      if (!result.success) {
        // Rollback on non-success result
        setState(snapshot);
        if (onError) {
          onError(result.error || 'Operation failed on server', snapshot);
        }
        return result;
      }

      if (onSuccess) {
        onSuccess(result.data);
      }
      return result;
    } catch (err: any) {
      // 4. Atomic rollback on network / execution error
      setState(snapshot);
      const errMsg = err?.message || 'Network exception occurred during operation';
      if (onError) {
        onError(errMsg, snapshot);
      }
      return { success: false, error: errMsg };
    }
  }
}

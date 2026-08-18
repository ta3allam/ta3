import { useState, useCallback } from 'react';
import { OptimisticRollbackEngine, OptimisticActionOptions } from './optimisticRollback';

export interface UseOptimisticActionReturn<TState, TPayload> {
  state: TState;
  setState: React.Dispatch<React.SetStateAction<TState>>;
  isPending: boolean;
  error: string | null;
  executeOptimistic: (
    payload: TPayload,
    options: Omit<OptimisticActionOptions<TState, TPayload>, 'currentState' | 'payload'>
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
}

export function useOptimisticAction<TState, TPayload = any>(
  initialState: TState
): UseOptimisticActionReturn<TState, TPayload> {
  const [state, setState] = useState<TState>(initialState);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeOptimistic = useCallback(
    async (
      payload: TPayload,
      options: Omit<OptimisticActionOptions<TState, TPayload>, 'currentState' | 'payload'>
    ) => {
      setIsPending(true);
      setError(null);

      const result = await OptimisticRollbackEngine.executeOptimistic<TState, TPayload>(
        {
          ...options,
          currentState: state,
          payload,
          onError: (err, rolledBackState) => {
            setError(err);
            if (options.onError) {
              options.onError(err, rolledBackState);
            }
          },
        },
        setState
      );

      setIsPending(false);
      return result;
    },
    [state]
  );

  return {
    state,
    setState,
    isPending,
    error,
    executeOptimistic,
  };
}

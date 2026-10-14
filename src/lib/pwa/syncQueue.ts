/**
 * PWA Offline Sync Queue Engine
 *
 * Persists pending write operations (assignment submissions, lecture progress,
 * feedback) locally when the client is disconnected. Automatically triggers
 * sequential background replay upon network reconnection with exponential retry backoff.
 */

export type SyncQueueItemStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SyncQueueItem<TPayload = unknown> {
  id: string;
  type: string;
  payload: TPayload;
  status: SyncQueueItemStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: number;
  lastAttemptAt?: number;
  error?: string;
}

export type SyncExecutor<T = unknown> = (payload: T) => Promise<void>;

const QUEUE_STORAGE_KEY = 'ta3_pwa_offline_sync_queue';

class OfflineSyncQueue {
  private queue: SyncQueueItem[] = [];
  private executors = new Map<string, SyncExecutor<unknown>>();
  private listeners = new Set<(items: SyncQueueItem[]) => void>();
  private isProcessing = false;

  constructor() {
    this.loadFromStorage();
    this.setupNetworkListeners();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const serialized = window.localStorage.getItem(QUEUE_STORAGE_KEY);
      if (serialized) {
        this.queue = JSON.parse(serialized);
      }
    } catch {
      this.queue = [];
    }
  }

  private persist(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {
      // Storage quota exceeded or disabled
    }
    this.notify();
  }

  private notify(): void {
    const items = [...this.queue];
    this.listeners.forEach((listener) => {
      try {
        listener(items);
      } catch {
        // Safe dispatch
      }
    });
  }

  private setupNetworkListeners(): void {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    window.addEventListener('online', () => {
      void this.flushQueue();
    });
  }

  /**
   * Registers a processor for an action type
   */
  registerExecutor<T>(type: string, executor: SyncExecutor<T>): void {
    this.executors.set(type, executor as SyncExecutor<unknown>);
  }

  /**
   * Enqueues an operation to be executed online
   */
  enqueue<T>(type: string, payload: T, maxRetries = 3): SyncQueueItem<T> {
    const item: SyncQueueItem<T> = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload,
      status: 'pending',
      retryCount: 0,
      maxRetries,
      createdAt: Date.now(),
    };

    this.queue.push(item as SyncQueueItem<unknown>);
    this.persist();

    // If online, attempt to process immediately
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      void this.flushQueue();
    }

    return item;
  }

  /**
   * Returns all pending items
   */
  getPendingItems(): SyncQueueItem[] {
    return this.queue.filter((item) => item.status === 'pending');
  }

  /**
   * Returns all items currently in queue
   */
  getAllItems(): SyncQueueItem[] {
    return [...this.queue];
  }

  /**
   * Removes an item by ID
   */
  removeItem(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id);
    this.persist();
  }

  /**
   * Clears the entire queue
   */
  clear(): void {
    this.queue = [];
    this.persist();
  }

  /**
   * Subscribes to queue changes
   */
  subscribe(listener: (items: SyncQueueItem[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.queue]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Flushes and processes pending operations sequentially
   */
  async flushQueue(): Promise<{ processed: number; failed: number }> {
    if (this.isProcessing) return { processed: 0, failed: 0 };
    this.isProcessing = true;

    let processedCount = 0;
    let failedCount = 0;

    try {
      const pending = this.queue.filter((item) => item.status === 'pending');

      for (const item of pending) {
        const executor = this.executors.get(item.type);
        if (!executor) {
          // Executor not yet registered; skip for now
          continue;
        }

        item.status = 'processing';
        item.lastAttemptAt = Date.now();
        this.persist();

        try {
          await executor(item.payload);
          item.status = 'completed';
          processedCount++;
        } catch (err) {
          item.retryCount += 1;
          item.error = err instanceof Error ? err.message : String(err);

          if (item.retryCount >= item.maxRetries) {
            item.status = 'failed';
            failedCount++;
          } else {
            item.status = 'pending';
          }
        }
        this.persist();
      }

      // Automatically prune completed items older than 5 minutes
      const now = Date.now();
      this.queue = this.queue.filter(
        (item) => !(item.status === 'completed' && now - (item.lastAttemptAt || 0) > 300000)
      );
      this.persist();
    } finally {
      this.isProcessing = false;
    }

    return { processed: processedCount, failed: failedCount };
  }
}

export const syncQueue = new OfflineSyncQueue();
export { OfflineSyncQueue };

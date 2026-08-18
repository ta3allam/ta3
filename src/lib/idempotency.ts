/**
 * Idempotency Key Manager for Ta3 (تعلّم) LMS
 * Prevents duplicate mutations, race conditions, double-submissions, and network replay attacks.
 */

export interface IdempotencyRecord<T = unknown> {
  key: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  result?: T;
  error?: string;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'ta3_idempotency_';
const DEFAULT_TTL_MS = 1000 * 60 * 15; // 15 minutes TTL

class IdempotencyManager {
  private memoryCache: Map<string, IdempotencyRecord> = new Map();

  /**
   * Generates a deterministic or random UUID-based idempotency key.
   */
  public generateKey(scope: string, payload?: unknown): string {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const payloadHash = payload ? this.hashPayload(payload) : '';
    return `${scope}_${Date.now()}_${payloadHash}_${randomSeed}`;
  }

  /**
   * Simple hash utility for payload matching.
   */
  private hashPayload(payload: unknown): string {
    try {
      const str = JSON.stringify(payload);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(36);
    } catch {
      return 'unhashable';
    }
  }

  /**
   * Retrieves recorded idempotency status from Memory or LocalStorage.
   */
  public getRecord<T>(key: string): IdempotencyRecord<T> | null {
    // 1. Check memory cache
    if (this.memoryCache.has(key)) {
      const record = this.memoryCache.get(key) as IdempotencyRecord<T>;
      if (Date.now() - record.timestamp > DEFAULT_TTL_MS) {
        this.clearRecord(key);
        return null;
      }
      return record;
    }

    // 2. Check LocalStorage fallback
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
        if (raw) {
          const record: IdempotencyRecord<T> = JSON.parse(raw);
          if (Date.now() - record.timestamp > DEFAULT_TTL_MS) {
            this.clearRecord(key);
            return null;
          }
          this.memoryCache.set(key, record);
          return record;
        }
      }
    } catch {
      // Ignore LocalStorage errors in non-browser environments
    }

    return null;
  }

  /**
   * Saves record status.
   */
  public setRecord<T>(key: string, record: IdempotencyRecord<T>): void {
    this.memoryCache.set(key, record as IdempotencyRecord);
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(record));
      }
    } catch {
      // LocalStorage error fallback
    }
  }

  /**
   * Removes record.
   */
  public clearRecord(key: string): void {
    this.memoryCache.delete(key);
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Executes an async operation safely wrapped with Idempotency locks.
   */
  public async execute<T>(
    key: string,
    action: () => Promise<T>,
    ttlMs: number = DEFAULT_TTL_MS
  ): Promise<T> {
    const existing = this.getRecord<T>(key);

    if (existing) {
      if (existing.status === 'COMPLETED') {
        return existing.result as T;
      }
      if (existing.status === 'PENDING') {
        throw new Error(`Idempotent action '${key}' is currently pending in another transaction.`);
      }
      if (existing.status === 'FAILED') {
        // Option: Re-throw previous error or allow retry
      }
    }

    // Mark as PENDING
    const pendingRecord: IdempotencyRecord<T> = {
      key,
      status: 'PENDING',
      timestamp: Date.now(),
    };
    this.setRecord(key, pendingRecord);

    try {
      const result = await action();
      const completedRecord: IdempotencyRecord<T> = {
        key,
        status: 'COMPLETED',
        result,
        timestamp: Date.now(),
      };
      this.setRecord(key, completedRecord);
      return result;
    } catch (err: any) {
      const failedRecord: IdempotencyRecord<T> = {
        key,
        status: 'FAILED',
        error: err?.message || 'Action failed',
        timestamp: Date.now(),
      };
      this.setRecord(key, failedRecord);
      throw err;
    }
  }
}

export const idempotencyManager = new IdempotencyManager();

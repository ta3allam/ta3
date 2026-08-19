/**
 * Ta3 (تعلّم) - Idempotency Key Manager Engine
 * Protects state-changing operations from duplicate form submissions,
 * rapid double-clicking, and network retry loops.
 */

export interface IdempotencyRecord<T = any> {
  key: string;
  response: T;
  timestamp: number;
}

class IdempotencyManager {
  private cache: Map<string, IdempotencyRecord> = new Map();
  private defaultTTLMs: number = 300000; // 5 minutes TTL

  /**
   * Generates a unique UUID v4 idempotency key for a payload action
   */
  generateKey(actionType: string, entityId: string | number): string {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    return `idempotent_${actionType}_${entityId}_${Date.now()}_${randomSuffix}`;
  }

  /**
   * Checks if an idempotency key has already been executed within TTL
   */
  has(key: string): boolean {
    const record = this.cache.get(key);
    if (!record) return false;

    // Check TTL expiration
    if (Date.now() - record.timestamp > this.defaultTTLMs) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Retrieves cached response for a processed idempotency key
   */
  get<T = any>(key: string): T | null {
    if (!this.has(key)) return null;
    return (this.cache.get(key) as IdempotencyRecord<T>).response;
  }

  /**
   * Saves a processed payload response with its idempotency key
   */
  set<T = any>(key: string, response: T): void {
    this.cache.set(key, {
      key,
      response,
      timestamp: Date.now()
    });
  }

  /**
   * Executes a command action with idempotency protection
   */
  async executeIdempotent<T = any>(
    key: string,
    action: () => Promise<T>
  ): Promise<{ result: T; cached: boolean }> {
    if (this.has(key)) {
      return {
        result: this.get<T>(key)!,
        cached: true
      };
    }

    const result = await action();
    this.set(key, result);

    return {
      result,
      cached: false
    };
  }
}

export const idempotencyManager = new IdempotencyManager();

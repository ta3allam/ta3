/**
 * Ta3 (تعلّم) - Idempotency Key Manager Engine
 * Protects state-changing operations from duplicate form submissions,
 * rapid double-clicking, and network retry loops.
 */

export interface IdempotencyRecord<T = any> {
  key: string;
  response?: T;
  error?: string;
  timestamp: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

class IdempotencyManager {
  private cache: Map<string, IdempotencyRecord> = new Map();
  private pendingKeys: Set<string> = new Set();
  private defaultTTLMs: number = 300000; // 5 minutes TTL

  generateKey(actionType: string, entityId: string | number): string {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    return `idempotent_${actionType}_${entityId}_${Date.now()}_${randomSuffix}`;
  }

  has(key: string): boolean {
    const record = this.cache.get(key);
    if (!record) return false;

    if (Date.now() - record.timestamp > this.defaultTTLMs) {
      this.cache.delete(key);
      return false;
    }

    return record.status === 'COMPLETED';
  }

  getRecord(key: string): IdempotencyRecord | undefined {
    return this.cache.get(key);
  }

  get<T = any>(key: string): T | null {
    if (!this.has(key)) return null;
    return (this.cache.get(key) as IdempotencyRecord<T>).response || null;
  }

  set<T = any>(key: string, response: T): void {
    this.cache.set(key, {
      key,
      response,
      timestamp: Date.now(),
      status: 'COMPLETED'
    });
  }

  clear(key: string): void {
    this.cache.delete(key);
    this.pendingKeys.delete(key);
  }

  async execute<T = any>(
    key: string,
    action: () => Promise<T>
  ): Promise<T> {
    if (this.pendingKeys.has(key)) {
      throw new Error(`Operation for key ${key} is currently pending`);
    }

    if (this.has(key)) {
      return this.get<T>(key)!;
    }

    this.pendingKeys.add(key);

    try {
      const result = await action();
      this.set(key, result);
      return result;
    } catch (error: any) {
      const errorMsg = typeof error === 'string' ? error : (error.message || 'Operation failed');
      this.cache.set(key, {
        key,
        error: errorMsg,
        timestamp: Date.now(),
        status: 'FAILED'
      });
      throw errorMsg;
    } finally {
      this.pendingKeys.delete(key);
    }
  }

  async executeIdempotent<T = any>(
    key: string,
    action: () => Promise<T>
  ): Promise<{ result: T; cached: boolean }> {
    const cached = this.has(key);
    const result = await this.execute(key, action);
    return { result, cached };
  }
}

export const idempotencyManager = new IdempotencyManager();

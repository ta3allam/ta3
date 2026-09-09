export interface CacheEntry<T> {
  value: T;
  expiresAt: number; // Unix timestamp in ms
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  keysCount: number;
}

export class RedisCacheClient {
  private store: Map<string, CacheEntry<any>> = new Map();
  private hits: number = 0;
  private misses: number = 0;

  /**
   * Set a key-value pair with TTL in seconds
   */
  public set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Get a cached value. Returns null if expired or missing.
   */
  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value as T;
  }

  /**
   * Invalidate all keys matching a prefix or wildcard pattern (e.g. 'course:*', 'community:*')
   */
  public invalidatePattern(pattern: string): number {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    let deletedCount = 0;

    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Get telemetry metrics
   */
  public getMetrics(): CacheMetrics {
    return {
      hits: this.hits,
      misses: this.misses,
      keysCount: this.store.size
    };
  }

  /**
   * Clear all cached keys
   */
  public flushAll(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

export const redisCache = new RedisCacheClient();

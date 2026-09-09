import { describe, it, expect, beforeEach } from 'vitest';
import { RedisCacheClient } from '../redisCache';
import { PgBouncerPoolManager } from '../pgBouncerPool';

describe('Redis Read Caching & PgBouncer Connection Pool Unit Tests', () => {
  let cache: RedisCacheClient;

  beforeEach(() => {
    cache = new RedisCacheClient();
  });

  it('should set and get cached values within TTL', () => {
    cache.set('course:101', { id: 101, title: 'هندسة البرمجيات الموزعة' }, 60);

    const cached = cache.get<{ id: number; title: string }>('course:101');
    expect(cached).not.toBeNull();
    expect(cached?.title).toBe('هندسة البرمجيات الموزعة');

    const metrics = cache.getMetrics();
    expect(metrics.hits).toBe(1);
    expect(metrics.misses).toBe(0);
  });

  it('should invalidate cache entries matching wildcard pattern', () => {
    cache.set('community:post:1', { title: 'مقال 1' });
    cache.set('community:post:2', { title: 'مقال 2' });
    cache.set('course:overview:1', { title: 'مقرر 1' });

    const deleted = cache.invalidatePattern('community:*');
    expect(deleted).toBe(2);

    expect(cache.get('community:post:1')).toBeNull();
    expect(cache.get('community:post:2')).toBeNull();
    expect(cache.get('course:overview:1')).not.toBeNull();
  });

  it('should manage connection pool acquisition and release lifecycle in PgBouncer', async () => {
    const pool = new PgBouncerPoolManager({ maxConnections: 2, acquireTimeoutMs: 1000 });

    const result = await pool.executeQuery(async () => {
      const stats = pool.getStats();
      expect(stats.activeConnections).toBe(1);
      return 'query_successful';
    });

    expect(result).toBe('query_successful');
    const finalStats = pool.getStats();
    expect(finalStats.activeConnections).toBe(0);
    expect(finalStats.idleConnections).toBe(2);
  });
});

/**
 * Client-Side Rate Limiter & Brute-Force Lockout Defense Engine
 *
 * Implements sliding-window rate tracking and progressive lockout backoffs
 * to prevent credential stuffing, automated receipt spam, and denial-of-service
 * bursts across client operations.
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  lockoutThreshold?: number; // Failures before lockout triggers
  lockoutDurationMs?: number; // Duration of lockout
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  locked: boolean;
  lockoutRemainingMs: number;
}

interface AttemptRecord {
  timestamps: number[];
  failedAttempts: number;
  lockedUntil: number | null;
}

export const RATE_LIMIT_PROFILES: Record<string, RateLimitConfig> = {
  // Login: 5 requests per 60s, lockout for 3 minutes after 5 consecutive failures
  'auth:login': {
    maxRequests: 5,
    windowMs: 60 * 1000,
    lockoutThreshold: 5,
    lockoutDurationMs: 3 * 60 * 1000,
  },
  // Payment Receipt Upload: 3 submissions per minute
  'payment:receipt': {
    maxRequests: 3,
    windowMs: 60 * 1000,
    lockoutThreshold: 4,
    lockoutDurationMs: 5 * 60 * 1000,
  },
  // Community Post / Comment: 8 actions per minute
  'community:write': {
    maxRequests: 8,
    windowMs: 60 * 1000,
  },
  // General Action / Mutation: 30 requests per minute
  'api:mutation': {
    maxRequests: 30,
    windowMs: 60 * 1000,
  },
};

class RateLimiter {
  private records = new Map<string, AttemptRecord>();

  private getKey(action: string, identifier: string): string {
    return `${action}:${identifier.toLowerCase().trim()}`;
  }

  private getRecord(key: string): AttemptRecord {
    let rec = this.records.get(key);
    if (!rec) {
      rec = { timestamps: [], failedAttempts: 0, lockedUntil: null };
      this.records.set(key, rec);
    }
    return rec;
  }

  /**
   * Evaluates current rate limit status without consuming a token
   */
  check(action: string, identifier: string): RateLimitStatus {
    const config = RATE_LIMIT_PROFILES[action] || { maxRequests: 20, windowMs: 60000 };
    const key = this.getKey(action, identifier);
    const record = this.getRecord(key);
    const now = Date.now();

    // Check if currently locked out
    if (record.lockedUntil && now < record.lockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetMs: record.lockedUntil - now,
        locked: true,
        lockoutRemainingMs: record.lockedUntil - now,
      };
    }

    // Lockout expired: reset failed attempts count
    if (record.lockedUntil && now >= record.lockedUntil) {
      record.lockedUntil = null;
      record.failedAttempts = 0;
    }

    // Prune expired timestamps outside sliding window
    const windowStart = now - config.windowMs;
    record.timestamps = record.timestamps.filter((t) => t > windowStart);

    const remaining = Math.max(0, config.maxRequests - record.timestamps.length);
    const oldest = record.timestamps[0];
    const resetMs = oldest ? Math.max(0, oldest + config.windowMs - now) : 0;

    return {
      allowed: remaining > 0,
      remaining,
      resetMs,
      locked: false,
      lockoutRemainingMs: 0,
    };
  }

  /**
   * Consumes an attempt token. Returns true if request is allowed, false if rejected.
   */
  consume(action: string, identifier: string): boolean {
    const status = this.check(action, identifier);
    if (!status.allowed) {
      return false;
    }

    const key = this.getKey(action, identifier);
    const record = this.getRecord(key);
    record.timestamps.push(Date.now());
    return true;
  }

  /**
   * Records an explicit operation failure (e.g. incorrect password), triggering lockout if threshold reached
   */
  recordFailure(action: string, identifier: string): { locked: boolean; lockoutRemainingMs: number } {
    const config = RATE_LIMIT_PROFILES[action];
    if (!config || !config.lockoutThreshold || !config.lockoutDurationMs) {
      return { locked: false, lockoutRemainingMs: 0 };
    }

    const key = this.getKey(action, identifier);
    const record = this.getRecord(key);
    record.failedAttempts += 1;

    if (record.failedAttempts >= config.lockoutThreshold) {
      record.lockedUntil = Date.now() + config.lockoutDurationMs;
      return { locked: true, lockoutRemainingMs: config.lockoutDurationMs };
    }

    return { locked: false, lockoutRemainingMs: 0 };
  }

  /**
   * Resets rate limit records for a given action and user (e.g. on successful login)
   */
  reset(action: string, identifier: string): void {
    const key = this.getKey(action, identifier);
    this.records.delete(key);
  }

  /**
   * Resets all in-memory records (for test isolation)
   */
  clearAll(): void {
    this.records.clear();
  }
}

export const rateLimiter = new RateLimiter();
export { RateLimiter };

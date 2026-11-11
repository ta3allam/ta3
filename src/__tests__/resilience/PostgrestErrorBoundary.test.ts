import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PostgrestErrorHandler, PostgrestErrorPayload } from '@/lib/network/postgrestErrorHandler';

describe('PostgREST Error Boundary & Network Resilience Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('HTTP Status Code Boundaries', () => {
    it('handles 401 Unauthorized by flagging REAUTH_REQUIRED and blocking blind retries', () => {
      const error: PostgrestErrorPayload = {
        status: 401,
        code: 'PGRST301',
        message: 'JWT expired or invalid bearer token',
      };

      const result = PostgrestErrorHandler.handle(error);

      expect(result.action).toBe('REAUTH_REQUIRED');
      expect(result.statusCode).toBe(401);
      expect(result.retryable).toBe(false);
      expect(result.offlineFallbackAvailable).toBe(false);
      expect(result.userMessageAr).toContain('تسجيل الدخول مرة أخرى');
    });

    it('handles 403 Forbidden by classifying PERMISSION_DENIED due to RLS violation', () => {
      const error: PostgrestErrorPayload = {
        status: 403,
        code: '42501',
        message: 'new row violates row-level security policy for table "payment_receipts"',
      };

      const result = PostgrestErrorHandler.handle(error);

      expect(result.action).toBe('PERMISSION_DENIED');
      expect(result.statusCode).toBe(403);
      expect(result.retryable).toBe(false);
      expect(result.offlineFallbackAvailable).toBe(false);
      expect(result.userMessageAr).toContain('انتهاك سياسة أمان RLS');
    });

    it('handles 409 Conflict by classifying CONCURRENCY_CONFLICT with retry enabled', () => {
      const error: PostgrestErrorPayload = {
        status: 409,
        code: '23505',
        message: 'duplicate key value violates unique constraint or OCC version mismatch',
      };

      const result = PostgrestErrorHandler.handle(error);

      expect(result.action).toBe('CONCURRENCY_CONFLICT');
      expect(result.statusCode).toBe(409);
      expect(result.retryable).toBe(true);
      expect(result.offlineFallbackAvailable).toBe(false);
      expect(result.userMessageAr).toContain('حدث تعارض في البيانات');
    });

    it('handles 429 Too Many Requests by classifying RATE_LIMITED', () => {
      const error: PostgrestErrorPayload = {
        status: 429,
        code: 'PGRST429',
        message: 'Too many requests sent within rate limit window',
      };

      const result = PostgrestErrorHandler.handle(error);

      expect(result.action).toBe('RATE_LIMITED');
      expect(result.statusCode).toBe(429);
      expect(result.retryable).toBe(true);
      expect(result.userMessageAr).toContain('تجاوز الحد الأقصى للطلبات');
    });

    it('handles 500 / 503 Internal Server Errors by enabling offline fallback', () => {
      const error: PostgrestErrorPayload = {
        status: 503,
        code: '57P01',
        message: 'PostgREST server connection pool exhausted',
      };

      const result = PostgrestErrorHandler.handle(error);

      expect(result.action).toBe('SERVER_ERROR');
      expect(result.statusCode).toBe(503);
      expect(result.retryable).toBe(true);
      expect(result.offlineFallbackAvailable).toBe(true);
      expect(result.userMessageAr).toContain('تعذر الاتصال بخدمة قواعد البيانات');
    });
  });

  describe('Dropped Network & 3G Offline Resilience', () => {
    it('classifies TypeError "Failed to fetch" as OFFLINE_FALLBACK with offlineFallbackAvailable', () => {
      const networkError = new TypeError('Failed to fetch');

      const result = PostgrestErrorHandler.handle(networkError);

      expect(result.action).toBe('OFFLINE_FALLBACK');
      expect(result.statusCode).toBe(0);
      expect(result.retryable).toBe(true);
      expect(result.offlineFallbackAvailable).toBe(true);
      expect(result.userMessageAr).toContain('انقطع الاتصال بالشبكة');
    });

    it('classifies AbortError from request timeout as OFFLINE_FALLBACK', () => {
      const timeoutError = new Error('The operation was aborted due to timeout');
      timeoutError.name = 'AbortError';

      const result = PostgrestErrorHandler.handle(timeoutError);

      expect(result.action).toBe('OFFLINE_FALLBACK');
      expect(result.retryable).toBe(true);
      expect(result.offlineFallbackAvailable).toBe(true);
    });

    it('detects navigator.onLine = false regardless of error message', () => {
      const originalGlobalNav = globalThis.navigator;
      Object.defineProperty(globalThis, 'navigator', {
        value: { onLine: false },
        configurable: true,
        writable: true,
      });

      const randomError = new Error('Some arbitrary error');
      const result = PostgrestErrorHandler.handle(randomError);

      expect(result.action).toBe('OFFLINE_FALLBACK');
      expect(result.offlineFallbackAvailable).toBe(true);

      // Restore
      Object.defineProperty(globalThis, 'navigator', {
        value: originalGlobalNav,
        configurable: true,
        writable: true,
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sanitizePlainText,
  sanitizeRichText,
  sanitizeMarkdown,
  isSafeUrl,
  containsSuspiciousPayload,
} from '@/lib/security/contentSanitizer';
import {
  canAccessRoute,
  hasComponentPermission,
  assertActionAuthorized,
  getDashboardRouteForRole,
  AuthorizationError,
} from '@/lib/security/rbacGuard';
import { rateLimiter, RateLimiter } from '@/lib/security/rateLimiter';
import {
  signOfflinePayload,
  verifySignedPayload,
  computeSha256,
  generateSecurityNonce,
} from '@/lib/security/tokenVault';
import { buildCspString, getHardenedSecurityHeaders } from '@/lib/security/cspConfig';
import { auditLogger } from '@/lib/security/auditLogger';
import { ReceiptStore } from '@/lib/receiptStore';
import { MockAuthEngine } from '@/lib/MockAuthEngine';

describe('🔒 Day 4: Backend Integration, Security & Zero-Trust Governance Suite', () => {
  beforeEach(() => {
    rateLimiter.clearAll();
    auditLogger.clear();
    ReceiptStore.clearMemory();
    MockAuthEngine.clearSession();
  });

  describe('1. Content Sanitizer & XSS Defense Engine', () => {
    it('should strip dangerous <script> elements and inline scripts entirely', () => {
      const dirty = '<p>مرحباً بكم</p><script>alert("XSS")</script><b>في الدورة</b>';
      const clean = sanitizeRichText(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
      expect(clean).toContain('مرحباً بكم');
      expect(clean).toContain('<b>في الدورة</b>');
    });

    it('should neutralize javascript: and vbscript: protocols in links and images', () => {
      const dirtyLink = '<a href="javascript:stealCookies()">اضغط هنا للتسجيل</a>';
      const cleanLink = sanitizeRichText(dirtyLink);
      expect(cleanLink).not.toContain('stealCookies');
      expect(cleanLink).toContain('href="#"');
    });

    it('should strip event handlers like onerror, onload, and onclick', () => {
      const dirtyImg = '<img src="valid.jpg" onerror="fetch(\'/leak\')" alt="غلاف">';
      const cleanImg = sanitizeRichText(dirtyImg);
      expect(cleanImg).not.toContain('onerror');
      expect(cleanImg).not.toContain('/leak');
      expect(cleanImg).toContain('alt="غلاف"');
    });

    it('should escape plain text to prevent HTML entity injection', () => {
      const escaped = sanitizePlainText('<script>alert("hack")</script> & "quotes"');
      expect(escaped).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt; &amp; &quot;quotes&quot;');
    });

    it('should sanitize dangerous markdown links', () => {
      const dirtyMd = '[انقر هنا](javascript:alert(1)) و [رابط آمن](https://ta3allam.sy)';
      const safeMd = sanitizeMarkdown(dirtyMd);
      expect(safeMd).toContain('[انقر هنا](#)');
      expect(safeMd).toContain('[رابط آمن](https://ta3allam.sy)');
    });

    it('should detect suspicious attack payloads with heuristic patterns', () => {
      expect(containsSuspiciousPayload('<script>alert(1)</script>')).toBe(true);
      expect(containsSuspiciousPayload('../../etc/passwd')).toBe(true);
      expect(containsSuspiciousPayload('admin\' UNION SELECT * FROM users--')).toBe(true);
      expect(containsSuspiciousPayload('نص عربي طبيعي وسليم')).toBe(false);
    });

    it('should validate safe and dangerous URLs correctly', () => {
      expect(isSafeUrl('https://ta3allam.sy/courses')).toBe(true);
      expect(isSafeUrl('/assets/logo.png')).toBe(true);
      expect(isSafeUrl('mailto:support@ta3allam.sy')).toBe(true);
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });
  });

  describe('2. Three-Tier RBAC Boundary Defense', () => {
    it('Tier 1: should enforce route access authorization strictly by role', () => {
      expect(canAccessRoute('admin', ['admin'])).toBe(true);
      expect(canAccessRoute('student', ['admin'])).toBe(false);
      expect(canAccessRoute('teacher', ['teacher', 'admin'])).toBe(true);
      expect(canAccessRoute(undefined, ['student'])).toBe(false);
    });

    it('Tier 2: should determine component permission based on user role', () => {
      expect(hasComponentPermission('admin', 'course:delete')).toBe(true);
      expect(hasComponentPermission('creator', 'course:create')).toBe(true);
      expect(hasComponentPermission('student', 'course:delete')).toBe(false);
      expect(hasComponentPermission('teacher', 'assignment:grade')).toBe(true);
      expect(hasComponentPermission('student', 'assignment:submit')).toBe(true);
    });

    it('Tier 3: should throw AuthorizationError when asserting unauthorized actions', () => {
      expect(() => {
        assertActionAuthorized('student', 'payout:approve');
      }).toThrow(AuthorizationError);

      expect(() => {
        assertActionAuthorized('admin', 'payout:approve');
      }).not.toThrow();
    });

    it('should resolve the correct localized dashboard route for each role', () => {
      expect(getDashboardRouteForRole('student')).toBe('/student');
      expect(getDashboardRouteForRole('teacher')).toBe('/teacher');
      expect(getDashboardRouteForRole('creator')).toBe('/creator');
      expect(getDashboardRouteForRole('admin')).toBe('/admin');
      expect(getDashboardRouteForRole(null)).toBe('/');
    });
  });

  describe('3. Sliding-Window Rate Limiting & Lockout Defense', () => {
    it('should allow requests within the permitted threshold and reject excess', () => {
      const limiter = new RateLimiter();

      // 'community:write' allows 8 requests
      for (let i = 0; i < 8; i++) {
        expect(limiter.consume('community:write', 'user_123')).toBe(true);
      }

      // 9th request should be rejected
      expect(limiter.consume('community:write', 'user_123')).toBe(false);
      const status = limiter.check('community:write', 'user_123');
      expect(status.allowed).toBe(false);
      expect(status.remaining).toBe(0);
    });

    it('should lock out users after consecutive login failure threshold', () => {
      const limiter = new RateLimiter();

      // Threshold for auth:login is 5 failures
      for (let i = 0; i < 4; i++) {
        const fail = limiter.recordFailure('auth:login', 'attacker');
        expect(fail.locked).toBe(false);
      }

      const fifthFail = limiter.recordFailure('auth:login', 'attacker');
      expect(fifthFail.locked).toBe(true);
      expect(fifthFail.lockoutRemainingMs).toBeGreaterThan(0);

      const check = limiter.check('auth:login', 'attacker');
      expect(check.locked).toBe(true);
      expect(check.allowed).toBe(false);
    });
  });

  describe('4. Cryptographic Token Vault & Offline Signatures', () => {
    it('should sign offline payloads with verifiable nonces and signatures', async () => {
      const payload = { assignmentId: 99, studentId: 'std_42', answer: 'خوارزمية البحث' };
      const signed = await signOfflinePayload(payload, 'std_42', 'student', 3600);

      expect(signed.signature).toBeDefined();
      expect(signed.nonce).toHaveLength(32);
      expect(signed.expiresAt).toBeGreaterThan(Date.now());

      const verification = await verifySignedPayload(signed);
      expect(verification.valid).toBe(true);
      expect(verification.payload).toEqual(payload);
    });

    it('should detect and reject tampered payloads', async () => {
      const payload = { score: 50 };
      const signed = await signOfflinePayload(payload, 'std_10', 'student');

      // Attacker attempts to alter the payload score
      (signed.payload as any).score = 100;

      const verification = await verifySignedPayload(signed);
      expect(verification.valid).toBe(false);
      expect(verification.reason).toContain('tampering detected');
    });

    it('should compute consistent SHA-256 checksums', async () => {
      const hash1 = await computeSha256('ta3allam-security-contract');
      const hash2 = await computeSha256('ta3allam-security-contract');
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBeGreaterThan(10);
    });
  });

  describe('5. Receipt Store Anti-Tamper & Sanitization', () => {
    it('should sanitize inputs and attach anti-tamper checksum on submission', () => {
      const receipt = ReceiptStore.submitReceipt({
        courseId: 1,
        courseName: 'دورة البرمجة',
        courseCode: 'CS101',
        studentId: 'std_sec_01',
        studentName: '<b>علي المحمد</b>',
        amount: 25,
        currency: 'USD',
        paymentMethod: 'shamcash',
        transactionReference: 'TX-SEC-9988',
        receiptImageUrl: 'https://cdn.ta3allam.sy/valid.jpg',
        senderNameOrPhone: '0988-112233',
        studentNotes: '<script>alert(1)</script>تم التحويل بنجاح',
      });

      expect(receipt.studentName).toBe('&lt;b&gt;علي المحمد&lt;/b&gt;');
      expect(receipt.studentNotes).toBe('&lt;script&gt;alert(1)&lt;/script&gt;تم التحويل بنجاح');
      expect(receipt.checksum).toBeDefined();
      expect(ReceiptStore.verifyReceiptChecksum(receipt)).toBe(true);

      // Verify tamper detection
      receipt.amount = 9999;
      expect(ReceiptStore.verifyReceiptChecksum(receipt)).toBe(false);
    });
  });

  describe('6. Content Security Policy (CSP) Directives', () => {
    it('should generate valid CSP header string including anti-framing and resource limits', () => {
      const csp = buildCspString();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain('frame-ancestors \'none\'');
      expect(csp).toContain('object-src \'none\'');
      expect(csp).toContain('https://*.supabase.co');
    });

    it('should supply hardened production security headers', () => {
      const headers = getHardenedSecurityHeaders();
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    });
  });

  describe('7. Security Audit Logging & Authentication Integration', () => {
    it('should log security audit events and dispatch to subscribers', () => {
      const listener = vi.fn();
      const unsubscribe = auditLogger.subscribe(listener);

      auditLogger.log('AUTH_LOGIN_SUCCESS', 'info', { username: 'admin' }, { userId: 'usr_1', role: 'admin' });

      expect(listener).toHaveBeenCalled();
      const events = auditLogger.getEvents({ type: 'AUTH_LOGIN_SUCCESS' });
      expect(events).toHaveLength(1);
      expect(events[0].role).toBe('admin');

      unsubscribe();
    });

    it('should record audit events on MockAuthEngine login attempts and enforce rate limits', () => {
      // 1. Successful student login
      const user = MockAuthEngine.authenticateMock('student', '123');
      expect(user).not.toBeNull();
      const successEvents = auditLogger.getEvents({ type: 'AUTH_LOGIN_SUCCESS' });
      expect(successEvents.length).toBeGreaterThan(0);

      // 2. Failed login with bad password
      const badUser = MockAuthEngine.authenticateMock('student', 'wrong_password');
      expect(badUser).toBeNull();
      const failureEvents = auditLogger.getEvents({ type: 'AUTH_LOGIN_FAILURE' });
      expect(failureEvents.length).toBeGreaterThan(0);
    });
  });
});

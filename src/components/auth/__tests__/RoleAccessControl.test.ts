import { describe, it, expect } from 'vitest';
import {
  canAccessRoute,
  getDashboardRouteForRole,
  hasComponentPermission,
  assertActionAuthorized,
  AuthorizationError,
} from '@/lib/security/rbacGuard';

describe('Three-Tier RBAC & Authentic Permission Isolation Suite', () => {
  describe('Tier 1: Route-Level Navigation Guards', () => {
    it('permits students only on student-allowed routes and resolves correct dashboard', () => {
      expect(canAccessRoute('student', ['student'])).toBe(true);
      expect(canAccessRoute('student', ['teacher', 'admin'])).toBe(false);
      expect(canAccessRoute('student', ['admin'])).toBe(false);
      expect(getDashboardRouteForRole('student')).toBe('/student');
    });

    it('permits teachers to access teacher routes and blocks admin consoles', () => {
      expect(canAccessRoute('teacher', ['teacher'])).toBe(true);
      expect(canAccessRoute('teacher', ['teacher', 'admin'])).toBe(true);
      expect(canAccessRoute('teacher', ['admin'])).toBe(false);
      expect(getDashboardRouteForRole('teacher')).toBe('/teacher');
    });

    it('permits creators to access creator workspaces and resolves creator dashboard', () => {
      expect(canAccessRoute('creator', ['creator'])).toBe(true);
      expect(canAccessRoute('creator', ['admin'])).toBe(false);
      expect(getDashboardRouteForRole('creator')).toBe('/creator');
    });

    it('permits administrators across administrative routes', () => {
      expect(canAccessRoute('admin', ['admin'])).toBe(true);
      expect(canAccessRoute('admin', ['teacher', 'admin'])).toBe(true);
      expect(getDashboardRouteForRole('admin')).toBe('/admin');
    });

    it('blocks null or undefined roles from accessing any protected route', () => {
      expect(canAccessRoute(null, ['student', 'teacher', 'admin'])).toBe(false);
      expect(canAccessRoute(undefined, ['student'])).toBe(false);
      expect(getDashboardRouteForRole(null)).toBe('/');
    });
  });

  describe('Tier 3: Domain Action & Operational Permissions', () => {
    it('restricts assignment grading and lecture edits strictly away from students', () => {
      expect(hasComponentPermission('student', 'assignment:grade')).toBe(false);
      expect(hasComponentPermission('student', 'lecture:add')).toBe(false);
      expect(hasComponentPermission('student', 'assignment:submit')).toBe(true);
      expect(hasComponentPermission('student', 'community:post')).toBe(true);

      expect(() => assertActionAuthorized('student', 'assignment:grade')).toThrow(AuthorizationError);
      try {
        assertActionAuthorized('student', 'assignment:grade');
      } catch (e) {
        expect(e).toBeInstanceOf(AuthorizationError);
        expect((e as AuthorizationError).statusCode).toBe(403);
        expect((e as AuthorizationError).code).toBe('ERR_INSUFFICIENT_PERMISSIONS');
      }
    });

    it('allows teachers to edit curriculum and grade assignments, but forbids financial verification', () => {
      expect(hasComponentPermission('teacher', 'assignment:grade')).toBe(true);
      expect(hasComponentPermission('teacher', 'course:edit')).toBe(true);
      expect(hasComponentPermission('teacher', 'receipt:verify')).toBe(false);
      expect(hasComponentPermission('teacher', 'payout:approve')).toBe(false);

      expect(() => assertActionAuthorized('teacher', 'payout:approve')).toThrow(AuthorizationError);
    });

    it('allows creators to request payouts and create courses, but isolates payout approvals', () => {
      expect(hasComponentPermission('creator', 'course:create')).toBe(true);
      expect(hasComponentPermission('creator', 'payout:request')).toBe(true);
      expect(hasComponentPermission('creator', 'payout:approve')).toBe(false);
      expect(hasComponentPermission('creator', 'receipt:verify')).toBe(false);

      expect(() => assertActionAuthorized('creator', 'receipt:verify')).toThrow(AuthorizationError);
    });

    it('empowers SuperAdmin with complete administrative governance powers', () => {
      expect(hasComponentPermission('admin', 'receipt:verify')).toBe(true);
      expect(hasComponentPermission('admin', 'payout:approve')).toBe(true);
      expect(hasComponentPermission('admin', 'user:manage')).toBe(true);
      expect(hasComponentPermission('admin', 'community:moderate')).toBe(true);

      expect(() => assertActionAuthorized('admin', 'receipt:verify')).not.toThrow();
      expect(() => assertActionAuthorized('admin', 'payout:approve')).not.toThrow();
    });
  });
});

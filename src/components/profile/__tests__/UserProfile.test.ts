import { describe, it, expect, beforeEach } from 'vitest';

// Simple in-memory localStorage mock for node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

import { MockAuthEngine } from '@/lib/MockAuthEngine';
import { Certificate, UserSession } from '@/types/user';

describe('Professional User Profile & Identity Center Unit Tests (Day 2 Overhaul)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Principle 4: Deep Domain Modeling — verifies student rich profile with bio, stats and certificates', () => {
    const student = MockAuthEngine.authenticateMock('student');
    expect(student).not.toBeNull();
    expect(student?.name).toBe('سامي الطالب');
    expect(student?.title).toContain('هندسة برمجيات');
    expect(student?.organization).toContain('جامعة دمشق');
    expect(student?.bio).toBeTruthy();
    expect(student?.twoFactorEnabled).toBe(true);

    // Student stats
    expect(student?.stats?.points).toBeGreaterThan(1000);
    expect(student?.stats?.streakDays).toBe(14);
    expect(student?.completedCoursesCount).toBe(4);

    // Certificates
    expect(student?.certificatesEarned?.length).toBe(2);
    const cert = student?.certificatesEarned?.[0] as Certificate;
    expect(cert.id).toBe('CERT-2026-8891');
    expect(cert.courseTitle).toContain('هندسة البرمجيات');
    expect(cert.grade).toContain('امتياز');
    expect(cert.verificationCode).toBe('TA3-DIST-SYS-94-8891');
  });

  it('Principle 2 & 4: Independent Creator Profile — contains published courses, total earnings and student reach', () => {
    const creator = MockAuthEngine.authenticateMock('creator');
    expect(creator).not.toBeNull();
    expect(creator?.role).toBe('creator');
    expect(creator?.name).toBe('طارق النابلسي');
    expect(creator?.stats?.publishedCoursesCount).toBe(6);
    expect(creator?.stats?.activeStudentsCount).toBe(1280);
    expect(creator?.stats?.totalEarningsUsd).toBe(14250);
  });

  it('Principle 2 & 4: Institutional Teacher Profile — contains academic titles without commercial wallet metrics', () => {
    const teacher = MockAuthEngine.authenticateMock('teacher');
    expect(teacher).not.toBeNull();
    expect(teacher?.role).toBe('teacher');
    expect(teacher?.name).toContain('د. داليا سليمان');
    expect(teacher?.stats?.activeStudentsCount).toBe(340);
    expect(teacher?.stats?.totalEarningsUsd).toBeUndefined(); // Strictly no wallet metrics
  });

  it('Principle 2 & 4: SuperAdmin Profile — contains moderation audit counts and SecOps auditor credentials', () => {
    const admin = MockAuthEngine.authenticateMock('admin');
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe('admin');
    expect(admin?.stats?.moderationAuditsCount).toBe(480);
    expect(admin?.certificatesEarned?.length).toBe(0); // Admin does not earn student certificates
  });

  it('Profile Persistence: allows updating bio, title, organization and location with instant localStorage persistence', () => {
    MockAuthEngine.authenticateMock('student');
    const updatedUser = MockAuthEngine.updateUserProfile({
      bio: 'تم تحديث النبذة التعريفية لتشمل شهادة الحوسبة السحابية الجديدة',
      location: 'اللاذقية، سوريا',
      phone: '+963 999 888 777',
    });

    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.bio).toBe('تم تحديث النبذة التعريفية لتشمل شهادة الحوسبة السحابية الجديدة');
    expect(updatedUser?.location).toBe('اللاذقية، سوريا');
    expect(updatedUser?.phone).toBe('+963 999 888 777');

    // Confirm reload from storage
    const reloaded = MockAuthEngine.getSavedUser();
    expect(reloaded?.bio).toBe('تم تحديث النبذة التعريفية لتشمل شهادة الحوسبة السحابية الجديدة');
    expect(reloaded?.location).toBe('اللاذقية، سوريا');
  });

  it('Security & 2FA: verifies toggle of two-factor authentication and active session structure', () => {
    const student = MockAuthEngine.authenticateMock('student');
    expect(student?.twoFactorEnabled).toBe(true);

    const toggled = MockAuthEngine.updateUserProfile({ twoFactorEnabled: false });
    expect(toggled?.twoFactorEnabled).toBe(false);

    // Active session inspections
    expect(student?.activeSessions?.length).toBeGreaterThan(0);
    const currentSession = student?.activeSessions?.find((s: UserSession) => s.isCurrent);
    expect(currentSession).toBeDefined();
    expect(currentSession?.browser).toContain('Chrome');
  });

  it('Session Revocation: successfully terminates remote active session by ID', () => {
    const student = MockAuthEngine.authenticateMock('student');
    const initialSessionCount = student?.activeSessions?.length || 0;
    expect(initialSessionCount).toBe(2);

    const updated = MockAuthEngine.terminateSession('SESS-02');
    expect(updated?.activeSessions?.length).toBe(1);
    expect(updated?.activeSessions?.find((s) => s.id === 'SESS-02')).toBeUndefined();
  });

  it('Avatar Update: persists custom Base64 avatar URL in user profile state', () => {
    MockAuthEngine.authenticateMock('student');
    const mockDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const updated = MockAuthEngine.updateUserProfile({ avatar: mockDataUrl });

    expect(updated?.avatar).toBe(mockDataUrl);
    const reloaded = MockAuthEngine.getSavedUser();
    expect(reloaded?.avatar).toBe(mockDataUrl);
  });
});
